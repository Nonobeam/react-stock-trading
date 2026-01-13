import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  generateOpenPositions, 
  generateClosedPositions,
  createPositionPriceStream,
  type Position,
  type ClosedPosition
} from '../services/mock/positions';

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
  refresh: () => void;
}

const PositionsContext = createContext<PositionsContextValue | undefined>(undefined);

export function PositionsProvider({ children }: { children: React.ReactNode }) {
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const refresh = useCallback(() => {
    try {
      const open = generateOpenPositions(5);
      const closed = generateClosedPositions(20);
      setOpenPositions(open);
      setClosedPositions(closed);
      setPortfolioSummary(calculateSummary(open));
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load positions');
      setIsLoading(false);
    }
  }, [calculateSummary]);

  // Initialize and set up real-time price updates
  useEffect(() => {
    refresh();

    // Set up real-time price stream
    const cleanup = createPositionPriceStream(openPositions, (updatedPositions) => {
      setOpenPositions(updatedPositions);
      setPortfolioSummary(calculateSummary(updatedPositions));
    }, 5000);

    return cleanup;
  }, []);

  const value: PositionsContextValue = {
    openPositions,
    closedPositions,
    portfolioSummary,
    isLoading,
    error,
    refresh,
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
