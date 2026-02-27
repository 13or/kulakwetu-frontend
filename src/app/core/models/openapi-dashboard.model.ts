export interface AuthenticatedUserProfile {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: string;
  roles?: string[];
}

export interface WalletResponse {
  walletId: string;
  userId: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface WalletBalanceResponse {
  currencyCode: string;
  availableAmount: number;
  reservedAmount: number;
}

export interface LedgerTransactionResponse {
  journalId: string;
  referenceType: string;
  referenceId: string;
  createdAt: string;
  debit: number;
  credit: number;
  currencyCode: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
