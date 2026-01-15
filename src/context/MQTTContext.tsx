/**
 * MQTT Context Provider
 * Provides MQTT connection state and methods throughout the application
 * 
 * Uses refs for MQTT client to avoid recreating connections on re-renders.
 * Uses functional state updates to avoid dependency issues in callbacks.
 */

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback, 
  useRef,
  useMemo,
  type ReactNode 
} from 'react';
import { MQTTClient, mqttApi } from '../services/mqtt';
import { MQTT_CONFIG } from '../shared/constants/config';
import type { 
  MQTTConnectionStatus, 
  IndexQuote,
} from '../shared/types/mqtt';

// ============================================================================
// Types
// ============================================================================

interface MQTTContextValue {
  /** Current connection status */
  status: MQTTConnectionStatus;
  
  /** Whether the client is connected */
  isConnected: boolean;
  
  /** Connect to MQTT broker */
  connect: () => Promise<void>;
  
  /** Disconnect from MQTT broker */
  disconnect: () => void;
  
  /** Subscribe to a topic */
  subscribe: (topic: string, handler: (topic: string, message: unknown) => void) => void;
  
  /** Unsubscribe from a topic */
  unsubscribe: (topic: string) => void;
  
  /** Subscribe to an index by code */
  subscribeToIndex: (indexCode: string) => void;
  
  /** Unsubscribe from an index by code */
  unsubscribeFromIndex: (indexCode: string) => void;
  
  /** Get list of subscribed index codes */
  subscribedIndices: string[];
  
  /** Get a quote by index code - stable function that doesn't change */
  getQuote: (indexCode: string) => IndexQuote | undefined;
  
  /** Get all quotes as array - use quotesVersion in dependency to detect changes */
  getQuotesArray: () => IndexQuote[];
  
  /** Version counter - changes when quotes are updated. Use this in dependencies */
  quotesVersion: number;
  
  /** Last error */
  error: Error | null;
}

const MQTTContext = createContext<MQTTContextValue | null>(null);

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEY_CUSTOM_INDICES = 'mqtt_custom_indices';

