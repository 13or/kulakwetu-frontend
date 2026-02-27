// src/app/core/service/core-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../models/api-error.model';
import { normalizeApiError } from '../helpers/normalize-api-error';

export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryParamValue>;

export interface CoreApiOptions {
  headers?: Record<string, string>;
  params?: QueryParams;
}

@Injectable({ providedIn: 'root' })
export class CoreApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  get<T>(path: string, options?: CoreApiOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(path), {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
      })
      .pipe(catchError((error) => this.throwNormalizedError(error)));
  }

  post<TResponse, TBody = unknown>(path: string, body: TBody, options?: CoreApiOptions): Observable<TResponse> {
    return this.http
      .post<TResponse>(this.buildUrl(path), body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
      })
      .pipe(catchError((error) => this.throwNormalizedError(error)));
  }

  put<TResponse, TBody = unknown>(path: string, body: TBody, options?: CoreApiOptions): Observable<TResponse> {
    return this.http
      .put<TResponse>(this.buildUrl(path), body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
      })
      .pipe(catchError((error) => this.throwNormalizedError(error)));
  }

  patch<TResponse, TBody = unknown>(path: string, body: TBody, options?: CoreApiOptions): Observable<TResponse> {
    return this.http
      .patch<TResponse>(this.buildUrl(path), body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
      })
      .pipe(catchError((error) => this.throwNormalizedError(error)));
  }

  delete<T>(path: string, options?: CoreApiOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(path), {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
      })
      .pipe(catchError((error) => this.throwNormalizedError(error)));
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }

  private buildHeaders(headers?: Record<string, string>): HttpHeaders | undefined {
    return headers ? new HttpHeaders(headers) : undefined;
  }

  private buildParams(params?: QueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }

  private throwNormalizedError(error: unknown): Observable<never> {
    const normalizedError: ApiError = normalizeApiError(error);
    return throwError(() => normalizedError);
  }
}
