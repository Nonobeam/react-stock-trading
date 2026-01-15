/**
 * MQTT Client for Real-Time Market Data
 * Handles connection, subscriptions, and message routing via MQTT over WSS
 */

import mqtt, { type MqttClient, type IClientOptions } from 'mqtt';
import type { 
  MQTTConnectionStatus, 
  MQTTMessage, 
  MQTTMessageType,
  MarketIndexMessage,
  StockInfoMessage,
  TopPriceMessage,
  BoardEventMessage,
  OHLCMessage,
  TickMessage 
} from '../../shared/types/mqtt';
import type { MQTTClientOptions, MQTTClientCallbacks, TopicSubscription } from './types';
import { generateClientId } from './types';
import { MQTT_CONFIG } from '../../shared/constants/config';

/**
 * MQTT Client class for managing broker connections and subscriptions
 */
export class MQTTClient {
  private client: MqttClient | null = null;
  private options: MQTTClientOptions;
  private callbacks: MQTTClientCallbacks = {};
  private subscriptions = new Map<string, TopicSubscription>();
  private status: MQTTConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(options?: Partial<MQTTClientOptions>) {
    this.options = {
      url: options?.url || MQTT_CONFIG.broker.url,
      username: options?.username || MQTT_CONFIG.broker.username,
      password: options?.password || '',
      clientId: options?.clientId || generateClientId(),
      qos: options?.qos || MQTT_CONFIG.qos,
      keepAlive: options?.keepAlive || 60,
      cleanSession: options?.cleanSession ?? true,
      reconnect: options?.reconnect || {
        enabled: true,
        maxAttempts: MQTT_CONFIG.reconnect.maxAttempts,
        initialDelay: MQTT_CONFIG.reconnect.initialDelay,
        maxDelay: MQTT_CONFIG.reconnect.maxDelay,
      },
    };
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: MQTTClientCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current connection status
   */
  getStatus(): MQTTConnectionStatus {
    return this.status;
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.client?.connected === true;
  }

  /**
   * Connect to MQTT broker
   */
  async connect(password?: string): Promise<void> {
    if (this.client?.connected) {
      console.log('[MQTT] Already connected');
      return;
    }

    if (password) {
      this.options.password = password;
    }

    if (!this.options.password) {
      throw new Error('MQTT password is required');
    }

    this.setStatus('connecting');

    const mqttOptions: IClientOptions = {
      clientId: this.options.clientId,
      username: this.options.username,
      password: this.options.password,
      keepalive: this.options.keepAlive,
      clean: this.options.cleanSession,
      reconnectPeriod: 0, // We handle reconnection manually
      connectTimeout: 30000,
      protocol: 'wss',
      protocolVersion: 5,
    };

    return new Promise((resolve, reject) => {
      try {
        console.log('[MQTT] Connecting to', this.options.url);
        this.client = mqtt.connect(this.options.url, mqttOptions);

        this.client.on('connect', () => {
          console.log('[MQTT] Connected successfully');
          this.setStatus('connected');
          this.reconnectAttempts = 0;
          this.restoreSubscriptions();
          resolve();
        });

        this.client.on('error', (error) => {
          console.error('[MQTT] Connection error:', error);
          this.setStatus('error');
          this.callbacks.onError?.(error);
          reject(error);
        });

        this.client.on('close', () => {
          console.log('[MQTT] Connection closed');
          if (this.status !== 'disconnected') {
            this.handleDisconnect();
          }
        });

        this.client.on('reconnect', () => {
          console.log('[MQTT] Reconnecting...');
          this.setStatus('reconnecting');
        });

        this.client.on('message', (topic, payload) => {
          this.handleMessage(topic, payload);
        });

        this.client.on('offline', () => {
          console.log('[MQTT] Client offline');
          this.handleDisconnect();
        });

      } catch (error) {
        this.setStatus('error');
        reject(error);
      }
    });
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      console.log('[MQTT] Disconnecting...');
      this.client.end(true);
      this.client = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * Subscribe to a topic
   */
  subscribe(
    topic: string, 
    handler: (topic: string, message: MQTTMessage | unknown) => void,
    qos: 0 | 1 | 2 = this.options.qos || 0
  ): void {
    const subscription: TopicSubscription = { topic, qos, handler };
    this.subscriptions.set(topic, subscription);

    if (this.isConnected() && this.client) {
      this.client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.error(`[MQTT] Failed to subscribe to ${topic}:`, error);
          this.callbacks.onError?.(error);
        } else {
          console.log(`[MQTT] Subscribed to ${topic}`);
        }
      });
    }
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(topic: string): void {
    this.subscriptions.delete(topic);

    if (this.isConnected() && this.client) {
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          console.error(`[MQTT] Failed to unsubscribe from ${topic}:`, error);
        } else {
          console.log(`[MQTT] Unsubscribed from ${topic}`);
        }
      });
    }
  }

  /**
   * Get list of subscribed topics
   */
  getSubscribedTopics(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private setStatus(status: MQTTConnectionStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.callbacks.onStatusChange?.(status);
    }
  }

  private handleDisconnect(): void {
    this.setStatus('disconnected');

    if (this.options.reconnect?.enabled) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    const { maxAttempts, initialDelay, maxDelay } = this.options.reconnect!;

    if (this.reconnectAttempts >= maxAttempts) {
      console.log('[MQTT] Max reconnection attempts reached');
      this.setStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      initialDelay * Math.pow(2, this.reconnectAttempts - 1),
      maxDelay
    );

    console.log(`[MQTT] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxAttempts})`);
    this.setStatus('reconnecting');

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('[MQTT] Reconnection failed:', error);
        this.attemptReconnect();
      }
    }, delay);
  }

  private restoreSubscriptions(): void {
    if (!this.client) return;

    for (const [topic, subscription] of this.subscriptions) {
      this.client.subscribe(topic, { qos: subscription.qos }, (error) => {
        if (error) {
          console.error(`[MQTT] Failed to restore subscription to ${topic}:`, error);
        } else {
          console.log(`[MQTT] Restored subscription to ${topic}`);
        }
      });
    }
  }

  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const messageStr = payload.toString();
      console.log('[MQTT] Raw message received on topic:', topic, 'payload:', messageStr.substring(0, 500));
      
      const message = JSON.parse(messageStr) as MQTTMessage;
      console.log('[MQTT] Parsed message type:', message.type, 'payload keys:', Object.keys(message));

      // Route to topic-specific handler
      const subscription = this.subscriptions.get(topic);
      if (subscription) {
        subscription.handler(topic, message);
      }

      // Route to general message callback
      this.callbacks.onMessage?.(topic, message);

      // Route to typed handlers based on message type
      this.routeToTypedHandler(message);

    } catch (error) {
      console.error('[MQTT] Failed to parse message:', error, 'Raw:', payload.toString().substring(0, 500));
    }
  }

  private routeToTypedHandler(message: MQTTMessage): void {
    const handlers = this.callbacks.typedHandlers;
    if (!handlers) return;

    const type = message.type as MQTTMessageType;

    switch (type) {
      case 'MARKET_INDEX':
        handlers.onMarketIndex?.(message as MarketIndexMessage);
        break;
      case 'STOCK_INFO':
        handlers.onStockInfo?.(message as StockInfoMessage);
        break;
      case 'TOP_PRICE':
        handlers.onTopPrice?.(message as TopPriceMessage);
        break;
      case 'BOARD_EVENT':
        handlers.onBoardEvent?.(message as BoardEventMessage);
        break;
      case 'OHLC':
        handlers.onOHLC?.(message as OHLCMessage);
        break;
      case 'TICK':
        handlers.onTick?.(message as TickMessage);
        break;
    }
  }
}

// Export singleton instance for convenience
let defaultClient: MQTTClient | null = null;

export function getMQTTClient(): MQTTClient {
  if (!defaultClient) {
    defaultClient = new MQTTClient();
  }
  return defaultClient;
}

export function resetMQTTClient(): void {
  if (defaultClient) {
    defaultClient.disconnect();
    defaultClient = null;
  }
}
