export type ShippingCalculableItem = {
  id: number;
  name?: string;
  price?: number;
  quantity: number;
  freeShipping?: boolean;
  shippingFee?: number;
};

export type ShippingCalculationResult = {
  totalCargo: number;
  isFree: boolean;
  maxFee: number;
  extraItemsFee: number;
  paidItemsCount: number;
  breakdown: string;
};

/**
 * Lumera Kargo Hesaplama Mantığı:
 * - Ücretsiz kargolu ürünler hesaba DAHİL EDİLMEZ.
 * - Kargo alıcıya ait ürünlerden en yüksek kargo ücreti baz alınır.
 * - İlave her ürün için kendi kargo ücretinin %40'ı ilave edilir (%60 indirimli ek kargo).
 */
export function calculateShipping(
  items: ShippingCalculableItem[]
): ShippingCalculationResult {
  if (!items || items.length === 0) {
    return {
      totalCargo: 0,
      isFree: true,
      maxFee: 0,
      extraItemsFee: 0,
      paidItemsCount: 0,
      breakdown: "Sepetinizde ürün bulunmuyor.",
    };
  }

  const feeList: number[] = [];

  for (const item of items) {
    const isFree = item.freeShipping === true;
    const fee = typeof item.shippingFee === "number" ? item.shippingFee : 0;

    if (!isFree && fee > 0) {
      const qty = Math.max(1, item.quantity || 1);
      for (let i = 0; i < qty; i++) {
        feeList.push(fee);
      }
    }
  }

  if (feeList.length === 0) {
    return {
      totalCargo: 0,
      isFree: true,
      maxFee: 0,
      extraItemsFee: 0,
      paidItemsCount: 0,
      breakdown: "Ücretsiz Kargo (Tüm ürünler ücretsiz teslimat kapsamındadır)",
    };
  }

  // En yüksekten en düşüğe sırala
  feeList.sort((a, b) => b - a);

  const maxFee = feeList[0];
  const remainingFees = feeList.slice(1);

  // Diğer ürünlerin %40'ı
  const extraItemsFee = Math.round(
    remainingFees.reduce((sum, f) => sum + f * 0.4, 0)
  );

  const totalCargo = Math.round(maxFee + extraItemsFee);

  const breakdown =
    feeList.length === 1
      ? `Kargo Bedeli: ₺${maxFee.toLocaleString("tr-TR")}`
      : `En yüksek kargo (₺${maxFee.toLocaleString("tr-TR")}) + Ek ${remainingFees.length} adet (%40 oranlı: ₺${extraItemsFee.toLocaleString("tr-TR")})`;

  return {
    totalCargo,
    isFree: false,
    maxFee,
    extraItemsFee,
    paidItemsCount: feeList.length,
    breakdown,
  };
}
