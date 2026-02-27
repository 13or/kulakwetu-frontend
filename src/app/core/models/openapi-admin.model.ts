import { PageResponse } from './openapi-common.model';

export interface AdminUserResponse {
  id: string;
  username: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  accountType: string;
  enabled: boolean;
  verified: boolean;
  createdAt: string;
}

export interface AdminUserStatusRequest {
  enabled: boolean;
}

export interface SubscriptionTypeRequest {
  name: string;
  benefits?: string;
  price: number;
  currencyCode: string;
  durationDays: number;
  isActive?: boolean;
}

export interface SubscriptionTypeResponse {
  id: string;
  name: string;
  benefits?: string;
  price: number;
  currencyCode: string;
  durationDays: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AdminUserPage = PageResponse<AdminUserResponse>;
export type SubscriptionTypePage = PageResponse<SubscriptionTypeResponse>;
