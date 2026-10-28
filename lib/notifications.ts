import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/services/settingsService";

export const ADMIN_NOTIFICATION_EMAIL = "lumeratasarim@gmail.com";

interface EmailPayload {
  subject: string;
  text: string;
  html?: string;
  senderName?: string;
  senderEmail?: string;
}

/**
 * Sipariş veya teklif geldiğinde lumeratasarim@gmail.com adresine e-posta bildirimi gönderir
 * ve yönetim panelinde bildirim olarak kaydeder.
 */
export async function sendAdminNotification({
  subject,
  text,
  html,
  senderName = "LUMERA Bildirim Sistemi",
  senderEmail = "bildirim@lumeratasarim.com",
}: EmailPayload) {
  let targetEmail = ADMIN_NOTIFICATION_EMAIL;
  try {
    const settings = await getSiteSettings();
    if (settings.contactEmail && settings.contactEmail.includes("@")) {
      targetEmail = settings.contactEmail.trim();
    }
  } catch {
    // Varsayılan lumeratasarim@gmail.com kullanılır
  }

  // 1. Veritabanına (Admin Paneli Bildirim / Mesaj Kutusu) kaydet
  try {
    await prisma.contactMessage.create({
      data: {
        name: senderName,
        email: senderEmail,
        subject,
        message: text,
        targetEmail: ADMIN_NOTIFICATION_EMAIL,
        isRead: false,
      },
    });
  } catch (err) {
    console.error("Bildirim veritabanına kaydedilemedi:", err);
  }

  // 2. Resend API tanımlıysa e-posta gönder
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "LUMERA <onboarding@resend.dev>",
          to: [ADMIN_NOTIFICATION_EMAIL, ...(targetEmail !== ADMIN_NOTIFICATION_EMAIL ? [targetEmail] : [])],
          reply_to: senderEmail,
          subject,
          text,
          html: html || `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`,
        }),
      });
    } catch (err) {
      console.error("Resend e-posta gönderim hatası:", err);
    }
  }

  // 3. FormSubmit AJAX üzerinden doğrudan lumeratasarim@gmail.com adresine ilet
  try {
    await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        Gonderen: senderName,
        Eposta: senderEmail,
        Detaylar: text,
      }),
    });
  } catch (err) {
    console.error("FormSubmit e-posta gönderim hatası:", err);
  }
}

export async function notifyNewOrder(order: {
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  total: number;
  paymentStatus?: string;
  items?: { name?: string; productId?: number; quantity: number; price: number }[];
}) {
  const itemsLines =
    order.items && order.items.length > 0
      ? order.items
          .map(
            (i, idx) =>
              `${idx + 1}. ${i.name || `Ürün #${i.productId}`} - ${i.quantity} Adet x ₺${Number(i.price).toLocaleString("tr-TR")}`
          )
          .join("\n")
      : "Sipariş kalemleri sistemde kayıtlıdır.";

  const text = [
    `🔔 YENİ SİPARİŞ BİLDİRİMİ (${order.orderNumber})`,
    `----------------------------------------`,
    `Müşteri Adı: ${order.fullName}`,
    `Telefon: ${order.phone}`,
    `E-posta: ${order.email}`,
    `İl / İlçe: ${order.city} / ${order.district}`,
    `Teslimat Adresi: ${order.address}`,
    `Ödeme Durumu: ${order.paymentStatus || "Ödendi"}`,
    `Toplam Tutar: ₺${Number(order.total).toLocaleString("tr-TR")}`,
    ``,
    `Sipariş Edilen Ürünler:`,
    itemsLines,
  ].join("\n");

  await sendAdminNotification({
    subject: `🛍️ Yeni Sipariş Geldi: ${order.orderNumber} - ${order.fullName} (₺${Number(order.total).toLocaleString("tr-TR")})`,
    text,
    senderName: `${order.fullName} (Sipariş)`,
    senderEmail: order.email || ADMIN_NOTIFICATION_EMAIL,
  });
}

export async function notifyNewQuoteRequest(quote: {
  quoteNumber: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  taxOffice?: string | null;
  taxNumber?: string | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
  items: { name: string; quantity: number; unitPrice: number }[];
  grandTotal: number;
}) {
  const itemsLines = quote.items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name} — ${i.quantity} Adet (Birim: ₺${Number(i.unitPrice).toLocaleString("tr-TR")})`
    )
    .join("\n");

  const text = [
    `🏢 YENİ TOPTAN / PROJE TEKLİF TALEBİ (${quote.quoteNumber})`,
    `----------------------------------------`,
    `Firma / Şirket Ünvanı: ${quote.companyName}`,
    `Yetkili Kişi: ${quote.contactPerson}`,
    `Telefon: ${quote.phone}`,
    `E-posta: ${quote.email}`,
    `Vergi Dairesi / No: ${quote.taxOffice || "-"} / ${quote.taxNumber || "-"}`,
    `İl / Adres: ${quote.city || "-"} - ${quote.address || "-"}`,
    `Proje Notu: ${quote.notes || "-"}`,
    ``,
    `Seçilen Ürünler:`,
    itemsLines,
    ``,
    `Yaklaşık Liste Toplamı (KDV Dahil): ₺${Number(quote.grandTotal).toLocaleString("tr-TR")}`,
  ].join("\n");

  await sendAdminNotification({
    subject: `📑 Yeni Toptan Fiyat Teklifi Talebi: ${quote.companyName} (${quote.quoteNumber})`,
    text,
    senderName: `${quote.companyName} - ${quote.contactPerson}`,
    senderEmail: quote.email || ADMIN_NOTIFICATION_EMAIL,
  });
}

