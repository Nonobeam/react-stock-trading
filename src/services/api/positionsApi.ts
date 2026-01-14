/**
 * Positions API Service
 * Handles all position-related API calls for the dashboard
 */

import { apiClient } from './client';
import type {
  ActivePositionsResponse,
  PositionsSummaryResponse,
} from '../../shared/types/dashboard';

/**
 * Positions API service object
 */
export const positionsApi = {
  /**
   * Get all open/active positions
   * @returns List of active positions with P&L data
   */
  async getActive(): Promise<ActivePositionsResponse> {
    return apiClient.get<ActivePositionsResponse>('/positions/active');
  },

  /**
   * Get aggregate portfolio metrics
   * @returns Portfolio summary with totals and averages
   */
  async getSummary(): Promise<PositionsSummaryResponse> {
    return apiClient.get<PositionsSummaryResponse>('/positions/summary');
  },
};
