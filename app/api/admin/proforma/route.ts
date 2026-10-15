import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/actions/session";
import { prisma } from "@/lib/prisma";
import { calculateProformaTotals } from "@/lib/proforma/utils";
import { ProformaItem, KdvStatus } from "@/lib/proforma/types";

// GET /api/admin/proforma -> List proformas
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { proformaNumber: { contains: search, mode: "insensitive" } },
        { customerTitle: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const proformas = await prisma.proformaInvoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, proformas });
  } catch (error: any) {
    console.error("Proforma fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Proformalar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// POST /api/admin/proforma -> Create new proforma
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const body = await req.json();
    const {
      customerTitle,
      contactPerson,
      email,
      phone,
      taxOffice,
      taxNumber,
      address,
      city,
      country = "Türkiye",
      currency = "TRY",
      currencySymbol = "₺",
      exchangeRate = 1.0,
      kdvRate = 20.0,
      kdvStatus = "HARIC",
      discountRate = 0.0,
      validUntilDays = 15,
      deliveryTerms,
      paymentTerms,
      bankInfo,
      notes,
      items = [],
      status = "TEKLIF",
    } = body;

    if (!customerTitle || customerTitle.trim() === "") {
      return NextResponse.json(
        { error: "Müşteri / Kurum ünvanı zorunludur." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "En az bir adet ürün veya hizmet kalemi eklemelisiniz." },
        { status: 400 }
      );
    }

    // Generate automatic unique proforma number: LMR-PF-2026-0001
    const currentYear = new Date().getFullYear();
    const prefix = `LMR-PF-${currentYear}-`;
    const countThisYear = await prisma.proformaInvoice.count({
      where: {
        proformaNumber: { startsWith: prefix },
      },
    });

    const nextSeq = countThisYear + 1;
    const autoNumber = `${prefix}${String(nextSeq).padStart(4, "0")}`;
    const finalNumber = body.proformaNumber?.trim() || autoNumber;

    // Recalculate totals
    const sanitizedItems: ProformaItem[] = items.map((it: any, idx: number) => {
      const qty = Number(it.quantity) || 1;
      const price = Number(it.unitPrice) || 0;
      const disc = Number(it.discountRate) || 0;
      const total = qty * price * (1 - disc / 100);
      return {
        id: it.id || `item-${Date.now()}-${idx}`,
        productId: it.productId ? Number(it.productId) : null,
        name: it.name || "Ürün / Hizmet",
        description: it.description || "",
        image: it.image || "",
        quantity: qty,
        unit: it.unit || "Adet",
        unitPrice: price,
        discountRate: disc,
        lineTotal: Math.round(total * 100) / 100,
      };
    });

    const calculated = calculateProformaTotals(
      sanitizedItems,
      Number(kdvRate) || 20,
      (kdvStatus as KdvStatus) || "HARIC",
      Number(discountRate) || 0
    );

    const created = await prisma.proformaInvoice.create({
      data: {
        proformaNumber: finalNumber,
        customerTitle: customerTitle.trim(),
        contactPerson: contactPerson?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        taxOffice: taxOffice?.trim() || null,
        taxNumber: taxNumber?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        country: country?.trim() || "Türkiye",
        currency,
        currencySymbol,
        exchangeRate: Number(exchangeRate) || 1.0,
        kdvRate: Number(kdvRate) || 20.0,
        kdvStatus,
        discountRate: Number(discountRate) || 0.0,
        validUntilDays: Number(validUntilDays) || 15,
        deliveryTerms: deliveryTerms || null,
        paymentTerms: paymentTerms || null,
        bankInfo: bankInfo || null,
        notes: notes || null,
        itemsJson: JSON.stringify(sanitizedItems),
        subtotal: calculated.subtotal,
        totalDiscount: calculated.totalDiscount,
        totalTax: calculated.totalTax,
        grandTotal: calculated.grandTotal,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      proforma: created,
      message: "Proforma fatura başarıyla oluşturuldu.",
    });
  } catch (error: any) {
    console.error("Proforma create error:", error);
    return NextResponse.json(
      { error: error.message || "Proforma fatura oluşturulamadı." },
      { status: 500 }
    );
  }
}
