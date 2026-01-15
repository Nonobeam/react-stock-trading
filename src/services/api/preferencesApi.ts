/**
 * Stock Preferences API Service
 * Handles all stock preference-related API calls
 */

import { apiClient } from './client';
import type {
  StockPreference,
  StockPreferencesResponse,
  StockPreferenceRequest,
} from '../../shared/types';

/**
 * Stock Preferences API service object
 */
export const preferencesApi = {
  /**
   * Get all stock preferences
   * @returns All configured stock preferences
   */
  async getAll(): Promise<StockPreferencesResponse> {
    return apiClient.get<StockPreferencesResponse>('/preferences/stocks');
  },

  /**
   * Get preference for a specific stock
   * @param symbol - Stock symbol
   * @returns Stock preference if exists
   */
  async getBySymbol(symbol: string): Promise<StockPreference> {
    return apiClient.get<StockPreference>(`/preferences/stocks/${symbol}`);
  },

  /**
   * Create or update a stock preference
   * @param symbol - Stock symbol
   * @param data - Preference data
   * @returns Updated stock preference
   */
  async upsert(symbol: string, data: StockPreferenceRequest): Promise<StockPreference> {
    return apiClient.put<StockPreference>(`/preferences/stocks/${symbol}`, data);
  },

  /**
   * Remove a stock preference
   * @param symbol - Stock symbol to remove
   */
  async remove(symbol: string): Promise<void> {
    return apiClient.delete<void>(`/preferences/stocks/${symbol}`);
  },
};
