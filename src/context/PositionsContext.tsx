import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  generateOpenPositions, 
  generateClosedPositions,
  createPositionPriceStream,
  type Position,
  type ClosedPosition
} from '../services/mock/positions';
import { positionsApi } from '../services/api';
import { API_CONFIG, REFRESH_CONFIG } from '../shared/constants/config';
import type { PositionResponse } from '../shared/types/dashboard';

interface PortfolioSummary {
  totalPositions: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  avgRMultiple: number;
  totalRisk: number;
  riskPercent: number;
}

interface PositionsContextValue {
  openPositions: Position[];
  closedPositions: ClosedPosition[];
  portfolioSummary: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
}

const PositionsContext = createContext<PositionsContextValue | undefined>(undefined);

/**
 * Map API position response to internal Position type
 */
function mapPositionResponse(pos: PositionResponse): Position {
  return {
    id: pos.id,
    symbol: pos.symbol,
    name: pos.name,
    exchange: pos.exchange,
    shares: pos.shares,
    entryPrice: pos.entryPrice,
    currentPrice: pos.currentPrice,
    entryDate: new Date(pos.entryDate),
    stopPrice: pos.stopPrice,
    targetPrice: pos.targetPrice,
    entryValue: pos.entryValue,
    currentValue: pos.currentValue,
    // API doesn't provide these, use defaults
    entryCommission: 0,
    breakeven: pos.entryPrice,
    grossPnL: pos.grossPnL,
    netPnL: pos.netPnL,
    netPnLPercent: pos.netPnLPercent,
    rMultiple: pos.rMultiple,
    risk: pos.risk,
    // Map status (API has 'yellow', internal only 'green' | 'red')
    status: pos.status === 'green' ? 'green' : 'red',
    daysHeld: pos.daysHeld,
  };
}

export function PositionsProvider({ children }: { children: React.ReactNode }) {
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const calculateSummary = useCallback((positions: Position[]): PortfolioSummary => {
    if (positions.length === 0) {
      return {
        totalPositions: 0,
        totalValue: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        avgRMultiple: 0,
        totalRisk: 0,
        riskPercent: 0,
      };
    }

    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalPnL = positions.reduce((sum, p) => sum + p.netPnL, 0);
    const avgRMultiple = positions.reduce((sum, p) => sum + p.rMultiple, 0) / positions.length;
    const totalRisk = positions.reduce((sum, p) => sum + p.risk, 0);

    return {
      totalPositions: positions.length,
      totalValue,
      totalPnL,
      totalPnLPercent: totalValue > 0 ? (totalPnL / totalValue) * 100 : 0,
      avgRMultiple: Math.round(avgRMultiple * 100) / 100,
      totalRisk,
      riskPercent: totalValue > 0 ? (totalRisk / totalValue) * 100 : 0,
    };
  }, []);

  const refresh = useCallback(async () => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      try {
        const open = generateOpenPositions(5);
        const closed = generateClosedPositions(20);
        setOpenPositions(open);
        setClosedPositions(closed);
        setPortfolioSummary(calculateSummary(open));
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load positions');
        setIsLoading(false);
      }
      return;
    }

    // Fetch from API
    try {
      const [activeResponse, summaryResponse] = await Promise.all([
        positionsApi.getActive(),
        positionsApi.getSummary(),
      ]);

      // Map API positions to internal type
      const positions = activeResponse.positions.map(mapPositionResponse);
      
      setOpenPositions(positions);
      setPortfolioSummary({
        totalPositions: summaryResponse.totalPositions,
        totalValue: summaryResponse.totalValue,
        totalPnL: summaryResponse.totalPnL,
        totalPnLPercent: summaryResponse.totalPnLPercent,
        avgRMultiple: summaryResponse.avgRMultiple,
        totalRisk: summaryResponse.totalRisk,
        riskPercent: summaryResponse.riskPercent,
      });
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      
      // Fall back to mock data if enabled
      if (API_CONFIG.enableFallback) {
        try {
          const open = generateOpenPositions(5);
          const closed = generateClosedPositions(20);
          setOpenPositions(open);
          setClosedPositions(closed);
          setPortfolioSummary(calculateSummary(open));
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          setError(mockErr instanceof Error ? mockErr.message : 'Failed to load positions');
          setIsLoading(false);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load positions');
        setIsLoading(false);
      }
    }
  }, [calculateSummary]);

  // Initialize and set up real-time price updates
  useEffect(() => {
    refresh();

    if (API_CONFIG.useMockData) {
      // Set up real-time price stream for mock data
      const cleanup = createPositionPriceStream(openPositions, (updatedPositions) => {
        setOpenPositions(updatedPositions);
        setPortfolioSummary(calculateSummary(updatedPositions));
        setLastUpdated(new Date());
      }, REFRESH_CONFIG.intervals.positions);

      return cleanup;
    } else if (REFRESH_CONFIG.enabled) {
      // Use polling for API data
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.positions);
      return () => clearInterval(intervalId);
    }
  }, []);

  const value: PositionsContextValue = {
    openPositions,
    closedPositions,
    portfolioSummary,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
  };

  return (
    <PositionsContext.Provider value={value}>
      {children}
    </PositionsContext.Provider>
  );
}

export function usePositions() {
  const context = useContext(PositionsContext);
  if (context === undefined) {
    throw new Error('usePositions must be used within PositionsProvider');
  }
  return context;
}
