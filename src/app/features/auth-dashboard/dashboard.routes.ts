import { Routes } from '@angular/router';

export const AUTH_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-layout/dashboard-layout.component')
        .then((m) => m.DashboardLayoutComponent),
  },
];
