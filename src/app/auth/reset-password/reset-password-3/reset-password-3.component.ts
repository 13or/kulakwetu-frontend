import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-reset-password-3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-3.component.html',
})
export class ResetPassword3Component {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // ===============================
  // UI STATE (Angular Signals)
  // ===============================
  readonly isLoading = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  // ===============================
  // 🔥 AJOUT OBLIGATOIRE POUR LE HTML
  // ===============================
  password: boolean[] = [false, false, false];

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }

  // ===============================
  // FORM
  // ===============================
  readonly form = this.fb.nonNullable.group({
    token: [
      this.route.snapshot.queryParamMap.get('token') ?? '',
      Validators.required,
    ],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  // ===============================
  // SUBMIT
  // ===============================
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { token, newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.resetPassword({ token, newPassword }).subscribe({
      next: () => {
        this.success.set('Mot de passe réinitialisé avec succès.');
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: (err) =>
        this.error.set(err?.error?.message ?? 'Réinitialisation impossible.'),
      complete: () => this.isLoading.set(false),
    });
  }
}
