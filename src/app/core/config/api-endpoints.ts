// UPDATED FILE: src/app/core/config/api-endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    mfaVerify: '/auth/mfa/verify',
    mfaSetup: '/auth/mfa/setup',
    mfaConfirm: '/auth/mfa/confirm',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    meFallback: '/users/me',
    register: '/auth/register',
    verify: '/auth/verify',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  admin: {
    users: {
      suppliers: '/admin/users/suppliers',
      consumers: '/admin/users/consumers',
      activation: (id: string) => `/admin/users/${id}/activation`,
    },
    subscriptions: {
      base: '/admin/subscriptions',
      byId: (id: string) => `/admin/subscriptions/${id}`,
    },
    reference: {
      currencyRates: '/admin/reference/currency-rates',
      currencies: '/admin/reference/currencies',
    },
  },
  company: {
    info: '/admin/company',
  },
  public: {
    geo: {
      countries: '/public/geo/countries',
      provinces: (countryId: string) => `/public/geo/countries/${countryId}/provinces`,
      cities: (provinceId: string) => `/public/geo/provinces/${provinceId}/cities`,
      municipalities: (cityId: string) => `/public/geo/cities/${cityId}/municipalities`,
    },
  },
  notifications: {
    mine: '/notifications',
  },
  agrisol: {
    shop: {
      products: '/agrisol/shop/products',
      cart: '/agrisol/shop/cart',
      cartItems: '/agrisol/shop/cart/items',
      cartItemById: (id: string) => `/agrisol/shop/cart/items/${id}`,
      checkout: '/agrisol/shop/checkout',
      orders: '/agrisol/shop/orders',
      cancelOrder: (id: string) => `/agrisol/shop/orders/${id}/cancel`,
    },
  },
  agricash: {
    wallet: {
      me: '/agricash/wallet/me',
      balances: '/agricash/wallet/balances',
      transactions: '/agricash/wallet/transactions',
    },
    payments: {
      intents: '/agricash/payments/intents',
      byId: (id: string) => `/agricash/payments/${id}`,
      capture: (id: string) => `/agricash/payments/${id}/capture`,
      refund: (id: string) => `/agricash/payments/${id}/refund`,
    },
    withdrawals: {
      base: '/agricash/withdrawals',
      adminPending: '/agricash/admin/withdrawals',
      approve: (id: string) => `/agricash/admin/withdrawals/${id}/approve`,
      reject: (id: string) => `/agricash/admin/withdrawals/${id}/reject`,
    },
    admin: {
      ledgerJournals: '/agricash/admin/ledger/journals',
    },
  },
  legacy: {
    users: {
      base: '/users',
      me: '/users/me',
    },
    companies: {
      base: '/companies',
      byId: (id: string) => `/companies/${id}`,
    },
    subscriptions: {
      base: '/subscriptions',
      byId: (id: string) => `/subscriptions/${id}`,
    },
    products: {
      base: '/products',
      byId: (id: string) => `/products/${id}`,
    },
    orders: {
      base: '/orders',
      byId: (id: string) => `/orders/${id}`,
    },
  },
} as const;
