export interface PropertyData {
  id: string;
  address: string;
  price: number;
  priceStr: string; // Keep raw string for display
  status: string; // 'AUCTION', 'FORECLOSURE', 'PRICE CUT', 'STANDARD'
  distressSignal: string;
  url: string;
  zip: string;
  sqft: number;
  pricePerSqFt: number;
  dateListed: string;
}

export enum SortField {
  PRICE = 'price',
  STATUS = 'status',
  ZIP = 'zip',
  SQFT = 'sqft'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}