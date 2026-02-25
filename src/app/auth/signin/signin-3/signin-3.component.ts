import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-signin-3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin-3.component.html',
  styleUrl: './signin-3.component.scss',
})
export class Signin3Component {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ===============================
  // UI STATE
  // ===============================
  readonly isLoading = signal(false);
  readonly requiresMfa = signal(false);
  readonly serverError = signal<string | null>(null);

  // 🔥 AJOUT OBLIGATOIRE (pour le HTML)
  passwordVisible = false;

  // ===============================
  // FORM
  // ===============================
  readonly form = this.fb.nonNullable.group({
    identifier: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
    code: [''],
  });

  // ===============================
  // SUBMIT
  // ===============================
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { identifier, password, rememberMe, code } = this.form.getRawValue();

    const request$ = this.requiresMfa()
      ? this.authService.verifyMfa({
        identifier,
        password,
        rememberMe,
        code: code ?? '',
      })
      : this.authService.login({
        identifier,
        password,
        rememberMe,
      });

    request$.subscribe({
      next: (response) => {
        if (response.mfaRequired) {
          this.requiresMfa.set(true);
          this.form.controls.code.addValidators([
            Validators.required,
            Validators.pattern(/^[0-9]{6}$/),
          ]);
          this.form.controls.code.updateValueAndValidity();
          this.isLoading.set(false);
          return;
        }

        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.serverError.set(
          err?.error?.message ??
          'Échec de connexion. Vérifiez vos identifiants.'
        );
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
