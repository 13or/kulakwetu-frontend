import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/public-layout/public-layout.component')
        .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/public/home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about.component')
            .then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/public/services/services.component')
            .then(m => m.ServicesComponent)
      },
      {
        path: 'service-detail',
        loadComponent: () =>
          import('./features/public/service-detail/service-detail.component')
            .then(m => m.ServiceDetailComponent)
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./features/public/team/team.component')
            .then(m => m.TeamComponent)
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/public/blog/blog.component')
            .then(m => m.BlogComponent)
      },
      {
        path: 'shop-products',
        loadComponent: () =>
          import('./features/public/shop-products/shop-products.component')
            .then(m => m.ShopProductsComponent)
      },
      {
        path: 'shop-detail',
        loadComponent: () =>
          import('./features/public/shop-detail/shop-detail.component')
            .then(m => m.ShopDetailComponent)
      },
      {
        path: 'shop-cart',
        loadComponent: () =>
          import('./features/public/shop-cart/shop-cart.component')
            .then(m => m.ShopCartComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/public/wishlist/wishlist.component')
            .then(m => m.WishlistComponent)
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component')
            .then(m => m.ContactComponent)
      },

      { path: 'email-verification', loadComponent: () => import('./auth/email-verification/email-verification-3/email-verification-3.component')
          .then(m => m.EmailVerification3Component) },
      { path: 'reset-password', loadComponent: () => import('./auth/reset-password/reset-password/reset-password.component')
          .then(m => m.ResetPasswordComponent) },
      { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password-3/forgot-password-3.component')
          .then(m => m.ForgotPassword3Component) },
      { path: 'register', loadComponent: () => import('./auth/register/register-3/register-3.component')
          .then(m => m.Register3Component) },
      { path: 'login', loadComponent: () => import('./auth/signin/signin-3/signin-3.component')
          .then(m => m.Signin3Component) },
      { path: 'two-step-verification-3', loadComponent: () => import('./auth/two-step-verification/two-step-verification-3/two-step-verification-3.component')
          .then(m => m.TwoStepVerification3Component) },
      { path: 'lock-screen', loadComponent: () => import('./auth/lock-screen/lock-screen.component')
          .then(m => m.LockScreenComponent) },
      { path: 'auth/verify', loadComponent: () => import('./auth/confirmation-account/confirmation-account.component')
          .then(m => m.ConfirmationAccountComponent) },
      { path: 'success', loadComponent: () => import('./auth/successs/success-3/success-3.component')
          .then(m => m.Success3Component) }
    ]
  }
];
