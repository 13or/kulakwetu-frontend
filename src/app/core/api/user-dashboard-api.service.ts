import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  AuthenticatedUserProfile,
  LedgerTransactionResponse,
  NotificationItem,
  WalletBalanceResponse,
  WalletResponse,
} from '../models/openapi-dashboard.model';
import { CoreApiService } from '../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class UserDashboardApiService {
  private readonly coreApiService = inject(CoreApiService);

  profile(): Observable<AuthenticatedUserProfile> {
    return this.coreApiService.get<AuthenticatedUserProfile>(API_ENDPOINTS.auth.me).pipe(
      catchError(() => this.coreApiService.get<AuthenticatedUserProfile>(API_ENDPOINTS.auth.meFallback)),
    );
  }

  wallet(): Observable<WalletResponse> {
    return this.coreApiService.get<WalletResponse>(API_ENDPOINTS.agricash.wallet.me);
  }

  balances(): Observable<WalletBalanceResponse[]> {
    return this.coreApiService.get<WalletBalanceResponse[]>(API_ENDPOINTS.agricash.wallet.balances);
  }

  transactions(): Observable<LedgerTransactionResponse[]> {
    return this.coreApiService.get<LedgerTransactionResponse[]>(API_ENDPOINTS.agricash.wallet.transactions);
  }

  notifications(): Observable<NotificationItem[]> {
    return this.coreApiService.get<NotificationItem[]>(API_ENDPOINTS.notifications.mine).pipe(
      catchError(() => of([])),
    );
  }
}
