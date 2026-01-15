/**
 * MQTT API Service
 * Handles API calls related to MQTT authentication
 */

import { apiClient } from '../api';

/**
 * Response from JWT token endpoint
 */
interface JwtTokenResponse {
  token: string;
  expiresAt?: number;
}

/**
 * MQTT API service for authentication and configuration
 */
export const mqttApi = {
  /**
   * Get JWT token for MQTT broker authentication
   * @returns Promise resolving to JWT token string
   */
  async getJwtToken(): Promise<string> {
    const response = await apiClient.get<JwtTokenResponse>('/api/jwt-token');
    return response.token;
  },
};
