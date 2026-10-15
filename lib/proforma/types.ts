export interface ProformaItem {
  id: string;
  productId?: number | null;
  name: string;
  description?: string;
  image?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number; // Yüzde (%)
  lineTotal: number;
}

export type KdvStatus = "HARIC" | "DAHIL" | "MUAFIYET";

export type ProformaStatus = "TEKLIF" | "ONAYLANDI" | "ODENDI" | "IPTAL";

export interface ProformaFormData {
  proformaNumber: string;
  customerTitle: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  taxOffice?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  
  currency: "TRY" | "USD" | "EUR";
  currencySymbol: string;
  exchangeRate: number;
  
  kdvRate: number;
  kdvStatus: KdvStatus;
  discountRate: number;
  
  validUntilDays: number;
  deliveryTerms?: string;
  paymentTerms?: string;
  bankInfo?: string;
  notes?: string;
  
  items: ProformaItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  status: ProformaStatus;
}
