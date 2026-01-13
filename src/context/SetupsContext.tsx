import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  generateSetups, 
  generateSignals, 
  updateSetupPrices,
  type Setup,
  type Signal
} from '../services/mock/setups';

interface SetupsContextValue {
  setups: Setup[];
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  filterSetups: (status?: Setup['status']) => Setup[];
  filterSignals: (type?: Signal['signalType'], strength?: Signal['strength']) => Signal[];
}

const SetupsContext = createContext<SetupsContextValue | undefined>(undefined);

export function SetupsProvider({ children }: { children: React.ReactNode }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      const newSetups = generateSetups(10);
      const newSignals = generateSignals(8);
      setSetups(newSetups);
      setSignals(newSignals);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load setups');
      setIsLoading(false);
    }
  }, []);

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

    // Update setup prices every 5 seconds
    const interval = setInterval(() => {
      setSetups(prev => updateSetupPrices(prev));
    }, 5000);

    return () => clearInterval(interval);
  }, [refresh]);

  const value: SetupsContextValue = {
    setups,
    signals,
    isLoading,
    error,
    refresh,
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
