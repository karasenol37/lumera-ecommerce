import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeCheckoutForm } from "@/lib/payment/iyzico-auth";
import Iyzipay from "iyzipay";

function generateId(prefix: string = "ID") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, buyer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Sepetinizde ürün bulunmamaktadır." },
        { status: 400 }
      );
    }

    if (!buyer) {
      return NextResponse.json(
        { error: "Müşteri bilgileri eksik." },
        { status: 400 }
      );
    }

    if (!buyer.fullName?.trim() || !buyer.phone?.trim() || !buyer.email?.trim()) {
      return NextResponse.json(
        { error: "Ad Soyad, Telefon ve E-posta alanları zorunludur." },
        { status: 400 }
      );
    }

    if (!buyer.address?.trim()) {
      return NextResponse.json(
        { error: "Lütfen açık adresinizi giriniz." },
        { status: 400 }
      );
    }

    const city = buyer.city?.trim() || "Kastamonu";
    const address = buyer.address.trim();
    const postalCode = buyer.postalCode?.trim() || "37000";

    const nameParts = buyer.fullName.trim().split(" ");
    const buyerName = nameParts.shift() || "Müşteri";
    const buyerSurname = nameParts.join(" ") || buyerName;

    const totalPrice = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    const cargo = totalPrice >= 750 ? 0 : 150;
    const grandTotal = totalPrice + cargo;

    const pendingPayment = await prisma.pendingPayment.create({
      data: {
        token: generateId("TEMP"),
        userId: buyer.id ?? null,
        fullName: buyer.fullName.trim(),
        phone: buyer.phone.trim(),
        email: buyer.email.trim(),
        city,
        district: buyer.district?.trim() || "",
        address,
        postalCode,
        items,
        total: grandTotal,
      },
    });

    const basketItems = items.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      category1: item.category || "Genel",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2),
    }));

    if (cargo > 0) {
      basketItems.push({
        id: "CARGO_FEE",
        name: "Kargo Ücreti",
        category1: "Kargo",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: cargo.toFixed(2),
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: generateId("CONV"),
      price: grandTotal.toFixed(2),
      paidPrice: grandTotal.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: generateId("BASKET"),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${appUrl}/api/payment/callback`,
      buyer: {
        id: buyer.id ? String(buyer.id) : "guest",
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: buyer.phone.trim(),
        email: buyer.email.trim(),
        identityNumber: "11111111111",
        registrationAddress: address,
        city,
        country: "Turkey",
        zipCode: postalCode,
        ip: req.headers.get("x-forwarded-for") || "85.34.78.112",
      },
      shippingAddress: {
        contactName: buyer.fullName.trim(),
        city,
        country: "Turkey",
        address,
        zipCode: postalCode,
      },
      billingAddress: {
        contactName: buyer.fullName.trim(),
        city,
        country: "Turkey",
        address,
        zipCode: postalCode,
      },
      basketItems,
    };

    console.log("Iyzico Request Data:", requestData);

    const result = await initializeCheckoutForm(requestData);

    console.log("========== IYZICO RESULT ==========");
    console.log(JSON.stringify(result, null, 2));
    console.log("===================================");

    if (!result || result.status !== "success") {
      await prisma.pendingPayment.delete({
        where: { id: pendingPayment.id },
      }).catch(() => {});

      return NextResponse.json(
        {
          error: result?.errorMessage || "İyzico ödeme başlatma başarısız oldu.",
          iyzico: result,
        },
        { status: 400 }
      );
    }

    await prisma.pendingPayment.update({
      where: { id: pendingPayment.id },
      data: { token: result.token },
    });

    return NextResponse.json({
      success: true,
      paymentPageUrl: result.paymentPageUrl,
      token: result.token,
    });
  } catch (error: any) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: error.message || "Ödeme oluşturulurken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}