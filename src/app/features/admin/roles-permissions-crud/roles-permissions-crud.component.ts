import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrudColumn, CrudTableComponent } from '../components/crud-table/crud-table.component';

@Component({
  selector: 'app-roles-permissions-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, CrudTableComponent],
  templateUrl: './roles-permissions-crud.component.html',
  styleUrl: './roles-permissions-crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPermissionsCrudComponent {
  readonly columns: CrudColumn[] = [
    { key: 'role', label: 'Role' },
    { key: 'permissions', label: 'Permissions' },
  ];

  readonly rows: Record<string, string>[] = [
    { role: 'SUPERADMIN', permissions: 'ALL' },
    { role: 'ADMIN', permissions: 'USER_MANAGEMENT, SETTINGS, CURRENCIES, ACTIVITY_LOGS' },
    { role: 'SUPPLIER', permissions: 'WALLET, PRODUCTS' },
    { role: 'PRODUCER', permissions: 'WALLET, PRODUCTS' },
    { role: 'CONSUMER', permissions: 'WALLET, ORDERS' },
  ];

  filter = '';

  get filteredRows(): Record<string, string>[] {
    const q = this.filter.trim().toLowerCase();
    if (!q) {
      return this.rows;
    }

    return this.rows.filter((row) =>
      [row['role'], row['permissions']].some((value) => value.toLowerCase().includes(q)),
    );
  }
}
