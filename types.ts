export interface PropertyData {
  id: string;
  address: string;
  zip: string;
  price: number;
  sqft: number;
  status: 'STANDARD' | 'AUCTION' | 'FORECLOSURE';
  priceCut: number;
  dateListed: string;
  pricePerSqFt: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export enum SortField {
  PRICE = 'price',
  SQFT = 'sqft',
  ZIP = 'zip',
  STATUS = 'status',
  PRICECUT = 'priceCut',
  DATE = 'dateListed'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}