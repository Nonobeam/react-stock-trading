/**
 * Stock Preferences Type Definitions
 * Types for per-stock signal score preferences
 */

/**
 * Individual stock preference configuration
 */
export interface StockPreference {
  /** Stock symbol (e.g., VNM, FPT) */
  symbol: string;
  
  /** Minimum signal score required (1-10) */
  min_signal_score: number;
  
  /** Optional notes about this preference */
  notes?: string;
  
  /** ISO timestamp when created */
  created_at?: string;
  
  /** ISO timestamp when last updated */
  updated_at?: string;
}

/**
 * Response from GET /api/preferences/stocks
 */
export interface StockPreferencesResponse {
  preferences: StockPreference[];
  total: number;
}

/**
 * Request body for PUT /api/preferences/stocks/:symbol
 */
export interface StockPreferenceRequest {
  min_signal_score: number;
  notes?: string;
}
