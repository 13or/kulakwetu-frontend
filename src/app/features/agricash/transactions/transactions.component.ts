import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LedgerTransactionResponse } from '../../../core/models/openapi-dashboard.model';
import { AgricashCurrencyPipe } from '../../../shared/pipe/currency/currency.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, AgricashCurrencyPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  @Input() transactions: LedgerTransactionResponse[] = [];
}
