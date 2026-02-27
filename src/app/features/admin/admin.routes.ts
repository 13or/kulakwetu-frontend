import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guard/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMIN'] },
    loadComponent: () => import('./admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', loadComponent: () => import('./users-crud/users-crud.component').then((m) => m.UsersCrudComponent) },
      {
        path: 'roles-permissions',
        loadComponent: () =>
          import('./roles-permissions-crud/roles-permissions-crud.component').then((m) => m.RolesPermissionsCrudComponent),
      },
      {
        path: 'currencies',
        loadComponent: () =>
          import('./currency-management/currency-management.component').then((m) => m.CurrencyManagementComponent),
      },
      {
        path: 'system-settings',
        loadComponent: () => import('./system-settings/system-settings.component').then((m) => m.SystemSettingsComponent),
      },
      {
        path: 'activity-logs',
        loadComponent: () => import('./activity-logs/activity-logs.component').then((m) => m.ActivityLogsComponent),
      },
    ],
  },
];
