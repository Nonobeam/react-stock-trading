/**
 * Account API Service
 * Handles all account-related API calls for the dashboard
 */

import { apiClient } from './client';
import type {
  AccountInfoResponse,
  AccountSummaryResponse,
} from '../../shared/types/dashboard';

/**
 * Account API service object
 */
export const accountApi = {
  /**
   * Get account capital and balance information
   * @returns Account info including capital, cash, positions value
   */
  async getInfo(): Promise<AccountInfoResponse> {
    return apiClient.get<AccountInfoResponse>('/account/info');
  },

  /**
   * Get account P&L summary and risk metrics
   * @returns Account summary with P&L and risk data
   */
  async getSummary(): Promise<AccountSummaryResponse> {
    return apiClient.get<AccountSummaryResponse>('/account/summary');
  },
};
