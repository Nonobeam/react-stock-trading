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

/**
 * MQTT Configuration for Real-Time Market Data
 */
export const MQTT_CONFIG = {
  /** Whether MQTT is enabled */
  enabled: import.meta.env.VITE_MQTT_ENABLED !== 'false',

  /** MQTT broker connection settings */
  broker: {
    /** WebSocket Secure URL */
    url: import.meta.env.VITE_MQTT_BROKER_URL || 'wss://datafeed-lts-krx.dnse.com.vn:443/wss',
    
    /** Username for authentication */
    username: import.meta.env.VITE_MQTT_USERNAME || '1001986205',
  },

  /** Auto-connect on application startup */
  autoConnect: import.meta.env.VITE_MQTT_AUTO_CONNECT !== 'false',

  /** Reconnection settings */
  reconnect: {
    /** Maximum reconnection attempts */
    maxAttempts: 5,
    
    /** Initial delay between reconnection attempts (ms) */
    initialDelay: 1000,
    
    /** Maximum delay between reconnection attempts (ms) */
    maxDelay: 30000,
  },

  /** Default topic subscriptions */
  defaultTopics: {
    /** Topic pattern for index data */
    indexPattern: 'plaintext/quotes/krx/mdds/index',
    
    /** Default indices to subscribe to */
    defaultIndices: ['VNINDEX', 'VN30'],
  },

  /** Quality of Service level (0, 1, or 2) */
  qos: 0 as 0 | 1 | 2,
};
