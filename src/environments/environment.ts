export const environment = {
  production: false,
  appName: 'kulakwetu-frontend',
  api: {
    name: 'kulakwetu-api',
    baseUrl: 'http://localhost:8080/api',
    timeoutMs: 30000,
    withCredentials: false,
    cors: {
      enabled: true,
      allowedOrigins: ['http://localhost:4200'],
    },
  },
  i18n: {
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en', 'sw'],
  },
  currency: {
    defaultCurrency: 'CDF',
    supportedCurrencies: ['KES', 'CDF', 'USD'],
  },
};
