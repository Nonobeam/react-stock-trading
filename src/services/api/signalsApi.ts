/**
 * Signals API Service
 * Handles all trading signal API calls for the dashboard
 */

import { apiClient } from './client';
import type {
  SignalsListResponse,
  SignalsQueryOptions,
} from '../../shared/types/dashboard';

/**
 * Signals API service object
 */
export const signalsApi = {
  /**
   * Get trading signals with optional filtering
   * @param options - Query options for filtering signals
   * @returns List of trading signals
   */
  async getSignals(options?: SignalsQueryOptions): Promise<SignalsListResponse> {
    return apiClient.get<SignalsListResponse>(
      '/signals',
      options as Record<string, unknown>
    );
  },
};
