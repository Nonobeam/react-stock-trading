import { useState, useCallback } from 'react';
import { apiClient } from '../../services/api/client';
import type { MarketRegime } from '../types';

interface UseRegimeDataResult {
  currentRegime: MarketRegime | null;
  regimeHistory: Array<MarketRegime & { timestamp: number }>;
  isLoading: boolean;
  error: string | null;
  fetchRegime: (symbol: string) => Promise<void>;
  fetchHistory: (symbol: string, days?: number) => Promise<void>;
}

export const useRegimeData = (): UseRegimeDataResult => {
  const [currentRegime, setCurrentRegime] = useState<MarketRegime | null>(null);
  const [regimeHistory, setRegimeHistory] = useState<Array<MarketRegime & { timestamp: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegime = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const regime = await apiClient.getCurrentRegime(symbol);
      setCurrentRegime(regime);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch regime data';
      setError(message);
      console.error('Regime fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (symbol: string, days: number = 30) => {
    try {
      const history = await apiClient.getRegimeHistory(symbol, days);
      setRegimeHistory(history);
    } catch (err) {
      console.error('Regime history fetch error:', err);
    }
  }, []);

  return {
    currentRegime,
    regimeHistory,
    isLoading,
    error,
    fetchRegime,
    fetchHistory,
  };
};
