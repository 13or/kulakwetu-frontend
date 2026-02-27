import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminUsersApiService } from '../../../core/api/admin-users-api.service';
import { AdminUserResponse } from '../../../core/models/openapi-admin.model';
import { CrudColumn, CrudTableComponent } from '../components/crud-table/crud-table.component';

type UserScope = 'SUPPLIER' | 'CONSUMER';

@Component({
  selector: 'app-users-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, CrudTableComponent],
  templateUrl: './users-crud.component.html',
  styleUrl: './users-crud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersCrudComponent implements OnInit {
  private readonly usersApi = inject(AdminUsersApiService);

  readonly columns: CrudColumn[] = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'accountType', label: 'Account type' },
    { key: 'enabledLabel', label: 'Enabled' },
  ];

  users: AdminUserResponse[] = [];
  filter = '';
  selectedScope: UserScope = 'SUPPLIER';

  page = 0;
  readonly size = 10;
  totalItems = 0;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  get filteredRows(): Record<string, string | number | boolean | null | undefined>[] {
    const q = this.filter.trim().toLowerCase();

    return this.users
      .filter((user) => {
        if (!q) {
          return true;
        }

        return [user.username, user.email, user.phoneNumber, user.accountType]
          .map((value) => (value ?? '').toLowerCase())
          .some((value) => value.includes(q));
      })
      .map((user) => ({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        accountType: user.accountType,
        enabledLabel: user.enabled ? 'Yes' : 'No',
      }));
  }

  onScopeChange(scope: UserScope): void {
    if (this.selectedScope === scope) {
      return;
    }

    this.selectedScope = scope;
    this.page = 0;
    this.load();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  toggleActivation(user: AdminUserResponse): void {
    this.isLoading = true;
    this.usersApi
      .setActivation(user.id, { enabled: !user.enabled })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => this.load(),
        error: (error: { message?: string } | null) => {
          this.errorMessage = error?.message ?? 'Unable to update user status.';
        },
      });
  }

  private load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request$ =
      this.selectedScope === 'SUPPLIER'
        ? this.usersApi.listSuppliers({ page: this.page, size: this.size })
        : this.usersApi.listConsumers({ page: this.page, size: this.size });

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error: { message?: string } | null) => {
        this.errorMessage = error?.message ?? 'Unable to load users.';
      },
    });
  }
}
