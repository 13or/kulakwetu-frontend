import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import {environment} from '../../../environments/environment';

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface MfaVerifyRequest extends LoginRequest {
  code: string;
}

export interface LoginResponse {
  accessToken: string | null;
  accessExpiresIn: number;
  refreshToken: string | null;
  refreshExpiresIn: number;
  mfaRequired: boolean;
}

export interface RefreshRequest {
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
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  claims: JwtClaims | null;
}

const STORAGE_KEY = 'kulakwetu_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.api.baseUrl;

  private readonly state$ = new BehaviorSubject<AuthState>(this.loadState());

  readonly authState$ = this.state$.asObservable();

  get authState(): AuthState {
    return this.state$.value;
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((res) => this.handleLoginResponse(res, payload.rememberMe)));
  }

  verifyMfa(payload: MfaVerifyRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/auth/mfa/verify`, payload)
      .pipe(tap((res) => this.handleLoginResponse(res, payload.rememberMe)));
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.authState.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const payload: RefreshRequest = { refreshToken };
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/auth/refresh`, payload)
      .pipe(tap((res) => this.handleLoginResponse(res, this.authState.rememberMe)));
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/auth/forgot-password`, payload, {
      responseType: 'text',
    });
  }

  resetPassword(payload: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/reset-password`, payload);
  }

  logout(): void {
    this.clearPersistedState();
    this.state$.next(this.emptyState());
  }

  isAuthenticated(): boolean {
    const state = this.authState;
    return !!state.accessToken && !this.isTokenExpired(state.accessToken);
  }

  hasRole(role: string): boolean {
    return this.authState.claims?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  getAccessToken(): string | null {
    return this.authState.accessToken;
  }

  private handleLoginResponse(response: LoginResponse, rememberMe: boolean): void {
    if (response.mfaRequired || !response.accessToken || !response.refreshToken) {
      return;
    }

    const claims = this.decodeJwt(response.accessToken);
    const nextState: AuthState = {
      isAuthenticated: true,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      rememberMe,
      claims,
    };

    this.persistState(nextState);
    this.state$.next(nextState);
  }

  private isTokenExpired(token: string): boolean {
    const claims = this.decodeJwt(token);
    if (!claims?.exp) return false;
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
          .join('')
      );
      return JSON.parse(json) as JwtClaims;
    } catch {
      return null;
    }
  }

  private loadState(): AuthState {
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    const fromSession = sessionStorage.getItem(STORAGE_KEY);
    const raw = fromLocal ?? fromSession;

    if (!raw) return this.emptyState();

    try {
      const parsed = JSON.parse(raw) as AuthState;
      if (!parsed.accessToken || this.isTokenExpired(parsed.accessToken)) {
        this.clearPersistedState();
        return this.emptyState();
      }
      return parsed;
    } catch {
      this.clearPersistedState();
      return this.emptyState();
    }
  }

  private persistState(state: AuthState): void {
    this.clearPersistedState();
    const target = state.rememberMe ? localStorage : sessionStorage;
    target.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private clearPersistedState(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private emptyState(): AuthState {
    return {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      claims: null,
    };
  }

  userId$(): Observable<string | null> {
    return this.authState$.pipe(map((s) => s.claims?.sub ?? null));
  }
}
