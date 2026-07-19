"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type PaymentItem = {
  id: number;
  quantity: number;
  price: number;
};

type PaymentData = {
  userId?: number;

  fullName: string;
  phone: string;
  email: string;

  city: string;
  district: string;
  address: string;
  postalCode: string;

  items: PaymentItem[];
};

export async function createPayment(data: PaymentData) {

  if (data.items.length === 0) {
    throw new Error("Sepet boş.");
  }

  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const conversationId = crypto.randomUUID();

  await prisma.pendingOrder.create({

    data: {

      conversationId,

      userId: data.userId,

      fullName: data.fullName,

      phone: data.phone,

      email: data.email,

      city: data.city,

      district: data.district,

      address: data.address,

      postalCode: data.postalCode,

      total,

      itemsJson: JSON.stringify(data.items),

    },

  });

  return {

    success: true,

    conversationId,

    total,

  };

}