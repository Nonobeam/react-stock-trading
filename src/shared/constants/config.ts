/**
 * Application Configuration
 * Centralized configuration read from environment variables
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /** Base URL for API requests */
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  /** Whether to use mock data instead of real API calls */
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  /** Whether to fall back to mock data when API fails */
  enableFallback: import.meta.env.VITE_ENABLE_FALLBACK !== 'false',
};

/**
 * Data Refresh Configuration
 */
export const REFRESH_CONFIG = {
  /** Whether auto-refresh is enabled */
  enabled: import.meta.env.VITE_REFRESH_ENABLED !== 'false',
  
  /** Refresh intervals in milliseconds */
  intervals: {
    /** Market data refresh interval (default: 5 seconds) */
    marketData: 5000,
    
    /** Positions data refresh interval (default: 10 seconds) */
    positions: 10000,
    
    /** Signals refresh interval (default: 30 seconds) */
    signals: 30000,
    
    /** Watchlist price updates interval (default: 15 seconds) */
    watchlist: 15000,
    
    /** Account data refresh interval (default: 30 seconds) */
    account: 30000,
  },
};
