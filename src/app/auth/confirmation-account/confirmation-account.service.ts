// src/app/auth/confirmation-account/confirmation-account.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api-endpoints';
import { CoreApiService } from '../../core/service/core-api.service';

export interface VerifyAccountRequest {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationAccountService {
  private readonly coreApiService = inject(CoreApiService);

  verifyAccount(payload: VerifyAccountRequest): Observable<void> {
    return this.coreApiService.post<void, VerifyAccountRequest>(API_ENDPOINTS.auth.verify, payload);
  }

  verifySmsCode(code: string): Observable<void> {
    return this.verifyAccount({ token: code.trim() });
  }

  confirmSmsAccount(code: string): Observable<void> {
    return this.verifySmsCode(code);
  }
}
