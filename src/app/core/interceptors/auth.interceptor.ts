import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, finalize, of, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { AuthService } from '../service/auth.service';
import { AuthStorageService } from '../service/auth-storage.service';

const RETRIED_REQUEST = new HttpContextToken<boolean>(() => false);
const SKIP_REFRESH_ENDPOINTS = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.logout,
] as const;

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorageService = inject(AuthStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiBaseUrl);
  if (!isApiRequest) {
    return next(req);
  }

  const isRefreshExcluded = SKIP_REFRESH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));
  const accessToken = authStorageService.getAccessToken();
  const request = accessToken ? addAuthorizationHeader(req, accessToken) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isRefreshExcluded) {
        return throwError(() => error);
      }

      if (request.context.get(RETRIED_REQUEST)) {
        return handleRefreshFailure(authService, router, error);
      }

      const refreshToken = authStorageService.getRefreshToken();
      if (!refreshToken) {
        return handleRefreshFailure(authService, router, error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((token): token is string => !!token),
          take(1),
          switchMap((token) =>
            next(addAuthorizationHeader(markAsRetried(req), token)).pipe(
              catchError((replayedError: HttpErrorResponse) =>
                handleRefreshFailure(authService, router, replayedError),
              ),
            ),
          ),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap(() => {
          const latestAccessToken = authStorageService.getAccessToken();

          if (!latestAccessToken) {
            return handleRefreshFailure(authService, router, error);
          }

          refreshTokenSubject.next(latestAccessToken);
          return next(addAuthorizationHeader(markAsRetried(req), latestAccessToken));
        }),
        catchError((refreshError: HttpErrorResponse) => handleRefreshFailure(authService, router, refreshError)),
        finalize(() => {
          isRefreshing = false;
        }),
      );
    }),
  );
};

function addAuthorizationHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function markAsRetried(req: HttpRequest<unknown>): HttpRequest<unknown> {
  return req.clone({
    context: req.context.set(RETRIED_REQUEST, true),
  });
}

function handleRefreshFailure(authService: AuthService, router: Router, error: HttpErrorResponse): Observable<never> {
  refreshTokenSubject.next(null);

  return authService.logout().pipe(
    catchError(() => of(void 0)),
    switchMap(() => {
      void router.navigate(['/login']);
      return throwError(() => error);
    }),
  );
}
