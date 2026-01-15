/**
 * OTP (One-Time Password) Types
 */

export interface OTPStatus {
  otp: string;        // Current OTP code (6 digits)
  ttl: number;        // Time to live in seconds
  expiresAt: string;  // ISO timestamp of expiration
}

export interface OTPSetRequest {
  otp: string;        // 6-digit OTP to set
}

export interface OTPSetResponse {
  success: boolean;
  message?: string;
}

export interface OTPContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  otpStatus: OTPStatus | null;
  error: string | null;
}
