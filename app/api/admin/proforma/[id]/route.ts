import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/actions/session";
import { prisma } from "@/lib/prisma";
import { calculateProformaTotals } from "@/lib/proforma/utils";
import { ProformaItem, KdvStatus } from "@/lib/proforma/types";

// GET /api/admin/proforma/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const proformaId = parseInt(id, 10);
    if (isNaN(proformaId)) {
      return NextResponse.json({ error: "Geçersiz proforma ID." }, { status: 400 });
    }

    const proforma = await prisma.proformaInvoice.findUnique({
      where: { id: proformaId },
    });

    if (!proforma) {
      return NextResponse.json(
        { error: "Proforma fatura bulunamadı." },
        { status: 404 }
      );
    }

    let parsedItems: ProformaItem[] = [];
    try {
      parsedItems = JSON.parse(proforma.itemsJson);
    } catch {
      parsedItems = [];
    }

    return NextResponse.json({
      success: true,
      proforma: {
        ...proforma,
        items: parsedItems,
      },
    });
  } catch (error: any) {
    console.error("Proforma fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Proforma faturası alınamadı." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/proforma/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const proformaId = parseInt(id, 10);
    if (isNaN(proformaId)) {
      return NextResponse.json({ error: "Geçersiz proforma ID." }, { status: 400 });
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

    const updated = await prisma.proformaInvoice.update({
      where: { id: proformaId },
      data: {
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
      proforma: updated,
      message: "Proforma fatura başarıyla güncellendi.",
    });
  } catch (error: any) {
    console.error("Proforma update error:", error);
    return NextResponse.json(
      { error: error.message || "Proforma fatura güncellenemedi." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/proforma/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const proformaId = parseInt(id, 10);
    if (isNaN(proformaId)) {
      return NextResponse.json({ error: "Geçersiz proforma ID." }, { status: 400 });
    }

    await prisma.proformaInvoice.delete({
      where: { id: proformaId },
    });

    return NextResponse.json({
      success: true,
      message: "Proforma fatura başarıyla silindi.",
    });
  } catch (error: any) {
    console.error("Proforma delete error:", error);
    return NextResponse.json(
      { error: error.message || "Proforma fatura silinemedi." },
      { status: 500 }
    );
  }
}
