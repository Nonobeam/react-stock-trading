import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  generateSetups, 
  generateSignals, 
  updateSetupPrices,
  type Setup,
  type Signal
} from '../services/mock/setups';
import { signalsApi } from '../services/api';
import { API_CONFIG, REFRESH_CONFIG } from '../shared/constants/config';
import type { SignalResponse } from '../shared/types/dashboard';

interface SetupsContextValue {
  setups: Setup[];
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
  filterSetups: (status?: Setup['status']) => Setup[];
  filterSignals: (type?: Signal['signalType'], strength?: Signal['strength']) => Signal[];
}

const SetupsContext = createContext<SetupsContextValue | undefined>(undefined);

/**
 * Map API signal response to internal Signal type
 */
function mapSignalResponse(sig: SignalResponse): Signal {
  return {
    id: sig.id,
    symbol: sig.symbol,
    name: sig.name,
    exchange: sig.exchange,
    currentPrice: sig.currentPrice,
    signalType: sig.signalType,
    strength: sig.strength,
    score: sig.score,
    indicators: sig.indicators,
    generatedAt: new Date(sig.generatedAt),
    expiresAt: new Date(sig.expiresAt),
    reason: sig.reason,
  };
}

export function SetupsProvider({ children }: { children: React.ReactNode }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
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
        const newSetups = generateSetups(10);
        const newSignals = generateSignals(8);
        setSetups(newSetups);
        setSignals(newSignals);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load setups');
        setIsLoading(false);
      }
      return;
    }

    // Fetch from API
    try {
      const response = await signalsApi.getSignals();
      
      // Map API signals to internal type
      const mappedSignals = response.signals.map(mapSignalResponse);
      
      setSignals(mappedSignals);
      // Keep setups from mock for now (API doesn't have setups endpoint)
      if (setups.length === 0) {
        setSetups(generateSetups(10));
      }
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      
      // Fall back to mock data if enabled
      if (API_CONFIG.enableFallback) {
        try {
          const newSetups = generateSetups(10);
          const newSignals = generateSignals(8);
          setSetups(newSetups);
          setSignals(newSignals);
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          setError(mockErr instanceof Error ? mockErr.message : 'Failed to load setups');
          setIsLoading(false);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load signals');
        setIsLoading(false);
      }
    }
  }, [setups.length]);

  const filterSetups = useCallback((status?: Setup['status']): Setup[] => {
    if (!status) return setups;
    return setups.filter(s => s.status === status);
  }, [setups]);

  const filterSignals = useCallback((
    type?: Signal['signalType'], 
    strength?: Signal['strength']
  ): Signal[] => {
    let filtered = signals;
    if (type) filtered = filtered.filter(s => s.signalType === type);
    if (strength) filtered = filtered.filter(s => s.strength === strength);
    return filtered;
  }, [signals]);

  // Initialize and set up real-time price updates
  useEffect(() => {
    refresh();

    if (API_CONFIG.useMockData) {
      // Update setup prices every 5 seconds for mock data
      const interval = setInterval(() => {
        setSetups(prev => updateSetupPrices(prev));
        setLastUpdated(new Date());
      }, 5000);

      return () => clearInterval(interval);
    } else if (REFRESH_CONFIG.enabled) {
      // Use polling for API data
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.signals);
      return () => clearInterval(intervalId);
    }
  }, []);

  const value: SetupsContextValue = {
    setups,
    signals,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    filterSetups,
    filterSignals,
  };

  return (
    <SetupsContext.Provider value={value}>
      {children}
    </SetupsContext.Provider>
  );
}

export function useSetups() {
  const context = useContext(SetupsContext);
  if (context === undefined) {
    throw new Error('useSetups must be used within SetupsProvider');
  }
  return context;
}
