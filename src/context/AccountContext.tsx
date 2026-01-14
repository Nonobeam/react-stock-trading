import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateAccountData, type AccountData } from '../services/mock/account';
import { accountApi } from '../services/api';
import { API_CONFIG, REFRESH_CONFIG } from '../shared/constants/config';

interface AccountContextValue {
  account: AccountData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountData | null>(null);
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
        const data = generateAccountData();
        setAccount(data);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load account data';
        setError(errorMessage);
        setIsLoading(false);
      }
      return;
    }

    // Fetch from API
    try {
      const [infoResponse, summaryResponse] = await Promise.all([
        accountApi.getInfo(),
        accountApi.getSummary(),
      ]);

      // Map API response to AccountData format
      const data: AccountData = {
        capital: infoResponse.capital,
        cash: infoResponse.cash,
        lockedCash: infoResponse.lockedCash,
        positionsValue: infoResponse.positionsValue,
        buyingPower: infoResponse.buyingPower,
        marginUsed: infoResponse.marginUsed,
        marginAvailable: infoResponse.marginAvailable,
        totalPnL: summaryResponse.totalPnL,
        totalPnLPercent: summaryResponse.totalPnLPercent,
        dayPnL: summaryResponse.dayPnL,
        dayPnLPercent: summaryResponse.dayPnLPercent,
        riskExposure: summaryResponse.riskExposure,
        riskPercent: summaryResponse.riskPercent,
      };

      setAccount(data);
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      
      // Fall back to mock data if enabled
      if (API_CONFIG.enableFallback) {
        try {
          const data = generateAccountData();
          setAccount(data);
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          const errorMessage = mockErr instanceof Error ? mockErr.message : 'Failed to load account data';
          setError(errorMessage);
          setIsLoading(false);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load account data';
        setError(errorMessage);
        setIsLoading(false);
      }
    }
  }, []);

  // Initialize account data
  useEffect(() => {
    refresh();

    // Set up auto-refresh if enabled and not using mock
    if (!API_CONFIG.useMockData && REFRESH_CONFIG.enabled) {
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.account);
      return () => clearInterval(intervalId);
    }
  }, [refresh]);

  const value: AccountContextValue = {
    account,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
