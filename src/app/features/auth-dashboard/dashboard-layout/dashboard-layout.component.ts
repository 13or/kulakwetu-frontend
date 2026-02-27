import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { UserDashboardApiService } from '../../../core/api/user-dashboard-api.service';
import {
  AuthenticatedUserProfile,
  LedgerTransactionResponse,
  NotificationItem,
  WalletBalanceResponse,
  WalletResponse,
} from '../../../core/models/openapi-dashboard.model';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {
  private readonly dashboardApi = inject(UserDashboardApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  profile: AuthenticatedUserProfile | null = null;
  wallet: WalletResponse | null = null;
  balances: WalletBalanceResponse[] = [];
  transactions: LedgerTransactionResponse[] = [];
  notifications: NotificationItem[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigate(['/login']);
      },
      error: () => {
        void this.router.navigate(['/login']);
      },
    });
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      profile: this.dashboardApi.profile(),
      wallet: this.dashboardApi.wallet(),
      balances: this.dashboardApi.balances(),
      transactions: this.dashboardApi.transactions(),
      notifications: this.dashboardApi.notifications(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.profile = data.profile;
          this.wallet = data.wallet;
          this.balances = data.balances;
          this.transactions = data.transactions;
          this.notifications = data.notifications;
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Impossible de charger le dashboard utilisateur.';
        },
      });
  }
}
