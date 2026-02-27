// src/app/core/models/subscription.model.ts
export interface SubscriptionDto {
  id: string;
  companyName?: string;
  billingCycle?: string;
  paymentMethod?: string;
  email?: string;
  accountUrl?: string;
  plan?: string;
  createdAt?: string;
  expiringAt?: string;
  status?: string;
  amount?: number;
  domainStatus?: string;
  invoiceId?: string;
}
