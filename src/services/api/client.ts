/**
 * Base API Client
 * Handles all HTTP requests to the GST backend
 */

import type {
  OHLCVBar,
  TechnicalIndicators,
  MarketRegime,
  TradeSetup,
  RiskCalculation,
  RiskCalculationParams,
  Position,
  PerformanceMetrics,
  EquityPoint,
  AccountInfo,
  PortfolioHolding,
  OrderRequest,
  Order,
  DailyBar,
  IntradayBar,
  SymbolInfo
} from '../../shared/types';

// TODO: Configure from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class APIError extends Error {
  status: number;
  data?: unknown;
  
  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Generic HTTP request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError(
        error instanceof Error ? error.message : 'Network request failed',
        0
      );
    }
  }

  /**
   * GET request
   */
  private async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString()
      : '';
    
    return this.request<T>(endpoint + queryString, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  private async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  private async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // Market Data APIs
  // ============================================================================

  /**
   * Get OHLCV data for a symbol
   */
  async getOHLCV(
    symbol: string,
    interval: string = 'D',
    limit: number = 500
  ): Promise<{ symbol: string; interval: string; data: OHLCVBar[] }> {
    return this.get(`/market/ohlcv/${symbol}`, { interval, limit });
  }

  /**
   * Get technical indicators for a symbol
   */
  async getIndicators(
    symbol: string,
    interval: string = 'D'
  ): Promise<{ symbol: string; interval: string; timestamp: number } & TechnicalIndicators> {
    return this.get(`/indicators/${symbol}`, { interval });
  }

  /**
   * Get list of available stocks
   */
  async getStockList(): Promise<Array<{
    symbol: string;
    name: string;
    sector: string;
    exchange: 'HOSE' | 'HNX';
  }>> {
    return this.get('/market/stocks');
  }

  // ============================================================================
  // Market Regime APIs
  // ============================================================================

  /**
   * Get current market regime for a symbol
   */
  async getCurrentRegime(symbol: string): Promise<MarketRegime> {
    return this.get(`/regime/${symbol}`);
  }

  /**
   * Get regime history for a symbol
   */
  async getRegimeHistory(
    symbol: string,
    days: number = 30
  ): Promise<Array<MarketRegime & { timestamp: number }>> {
    return this.get(`/regime/${symbol}/history`, { days });
  }

  // ============================================================================
  // Trade Setup APIs
  // ============================================================================

  /**
   * Scan for trade setups
   */
  async scanSetups(filters?: {
    minScore?: number;
    sector?: string;
    setupType?: string;
  }): Promise<{ setups: TradeSetup[]; count: number }> {
    return this.get('/setups/scan', filters);
  }

  /**
   * Get setup details by ID
   */
  async getSetup(id: string): Promise<TradeSetup> {
    return this.get(`/setups/${id}`);
  }

  // ============================================================================
  // Risk Calculation APIs
  // ============================================================================

  /**
   * Calculate position size and risk metrics
   */
  async calculateRisk(params: RiskCalculationParams): Promise<RiskCalculation> {
    return this.post('/risk/calculate', params);
  }

  /**
   * Calculate stop loss levels
   */
  async calculateStops(params: {
    symbol: string;
    entryPrice: number;
    methods: string[];
  }): Promise<Record<string, number>> {
    return this.post('/risk/stops', params);
  }

  /**
   * Calculate profit targets
   */
  async calculateTargets(params: {
    symbol: string;
    entryPrice: number;
    stopPrice: number;
    methods: string[];
  }): Promise<{
    targets: Record<string, { price: number; rMultiple: number }>;
    consensus?: { min: number; max: number; confidence: string };
  }> {
    return this.post('/risk/targets', params);
  }

  // ============================================================================
  // Position Management APIs
  // ============================================================================

  /**
   * Get active positions
   */
  async getActivePositions(): Promise<{ positions: Position[] }> {
    return this.get('/positions/active');
  }

  /**
   * Get position by ID
   */
  async getPosition(id: string): Promise<Position> {
    return this.get(`/positions/${id}`);
  }

  /**
   * Update position stop level
   */
  async updateStop(positionId: string, stopPrice: number, reason: string): Promise<void> {
    return this.patch(`/positions/${positionId}/stop`, { stopPrice, reason });
  }

  /**
   * Close position (full or partial)
   */
  async closePosition(positionId: string, size?: number): Promise<void> {
    return this.post(`/positions/${positionId}/close`, { size });
  }

  // ============================================================================
  // Performance Analytics APIs
  // ============================================================================

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(period?: string): Promise<PerformanceMetrics> {
    return this.get('/performance/metrics', period ? { period } : undefined);
  }

  /**
   * Get equity curve data
   */
  async getEquityCurve(params?: {
    start?: string;
    end?: string;
  }): Promise<{ data: EquityPoint[] }> {
    return this.get('/performance/equity-curve', params);
  }

  /**
   * Get performance distributions
   */
  async getPerformanceDistributions(): Promise<{
    rMultiple: Record<string, number>;
    setupType: Record<string, { winRate: number; avgR: number; count: number }>;
    regime: Record<string, { winRate: number; avgR: number; count: number }>;
  }> {
    return this.get('/performance/distributions');
  }

  // ============================================================================
  // Account & Portfolio APIs
  // ============================================================================

  /**
   * Get account information (balance, account number, name)
   */
  async getAccountInfo(): Promise<AccountInfo> {
    return this.get('/account/info');
  }

  /**
   * Get portfolio holdings with current market prices
   */
  async getPortfolio(): Promise<PortfolioHolding[]> {
    return this.get('/account/portfolio');
  }

  // ============================================================================
  // Trading / Order APIs
  // ============================================================================

  /**
   * Place a new order (BUY/SELL)
   */
  async placeOrder(request: OrderRequest): Promise<{ orderId: string; status: string; message: string }> {
    return this.post('/orders', request);
  }

  /**
   * Cancel an existing order
   */
  async cancelOrder(orderId: string): Promise<{ orderId: string; status: string; message: string }> {
    return this.post(`/orders/${orderId}/cancel`, {});
  }

  /**
   * Get all orders (pending, filled, cancelled)
   * Note: This endpoint is assumed to exist based on typical trading API patterns
   */
  async getOrders(): Promise<Order[]> {
    return this.get('/orders');
  }

  // ============================================================================
  // Historical Market Data APIs
  // ============================================================================

  /**
   * Get historical daily OHLCV bars
   */
  async getHistoricalDaily(
    symbol: string,
    from: string,
    to: string
  ): Promise<DailyBar[]> {
    return this.get('/market/history/daily', { symbol, from, to });
  }

  /**
   * Get historical intraday OHLCV bars (1m, 5m, 15m, 30m, 1h)
   */
  async getHistoricalIntraday(
    symbol: string,
    interval: string,
    from: string,
    to: string
  ): Promise<IntradayBar[]> {
    return this.get('/market/history/intraday', { symbol, interval, from, to });
  }

  /**
   * Get current symbol information (price, ceiling, floor, bid/ask)
   */
  async getSymbolInfo(symbol: string): Promise<SymbolInfo> {
    return this.get(`/market/symbol/${symbol}`);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing
export { APIClient, APIError };
