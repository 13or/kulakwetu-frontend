import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  LedgerTransactionResponse,
  WalletBalanceResponse,
  WalletResponse,
} from '../models/openapi-dashboard.model';
import { CoreApiService } from '../service/core-api.service';

interface CurrencyRateResponse {
  id: string;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  rate: number;
  validFrom: string;
}

interface PageCurrencyRateResponse {
  content: CurrencyRateResponse[];
}

@Injectable({ providedIn: 'root' })
export class AgricashService {
  private readonly coreApiService = inject(CoreApiService);

  wallet(): Observable<WalletResponse> {
    return this.coreApiService.get<WalletResponse>(API_ENDPOINTS.agricash.wallet.me);
  }

  balances(): Observable<WalletBalanceResponse[]> {
    return this.coreApiService.get<WalletBalanceResponse[]>(API_ENDPOINTS.agricash.wallet.balances);
  }

  transactions(): Observable<LedgerTransactionResponse[]> {
    return this.coreApiService.get<LedgerTransactionResponse[]>(API_ENDPOINTS.agricash.wallet.transactions);
  }

  currencyRates(page = 0, size = 100): Observable<PageCurrencyRateResponse> {
    return this.coreApiService.get<PageCurrencyRateResponse>(API_ENDPOINTS.admin.reference.currencyRates, {
      params: { page, size },
    });
  }
}
