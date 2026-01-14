import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { generateMarketData, createMarketDataStream, type MarketData } from '../services/mock/marketData';
import { marketApi } from '../services/api';
import { API_CONFIG, REFRESH_CONFIG } from '../shared/constants/config';

interface MarketDataContextValue {
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
}

const MarketDataContext = createContext<MarketDataContextValue | null>(null);

interface MarketDataProviderProps {
  children: ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      try {
        const data = generateMarketData();
        setMarketData(data);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load market data');
        setIsLoading(false);
      }
      return;
    }

    // Fetch from API
    try {
      const [indicesResponse, regimeResponse] = await Promise.all([
        marketApi.getIndices(),
        marketApi.getRegime(),
      ]);

      // Map API response to MarketData format
      const data: MarketData = {
        vnIndex: indicesResponse.vnIndex.value,
        change: indicesResponse.vnIndex.change,
        changePercent: indicesResponse.vnIndex.changePercent,
        volume: 0, // Not provided by indices API
        marketStatus: regimeResponse.marketStatus,
        regime: regimeResponse.regime,
        regimeScore: regimeResponse.regimeScore,
        breadth: regimeResponse.breadth,
        lastUpdate: new Date(regimeResponse.lastUpdate),
        indices: {
          vnIndex: indicesResponse.vnIndex,
          vn30: indicesResponse.vn30,
          vn100: indicesResponse.vn100,
        },
      };

      setMarketData(data);
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      
      // Fall back to mock data if enabled
      if (API_CONFIG.enableFallback) {
        try {
          const data = generateMarketData();
          setMarketData(data);
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          setError(mockErr instanceof Error ? mockErr.message : 'Failed to load market data');
          setIsLoading(false);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load market data');
        setIsLoading(false);
      }
    }
  }, []);

  // Initialize and set up real-time updates
  useEffect(() => {
    // Initial load
    refresh();

    // Set up auto-refresh
    if (API_CONFIG.useMockData) {
      // Use mock stream for mock data
      const cleanup = createMarketDataStream((data) => {
        setMarketData(data);
        setLastUpdated(new Date());
        setIsLoading(false);
      }, REFRESH_CONFIG.intervals.marketData);

      return cleanup;
    } else if (REFRESH_CONFIG.enabled) {
      // Use polling for API data
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.marketData);
      return () => clearInterval(intervalId);
    }
  }, [refresh]);

  const value: MarketDataContextValue = {
    marketData,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = (): MarketDataContextValue => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within MarketDataProvider');
  }
  return context;
};
