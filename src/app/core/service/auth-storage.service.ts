// src/app/core/service/auth-storage.service.ts
import { Injectable } from '@angular/core';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface PersistedAuthState {
  tokens: AuthTokens | null;
}

const STORAGE_KEY = 'kulakwetu_auth_tokens';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  setTokens(tokens: AuthTokens, rememberMe = false): void {
    this.clear();

    const payload: PersistedAuthState = { tokens };
    const target = rememberMe ? localStorage : sessionStorage;
    target.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  getTokens(): AuthTokens | null {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as PersistedAuthState;
      if (!parsed.tokens?.accessToken || !parsed.tokens?.refreshToken) {
        this.clear();
        return null;
      }

      return parsed.tokens;
    } catch {
      this.clear();
      return null;
    }
  }

  getAccessToken(): string | null {
    return this.getTokens()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.getTokens()?.refreshToken ?? null;
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
