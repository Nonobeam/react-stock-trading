import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateAccountData, type AccountData } from '../services/mock/account';

interface AccountContextValue {
  account: AccountData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      const data = generateAccountData();
      setAccount(data);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load account data';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  // Initialize account data
  useEffect(() => {
    refresh();
  }, [refresh]);

  const value: AccountContextValue = {
    account,
    isLoading,
    error,
    refresh
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
