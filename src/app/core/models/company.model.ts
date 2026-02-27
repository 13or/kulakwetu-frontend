// src/app/core/models/company.model.ts
export interface CompanyDto {
  id: string;
  name: string;
  email?: string;
  accountUrl?: string;
  plan?: string;
  createdAt?: string;
  status?: string;
  logoUrl?: string;
}
