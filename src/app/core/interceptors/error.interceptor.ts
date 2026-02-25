import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('auth.accessToken');
        void router.navigate(['/auth/login'], {
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

      const normalizedError = {
        status: error.status,
        url: error.url ?? req.url,
        message:
          (error.error && (error.error.message || error.error.error)) ||
          error.message ||
          'Une erreur inattendue est survenue.',
        details: error.error,
      };

      return throwError(() => normalizedError);
    }),
  );
};
