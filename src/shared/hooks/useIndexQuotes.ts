/**
 * useIndexQuotes Hook
 * Provides access to real-time index quotes from MQTT
 */

import { useMemo } from 'react';
import { useMQTT } from '../../context/MQTTContext';
import type { IndexQuote } from '../types/mqtt';
import { MQTT_CONFIG } from '../constants/config';

interface UseIndexQuotesReturn {
  /** Array of all quotes for easy iteration */
  quotesArray: IndexQuote[];
  
  /** Get quote for a specific index - stable function */
  getQuote: (indexCode: string) => IndexQuote | undefined;
  
  /** List of currently subscribed indices */
  subscribedIndices: string[];
  
  /** Default indices that are always subscribed */
  defaultIndices: string[];
  
  /** Custom indices added by user */
  customIndices: string[];
  
  /** Subscribe to a new index */
  subscribeToIndex: (indexCode: string) => void;
  
  /** Unsubscribe from an index (only custom indices) */
  unsubscribeFromIndex: (indexCode: string) => void;
  
  /** Whether MQTT is connected */
  isConnected: boolean;
  
  /** Connection status */
  status: string;
  
  /** Version counter for dependency tracking */
  quotesVersion: number;
  
  /** Connection error if any */
  error: Error | null;
}

/**
 * Hook for accessing real-time index quotes from MQTT
 * Uses quotesVersion to detect changes without causing infinite loops
 */
export function useIndexQuotes(): UseIndexQuotesReturn {
  const {
    getQuote,
    getQuotesArray,
    quotesVersion,
    subscribedIndices,
    subscribeToIndex,
    unsubscribeFromIndex,
    isConnected,
    status,
    error,
  } = useMQTT();

  // Convert to array using quotesVersion as dependency
  // getQuotesArray is stable, quotesVersion changes when data updates
  const quotesArray = useMemo(() => {
    return getQuotesArray();
  }, [quotesVersion, getQuotesArray]);

  // Get default indices from config
  const defaultIndices = useMemo(() => {
    return MQTT_CONFIG.defaultTopics.defaultIndices;
  }, []);

  // Get custom indices (those not in defaults)
  const customIndices = useMemo(() => {
    return subscribedIndices.filter(
      (code) => !defaultIndices.includes(code)
    );
  }, [subscribedIndices, defaultIndices]);

  return {
    quotesArray,
    getQuote,
    subscribedIndices,
    defaultIndices,
    customIndices,
    subscribeToIndex,
    unsubscribeFromIndex,
    isConnected,
    status,
    quotesVersion,
    error,
  };
}

/**
 * Hook for getting a single index quote
 * Use quotesVersion in your component's useMemo dependency to get updates
 */
export function useIndexQuote(indexCode: string): IndexQuote | undefined {
  const { getQuote, quotesVersion } = useIndexQuotes();
  // Memoize based on quotesVersion to get fresh data when it updates
  return useMemo(() => getQuote(indexCode), [getQuote, indexCode, quotesVersion]);
}