function loadCustomIndices(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_INDICES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomIndices(indices: string[]): void {
  localStorage.setItem(STORAGE_KEY_CUSTOM_INDICES, JSON.stringify(indices));
}

// ============================================================================
// DNSE Message Interface
// ============================================================================

/**
 * DNSE Broker message format (actual from logs):
 * {
 *   marketId: "MARKET_ID_STO",
 *   tradingSessionId: "TRADING_SESSION_ID_99",
 *   marketIndexClass: "MARKET_INDEX_CLASS_HSX",
 *   indexTypeCode: "001",
 *   currencyCode: "VND",
 *   transactTime: "2026-01-15T08:05:05.029Z",
 *   valueIndexes: 1864.8,
 *   totalVolumeTraded: "1237786766",
 *   grossTradeAmount: 40920.79910835,
 *   ...
 * }
 * 
 * Note: priorValueIndexes, changedValue, changedRatio may not be present
 * We calculate change from previous close if available
 */
interface DNSEIndexMessage {
  marketId: string;
  tradingSessionId?: string;
  marketIndexClass?: string;
  indexTypeCode?: string;
  currencyCode?: string;
  transactTime?: string;
  valueIndexes: number;
  priorValueIndexes?: number;
  changedValue?: number;
  changedRatio?: number;
  totalVolumeTraded?: string;
  grossTradeAmount?: number;
  // Index name is derived from topic, not in message
}

// ============================================================================
// Provider Component
// ============================================================================

interface MQTTProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

export const MQTTProvider: React.FC<MQTTProviderProps> = ({ 
  children, 
  autoConnect = MQTT_CONFIG.autoConnect 
}) => {
  const [status, setStatus] = useState<MQTTConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [subscribedIndices, setSubscribedIndices] = useState<string[]>([]);
  
  // Use a STABLE ref for the quotes Map - never recreate the Map object
  // This prevents infinite re-render loops in consuming components
  const indexQuotesRef = useRef<Map<string, IndexQuote>>(new Map());
  
  // Version counter - bump this when quotes change to signal consumers
  const [quotesVersion, setQuotesVersion] = useState(0);
  
  // Use refs to avoid recreating connections and handlers
  const clientRef = useRef<MQTTClient | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);
  
  // Throttle refs for batching updates
  const pendingQuotesRef = useRef<Map<string, IndexQuote>>(new Map());
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const THROTTLE_MS = 500; // Update at most every 500ms to prevent chart re-render storms

  // Build topic from index code - stable function
  const buildIndexTopic = (indexCode: string): string => {
    return `${MQTT_CONFIG.defaultTopics.indexPattern}/${indexCode}`;
  };

  // Flush pending quotes to state - called on throttle interval
  const flushPendingQuotes = () => {
    if (!isMountedRef.current) return;
    
    const pending = pendingQuotesRef.current;
    if (pending.size === 0) return;
    
    // Update the SAME Map reference - don't create a new one
    pending.forEach((quote, key) => {
      indexQuotesRef.current.set(key, quote);
    });
    
    // Bump version to signal consumers that data changed
    setQuotesVersion(v => v + 1);
    
    pendingQuotesRef.current = new Map();
  };

  // Handle incoming index message - stored in ref to avoid dependency issues
  // Uses throttling to batch updates and prevent excessive re-renders
  const handleIndexMessageRef = useRef((topic: string, message: unknown) => {
    try {
      const msg = message as DNSEIndexMessage;
      
      // Log full message to debug field names
      console.log('[MQTT] Full message:', JSON.stringify(msg).substring(0, 500));
      
      // DNSE format: valueIndexes is the current value
      if (msg.valueIndexes !== undefined) {
        // Extract index code from topic (not in message)
        // Topic format: plaintext/quotes/krx/mdds/index/VNINDEX
        const parts = topic.split('/');
        const indexCode = parts[parts.length - 1];
        
        // Calculate change - use changedValue/changedRatio if present, otherwise calculate from prior
        let change = 0;
        let changePercent = 0;
        
        if (msg.changedValue !== undefined) {
          change = msg.changedValue;
        } else if (msg.priorValueIndexes !== undefined && msg.priorValueIndexes > 0) {
          change = msg.valueIndexes - msg.priorValueIndexes;
        }
        
        if (msg.changedRatio !== undefined) {
          // changedRatio is already a percentage value (e.g., 0.15 means 0.15%, not 15%)
          changePercent = msg.changedRatio;
        } else if (msg.priorValueIndexes !== undefined && msg.priorValueIndexes > 0) {
          changePercent = ((msg.valueIndexes - msg.priorValueIndexes) / msg.priorValueIndexes) * 100;
        }
        
        const quote: IndexQuote = {
          indexCode: indexCode,
          value: msg.valueIndexes,
          change: change,
          changePercent: changePercent,
          volume: msg.totalVolumeTraded ? parseInt(msg.totalVolumeTraded, 10) : undefined,
          lastUpdated: msg.transactTime ? new Date(msg.transactTime) : new Date(),
        };
        
        console.log('[MQTT] Parsed index quote:', indexCode, 'value:', quote.value, 'change:', quote.change.toFixed(2), 'pct:', quote.changePercent.toFixed(2) + '%');
        
        // Add to pending quotes
        pendingQuotesRef.current.set(indexCode, quote);
        
        // Schedule flush if not already scheduled
        if (!throttleTimeoutRef.current) {
          throttleTimeoutRef.current = setTimeout(() => {
            throttleTimeoutRef.current = null;
            flushPendingQuotes();
          }, THROTTLE_MS);
        }
      }
    } catch (err) {
      console.error('[MQTT] Error handling index message:', err);
    }
  });

  // Initialize client once on mount
  useEffect(() => {
    isMountedRef.current = true;
    clientRef.current = new MQTTClient();
    
    clientRef.current.setCallbacks({
      onStatusChange: (newStatus) => {
        if (isMountedRef.current) {
          setStatus(newStatus);
          if (newStatus === 'connected') {
            setError(null);
          }
        }
      },
      onError: (err) => {
        if (isMountedRef.current) {
          setError(err);
        }
      },
    });

    return () => {
      isMountedRef.current = false;
      // Clear throttle timeout
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
        throttleTimeoutRef.current = null;
      }
      clientRef.current?.disconnect();
      clientRef.current = null;
    };
  }, []); // Empty dependency - runs once

  // Connect to MQTT broker
  const connectToMQTT = useCallback(async () => {
    const client = clientRef.current;
    
    if (!client || isConnectingRef.current) {
      console.log('[MQTT] Skipping - no client or already connecting');
      return;
    }
    
    if (client.isConnected() || client.getStatus() === 'connecting') {
      console.log('[MQTT] Skipping - already connected/connecting');
      return;
    }

    isConnectingRef.current = true;
    setError(null);
    setStatus('connecting');

    try {
      // Get JWT token for password
      console.log('[MQTT] Fetching JWT token...');
      const password = await mqttApi.getJwtToken();
      console.log('[MQTT] Got JWT token, connecting to broker...');
      
      // Connect with password
      await client.connect(password);
      console.log('[MQTT] Connected successfully');
      
      // Subscribe to default indices
      const defaultIndices = MQTT_CONFIG.defaultTopics.defaultIndices;
      const customIndices = loadCustomIndices();
      const allIndices = [...new Set([...defaultIndices, ...customIndices])];
      
      console.log('[MQTT] Subscribing to indices:', allIndices);
      for (const indexCode of allIndices) {
        const topic = buildIndexTopic(indexCode);
        client.subscribe(topic, handleIndexMessageRef.current);
      }
      
      if (isMountedRef.current) {
        setSubscribedIndices(allIndices);
      }
      
    } catch (err) {
      console.error('[MQTT] Connection failed:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Connection failed'));
        setStatus('error');
      }
    } finally {
      isConnectingRef.current = false;
    }
  }, []); // Empty dependency - uses refs

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && MQTT_CONFIG.enabled) {
      console.log('[MQTT] Auto-connect triggered, enabled:', MQTT_CONFIG.enabled);
      connectToMQTT();
    }
  }, [autoConnect, connectToMQTT]);

  // Disconnect from MQTT broker
  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    indexQuotesRef.current.clear();
    setQuotesVersion(v => v + 1);
  }, []);

  // Subscribe to a topic
  const subscribe = useCallback((topic: string, handler: (topic: string, message: unknown) => void) => {
    clientRef.current?.subscribe(topic, handler);
  }, []);

  // Unsubscribe from a topic
  const unsubscribe = useCallback((topic: string) => {
    clientRef.current?.unsubscribe(topic);
  }, []);

  // Subscribe to an index - uses ref for handler
  const subscribeToIndex = useCallback((indexCode: string) => {
    const client = clientRef.current;
    if (!client) return;
    
    const topic = buildIndexTopic(indexCode);
    client.subscribe(topic, handleIndexMessageRef.current);
    
    setSubscribedIndices((prev) => {
      if (prev.includes(indexCode)) return prev;
      const next = [...prev, indexCode];
      
      // Save custom indices (exclude defaults)
      const customIndices = next.filter(
        (code) => !MQTT_CONFIG.defaultTopics.defaultIndices.includes(code)
      );
      saveCustomIndices(customIndices);
      
      return next;
    });
  }, []); // Empty - uses refs and functional updates

  // Unsubscribe from an index
  const unsubscribeFromIndex = useCallback((indexCode: string) => {
    const client = clientRef.current;
    if (!client) return;
    
    // Don't allow unsubscribing from default indices
    if (MQTT_CONFIG.defaultTopics.defaultIndices.includes(indexCode)) {
      console.warn(`[MQTT] Cannot unsubscribe from default index: ${indexCode}`);
      return;
    }
    
    const topic = buildIndexTopic(indexCode);
    client.unsubscribe(topic);
    
    setSubscribedIndices((prev) => {
      const next = prev.filter((code) => code !== indexCode);
      
      // Update saved custom indices
      const customIndices = next.filter(
        (code) => !MQTT_CONFIG.defaultTopics.defaultIndices.includes(code)
      );
      saveCustomIndices(customIndices);
      
      return next;
    });
    
    // Remove quote for this index - mutate the stable ref
    indexQuotesRef.current.delete(indexCode);
    setQuotesVersion(v => v + 1);
  }, []); // Empty - uses refs and functional updates

  // Stable getter function - never changes identity
  const getQuote = useCallback((indexCode: string): IndexQuote | undefined => {
    return indexQuotesRef.current.get(indexCode);
  }, []);

  // Stable getter for all quotes as array - never changes identity
  const getQuotesArray = useCallback((): IndexQuote[] => {
    return Array.from(indexQuotesRef.current.values());
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<MQTTContextValue>(() => ({
    status,
    isConnected: status === 'connected',
    connect: connectToMQTT,
    disconnect,
    subscribe,
    unsubscribe,
    subscribeToIndex,
    unsubscribeFromIndex,
    subscribedIndices,
    getQuote,
    getQuotesArray,
    quotesVersion,
    error,
  }), [
    status,
    connectToMQTT,
    disconnect,
    subscribe,
    unsubscribe,
    subscribeToIndex,
    unsubscribeFromIndex,
    subscribedIndices,
    getQuote,
    getQuotesArray,
    quotesVersion,
    error,
  ]);

  return (
    <MQTTContext.Provider value={value}>
      {children}
    </MQTTContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useMQTT = (): MQTTContextValue => {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error('useMQTT must be used within an MQTTProvider');
  }
  return context;
};
