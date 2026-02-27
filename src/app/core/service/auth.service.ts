import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { ApiError } from '../models/api-error.model';
import { AuthStorageService, AuthTokens } from './auth-storage.service';
import { CoreApiService } from './core-api.service';

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
  accessExpiresIn?: number;
  refreshExpiresIn?: number;
  tokenType?: string;
  mfaRequired?: boolean;
  user?: User;
  tokens?: {
    accessToken?: string | null;
    refreshToken?: string | null;
  };
}

interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface JwtClaims {
  sub: string;
  roles?: string[];
  permissions?: string[];
  exp?: number;
  iat?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  claims: JwtClaims | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly coreApiService = inject(CoreApiService);
  private readonly authStorageService = inject(AuthStorageService);

  private readonly state$ = new BehaviorSubject<AuthState>(this.buildStateFromStorage());

  readonly authState$ = this.state$.asObservable();

  get authState(): AuthState {
    return this.state$.value;
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.coreApiService
      .post<LoginResponse, LoginRequest>(API_ENDPOINTS.auth.login, payload)
      .pipe(tap((res) => this.handleAuthResponse(res, payload.rememberMe ?? false)));
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.authStorageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const payload: RefreshRequest = { refreshToken };
    return this.coreApiService
      .post<LoginResponse, RefreshRequest>(API_ENDPOINTS.auth.refresh, payload)
      .pipe(tap((res) => this.handleAuthResponse(res, true)));
  }

  me(): Observable<User> {
    return this.coreApiService.get<User>(API_ENDPOINTS.auth.me).pipe(
      tap((user) => this.patchUser(user)),
      catchError((error: ApiError) => {
        if (error.status === 404) {
          return this.coreApiService.get<User>(API_ENDPOINTS.auth.meFallback).pipe(
            tap((user) => this.patchUser(user)),
          );
        }

        return throwError(() => error);
      }),
    );
  }

  logout(): Observable<void> {
    return this.coreApiService.post<void, Record<string, never>>(API_ENDPOINTS.auth.logout, {}).pipe(
      tap(() => this.clearAuthState()),
      catchError((error: ApiError) => {
        this.clearAuthState();
        return throwError(() => error);
      }),
    );
  }

  isAuthenticated(): boolean {
    const token = this.authStorageService.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    const normalizedRole = role.trim().toUpperCase();
    if (!normalizedRole) {
      return false;
    }

    return this.getUserRoles().includes(normalizedRole);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  getAccessToken(): string | null {
    return this.authStorageService.getAccessToken();
  }

  verifyMfa(payload: LoginRequest & { code: string }): Observable<LoginResponse> {
    return this.coreApiService
      .post<LoginResponse, LoginRequest & { code: string }>(API_ENDPOINTS.auth.mfaVerify, payload)
      .pipe(tap((res) => this.handleAuthResponse(res, payload.rememberMe ?? false)));
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<string> {
    return this.coreApiService
      .post<string, ForgotPasswordRequest>(API_ENDPOINTS.auth.forgotPassword, payload, {
        headers: {
          Accept: 'text/plain',
        },
      })
      .pipe(catchError(() => of('Si le compte existe, les instructions ont été envoyées.')));
  }

  resetPassword(payload: ResetPasswordRequest): Observable<void> {
    return this.coreApiService.post<void, ResetPasswordRequest>(API_ENDPOINTS.auth.resetPassword, payload);
  }

  userId$(): Observable<string | null> {
    return this.authState$.pipe(map((s) => s.claims?.sub ?? s.user?.id ?? null));
  }

  private getUserRoles(): string[] {
    const claimRoles = this.authState.claims?.roles ?? [];
    const userRoles = this.authState.user?.roles ?? [];

    return [...claimRoles, ...userRoles]
      .map((value) => value.trim().toUpperCase())
      .filter((value, index, array) => value.length > 0 && array.indexOf(value) === index);
  }

  private handleAuthResponse(response: LoginResponse, rememberMe: boolean): void {
    if (response.mfaRequired) {
      return;
    }

    const tokens = this.extractTokens(response);
    if (!tokens) {
      return;
    }

    const claims = this.decodeJwt(tokens.accessToken);

    this.authStorageService.setTokens(tokens, rememberMe);
    this.state$.next({
      isAuthenticated: true,
      user: response.user ?? this.authState.user,
      claims,
    });
  }

  private extractTokens(response: LoginResponse): AuthTokens | null {
    const accessToken = response.accessToken ?? response.tokens?.accessToken ?? null;
    const refreshToken = response.refreshToken ?? response.tokens?.refreshToken ?? null;

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  private patchUser(user: User): void {
    this.state$.next({
      ...this.authState,
      user,
      isAuthenticated: this.isAuthenticated(),
    });
  }

  private clearAuthState(): void {
    this.authStorageService.clear();
    this.state$.next({
      isAuthenticated: false,
      user: null,
      claims: null,
    });
  }

  private buildStateFromStorage(): AuthState {
    const accessToken = this.authStorageService.getAccessToken();

    if (!accessToken || this.isTokenExpired(accessToken)) {
      this.authStorageService.clear();
      return {
        isAuthenticated: false,
        user: null,
        claims: null,
      };
    }

    return {
      isAuthenticated: true,
      user: null,
      claims: this.decodeJwt(accessToken),
    };
  }

  private isTokenExpired(token: string): boolean {
    const claims = this.decodeJwt(token);
    if (!claims?.exp) {
      return false;
    }

    return claims.exp * 1000 <= Date.now();
  }

  private decodeJwt(token: string): JwtClaims | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      );

      return JSON.parse(json) as JwtClaims;
    } catch {
      return null;
    }
  }
}
