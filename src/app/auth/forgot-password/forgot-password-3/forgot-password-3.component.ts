import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {AuthService} from '../../../core/service/auth.service';

@Component({
  selector: 'app-forgot-password-3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-3.component.html',
})
export class ForgotPassword3Component {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: (response) => this.message.set(response),
      error: (err) => this.error.set(err?.error?.message ?? 'Impossible de traiter la demande.'),
      complete: () => this.isLoading.set(false),
    });
  }
}
