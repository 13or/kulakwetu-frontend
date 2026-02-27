// NEW FILE: src/app/features/admin/system-settings/system-settings.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminSystemApiService } from '../../../core/api/admin/admin-system-api.service';

@Component({
  selector: 'app-admin-system-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './system-settings.component.html',
  styleUrl: './system-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemSettingsComponent implements OnInit {
  private readonly systemApi = inject(AdminSystemApiService);
  private readonly fb = inject(FormBuilder);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    legalName: this.fb.nonNullable.control('', [Validators.required]),
    tradeName: this.fb.nonNullable.control(''),
    supportEmail: this.fb.nonNullable.control(''),
    supportPhone: this.fb.nonNullable.control(''),
    websiteUrl: this.fb.nonNullable.control(''),
    agrisolDescription: this.fb.nonNullable.control(''),
    agricashDescription: this.fb.nonNullable.control(''),
  });

  ngOnInit(): void {
    this.load();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.systemApi
      .updateCompanyInfo(this.form.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'System settings saved.';
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Unable to save system settings.';
        },
      });
  }

  private load(): void {
    this.isLoading = true;
    this.systemApi
      .getCompanyInfo()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (info) => {
          this.form.reset({
            legalName: info.legalName ?? '',
            tradeName: info.tradeName ?? '',
            supportEmail: info.supportEmail ?? '',
            supportPhone: info.supportPhone ?? '',
            websiteUrl: info.websiteUrl ?? '',
            agrisolDescription: info.agrisolDescription ?? '',
            agricashDescription: info.agricashDescription ?? '',
          });
        },
        error: (error) => {
          this.errorMessage = error?.message ?? 'Unable to load system settings.';
        },
      });
  }
}
