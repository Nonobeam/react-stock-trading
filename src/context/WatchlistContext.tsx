import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { watchlistApi } from '../services/api';
import { API_CONFIG, REFRESH_CONFIG } from '../shared/constants/config';
import type { WatchlistItemResponse } from '../shared/types/dashboard';

/**
 * WatchlistItem type matching the API response
 */
export interface WatchlistItem {
  symbol: string;
  addedAt: number;
  isFavorite: boolean;
  price?: number;
  change?: number;
  changePercent?: number;
  sparklineData?: number[];
}

interface WatchlistContextValue {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
  addItem: (symbol: string) => Promise<void>;
  removeItem: (symbol: string) => Promise<void>;
  toggleFavorite: (symbol: string, isFavorite: boolean) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

/**
 * Map API response to internal WatchlistItem type
 */
function mapWatchlistResponse(item: WatchlistItemResponse): WatchlistItem {
  return {
    symbol: item.symbol,
    addedAt: item.addedAt,
    isFavorite: item.isFavorite,
    price: item.price,
    change: item.change,
    changePercent: item.changePercent,
    sparklineData: item.sparklineData,
  };
}

/**
 * Generate mock watchlist items for fallback
 */
function generateMockItems(): WatchlistItem[] {
  const symbols = ['VNM', 'VIC', 'VHM', 'VCB', 'FPT'];
  
  return symbols.map((symbol, index) => {
    const price = Math.round((50 + Math.random() * 150) * 1000);
    const change = Math.round((Math.random() - 0.5) * 5000);
    
    return {
      symbol,
      addedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      isFavorite: index < 2,
      price,
      change,
      changePercent: (change / price) * 100,
    };
  });
}

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
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
        setItems(generateMockItems());
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load watchlist');
        setIsLoading(false);
      }
      return;
    }

    // Fetch from API
    try {
      const response = await watchlistApi.getAll();
      const mappedItems = response.items.map(mapWatchlistResponse);
      setItems(mappedItems);
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      
      // Fall back to mock data if enabled
      if (API_CONFIG.enableFallback) {
        try {
          setItems(generateMockItems());
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          setError(mockErr instanceof Error ? mockErr.message : 'Failed to load watchlist');
          setIsLoading(false);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load watchlist');
        setIsLoading(false);
      }
    }
  }, []);

  const addItem = useCallback(async (symbol: string): Promise<void> => {
    // Mock mode
    if (API_CONFIG.useMockData) {
      const newItem: WatchlistItem = {
        symbol,
        addedAt: Date.now(),
        isFavorite: false,
        price: 100000,
        change: 1000,
        changePercent: 1.01,
      };
      setItems(prev => [...prev, newItem]);
      return;
    }

    // API call
    await watchlistApi.add(symbol);
    // Refresh to get updated list
    await refresh();
  }, [refresh]);

  const removeItem = useCallback(async (symbol: string): Promise<void> => {
    // Mock mode
    if (API_CONFIG.useMockData) {
      setItems(prev => prev.filter(item => item.symbol !== symbol));
      return;
    }

    // API call
    await watchlistApi.remove(symbol);
    setItems(prev => prev.filter(item => item.symbol !== symbol));
  }, []);

  const toggleFavorite = useCallback(async (
    symbol: string, 
    isFavorite: boolean
  ): Promise<void> => {
    // Mock mode
    if (API_CONFIG.useMockData) {
      setItems(prev => prev.map(item => {
        if (item.symbol === symbol) {
          return { ...item, isFavorite };
        }
        return item;
      }));
      return;
    }

    // API call
    await watchlistApi.toggleFavorite(symbol, isFavorite);
    setItems(prev => prev.map(item => 
      item.symbol === symbol ? { ...item, isFavorite } : item
    ));
  }, []);

  // Initialize and set up auto-refresh
  useEffect(() => {
    refresh();

    if (REFRESH_CONFIG.enabled && !API_CONFIG.useMockData) {
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.watchlist);
      return () => clearInterval(intervalId);
    }
  }, []);

  const value: WatchlistContextValue = {
    items,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    addItem,
    removeItem,
    toggleFavorite,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
}
