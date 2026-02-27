import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface CrudColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-crud-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudTableComponent {
  @Input() title = 'Data table';
  @Input() columns: CrudColumn[] = [];
  @Input() rows: Record<string, string | number | boolean | null | undefined>[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Input() currentPage = 0;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    const computed = Math.ceil(this.totalItems / this.pageSize);
    return computed > 0 ? computed : 1;
  }

  get canGoPrev(): boolean {
    return this.currentPage > 0;
  }

  get canGoNext(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  prevPage(): void {
    if (this.canGoPrev) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
