import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PerformanceMetrics, EquityPoint } from '../shared/types';

interface PerformanceContextValue {
  metrics: PerformanceMetrics | null;
  equityCurve: EquityPoint[];
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchEquityCurve: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [equityCurve, setEquityCurve] = useState<EquityPoint[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    // Performance metrics API not implemented yet - skip silently
    setMetrics(null);
  }, []);

  const fetchEquityCurve = useCallback(async () => {
    // Equity curve API not implemented yet - skip silently
    setEquityCurve([]);
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchEquityCurve()]);
  }, [fetchMetrics, fetchEquityCurve]);

  // NOTE: Auto-fetch disabled - performance APIs not yet implemented

  const value: PerformanceContextValue = {
    metrics,
    equityCurve,
    loading,
    error,
    fetchMetrics,
    fetchEquityCurve,
    refreshData,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
