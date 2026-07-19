import { CheckoutFormData } from "@/types/order";

export function validateCheckout(data: CheckoutFormData) {
  if (!data.fullName.trim()) {
    return "Ad Soyad zorunludur.";
  }

  if (!data.phone.trim()) {
    return "Telefon zorunludur.";
  }

  if (!data.email.trim()) {
    return "E-posta zorunludur.";
  }

  if (!data.city.trim()) {
    return "İl zorunludur.";
  }

  if (!data.district.trim()) {
    return "İlçe zorunludur.";
  }

  if (!data.address.trim()) {
    return "Adres zorunludur.";
  }

  return null;
}