export const environmentProd = {
  production: true,
  appName: 'kulakwetu-frontend',
  api: {
    name: 'kulakwetu-api',
    baseUrl: 'https://api.kulakwetu.com/api',
    timeoutMs: 30000,
    withCredentials: false,
    cors: {
      enabled: true,
      allowedOrigins: ['https://app.kulakwetu.com'],
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
