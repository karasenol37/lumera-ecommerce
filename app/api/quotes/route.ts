import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProformaTotals } from "@/lib/proforma/utils";
import { ProformaItem } from "@/lib/proforma/types";
import {
  ADMIN_NOTIFICATION_EMAIL,
  notifyNewQuoteRequest,
} from "@/lib/notifications";
import { getProductImageUrl } from "@/lib/utils/productImage";

// GET /api/quotes -> Sitedeki aktif ürünleri döndürür (Teklif formunda ürün seçimi için)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
      },
    });

    const formatted = products.map((p) => ({
      ...p,
      image: getProductImageUrl(p.image, p.name, 1),
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (error: any) {
    console.error("Quotes products fetch error:", error);
    return NextResponse.json(
      { error: "Ürün listesi alınamadı." },
      { status: 500 }
    );
  }
}

// POST /api/quotes -> Toptan / Proje teklif talebini sisteme kaydeder ve lumeratasarim@gmail.com adresine bildirir
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      phone,
      email,
      taxOffice,
      taxNumber,
      city,
      address,
      notes,
      items = [],
    } = body;

    if (!companyName?.trim() || !contactPerson?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        {
          error:
            "Lütfen Şirket/Firma Ünvanı, Yetkili Adı, Telefon ve E-posta alanlarını doldurunuz.",
        },
        { status: 400 }
      );
    }

    const selectedItems = Array.isArray(items)
      ? items.filter((it: any) => Number(it.quantity) > 0)
      : [];

    if (selectedItems.length === 0) {
      return NextResponse.json(
        { error: "Lütfen teklif almak istediğiniz en az bir ürünü seçiniz." },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const quoteNumber = `TKL-${currentYear}-${Date.now().toString().slice(-5)}`;

    const sanitizedItems: ProformaItem[] = selectedItems.map(
      (it: any, idx: number) => {
        const qty = Math.max(1, Number(it.quantity) || 1);
        const price = Number(it.unitPrice) || 0;
        return {
          id: `quote-item-${Date.now()}-${idx}`,
          productId: it.productId ? Number(it.productId) : null,
          name: String(it.name || "Ürün"),
          description: it.category || "Proje / Toptan Teklif Kalemi",
          image: it.image || "",
          quantity: qty,
          unit: "Adet",
          unitPrice: price,
          discountRate: 0,
          lineTotal: Math.round(qty * price * 100) / 100,
        };
      }
    );

    const calculated = calculateProformaTotals(sanitizedItems, 20, "HARIC", 0);

    // 1. Proforma / Teklif tablosuna kaydet (Admin panelinde /admin/proforma sayfasında direkt görünür)
    let savedProforma = null;
    try {
      savedProforma = await prisma.proformaInvoice.create({
        data: {
          proformaNumber: quoteNumber,
          customerTitle: companyName.trim(),
          contactPerson: contactPerson.trim(),
          email: email.trim(),
          phone: phone.trim(),
          taxOffice: taxOffice?.trim() || null,
          taxNumber: taxNumber?.trim() || null,
          address: address?.trim() || null,
          city: city?.trim() || null,
          country: "Türkiye",
          currency: "TRY",
          currencySymbol: "₺",
          exchangeRate: 1.0,
          kdvRate: 20.0,
          kdvStatus: "HARIC",
          discountRate: 0.0,
          validUntilDays: 15,
          notes: `[WEB TOPTAN TEKLİF TALEBİ] ${notes?.trim() || ""}`.trim(),
          itemsJson: JSON.stringify(sanitizedItems),
          subtotal: calculated.subtotal,
          totalDiscount: calculated.totalDiscount,
          totalTax: calculated.totalTax,
          grandTotal: calculated.grandTotal,
          status: "TEKLIF",
        },
      });
    } catch (dbErr) {
      console.error("Proforma DB kayıt hatası:", dbErr);
    }

    // 2. lumeratasarim@gmail.com adresine e-posta ve sistem bildirimi gönder
    await notifyNewQuoteRequest({
      quoteNumber,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      taxOffice: taxOffice?.trim() || null,
      taxNumber: taxNumber?.trim() || null,
      city: city?.trim() || null,
      address: address?.trim() || null,
      notes: notes?.trim() || null,
      items: sanitizedItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      grandTotal: calculated.grandTotal,
    });

    // 3. WhatsApp ve E-posta iletişim bağlantılarını hazırla
    const itemsText = sanitizedItems
      .map((i, idx) => `${idx + 1}) ${i.name} - ${i.quantity} Adet`)
      .join("\n");

    const whatsappMessage = [
      `Merhaba LUMERA, web siteniz üzerinden projemiz için toptan fiyat teklifi talep ediyoruz.`,
      ``,
      `📋 *Teklif Talep No:* ${quoteNumber}`,
      `🏢 *Firma Ünvanı:* ${companyName.trim()}`,
      `👤 *Yetkili:* ${contactPerson.trim()}`,
      `📞 *Telefon:* ${phone.trim()}`,
      `✉️ *E-posta:* ${email.trim()}`,
      city ? `📍 *İl / Adres:* ${city.trim()} ${address ? `- ${address.trim()}` : ""}` : "",
      taxOffice || taxNumber
        ? `🧾 *Vergi Dairesi / No:* ${taxOffice || "-"} / ${taxNumber || "-"}`
        : "",
      notes ? `📝 *Proje Notu:* ${notes.trim()}` : "",
      ``,
      `🛒 *Teklif İstenen Ürünler:*`,
      itemsText,
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/905358746909?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    const mailSubject = `Toptan Fiyat Teklifi Talebi - ${companyName.trim()} (${quoteNumber})`;
    const mailtoUrl = `mailto:${ADMIN_NOTIFICATION_EMAIL}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(whatsappMessage.replace(/\*/g, ""))}`;

    return NextResponse.json({
      success: true,
      quoteNumber,
      whatsappUrl,
      mailtoUrl,
      proforma: savedProforma,
      message:
        "Teklif talebiniz sisteme kaydedildi ve lumeratasarim@gmail.com adresine iletildi.",
    });
  } catch (error: any) {
    console.error("Quote POST error:", error);
    return NextResponse.json(
      { error: "Teklif talebi gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

