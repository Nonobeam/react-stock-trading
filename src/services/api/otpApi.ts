/**
 * OTP API Service
 * Handles OTP-related API calls
 */

import { apiClient } from './client';
import type { OTPStatus, OTPSetRequest, OTPSetResponse } from '../../shared/types/otp';

export const otpApi = {
  /**
   * Get current OTP status
   * Returns OTP and TTL if valid, or error if no OTP exists
   */
  async getStatus(): Promise<OTPStatus> {
    return apiClient.get<OTPStatus>('/otp');
  },

  /**
   * Set a new OTP
   * @param otp - 6-digit OTP code
   */
  async setOtp(otp: string): Promise<OTPSetResponse> {
    const request: OTPSetRequest = { otp };
    return apiClient.post<OTPSetResponse>('/otp', request);
  }
};
