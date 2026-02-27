export enum CurrencyStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export interface CurrencyModel {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  status: CurrencyStatus;
  exchangeRateToBase?: number | null;
  createdAt?: string;
  updatedAt?: string | null;
}
