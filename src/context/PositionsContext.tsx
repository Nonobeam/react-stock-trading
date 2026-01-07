import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Position, PortfolioSummary, StopAdjustmentRequest, ClosePositionRequest } from '../shared/types';

interface PositionsContextValue {
  positions: Position[];
  portfolioSummary: PortfolioSummary | null;
  selectedPosition: Position | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPositions: () => Promise<void>;
  selectPosition: (positionId: string | null) => void;
  adjustStop: (request: StopAdjustmentRequest) => Promise<void>;
  closePosition: (request: ClosePositionRequest) => Promise<void>;
  updatePositionPrice: (symbol: string, price: number) => void;
}

const PositionsContext = createContext<PositionsContextValue | undefined>(undefined);

export function PositionsProvider({ children }: { children: React.ReactNode }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate portfolio summary from positions
  const calculatePortfolioSummary = useCallback((positions: Position[]): PortfolioSummary => {
    if (positions.length === 0) {
      return {
        totalPositions: 0,
        totalValue: 0,
        totalUnrealizedPL: 0,
        totalUnrealizedPLPercent: 0,
        avgRMultiple: 0,
        totalCapitalAtRisk: 0,
        riskPercent: 0,
      };
    }

    const totalValue = positions.reduce((sum, p) => sum + (p.currentPrice * p.size), 0);
    const totalUnrealizedPL = positions.reduce((sum, p) => sum + p.unrealizedPL, 0);
    const avgRMultiple = positions.reduce((sum, p) => sum + p.rMultiple, 0) / positions.length;
    
    // Calculate capital at risk (distance from current to stop)
    const totalCapitalAtRisk = positions.reduce((sum, p) => {
      const riskPerShare = Math.abs(p.currentPrice - p.currentStop);
      return sum + (riskPerShare * p.size);
    }, 0);

    // Find best and worst performers
    const sortedByPL = [...positions].sort((a, b) => b.unrealizedPL - a.unrealizedPL);
    const best = sortedByPL[0];
    const worst = sortedByPL[sortedByPL.length - 1];

    return {
      totalPositions: positions.length,
      totalValue,
      totalUnrealizedPL,
      totalUnrealizedPLPercent: totalValue > 0 ? (totalUnrealizedPL / totalValue) * 100 : 0,
      avgRMultiple,
      totalCapitalAtRisk,
      riskPercent: totalValue > 0 ? (totalCapitalAtRisk / totalValue) * 100 : 0,
      bestPerformer: best ? { symbol: best.symbol, pl: best.unrealizedPL } : undefined,
      worstPerformer: worst ? { symbol: worst.symbol, pl: worst.unrealizedPL } : undefined,
    };
  }, []);

  // Fetch positions from API
  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock data for now - replace with actual API call
      const mockPositions: Position[] = [
        {
          id: '1',
          symbol: 'FPT',
          entryPrice: 85000,
          entryDate: '2026-01-05T09:15:00Z',
          size: 500,
          currentPrice: 92500,
          currentStop: 85200,
          targets: [
            { price: 89000, size: 125, hit: true },
            { price: 91500, size: 125, hit: true },
            { price: 92200, size: 125, hit: true },
            { price: 95000, size: 125, hit: false },
          ],
          unrealizedPL: 3750000,
          unrealizedPLPercent: 8.82,
          rMultiple: 2.1,
          daysHeld: 2,
          stopHistory: [
            {
              date: '2026-01-05T09:15:00Z',
              price: 81400,
              reason: 'Initial stop',
              method: 'ATR',
            },
            {
              date: '2026-01-06T14:30:00Z',
              price: 85200,
              reason: 'Moved to breakeven after T2 hit',
              method: 'BREAKEVEN',
            },
          ],
          trailingSuggestions: [
            {
              price: 88400,
              method: 'ATR',
              reason: 'Position at +2.1R, trail to lock profits',
              riskReduction: 3300,
            },
            {
              price: 89200,
              method: 'EMA',
              reason: 'Trail with 21 EMA',
              riskReduction: 3700,
            },
          ],
          status: 'PROFIT',
        },
        {
          id: '2',
          symbol: 'VNM',
          entryPrice: 72000,
          entryDate: '2026-01-02T09:30:00Z',
          size: 300,
          currentPrice: 71200,
          currentStop: 69500,
          targets: [
            { price: 74500, size: 75, hit: false },
            { price: 76000, size: 75, hit: false },
            { price: 77500, size: 75, hit: false },
            { price: 79000, size: 75, hit: false },
          ],
          unrealizedPL: -240000,
          unrealizedPLPercent: -1.11,
          rMultiple: -0.32,
          daysHeld: 5,
          stopHistory: [
            {
              date: '2026-01-02T09:30:00Z',
              price: 69500,
              reason: 'Initial stop at support',
              method: 'SWING_LOW',
            },
          ],
          trailingSuggestions: [],
          isStagnant: true,
          stagnantDays: 5,
          status: 'LOSS',
        },
        {
          id: '3',
          symbol: 'HPG',
          entryPrice: 28500,
          entryDate: '2025-12-28T10:00:00Z',
          size: 1000,
          currentPrice: 28600,
          currentStop: 27400,
          targets: [
            { price: 29800, size: 250, hit: false },
            { price: 30500, size: 250, hit: false },
            { price: 31200, size: 250, hit: false },
            { price: 32000, size: 250, hit: false },
          ],
          unrealizedPL: 100000,
          unrealizedPLPercent: 0.35,
          rMultiple: 0.09,
          daysHeld: 10,
          stopHistory: [
            {
              date: '2025-12-28T10:00:00Z',
              price: 27400,
              reason: 'Initial stop',
              method: 'ATR',
            },
          ],
          trailingSuggestions: [],
          isStagnant: true,
          stagnantDays: 10,
          status: 'BREAKEVEN',
        },
      ];

      setPositions(mockPositions);
      setPortfolioSummary(calculatePortfolioSummary(mockPositions));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setIsLoading(false);
    }
  }, [calculatePortfolioSummary]);

  // Select a position
  const selectPosition = useCallback((positionId: string | null) => {
    if (positionId === null) {
      setSelectedPosition(null);
      return;
    }
    
    const position = positions.find(p => p.id === positionId);
    setSelectedPosition(position || null);
  }, [positions]);

  // Adjust stop for a position
  const adjustStop = useCallback(async (request: StopAdjustmentRequest) => {
    try {
      // Mock API call
      console.log('Adjusting stop:', request);
      
      // Update local state
      setPositions(prev => prev.map(p => {
        if (p.id === request.positionId) {
          return {
            ...p,
            currentStop: request.newStop,
            stopHistory: [
              ...p.stopHistory,
              {
                date: new Date().toISOString(),
                price: request.newStop,
                reason: request.reason,
                method: request.method,
              },
            ],
          };
        }
        return p;
      }));

      // Recalculate portfolio summary
      const updatedPositions = positions.map(p => {
        if (p.id === request.positionId) {
          return {
            ...p,
            currentStop: request.newStop,
          };
        }
        return p;
      });
      setPortfolioSummary(calculatePortfolioSummary(updatedPositions));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust stop');
      throw err;
    }
  }, [positions, calculatePortfolioSummary]);

  // Close position (full or partial)
  const closePosition = useCallback(async (request: ClosePositionRequest) => {
    try {
      // Mock API call
      console.log('Closing position:', request);
      
      if (request.shares === undefined) {
        // Full close - remove position
        setPositions(prev => prev.filter(p => p.id !== request.positionId));
        setSelectedPosition(null);
      } else {
        // Partial close - reduce size
        setPositions(prev => prev.map(p => {
          if (p.id === request.positionId) {
            const newSize = p.size - request.shares!;
            return {
              ...p,
              size: newSize,
              unrealizedPL: (p.unrealizedPL / p.size) * newSize,
            };
          }
          return p;
        }));
      }

      // Recalculate portfolio summary
      const updatedPositions = positions.filter(p => 
        request.shares === undefined ? p.id !== request.positionId : true
      );
      setPortfolioSummary(calculatePortfolioSummary(updatedPositions));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close position');
      throw err;
    }
  }, [positions, calculatePortfolioSummary]);

  // Update position price in real-time (from WebSocket)
  const updatePositionPrice = useCallback((symbol: string, price: number) => {
    setPositions(prev => prev.map(p => {
      if (p.symbol === symbol) {
        const priceDiff = price - p.entryPrice;
        const unrealizedPL = priceDiff * p.size;
        const unrealizedPLPercent = (priceDiff / p.entryPrice) * 100;
        const riskPerShare = p.entryPrice - p.currentStop;
        const rMultiple = riskPerShare > 0 ? priceDiff / riskPerShare : 0;
        
        // Determine status
        let status: 'PROFIT' | 'LOSS' | 'BREAKEVEN' = 'BREAKEVEN';
        if (unrealizedPL > p.size * 100) status = 'PROFIT';
        else if (unrealizedPL < -p.size * 100) status = 'LOSS';
        
        // Check for stop or target hit
        const stopHit = price <= p.currentStop;
        const targetHit = p.targets.some(t => !t.hit && price >= t.price);
        
        return {
          ...p,
          currentPrice: price,
          unrealizedPL,
          unrealizedPLPercent,
          rMultiple,
          status,
          stopHit,
          targetHit,
        };
      }
      return p;
    }));
  }, []);

  // Fetch positions on mount
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const value: PositionsContextValue = {
    positions,
    portfolioSummary,
    selectedPosition,
    isLoading,
    error,
    fetchPositions,
    selectPosition,
    adjustStop,
    closePosition,
    updatePositionPrice,
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
    throw new Error('usePositions must be used within a PositionsProvider');
  }
  return context;
}
