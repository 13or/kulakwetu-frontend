import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyAccountRequest,
} from '../models/openapi-auth.model';
import { CoreApiService } from '../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly coreApiService = inject(CoreApiService);

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.coreApiService.post<RegisterResponse, RegisterRequest>(API_ENDPOINTS.auth.register, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.coreApiService.post<LoginResponse, LoginRequest>(API_ENDPOINTS.auth.login, payload);
  }

  refresh(payload: RefreshRequest): Observable<LoginResponse> {
    return this.coreApiService.post<LoginResponse, RefreshRequest>(API_ENDPOINTS.auth.refresh, payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<string> {
    return this.coreApiService.post<string, ForgotPasswordRequest>(API_ENDPOINTS.auth.forgotPassword, payload, {
      headers: {
        Accept: 'text/plain',
      },
    });
  }

  resetPassword(payload: ResetPasswordRequest): Observable<void> {
    return this.coreApiService.post<void, ResetPasswordRequest>(API_ENDPOINTS.auth.resetPassword, payload);
  }

  verify(payload: VerifyAccountRequest): Observable<void> {
    return this.coreApiService.post<void, VerifyAccountRequest>(API_ENDPOINTS.auth.verify, payload);
  }
}
