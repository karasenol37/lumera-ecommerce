export type CheckoutFormData = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
};

export type CheckoutCartItem = {
  productId: number;
  quantity: number;
};

export type OrderStatus =
  | "Bekliyor"
  | "Hazırlanıyor"
  | "Kargoda"
  | "Teslim Edildi";