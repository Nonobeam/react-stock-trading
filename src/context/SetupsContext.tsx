import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { TradeSetup, SetupType } from '../shared/types';

interface SetupsContextType {
  setups: TradeSetup[];
  filteredSetups: TradeSetup[];
  selectedSetup: TradeSetup | null;
  filters: {
    minScore: number;
    setupTypes: SetupType[];
    sectors: string[];
  };
  sortBy: 'score' | 'riskReward' | 'symbol';
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSetups: () => Promise<void>;
  selectSetup: (setup: TradeSetup | null) => void;
  updateFilters: (filters: Partial<SetupsContextType['filters']>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SetupsContextType['sortBy'], order?: 'asc' | 'desc') => void;
}

const SetupsContext = createContext<SetupsContextType | undefined>(undefined);

const defaultFilters = {
  minScore: 0,
  setupTypes: [] as SetupType[],
  sectors: [] as string[],
};

export const SetupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [setups, setSetups] = useState<TradeSetup[]>([]);
  const [selectedSetup, setSelectedSetup] = useState<TradeSetup | null>(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortByState] = useState<'score' | 'riskReward' | 'symbol'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch setups from API
  const fetchSetups = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scanner/setups');
      if (!response.ok) throw new Error('Failed to fetch setups');
      
      const data = await response.json();
      setSetups(data.setups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch setups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter setups based on current filters
  const filteredSetups = React.useMemo(() => {
    let filtered = [...setups];
    
    // Score filter
    if (filters.minScore > 0) {
      filtered = filtered.filter(setup => setup.score >= filters.minScore);
    }
    
    // Setup type filter
    if (filters.setupTypes.length > 0) {
      filtered = filtered.filter(setup => filters.setupTypes.includes(setup.setupType));
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'riskReward':
          comparison = a.riskRewardRatio - b.riskRewardRatio;
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [setups, filters, sortBy, sortOrder]);

  const selectSetup = useCallback((setup: TradeSetup | null) => {
    setSelectedSetup(setup);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const setSortBy = useCallback((
    newSortBy: 'score' | 'riskReward' | 'symbol',
    order?: 'asc' | 'desc'
  ) => {
    if (newSortBy === sortBy && !order) {
      // Toggle order if clicking same column
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByState(newSortBy);
      setSortOrder(order || 'desc');
    }
  }, [sortBy]);

  // Fetch setups on mount
  useEffect(() => {
    fetchSetups();
    
    // Set up polling for new setups (every 30 seconds)
    const interval = setInterval(fetchSetups, 30000);
    return () => clearInterval(interval);
  }, [fetchSetups]);

  const value: SetupsContextType = {
    setups,
    filteredSetups,
    selectedSetup,
    filters,
    sortBy,
    sortOrder,
    loading,
    error,
    fetchSetups,
    selectSetup,
    updateFilters,
    clearFilters,
    setSortBy,
  };

  return <SetupsContext.Provider value={value}>{children}</SetupsContext.Provider>;
};

export const useSetups = () => {
  const context = useContext(SetupsContext);
  if (context === undefined) {
    throw new Error('useSetups must be used within a SetupsProvider');
  }
  return context;
};
