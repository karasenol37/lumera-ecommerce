import type { ProformaItem, KdvStatus } from "./types";

export const DEFAULT_BANK_INFO = `Banka: T.C. Ziraat Bankası A.Ş.
Şube: Tosya Şubesi (Şube Kodu: 0142)
Hesap Sahibi: LUMERA TASARIM VE DIŞ MEKAN MOBİLYALARI
IBAN (TRY): TR42 0001 0001 4200 0012 3456 78
IBAN (USD): TR15 0001 0001 4200 0012 3456 79 (Swift: TCZBTR2A)
IBAN (EUR): TR88 0001 0001 4200 0012 3456 80`;

export const DEFAULT_DELIVERY_TERMS = "Sipariş teyidini ve ön ödemeyi takiben 7 - 14 iş günü içerisinde ambalajlı olarak fabrikadan sevk edilir. Nakliye ve indirme alıcıya aittir (Anlaşmalı ambar/lojistik ile sevk edilebilir).";

export const DEFAULT_PAYMENT_TERMS = "%50 Sipariş onayı ve imalata başlama aşamasında peşin havale, kalan %50 sevk öncesi nakit/havale.";

export const DEFAULT_PROFORMA_NOTES = `1. Fiyatlarımıza montaj ve kurulum dahil değildir (Aksi belirtilmedikçe).
2. Ürünlerimiz 1. Sınıf fırınlanmış gürgen/kayın ve dış hava koşullarına dayanıklı koruyucu yağlar ile üretilmektedir.
3. Teklifimiz hazırlandığı tarihten itibaren belirtilen geçerlilik süresi boyunca bağlayıcıdır.
4. Özel ölçü ve siparişe özel üretilen ürünlerde iptal veya iade kabul edilmemektedir.`;

export function calculateProformaTotals(
  items: ProformaItem[],
  kdvRate: number,
  kdvStatus: KdvStatus,
  overallDiscountRate: number = 0
) {
  // 1. Line items subtotal
  let rawSubtotal = 0;
  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const disc = Number(item.discountRate) || 0;
    const lineGross = qty * price;
    const lineNet = lineGross * (1 - disc / 100);
    rawSubtotal += lineNet;
  }

  // 2. Overall discount
  const discountAmount = rawSubtotal * ((Number(overallDiscountRate) || 0) / 100);
  const baseAfterDiscount = Math.max(0, rawSubtotal - discountAmount);

  // 3. Tax & Grand Total based on KDV Status
  let totalTax = 0;
  let grandTotal = 0;
  let subtotal = rawSubtotal;

  if (kdvStatus === "HARIC") {
    totalTax = baseAfterDiscount * ((Number(kdvRate) || 0) / 100);
    grandTotal = baseAfterDiscount + totalTax;
  } else if (kdvStatus === "DAHIL") {
    // baseAfterDiscount is already tax inclusive
    const rateFactor = 1 + (Number(kdvRate) || 0) / 100;
    const netBase = baseAfterDiscount / rateFactor;
    totalTax = baseAfterDiscount - netBase;
    grandTotal = baseAfterDiscount;
    subtotal = rawSubtotal / rateFactor;
  } else {
    // MUAFIYET (KDV'den Muaf)
    totalTax = 0;
    grandTotal = baseAfterDiscount;
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalDiscount: Math.round(discountAmount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

// Convert numbers like 14250.50 to Turkish legal words for invoice
export function amountToTurkishWords(amount: number, currency: string = "TRY"): string {
  const birler = ["", "BİR", "İKİ", "ÜÇ", "DÖRT", "BEŞ", "ALTI", "YEDİ", "SEKİZ", "DOKUZ"];
  const onlar = ["", "ON", "YİRMİ", "OTUZ", "KIRK", "ELLİ", "ALTMIŞ", "YETMİŞ", "SEKSEN", "DOKSAN"];
  const basamaklar = ["", "BİN", "MİLYON", "MİLYAR", "TRİLYON"];

  let mainUnit = "TÜRK LİRASI";
  let subUnit = "KURUŞ";

  if (currency === "USD") {
    mainUnit = "ABD DOLARI";
    subUnit = "CENT";
  } else if (currency === "EUR") {
    mainUnit = "EURO";
    subUnit = "CENT";
  }

  if (isNaN(amount) || amount === 0) {
    return `SIFIR ${mainUnit}`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const tamKisim = Math.floor(absAmount);
  const kurusKisim = Math.round((absAmount - tamKisim) * 100);

  function ucBasamak(n: number): string {
    const yuz = Math.floor(n / 100);
    const on = Math.floor((n % 100) / 10);
    const bir = n % 10;
    let res = "";

    if (yuz > 1) res += birler[yuz] + " YÜZ ";
    else if (yuz === 1) res += "YÜZ ";

    if (on > 0) res += onlar[on] + " ";
    if (bir > 0) res += birler[bir] + " ";

    return res.trim();
  }

  let tamText = "";
  if (tamKisim === 0) {
    tamText = "SIFIR";
  } else {
    let kalan = tamKisim;
    let basamakIndex = 0;

    while (kalan > 0) {
      const grup = kalan % 1000;
      if (grup > 0) {
        let grupText = ucBasamak(grup);
        // "BİR BİN" yerine sadece "BİN" kuralı
        if (basamakIndex === 1 && grup === 1) {
          grupText = "";
        }
        const bText = basamaklar[basamakIndex];
        tamText = (grupText ? grupText + " " : "") + (bText ? bText + " " : "") + tamText;
      }
      kalan = Math.floor(kalan / 1000);
      basamakIndex++;
    }
  }

  let kurusText = "";
  if (kurusKisim > 0) {
    kurusText = ucBasamak(kurusKisim) + " " + subUnit;
  }

  const result = `${isNegative ? "EKSİ " : ""}${tamText.trim()} ${mainUnit} ${kurusText ? kurusText.trim() : ""}`.trim();
  return `# ${result} #`;
}

export function formatCurrencyValue(amount: number, symbol: string = "₺"): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
  return `${formatted} ${symbol}`;
}
