import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/services/settingsService";
import { PrismaClient } from "@prisma/client";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Lütfen zorunlu alanları (Ad, E-posta, Mesaj) doldurunuz." },
        { status: 400 }
      );
    }

    const settings = await getSiteSettings();
    const targetEmail = settings.contactEmail || ADMIN_NOTIFICATION_EMAIL;

    let client: any = prisma;
    if (!client.contactMessage) {
      client = new PrismaClient();
    }

    let createdRecord = null;
    if (client.contactMessage) {
      createdRecord = await client.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject ? subject.trim() : null,
          message: message.trim(),
          targetEmail: targetEmail,
        },
      });
    }

    // FormSubmit üzerinden lumeratasarim@gmail.com adresine e-posta bildirimi
    try {
      await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `✉️ İletişim Mesajı: ${subject || name}`,
          Gonderen: name.trim(),
          Eposta: email.trim(),
          Konu: subject || "Genel İletişim",
          Mesaj: message.trim(),
        }),
      });
    } catch {
      // ignore external relay error
    }

    return NextResponse.json({
      success: true,
      message: `Mesajınız başarıyla iletildi. (${targetEmail} adresine gönderildi)`,
      data: createdRecord,
    });
  } catch (error: any) {
    console.error("İletişim mesajı gönderme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
