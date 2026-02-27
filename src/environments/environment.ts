export const environment = {
  production: false,
  appName: 'kulakwetu-frontend',
  apiBaseUrl: 'http://localhost:8080/api',
  apiName: 'kulakwetu-api',
  apiTimeoutMs: 30000,
  apiWithCredentials: false,
  cors: {
    enabled: true,
    allowedOrigins: ['http://localhost:4200'],
  },
  i18n: {
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en', 'sw'],
  },
  currency: {
    defaultCurrency: 'CDF',
    supportedCurrencies: ['KES', 'CDF', 'USD'],
  },
} as const;
