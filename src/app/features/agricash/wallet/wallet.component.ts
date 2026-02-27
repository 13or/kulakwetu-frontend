import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletBalanceResponse } from '../../../core/models/openapi-dashboard.model';
import { AgricashCurrencyPipe } from '../../../shared/pipe/currency/currency.pipe';

export interface WalletOperation {
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  currencyCode: string;
  confirmationCode: string;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgricashCurrencyPipe],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent {
  @Input() balances: WalletBalanceResponse[] = [];
  @Input() rates: Record<string, number> = {};

  @Output() submitted = new EventEmitter<WalletOperation>();

  private readonly fb = inject(FormBuilder);

  readonly step = signal<1 | 2>(1);

  readonly operationForm = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT'),
    amount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0.01)]),
    currencyCode: this.fb.nonNullable.control('USD', [Validators.required]),
  });

  readonly confirmationForm = this.fb.nonNullable.group({
    confirmationCode: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
  });

  readonly convertedBalances = computed(() => {
    const target = this.operationForm.controls.currencyCode.value;
    const targetRate = this.rates[target] ?? 1;

    return this.balances.map((balance) => {
      const rate = this.rates[balance.currencyCode] ?? 1;
      const conversionRate = targetRate === 0 ? 0 : rate / targetRate;

      return {
        ...balance,
        convertedAmount: balance.availableAmount * conversionRate,
      };
    });
  });

  nextStep(): void {
    if (this.operationForm.invalid) {
      this.operationForm.markAllAsTouched();
      return;
    }

    this.step.set(2);
  }

  previousStep(): void {
    this.step.set(1);
  }

  submit(): void {
    if (this.confirmationForm.invalid || this.operationForm.invalid) {
      this.confirmationForm.markAllAsTouched();
      this.operationForm.markAllAsTouched();
      return;
    }

    this.submitted.emit({
      type: this.operationForm.controls.type.value,
      amount: this.operationForm.controls.amount.value,
      currencyCode: this.operationForm.controls.currencyCode.value,
      confirmationCode: this.confirmationForm.controls.confirmationCode.value,
    });

    this.confirmationForm.reset({ confirmationCode: '' });
    this.step.set(1);
  }
}
