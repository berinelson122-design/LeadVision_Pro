
export interface PropertyData {
  id: string;
  address: string;
  price: number;
  priceStr: string;
  status: string;
  url: string;
  zip: string;
  priceCut?: number;
  distressSignal?: string;
  sqft?: number;
  pricePerSqft?: number;
  dateListed?: string;
}