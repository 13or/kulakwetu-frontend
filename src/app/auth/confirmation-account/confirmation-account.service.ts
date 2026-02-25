import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

export interface VerifyAccountRequest {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationAccountService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.api.baseUrl;

  verifyAccount(payload: VerifyAccountRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/verify`, payload);
  }

  verifySmsCode(code: string): Observable<void> {
    return this.verifyAccount({ token: code.trim() });
  }

  confirmSmsAccount(code: string): Observable<void> {
    return this.verifySmsCode(code);
  }
}
