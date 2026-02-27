// NEW FILE: src/app/features/admin/admin-layout/admin-layout.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface AdminNavItem {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  protected readonly navItems: AdminNavItem[] = [
    { label: 'Users', path: 'users' },
    { label: 'Roles & permissions', path: 'roles-permissions' },
    { label: 'Currencies', path: 'currencies' },
    { label: 'System settings', path: 'system-settings' },
    { label: 'Activity logs', path: 'activity-logs' },
  ];
}
