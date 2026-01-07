import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { OHLCVBar, TechnicalIndicators } from '../shared/types';
import { useWebSocket } from './WebSocketContext';

interface MarketDataState {
  selectedSymbol: string | null;
  ohlcvData: OHLCVBar[];
  indicators: TechnicalIndicators | null;
  isLoading: boolean;
  error: string | null;
}

interface MarketDataContextValue extends MarketDataState {
  setSelectedSymbol: (symbol: string) => void;
  updateOHLCVData: (data: OHLCVBar[]) => void;
  updateIndicators: (indicators: TechnicalIndicators) => void;
  addRealtimeBar: (bar: OHLCVBar) => void;
  clearError: () => void;
}

const MarketDataContext = createContext<MarketDataContextValue | null>(null);

interface MarketDataProviderProps {
  children: ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children }) => {
  const { client, isConnected } = useWebSocket();
  const [state, setState] = useState<MarketDataState>({
    selectedSymbol: null,
    ohlcvData: [],
    indicators: null,
    isLoading: false,
    error: null,
  });

  const setSelectedSymbol = useCallback((symbol: string) => {
    setState(prev => ({
      ...prev,
      selectedSymbol: symbol,
      ohlcvData: [],
      indicators: null,
      isLoading: true,
      error: null,
    }));
  }, []);

  const updateOHLCVData = useCallback((data: OHLCVBar[]) => {
    setState(prev => ({
      ...prev,
      ohlcvData: data,
      isLoading: false,
    }));
  }, []);

  const updateIndicators = useCallback((indicators: TechnicalIndicators) => {
    setState(prev => ({
      ...prev,
      indicators,
    }));
  }, []);

  const addRealtimeBar = useCallback((bar: OHLCVBar) => {
    setState(prev => {
      const newData = [...prev.ohlcvData];
      const lastBar = newData[newData.length - 1];

      if (lastBar && lastBar.time === bar.time) {
        // Update existing bar
        newData[newData.length - 1] = bar;
      } else {
        // Add new bar
        newData.push(bar);
      }

      return {
        ...prev,
        ohlcvData: newData,
      };
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Subscribe to WebSocket updates when symbol changes
  useEffect(() => {
    if (!client || !isConnected || !state.selectedSymbol) {
      return;
    }

    // Subscribe to real-time price updates
    const unsubscribePrice = client.subscribeToPrice(
      state.selectedSymbol,
      (data) => {
        if ('ohlcv' in data && data.ohlcv) {
          addRealtimeBar(data.ohlcv as OHLCVBar);
        }
      }
    );

    return () => {
      unsubscribePrice();
    };
  }, [client, isConnected, state.selectedSymbol, addRealtimeBar]);

  const value: MarketDataContextValue = {
    ...state,
    setSelectedSymbol,
    updateOHLCVData,
    updateIndicators,
    addRealtimeBar,
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
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
