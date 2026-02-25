import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationAccountService } from './confirmation-account.service';

@Component({
  selector: 'app-confirmation-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './confirmation-account.component.html',
  styleUrl: './confirmation-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationAccountComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationAccountService = inject(
    ConfirmationAccountService
  );

  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;

  readonly loading = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly countdown = signal(60);
  readonly isSmsFlow = signal(false);

  readonly form = this.fb.nonNullable.group({
    token: ['', [Validators.required]],
  });

  readonly smsCodeForm = this.fb.nonNullable.group({
    d1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    d2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    d3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    d4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    d5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    d6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
  });

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    const token = (this.route.snapshot.queryParamMap.get('token') ?? '').trim();
    const channel = (
      this.route.snapshot.queryParamMap.get('channel') ?? ''
    ).toUpperCase();

    this.form.controls.token.setValue(token);

    if (channel === 'SMS') {
      this.isSmsFlow.set(true);
      if (/^\d{6}$/.test(token)) {
        this.patchSmsDigits(token);
      }
      this.startCountdown();
      return;
    }

    if (token) {
      this.verifyToken(token, false);
    }
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  // ===============================
  // INPUT UX
  // ===============================
  onDigitInput(event: Event, nextFieldId?: string): void {
    const input = event.target as HTMLInputElement;
    const value = (input.value ?? '').replace(/\D/g, '');
    input.value = value.slice(-1);

    if (input.value && nextFieldId) {
      document.getElementById(nextFieldId)?.focus();
    }
  }

  onBackspace(event: KeyboardEvent, previousFieldId?: string): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && previousFieldId) {
      document.getElementById(previousFieldId)?.focus();
    }
  }

  // ===============================
  // SUBMIT
  // ===============================
  onSubmit(): void {
    if (this.isSmsFlow()) {
      this.form.controls.token.setValue(this.smsToken());
    }

    if (this.form.invalid || (this.isSmsFlow() && this.smsCodeForm.invalid)) {
      this.form.markAllAsTouched();
      this.smsCodeForm.markAllAsTouched();
      return;
    }

    this.verifyToken(this.form.controls.token.value.trim(), this.isSmsFlow());
  }

  // ===============================
  // VERIFICATION
  // ===============================
  private verifyToken(token: string, isSms: boolean): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const request$ = isSms
      ? this.confirmationAccountService.verifySmsCode(token)
      : this.confirmationAccountService.verifyAccount({ token });

    request$.subscribe({
      next: () => {
        this.success.set(
          'Compte vérifié avec succès. Vous pouvez maintenant vous connecter.'
        );
        this.loading.set(false);

        // ✅ Redirection UNIQUEMENT en cas de succès
        setTimeout(() => this.router.navigateByUrl('/success'), 1500);
      },
      error: (err) => {
        // ❌ rester sur la page
        this.error.set(this.mapServerError(err));
        this.loading.set(false);
      },
    });
  }

  // ===============================
  // ERROR MAPPING
  // ===============================
  private mapServerError(err: any): string {
    const serverError = err?.error;

    if (!serverError) {
      return 'Une erreur réseau est survenue. Veuillez réessayer.';
    }

    switch (serverError.code) {
      case 'DOMAIN_ERROR':
        return (
          serverError.message ??
          'Le token est invalide, expiré ou déjà utilisé.'
        );

      case 'VALIDATION_ERROR':
        return 'Données invalides. Veuillez vérifier votre saisie.';

      case 'UNAUTHORIZED':
        return 'Action non autorisée.';

      default:
        return serverError.message ?? 'La vérification du compte a échoué.';
    }
  }

  // ===============================
  // SMS HELPERS
  // ===============================
  smsToken(): string {
    const { d1, d2, d3, d4, d5, d6 } = this.smsCodeForm.getRawValue();
    return `${d1}${d2}${d3}${d4}${d5}${d6}`;
  }

  private patchSmsDigits(token: string): void {
    this.smsCodeForm.patchValue({
      d1: token[0],
      d2: token[1],
      d3: token[2],
      d4: token[3],
      d5: token[4],
      d6: token[5],
    });
  }

  // ===============================
  // COUNTDOWN
  // ===============================
  restartCountdown(): void {
    this.countdown.set(60);
    this.startCountdown();
  }

  private startCountdown(): void {
    this.clearCountdown();
    this.countdownIntervalId = setInterval(() => {
      const next = this.countdown() - 1;
      if (next <= 0) {
        this.countdown.set(0);
        this.clearCountdown();
        return;
      }
      this.countdown.set(next);
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }
}
