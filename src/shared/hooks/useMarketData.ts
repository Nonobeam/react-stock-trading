import { useState, useCallback } from 'react';
import { apiClient } from '../../services/api/client';
import type { OHLCVBar, TechnicalIndicators } from '../types';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | 'D' | 'W';

interface UseMarketDataResult {
  ohlcvData: OHLCVBar[];
  indicators: TechnicalIndicators | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (symbol: string, timeframe: Timeframe) => Promise<void>;
  refreshIndicators: (symbol: string, timeframe: Timeframe) => Promise<void>;
}

export const useMarketData = (): UseMarketDataResult => {
  const [ohlcvData, setOhlcvData] = useState<OHLCVBar[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (symbol: string, timeframe: Timeframe) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch OHLCV data
      const response = await apiClient.getOHLCV(symbol, timeframe);
      setOhlcvData(response.data);

      // Fetch indicators
      const indicatorsData = await apiClient.getIndicators(symbol, timeframe);
      setIndicators(indicatorsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(message);
      console.error('Market data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshIndicators = useCallback(async (symbol: string, timeframe: Timeframe) => {
    try {
      const indicatorsData = await apiClient.getIndicators(symbol, timeframe);
      setIndicators(indicatorsData);
    } catch (err) {
      console.error('Indicators refresh error:', err);
    }
  }, []);

  return {
    ohlcvData,
    indicators,
    isLoading,
    error,
    fetchData,
    refreshIndicators,
  };
};
