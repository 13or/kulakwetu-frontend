import { InjectionToken, inject, provideAppInitializer } from '@angular/core';
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { errorInterceptor } from '../interceptors/error.interceptor';

export interface ApiConfig {
  apiName: string;
  apiBaseUrl: string;
  timeoutMs: number;
  withCredentials: boolean;
  defaultLanguage: string;
  defaultCurrency: string;
  supportedLanguages: readonly string[];
  supportedCurrencies: readonly string[];
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiName: environment.apiName,
    apiBaseUrl: environment.apiBaseUrl,
    timeoutMs: environment.apiTimeoutMs,
    withCredentials: environment.apiWithCredentials,
    defaultLanguage: environment.i18n.defaultLanguage,
    defaultCurrency: environment.currency.defaultCurrency,
    supportedLanguages: environment.i18n.supportedLanguages,
    supportedCurrencies: environment.currency.supportedCurrencies,
  }),
});

const apiPrefixInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const config = inject(API_CONFIG);

  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);
  const url = isAbsoluteUrl ? req.url : `${config.apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`;

  const activeLanguage = localStorage.getItem('app.language') || config.defaultLanguage;
  const activeCurrency = localStorage.getItem('app.currency') || config.defaultCurrency;

  return next(
    req.clone({
      url,
      withCredentials: config.withCredentials,
      setHeaders: {
        'Accept-Language': activeLanguage,
        'X-Currency': activeCurrency,
      },
    }),
  );
};

export const provideApiConfig = () => [
  provideHttpClient(withInterceptors([apiPrefixInterceptor, errorInterceptor, authInterceptor])),
  provideAppInitializer(() => {
    const config = inject(API_CONFIG);

    if (!localStorage.getItem('app.language')) {
      localStorage.setItem('app.language', config.defaultLanguage);
    }

    if (!localStorage.getItem('app.currency')) {
      localStorage.setItem('app.currency', config.defaultCurrency);
    }
  }),
];
