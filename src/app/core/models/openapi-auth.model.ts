export type AccountType = 'SUPPLIER' | 'PRODUCER' | 'CONSUMER';
export type VerificationChannel = 'EMAIL' | 'SMS';

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  accountType: AccountType;
  verificationChannel?: VerificationChannel;
}

export interface RegisterResponse {
  userId: string;
  walletId: string;
  verificationToken: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  accessExpiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  mfaRequired: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyAccountRequest {
  token: string;
}
