import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputOtp } from 'primeng/inputotp';
import { TwoStepVerification3Service } from './two-step-verification-3.service';

@Component({
  selector: 'app-two-step-verification-3',
  standalone: true,
  templateUrl: './two-step-verification-3.component.html',
  styleUrl: './two-step-verification-3.component.scss',
  imports: [InputOtp, CommonModule, FormsModule, RouterLink],
})
export class TwoStepVerification3Component implements OnInit, OnDestroy {
  public routes = { index: '/', success3: '/auth/success-3' };
  value: string | undefined;
  loading = false;
  errorMessage: string | null = null;
  remainingSeconds = 60;
  maskedDestination = '******doe@example.com';

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private verificationService: TwoStepVerification3Service
  ) {}

  get countdownLabel(): string {
    const minutes = Math.floor(this.remainingSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    const phoneNumber = this.route.snapshot.queryParamMap.get('phoneNumber') ?? '';

    if (token) {
      this.value = token;
    }

    if (phoneNumber) {
      this.maskedDestination = this.mask(phoneNumber);
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  navigation(): void {
    const code = (this.value ?? '').trim();
    if (code.length !== 6) {
      this.errorMessage = 'Veuillez saisir le code SMS à 6 chiffres.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.verificationService.verifyCode(code).subscribe({
      next: () => this.router.navigate([this.routes.success3]),
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Code invalide ou expiré.';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }

  resendCode(): void {
    if (this.remainingSeconds > 0 || this.loading) {
      return;
    }

    this.remainingSeconds = 60;
    this.startCountdown();
  }

  private startCountdown(): void {
    this.clearCountdown();
    this.timerId = setInterval(() => {
      this.remainingSeconds -= 1;
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.clearCountdown();
      }
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private mask(value: string): string {
    if (value.length <= 4) {
      return '******';
    }
    return `******${value.slice(-4)}`;
  }
}
