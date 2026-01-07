/**
 * WebSocket Client for Real-Time Market Data
 * Handles connection, subscriptions, and message routing
 */

import type { PriceUpdateMessage, MarketIndexMessage, TickMessage } from '../../shared/types';

type WebSocketMessage = 
  | { type: 'price'; data: PriceUpdateMessage }
  | { type: 'index'; data: MarketIndexMessage }
  | { type: 'tick'; data: TickMessage }
  | { type: 'regime'; data: unknown }
  | { type: 'setup'; data: unknown }
  | { type: 'position'; data: unknown };

type MessageCallback = (message: WebSocketMessage) => void;

// TODO: Configure from environment variables
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/market';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private callbacks = new Map<string, Set<MessageCallback>>();
  private connectionStatus: 'connected' | 'disconnected' | 'reconnecting' = 'disconnected';
  private statusCallbacks = new Set<(status: typeof this.connectionStatus) => void>();

  constructor(url: string = WS_URL) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected');
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.notifyStatusChange();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.routeMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          this.connectionStatus = 'disconnected';
          this.notifyStatusChange();
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connectionStatus = 'disconnected';
      this.notifyStatusChange();
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    this.connectionStatus = 'reconnecting';
    this.notifyStatusChange();
    this.reconnectAttempts++;

    console.log(
      `[WebSocket] Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
      });
      
      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, callback: MessageCallback): () => void {
    if (!this.callbacks.has(channel)) {
      this.callbacks.set(channel, new Set());
    }

    this.callbacks.get(channel)!.add(callback);

    // Send subscription message to server
    this.send({
      type: 'subscribe',
      channel,
    });

    // Return unsubscribe function
    return () => this.unsubscribe(channel, callback);
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string, callback: MessageCallback): void {
    const channelCallbacks = this.callbacks.get(channel);
    
    if (channelCallbacks) {
      channelCallbacks.delete(callback);
      
      if (channelCallbacks.size === 0) {
        this.callbacks.delete(channel);
        
        // Send unsubscribe message to server
        this.send({
          type: 'unsubscribe',
          channel,
        });
      }
    }
  }

  /**
   * Send message to server
   */
  private send(data: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }

  /**
   * Route incoming messages to appropriate callbacks
   */
  private routeMessage(message: WebSocketMessage): void {
    // Route to specific channel callbacks
    const channelCallbacks = this.callbacks.get(message.type);
    
    if (channelCallbacks) {
      channelCallbacks.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error('[WebSocket] Callback error:', error);
        }
      });
    }
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: (status: typeof this.connectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    
    // Immediately call with current status
    callback(this.connectionStatus);
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Notify all status callbacks
   */
  private notifyStatusChange(): void {
    this.statusCallbacks.forEach((callback) => {
      try {
        callback(this.connectionStatus);
      } catch (error) {
        console.error('[WebSocket] Status callback error:', error);
      }
    });
  }

  /**
   * Get current connection status
   */
  getStatus(): typeof this.connectionStatus {
    return this.connectionStatus;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }

  // ============================================================================
  // Convenience methods for common subscriptions
  // ============================================================================

  /**
   * Subscribe to price updates for a symbol
   */
  subscribeToPrice(
    symbol: string,
    callback: (price: PriceUpdateMessage) => void
  ): () => void {
    return this.subscribe(`price:${symbol}`, (message) => {
      if (message.type === 'price') {
        callback(message.data);
      }
    });
  }

  /**
   * Subscribe to tick data for a symbol
   */
  subscribeToTick(
    symbol: string,
    callback: (tick: TickMessage) => void
  ): () => void {
    return this.subscribe(`tick:${symbol}`, (message) => {
      if (message.type === 'tick') {
        callback(message.data);
      }
    });
  }

  /**
   * Subscribe to market index updates
   */
  subscribeToMarketIndex(
    callback: (index: MarketIndexMessage) => void
  ): () => void {
    return this.subscribe('index', (message) => {
      if (message.type === 'index') {
        callback(message.data);
      }
    });
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();
