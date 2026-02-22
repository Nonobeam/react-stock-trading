/**
 * Market Data API Service
 * Handles all market-related API calls for the dashboard
 */

import { apiClient } from "./client";
import type {
  MarketIndicesResponse,
  IndexHistoryResponse,
  MarketRegimeResponse,
  StockQuoteResponse,
} from "../../shared/types/dashboard";

/**
 * Market API service object
 */
export const marketApi = {
  /**
   * Get all market indices with current values and intraday chart data
   * @returns Market indices data including VN-Index, VN30, VN100
   */
  async getIndices(): Promise<MarketIndicesResponse> {
    return apiClient.get<MarketIndicesResponse>("/market/indices");
  },

  /**
   * Get historical intraday data for a specific index
   * @param indexKey - The index key (vnIndex, vn30, vn100)
   * @param options - Optional query parameters
   * @returns Index history data
   */
  async getIndexHistory(
    indexKey: "vnIndex" | "vn30" | "vn100",
    options?: { interval?: "1m" | "5m" | "15m" | "1h"; limit?: number },
  ): Promise<IndexHistoryResponse> {
    return apiClient.get<IndexHistoryResponse>(
      `/market/indices/${indexKey}/history`,
      options as Record<string, unknown>,
    );
  },

  /**
   * Get current market regime analysis and breadth metrics
   * @returns Market regime data
   */
  async getRegime(): Promise<MarketRegimeResponse> {
    return apiClient.get<MarketRegimeResponse>("/market/regime");
  },

  /**
   * Get real-time price quote for a specific symbol
   * @param symbol - Stock symbol (e.g., VCB, FPT)
   * @returns Stock quote data
   */
  async getQuote(symbol: string): Promise<StockQuoteResponse> {
    return apiClient.get<StockQuoteResponse>(`/market/quote/${symbol}`);
  },

  /**
   * Get the list of active stock symbols from the stock_universe table
   * @returns Array of active ticker strings e.g. ["VCB", "HPG", ...]
   */
  async getUniverse(): Promise<string[]> {
    return apiClient.get<string[]>("/market/universe");
  },
};
