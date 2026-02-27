// NEW FILE: src/app/core/models/openapi-admin-extended.model.ts
import { PageResponse } from './openapi-common.model';

export interface CurrencyResponse {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
}

export interface CurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isActive: boolean;
}

export interface CompanyInfoResponse {
  id: string;
  legalName: string;
  tradeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  agrisolDescription?: string;
  agricashDescription?: string;
  updatedAt?: string;
}

export interface CompanyInfoRequest {
  legalName: string;
  tradeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  agrisolDescription?: string;
  agricashDescription?: string;
}

export interface LedgerJournalResponse {
  journalId: string;
  referenceType: string;
  referenceId: string;
  status: 'POSTED' | 'REVERSED';
  reversalOfJournalId?: string;
  createdAt: string;
}

export type CurrencyPage = PageResponse<CurrencyResponse>;
