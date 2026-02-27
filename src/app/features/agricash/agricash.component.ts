import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { finalize, forkJoin, map } from 'rxjs';
import { AgricashService } from '../../core/api/agricash.service';
import { WalletOperation, WalletComponent } from './wallet/wallet.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LedgerTransactionResponse, WalletBalanceResponse } from '../../core/models/openapi-dashboard.model';

@Component({
  selector: 'app-agricash',
  standalone: true,
  imports: [CommonModule, WalletComponent, TransactionsComponent],
  templateUrl: './agricash.component.html',
  styleUrl: './agricash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgricashComponent {
  private readonly agricashService = inject(AgricashService);

  balances: WalletBalanceResponse[] = [];
  transactions: LedgerTransactionResponse[] = [];
  rates: Record<string, number> = {};
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.loadData();
  }

  handleOperation(operation: WalletOperation): void {
    this.successMessage = `${operation.type} request confirmed for ${operation.amount} ${operation.currencyCode}.`;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      balances: this.agricashService.balances(),
      transactions: this.agricashService.transactions(),
      rates: this.agricashService.currencyRates().pipe(
        map((response) => this.mapRates(response.content)),
      ),
    })
      .pipe(
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (data) => {
          this.balances = data.balances;
          this.transactions = data.transactions;
          this.rates = data.rates;
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Unable to load Agricash module.';
          this.rates = this.fallbackRates(this.balances);
        },
      });
  }

  private mapRates(rates: { baseCurrencyId: string; quoteCurrencyId: string; rate: number }[]): Record<string, number> {
    const mapped: Record<string, number> = {};

    rates.forEach((rate) => {
      mapped[rate.baseCurrencyId] = rate.rate;
      if (!mapped[rate.quoteCurrencyId]) {
        mapped[rate.quoteCurrencyId] = 1;
      }
    });

    return Object.keys(mapped).length > 0 ? mapped : this.fallbackRates(this.balances);
  }

  private fallbackRates(balances: WalletBalanceResponse[]): Record<string, number> {
    const fallback: Record<string, number> = { USD: 1 };

    balances.forEach((balance) => {
      fallback[balance.currencyCode] = fallback[balance.currencyCode] ?? 1;
    });

    return fallback;
  }
}
