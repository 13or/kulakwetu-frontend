import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth/auth.guard';
import { roleGuard } from './core/guard/role.guard';
import {publicRoutes} from './public.routes';

export const routes: Routes = [
  ...publicRoutes,
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  { path: 'user-management', canActivate: [roleGuard], data: { roles: ['SUPERADMIN', 'ADMIN'] }, loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent), children: [
      { path: 'roles-permissions', loadComponent: () => import('./features/user-management/roles-permissions/roles-permissions.component').then(m => m.RolesPermissionsComponent) },
      { path: 'delete-account', loadComponent: () => import('./features/user-management/delete-account/delete-account.component').then(m => m.DeleteAccountComponent) },
      { path: 'users', loadComponent: () => import('./features/user-management/users/users.component').then(m => m.UsersComponent) },
      { path: 'permissions', loadComponent: () => import('./features/user-management/permissions/permissions.component').then(m => m.PermissionsComponent) }
    ]
  },
  {
    path: 'my-dashboard',
    canActivate: [roleGuard],
    data: { roles: ['CONSUMER', 'SUPPLIER', 'PRODUCER'] },
    loadChildren: () => import('./features/auth-dashboard/dashboard.routes').then((m) => m.AUTH_DASHBOARD_ROUTES),
  },

  {
    path: 'agricash',
    canActivate: [roleGuard],
    data: { roles: ['CONSUMER', 'SUPPLIER', 'PRODUCER'] },
    loadComponent: () => import('./features/agricash/agricash.component').then(m => m.AgricashComponent),
  },

  // Error
  {
    path: 'error',
    loadComponent: () => import('./error/error.component').then((m) => m.ErrorComponent),
    children: [
      { path: '', redirectTo: 'error-404', pathMatch: 'full' },
      {
        path: 'error-404',
        loadComponent: () =>
          import('./error/error-404/error-404.component').then((m) => m.Error404Component),
      },
      {
        path: 'error-500',
        loadComponent: () =>
          import('./error/error-500/error-500.component').then((m) => m.Error500Component),
      },
    ],
  },

  // Auth layout (si tu veux garder un layout séparé)
  {
    path: '',
    loadComponent: () => import('./auth/auth.component').then((m) => m.AuthComponent),
    children: [],
  },

  // Features (privé)
  {
    path: '',
    loadComponent: () => import('./features/features.component').then((m) => m.FeaturesComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboards/dashboard.component').then((m) => m.DashboardComponent),
        children: [
          {
            path: 'index',
            loadComponent: () =>
              import('./features/dashboards/admin-dashboard-1/admin-dashboard-1.component').then(
                (m) => m.AdminDashboard1Component
              ),
          },
          {
            path: 'admin-dashboard',
            loadComponent: () =>
              import('./features/dashboards/admin-dashboard/admin-dashboard.component').then(
                (m) => m.AdminDashboardComponent
              ),
          },
          {
            path: 'sales-dashboard',
            loadComponent: () =>
              import('./features/dashboards/sales-dashboard/sales-dashboard.component').then(
                (m) => m.SalesDashboardComponent
              ),
          },
        ],
      },

      {
        path: 'layouts',
        loadComponent: () =>
          import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
            (m) => m.ModalDashboardComponent
          ),
        children: [
          {
            path: 'layout-horizontal',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-rtl',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-detached',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-two-column',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-boxed',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-dark',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
          {
            path: 'layout-hovered',
            loadComponent: () =>
              import('./features/dashboards/modal-dashboard/modal-dashboard.component').then(
                (m) => m.ModalDashboardComponent
              ),
          },
        ],
      },

      {
        path: 'application',
        loadComponent: () =>
          import('./features/application/application.component').then((m) => m.ApplicationComponent),
        children: [
          { path: 'chat', loadComponent: () => import('./features/application/chat/chat.component').then((m) => m.ChatComponent) },
          { path: 'calendar', loadComponent: () => import('./features/application/calendar/calendar.component').then((m) => m.CalendarComponent) },
          { path: 'email', loadComponent: () => import('./features/application/email/email.component').then((m) => m.EmailComponent) },
          { path: 'email-reply', loadComponent: () => import('./features/application/email-reply/email-reply.component').then((m) => m.EmailReplyComponent) },
          { path: 'call-history', loadComponent: () => import('./features/application/call/call-history/call-history.component').then((m) => m.CallHistoryComponent) },
          { path: 'file-archived', loadComponent: () => import('./features/application/file/file-archived/file-archived.component').then((m) => m.FileArchivedComponent) },
          { path: 'file-document', loadComponent: () => import('./features/application/file/file-document/file-document.component').then((m) => m.FileDocumentComponent) },
          { path: 'file-favourites', loadComponent: () => import('./features/application/file/file-favourites/file-favourites.component').then((m) => m.FileFavouritesComponent) },
          { path: 'file-manager', loadComponent: () => import('./features/application/file/file-manager/file-manager.component').then((m) => m.FileManagerComponent) },
          { path: 'file-manager-deleted', loadComponent: () => import('./features/application/file/file-manager-deleted/file-manager-deleted.component').then((m) => m.FileManagerDeletedComponent) },
          { path: 'file-recent', loadComponent: () => import('./features/application/file/file-recent/file-recent.component').then((m) => m.FileRecentComponent) },
          { path: 'file-shared', loadComponent: () => import('./features/application/file/file-shared/file-shared.component').then((m) => m.FileSharedComponent) },
          { path: 'audio-call', loadComponent: () => import('./features/application/call/audio-call/audio-call.component').then((m) => m.AudioCallComponent) },
          { path: 'video-call', loadComponent: () => import('./features/application/call/video-call/video-call.component').then((m) => m.VideoCallComponent) },
          { path: 'todo', loadComponent: () => import('./features/application/todo/todo.component').then((m) => m.TodoComponent) },
          { path: 'notes', loadComponent: () => import('./features/application/notes/notes.component').then((m) => m.NotesComponent) },
          { path: 'social-feed', loadComponent: () => import('./features/application/social-feed/social-feed.component').then((m) => m.SocialFeedComponent) },
          { path: 'kanban', loadComponent: () => import('./features/application/kanban/kanban.component').then((m) => m.KanbanComponent) },
          { path: 'projects', loadComponent: () => import('./features/application/kanban-view/kanban-view.component').then((m) => m.KanbanViewComponent) },
          { path: 'contacts', loadComponent: () => import('./features/application/contacts/contacts.component').then((m) => m.ContactsComponent) },

          {
            path: 'ecommerce',
            loadComponent: () =>
              import('./features/application/ecommerce/ecommerce.component').then((m) => m.EcommerceComponent),
            children: [
              { path: 'products', loadComponent: () => import('./features/application/ecommerce/products/products.component').then((m) => m.ProductsComponent) },
              { path: 'orders', loadComponent: () => import('./features/application/ecommerce/orders/orders.component').then((m) => m.OrdersComponent) },
              { path: 'customers', loadComponent: () => import('./features/application/ecommerce/customers/customers.component').then((m) => m.CustomersComponent) },
              { path: 'cart', loadComponent: () => import('./features/application/ecommerce/cart/cart.component').then((m) => m.CartComponent) },
              { path: 'checkout', loadComponent: () => import('./features/application/ecommerce/checkout/checkout.component').then((m) => m.CheckoutComponent) },
              { path: 'wishlist', loadComponent: () => import('./features/application/ecommerce/wishlist/wishlist.component').then((m) => m.WishlistComponent) },
              { path: 'reviews', loadComponent: () => import('./features/application/ecommerce/reviews/reviews.component').then((m) => m.ReviewsComponent) },
            ],
          },

          { path: 'todo-list', loadComponent: () => import('./features/application/todo-list/todo-list.component').then((m) => m.TodoListComponent) },
          { path: 'search-list', loadComponent: () => import('./features/application/search-list/search-list.component').then((m) => m.SearchListComponent) },
        ],
      },

      {
        path: 'super-admin',
        canActivate: [roleGuard],
        data: { roles: ['SUPERADMIN'] },
        loadComponent: () =>
          import('./features/super-admin/super-admin.component').then((m) => m.SuperAdminComponent),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/super-admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
          },
          {
            path: 'companies',
            loadComponent: () =>
              import('./features/super-admin/companies/companies.component').then((m) => m.CompaniesComponent),
          },
          {
            path: 'subscriptions',
            loadComponent: () =>
              import('./features/super-admin/subscriptions/subscriptions.component').then((m) => m.SubscriptionsComponent),
          },
          {
            path: 'packages',
            loadComponent: () =>
              import('./features/super-admin/packages/packages.component').then((m) => m.PackagesComponent),
          },
          {
            path: 'domain',
            loadComponent: () =>
              import('./features/super-admin/domain/domain.component').then((m) => m.DomainComponent),
          },
          {
            path: 'purchase-transaction',
            loadComponent: () =>
              import('./features/super-admin/purchase-transaction/purchase-transaction.component').then(
                (m) => m.PurchaseTransactionComponent
              ),
          },
        ],
      },

      // ... (le reste de tes routes est OK à garder pareil, c'est surtout la mise en forme + virgules/parenthèses)
    ],
  },

  { path: '**', redirectTo: 'error/error-404', pathMatch: 'full' },
];
