// src/app/core/interceptors/error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { normalizeApiError } from '../helpers/normalize-api-error';
import { AuthStorageService } from '../service/auth-storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStorageService = inject(AuthStorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStorageService.clear();
        void router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
      }

      if (error.status === 403) {
        void router.navigate(['/forbidden']);
      }

      if (error.status === 0) {
        console.error('[API] Network/CORS error', {
          url: req.url,
          message: error.message,
        });
      }

      const normalizedError = normalizeApiError(error);
      return throwError(() => normalizedError);
    }),
  );
};
