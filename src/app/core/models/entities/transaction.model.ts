export enum TransactionDirection {
  Debit = 'DEBIT',
  Credit = 'CREDIT',
}

export enum TransactionStatus {
  Pending = 'PENDING',
  Posted = 'POSTED',
  Reversed = 'REVERSED',
  Failed = 'FAILED',
}

export interface TransactionPartyModel {
  userId?: string | null;
  walletId?: string | null;
}

export interface TransactionModel {
  journalId: string;
  referenceType: string;
  referenceId: string;
  direction: TransactionDirection;
  amount: number;
  currencyCode: string;
  status: TransactionStatus;
  description?: string | null;
  source?: TransactionPartyModel | null;
  destination?: TransactionPartyModel | null;
  createdAt: string;
  updatedAt?: string | null;
}
