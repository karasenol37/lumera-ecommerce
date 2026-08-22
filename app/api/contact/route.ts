import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/services/settingsService";
import { PrismaClient } from "@prisma/client";

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

    // Site ayarlarından güncel e-posta adresini al (ana sayfada görüntülenen mail)
    const settings = await getSiteSettings();
    const targetEmail = settings.contactEmail || "destek@lumera.com";

    // Prisma model erişimi
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

    // Konsol logu ve bilgilendirme
    console.log(`[İletişim Formu] Mesaj başarıyla iletildi -> Hedef E-posta: ${targetEmail}`);
    console.log(`Gönderen: ${name} (${email}) | Konu: ${subject || "Konusuz"}`);

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
