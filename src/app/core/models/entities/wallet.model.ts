export enum WalletStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Closed = 'CLOSED',
}

export interface WalletBalanceModel {
  currencyCode: string;
  availableAmount: number;
  reservedAmount: number;
}

export interface WalletModel {
  walletId: string;
  userId: string;
  status: WalletStatus;
  balances?: WalletBalanceModel[];
  createdAt?: string;
  updatedAt?: string | null;
}
