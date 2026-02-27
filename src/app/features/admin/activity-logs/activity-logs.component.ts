import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminActivityApiService } from '../../../core/api/admin/admin-activity-api.service';
import { LedgerJournalResponse } from '../../../core/models/openapi-admin-extended.model';
import { CrudColumn, CrudTableComponent } from '../components/crud-table/crud-table.component';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrudTableComponent],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogsComponent implements OnInit {
  private readonly activityApi = inject(AdminActivityApiService);
  private readonly fb = inject(FormBuilder);

  readonly columns: CrudColumn[] = [
    { key: 'createdAt', label: 'Created at' },
    { key: 'referenceType', label: 'Reference type' },
    { key: 'referenceId', label: 'Reference id' },
    { key: 'status', label: 'Status' },
    { key: 'journalId', label: 'Journal id' },
  ];

  private rows: Record<string, string>[] = [];
  page = 0;
  readonly size = 10;

  isLoading = false;
  errorMessage = '';

  readonly filterForm = this.fb.nonNullable.group({
    query: this.fb.nonNullable.control(''),
    status: this.fb.nonNullable.control<'ALL' | 'POSTED' | 'REVERSED'>('ALL'),
  });

  ngOnInit(): void {
    this.load();
  }

  onPageChange(page: number): void {
    this.page = page;
  }

  get filteredRows(): Record<string, string>[] {
    const query = this.filterForm.controls.query.value.trim().toLowerCase();
    const status = this.filterForm.controls.status.value;

    return this.rows.filter((row) => {
      const matchesStatus = status === 'ALL' ? true : row['status'] === status;
      if (!query) {
        return matchesStatus;
      }

      const matchesQuery = Object.values(row).some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }

  get pagedRows(): Record<string, string>[] {
    const start = this.page * this.size;
    return this.filteredRows.slice(start, start + this.size);
  }

  get totalItems(): number {
    return this.filteredRows.length;
  }

  private load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.activityApi
      .journals()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (journals) => {
          this.rows = journals.map((journal) => this.toRow(journal));
          this.page = 0;
        },
        error: (error: { message?: string } | null) => {
          this.errorMessage = error?.message ?? 'Unable to load activity logs.';
        },
      });
  }

  private toRow(journal: LedgerJournalResponse): Record<string, string> {
    return {
      createdAt: new Date(journal.createdAt).toLocaleString(),
      referenceType: journal.referenceType,
      referenceId: journal.referenceId,
      status: journal.status,
      journalId: journal.journalId,
    };
  }
}
