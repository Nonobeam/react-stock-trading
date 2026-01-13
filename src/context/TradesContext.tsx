/**
 * TradesContext - Manages trading journal state
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Trade } from '../shared/types/Trade';
import { createTrade } from '../shared/types/Trade';
import { LocalStorageProvider } from '../services/storage/StorageService';

interface TradesContextValue {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  getTrade: (id: string) => Trade | undefined;
  getTradesBySymbol: (symbol: string) => Trade[];
  getTradesByDateRange: (startDate: Date, endDate: Date) => Trade[];
  getTradesByTag: (tag: string) => Trade[];
  exportTrades: () => void;
}

const TradesContext = createContext<TradesContextValue | undefined>(undefined);

const storage = new LocalStorageProvider();
const TRADES_KEY = 'trades';

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load trades from storage on mount
  useEffect(() => {
    try {
      const storedTrades = storage.get<Trade[]>(TRADES_KEY);
      if (storedTrades) {
        setTrades(storedTrades);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trades');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist trades to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        storage.set(TRADES_KEY, trades);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save trades');
      }
    }
  }, [trades, isLoading]);

  const addTrade = useCallback((tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTrade = createTrade(tradeData);
    setTrades((prev) => [newTrade, ...prev]);
  }, []);

  const updateTrade = useCallback((id: string, updates: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((trade) =>
        trade.id === id
          ? { ...trade, ...updates, updatedAt: new Date().toISOString() }
          : trade
      )
    );
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  }, []);

  const getTrade = useCallback(
    (id: string) => {
      return trades.find((trade) => trade.id === id);
    },
    [trades]
  );

  const getTradesBySymbol = useCallback(
    (symbol: string) => {
      return trades.filter((trade) => trade.symbol === symbol);
    },
    [trades]
  );

  const getTradesByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return trades.filter((trade) => {
        const entryDate = new Date(trade.entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
    },
    [trades]
  );

  const getTradesByTag = useCallback(
    (tag: string) => {
      return trades.filter((trade) => trade.tags?.includes(tag));
    },
    [trades]
  );

  const exportTrades = useCallback(() => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trades-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [trades]);

  const value: TradesContextValue = {
    trades,
    isLoading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    getTrade,
    getTradesBySymbol,
    getTradesByDateRange,
    getTradesByTag,
    exportTrades,
  };

  return <TradesContext.Provider value={value}>{children}</TradesContext.Provider>;
}

export function useTrades() {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
}
