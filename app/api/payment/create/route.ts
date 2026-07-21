import { NextResponse } from "next/server";
import { getIyzipay } from "@/lib/payment/iyzico";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { items, buyer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Sepet boş.",
        },
        {
          status: 400,
        }
      );
    }

    const price = items.reduce(
      (
        total: number,
        item: any
      ) =>
        total + item.price * item.quantity,
      0
    );

    console.log("ENV:", {
      apiKey: process.env.IYZICO_API_KEY ? "OK" : "YOK",
      secret: process.env.IYZICO_SECRET_KEY ? "OK" : "YOK",
      baseUrl: process.env.IYZICO_BASE_URL,
      callback: process.env.NEXT_PUBLIC_APP_URL,
    });

    const requestData: any = {
      locale: "tr",

      conversationId: String(Date.now()),

      price: price.toFixed(2),

      paidPrice: price.toFixed(2),

      currency: "TRY",

      basketId: `LUM-${Date.now()}`,

      paymentGroup: "PRODUCT",

      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,

      buyer: {
        id: "user",

        name: buyer.fullName,

        surname: "-",

        gsmNumber: buyer.phone,

        email: buyer.email,

        identityNumber: "11111111111",

        registrationAddress: buyer.address,

        city: buyer.city,

        country: "Turkey",

        zipCode: buyer.postalCode,
      },

      shippingAddress: {
        contactName: buyer.fullName,

        city: buyer.city,

        country: "Turkey",

        address: buyer.address,

        zipCode: buyer.postalCode,
      },

      billingAddress: {
        contactName: buyer.fullName,

        city: buyer.city,

        country: "Turkey",

        address: buyer.address,

        zipCode: buyer.postalCode,
      },

      basketItems: items.map((item: any) => ({
        id: String(item.id),

        name: item.name,

        category1: "Bahçe Ürünleri",

        itemType: "PHYSICAL",

        price: (
          item.price *
          item.quantity
        ).toFixed(2),
      })),
    };

    console.log("REQUEST DATA");
    console.dir(requestData, { depth: null });

    console.log(
      "CALLBACK URL:",
      `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`
    );

    const iyzipay = getIyzipay();

    const result: any = await new Promise(
      (resolve, reject) => {

        iyzipay.checkoutFormInitialize.create(

          requestData,

          (
            error: unknown,
            result: any
          ) => {

            console.log("IYZICO RAW RESULT");
            console.dir(result, { depth: null });

            if (error) {

              console.error("IYZICO SDK ERROR");
              console.dir(error, { depth: null });

              reject(error);
              return;
            }

            resolve(result);

          }

        );

      }
    );

    console.log("STATUS:", result.status);
    console.log("ERROR MESSAGE:", result.errorMessage);
        if (result.status !== "success") {

      console.error("IYZICO FAILED RESPONSE");
      console.dir(result, { depth: null });

      return NextResponse.json(
        {
          success: false,
          message: result.errorMessage || "İyzico ödeme başlatılamadı.",
          result,
        },
        {
          status: 400,
        }
      );

    }

    console.log("TOKEN:", result.token);
    console.log("PAYMENT PAGE:", result.paymentPageUrl);

    await prisma.pendingPayment.create({

      data: {

        token: result.token,

        fullName: buyer.fullName,

        phone: buyer.phone,

        email: buyer.email,

        city: buyer.city,

        district: buyer.district,

        address: buyer.address,

        postalCode: buyer.postalCode,

        items,

        total: price,

      },

    });

    return NextResponse.json({

      success: true,

      paymentPageUrl: result.paymentPageUrl,

      token: result.token,

    });

  } catch (error) {

    console.error("===== IYZICO CATCH ERROR =====");
    console.dir(error, { depth: null });

    return NextResponse.json(

      {

        success: false,

        message: "Ödeme başlatılamadı.",

      },

      {

        status: 500,

      }

    );

  }

}