import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { generateMarketData, createMarketDataStream, type MarketData } from '../services/mock/marketData';

interface MarketDataContextValue {
  marketData: MarketData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const MarketDataContext = createContext<MarketDataContextValue | null>(null);

interface MarketDataProviderProps {
  children: ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      const data = generateMarketData();
      setMarketData(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load market data');
      setIsLoading(false);
    }
  }, []);

  // Initialize and set up real-time updates
  useEffect(() => {
    // Initial load
    refresh();

    // Set up auto-refresh every 3 seconds
    const cleanup = createMarketDataStream((data) => {
      setMarketData(data);
      setIsLoading(false);
    }, 3000);

    return cleanup;
  }, [refresh]);

  const value: MarketDataContextValue = {
    marketData,
    isLoading,
    error,
    refresh
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
