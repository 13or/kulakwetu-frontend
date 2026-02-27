import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminCurrencyApiService } from '../../../core/api/admin/admin-currency-api.service';
import { CrudColumn, CrudTableComponent } from '../components/crud-table/crud-table.component';

@Component({
  selector: 'app-currency-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrudTableComponent],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyManagementComponent implements OnInit {
  private readonly currencyApi = inject(AdminCurrencyApiService);
  private readonly fb = inject(FormBuilder);

  readonly columns: CrudColumn[] = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'decimals', label: 'Decimals' },
    { key: 'isActiveLabel', label: 'Active' },
  ];

  rows: Record<string, string | number | boolean | null | undefined>[] = [];
  page = 0;
  readonly size = 10;
  totalItems = 0;

  isLoading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    code: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    name: this.fb.nonNullable.control('', [Validators.required]),
    symbol: this.fb.nonNullable.control('', [Validators.required]),
    decimals: this.fb.nonNullable.control(2, [Validators.required, Validators.min(0), Validators.max(8)]),
    isActive: this.fb.nonNullable.control(true),
  });

  ngOnInit(): void {
    this.load();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.currencyApi
      .create({
        code: this.form.controls.code.value.toUpperCase(),
        name: this.form.controls.name.value,
        symbol: this.form.controls.symbol.value,
        decimals: this.form.controls.decimals.value,
        isActive: this.form.controls.isActive.value,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.form.reset({ code: '', name: '', symbol: '', decimals: 2, isActive: true });
          this.page = 0;
          this.load();
        },
        error: (error: { message?: string } | null) => {
          this.errorMessage = error?.message ?? 'Unable to create currency.';
        },
      });
  }

  private load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.currencyApi
      .list({ page: this.page, size: this.size })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalElements;
          this.rows = response.content.map((currency) => ({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            decimals: currency.decimals,
            isActiveLabel: currency.isActive ? 'Yes' : 'No',
          }));
        },
        error: (error: { message?: string } | null) => {
          this.errorMessage = error?.message ?? 'Unable to load currencies.';
        },
      });
  }
}
