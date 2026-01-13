/**
 * BacktestContext - Manages backtest state
 */

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { BacktestConfig, BacktestResults } from '../shared/types/Backtest';
import { LocalStorageProvider } from '../services/storage/StorageService';

interface BacktestContextValue {
  backtests: BacktestResults[];
  currentBacktest: BacktestResults | null;
  isRunning: boolean;
  runBacktest: (config: BacktestConfig) => Promise<void>;
  cancelBacktest: () => void;
  deleteBacktest: (id: string) => void;
  exportBacktest: (id: string) => void;
}

const BacktestContext = createContext<BacktestContextValue | undefined>(undefined);

const storage = new LocalStorageProvider();
const BACKTESTS_KEY = 'backtests';

export function BacktestProvider({ children }: { children: ReactNode }) {
  const [backtests, setBacktests] = useState<BacktestResults[]>([]);
  const [currentBacktest, setCurrentBacktest] = useState<BacktestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = useCallback(async (_config: BacktestConfig) => {
    setIsRunning(true);
    
    // Simulate backtest execution (replace with actual implementation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: BacktestResults = {
      configId: Date.now().toString(),
      summary: {
        totalReturn: 25.5,
        totalReturnVND: 15000000,
        annualReturn: 18.2,
        winRate: 60,
        totalTrades: 50,
        winningTrades: 30,
        losingTrades: 20,
        profitFactor: 1.8,
        expectancy: 0.8,
        maxDrawdown: 12.5,
        sharpeRatio: 1.5,
        avgWin: 1.2,
        avgLoss: 0.8,
        avgWinToLoss: 1.5,
      },
      equityCurve: [],
      trades: [],
      analytics: {
        bySetupType: [],
        byHoldingPeriod: [],
        rMultipleDistribution: [],
        monthlyReturns: [],
        maeVsRMultiple: [],
      },
      benchmark: {
        name: 'VN-Index',
        return: 12.5,
        maxDrawdown: 15.0,
        sharpeRatio: 0.9,
      },
      executedAt: new Date().toISOString(),
    };

    setCurrentBacktest(mockResults);
    setBacktests(prev => [mockResults, ...prev]);
    storage.set(BACKTESTS_KEY, [mockResults, ...backtests]);
    setIsRunning(false);
  }, [backtests]);

  const cancelBacktest = useCallback(() => {
    setIsRunning(false);
  }, []);

  const deleteBacktest = useCallback((id: string) => {
    setBacktests(prev => prev.filter(b => b.configId !== id));
  }, []);

  const exportBacktest = useCallback((id: string) => {
    const backtest = backtests.find(b => b.configId === id);
    if (!backtest) return;
    
    const dataStr = JSON.stringify(backtest, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backtest-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [backtests]);

  return (
    <BacktestContext.Provider
      value={{
        backtests,
        currentBacktest,
        isRunning,
        runBacktest,
        cancelBacktest,
        deleteBacktest,
        exportBacktest,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
}

export function useBacktest() {
  const context = useContext(BacktestContext);
  if (!context) {
    throw new Error('useBacktest must be used within BacktestProvider');
  }
  return context;
}
