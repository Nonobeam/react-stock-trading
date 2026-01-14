/**
 * Recommendations API Service
 * Handles AI recommendation API calls for the dashboard
 */

import { apiClient } from './client';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from '../../shared/types/dashboard';

/**
 * Recommendations API service object
 */
export const recommendationsApi = {
  /**
   * Get AI-powered trading recommendation based on context
   * @param request - Context flags for recommendation generation
   * @returns AI recommendation with symbol, action, and rationale
   */
  async get(request: RecommendationRequest): Promise<RecommendationResponse> {
    return apiClient.post<RecommendationResponse>('/recommendations', request);
  },
};
