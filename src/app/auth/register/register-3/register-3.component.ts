import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {RegisterService, VerificationChannel} from './register-3.service';

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-register-3',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register-3.component.html',
  styleUrl: './register-3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register3Component {
  private readonly fb = inject(FormBuilder);
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  readonly password: boolean[] = [false, false, false];
  readonly loading = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(80)]],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+[1-9][0-9]{6,14}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
      accountType: ['CONSUMER' as const, Validators.required],
      verificationChannel: ['SMS' as VerificationChannel, Validators.required],
      agree: [false, Validators.requiredTrue],
    },
    { validators: passwordMatchValidator() }
  );

  readonly passwordMismatch = computed(() => this.form.hasError('passwordMismatch') && this.form.touched);

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (raw.verificationChannel === 'EMAIL' && !raw.email.trim()) {
      this.submitError.set('Veuillez renseigner un email pour confirmer par email.');
      return;
    }

    this.loading.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(null);

    this.registerService
      .register({
        username: raw.username.trim(),
        firstName: raw.firstName.trim(),
        lastName: raw.lastName.trim(),
        phoneNumber: raw.phoneNumber.trim(),
        email: raw.email.trim() ? raw.email.trim().toLowerCase() : null,
        password: raw.password,
        accountType: raw.accountType,
        verificationChannel: raw.verificationChannel,
      })
      .subscribe({
        next: (res) => {
          if (raw.verificationChannel === 'SMS') {
            this.submitSuccess.set('Compte créé. Entrez le code reçu par SMS pour finaliser la vérification.');
            setTimeout(
              () =>
                this.router.navigate(['/auth/verify'], {
                  queryParams: {
                    channel: 'SMS',
                    phoneNumber: raw.phoneNumber.trim(),
                    token: res.verificationToken,
                  },
                }),
              800
            );
            return;
          }

          this.submitSuccess.set('Compte créé. Vérifiez votre email puis confirmez votre compte.');
          setTimeout(() => this.router.navigateByUrl('/login'), 1500);
        },
        error: (err) => {
          this.submitError.set(err?.error?.message ?? "Échec de l'inscription.");
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }
}
