/**
 * Watchlist API Service
 * Handles all watchlist-related API calls for the dashboard
 */

import { apiClient } from './client';
import type {
  WatchlistResponse,
  WatchlistAddResponse,
  WatchlistRemoveResponse,
  WatchlistFavoriteResponse,
} from '../../shared/types/dashboard';

/**
 * Watchlist API service object
 */
export const watchlistApi = {
  /**
   * Get user's watchlist items with live quotes
   * @returns Watchlist items with price data
   */
  async getAll(): Promise<WatchlistResponse> {
    return apiClient.get<WatchlistResponse>('/watchlist');
  },

  /**
   * Add a symbol to the watchlist
   * @param symbol - Stock symbol to add
   * @returns Add confirmation
   */
  async add(symbol: string): Promise<WatchlistAddResponse> {
    return apiClient.post<WatchlistAddResponse>('/watchlist', { symbol });
  },

  /**
   * Remove a symbol from the watchlist
   * @param symbol - Stock symbol to remove
   * @returns Remove confirmation
   */
  async remove(symbol: string): Promise<WatchlistRemoveResponse> {
    return apiClient.delete<WatchlistRemoveResponse>(`/watchlist/${symbol}`);
  },

  /**
   * Toggle favorite status for a watchlist item
   * @param symbol - Stock symbol to update
   * @param isFavorite - New favorite status
   * @returns Update confirmation
   */
  async toggleFavorite(
    symbol: string,
    isFavorite: boolean
  ): Promise<WatchlistFavoriteResponse> {
    return apiClient.patch<WatchlistFavoriteResponse>(
      `/watchlist/${symbol}/favorite`,
      { isFavorite }
    );
  },
};
