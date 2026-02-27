export const environment = {
  production: true,
  appName: 'kulakwetu-frontend',
  apiBaseUrl: 'https://api.kulakwetu.com/api',
  apiName: 'kulakwetu-api',
  apiTimeoutMs: 30000,
  apiWithCredentials: false,
  cors: {
    enabled: true,
    allowedOrigins: ['https://app.kulakwetu.com'],
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
