import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retrieveCheckoutForm } from "@/lib/payment/iyzico-auth";
import Iyzipay from "iyzipay";
import { notifyNewOrder } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.redirect(new URL("/odeme-basarisiz", req.url));
    }

    const result = await retrieveCheckoutForm({
      locale: Iyzipay.LOCALE.TR,
      conversationId: Date.now().toString(),
      token,
    });

    console.log("========== IYZICO CALLBACK RETRIEVE ==========");
    console.log(JSON.stringify(result, null, 2));
    console.log("==============================================");

    if (!result || result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      return NextResponse.redirect(new URL("/odeme-basarisiz", req.url));
    }

    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { token },
    });

    if (!pendingPayment) {
      return NextResponse.redirect(new URL("/odeme-basarisiz", req.url));
    }

    const orderNumber = `LUM-${Date.now()}`;
    const rawItems = (pendingPayment.items as any[]) || [];

    const order = await prisma.order.create({
      data: {
        userId: pendingPayment.userId,
        orderNumber,
        paymentToken: token,
        fullName: pendingPayment.fullName,
        phone: pendingPayment.phone,
        email: pendingPayment.email,
        city: pendingPayment.city,
        district: pendingPayment.district,
        address: pendingPayment.address,
        postalCode: pendingPayment.postalCode,
        total: pendingPayment.total,
        paymentStatus: "Ödendi",
        paymentMethod: "Kredi Kartı",
        status: "Hazırlanıyor",
        items: {
          create: rawItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // lumeratasarim@gmail.com hesabına sipariş bildirimi gönder
    await notifyNewOrder({
      orderNumber: order.orderNumber,
      fullName: pendingPayment.fullName,
      phone: pendingPayment.phone,
      email: pendingPayment.email,
      city: pendingPayment.city,
      district: pendingPayment.district,
      address: pendingPayment.address,
      total: pendingPayment.total,
      paymentStatus: "Ödendi (Kredi Kartı)",
      items: rawItems.map((item: any) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }).catch((err) => console.error("Sipariş e-posta bildirim hatası:", err));

    await prisma.pendingPayment.delete({
      where: { id: pendingPayment.id },
    });

    return NextResponse.redirect(
      new URL(`/odeme-basarili?order=${order.orderNumber}`, req.url)
    );
  } catch (error: any) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(new URL("/odeme-basarisiz", req.url));
  }
}
