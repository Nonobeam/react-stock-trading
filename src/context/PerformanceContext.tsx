import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/performance/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      console.error('Error fetching performance metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEquityCurve = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/performance/equity-curve');
      if (!response.ok) throw new Error('Failed to fetch equity curve');
      
      const data = await response.json();
      setEquityCurve(data.map((point: any) => ({
        ...point,
        date: new Date(point.date)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equity curve');
      console.error('Error fetching equity curve:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchEquityCurve()]);
  }, [fetchMetrics, fetchEquityCurve]);

  // Auto-fetch on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
