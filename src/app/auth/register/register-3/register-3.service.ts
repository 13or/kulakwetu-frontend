// src/app/auth/register/register-3/register-3.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';
import { CoreApiService } from '../../../core/service/core-api.service';

export type AccountType = 'SUPPLIER' | 'PRODUCER' | 'CONSUMER';
export type VerificationChannel = 'EMAIL' | 'SMS';

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  password: string;
  accountType: AccountType;
  verificationChannel: VerificationChannel;
}

export interface RegisterResponse {
  userId: string;
  walletId: string;
  verificationToken: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private readonly coreApiService = inject(CoreApiService);

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.coreApiService.post<RegisterResponse, RegisterRequest>(API_ENDPOINTS.auth.register, payload);
  }
}
