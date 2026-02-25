import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';

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
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.api.baseUrl;

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiBaseUrl}/auth/register`, payload);
  }
}
