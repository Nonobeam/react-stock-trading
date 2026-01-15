/**
 * MQTT Service Types
 * Internal types for the MQTT client implementation
 */

import type { MQTTConnectionStatus, MQTTMessage, MQTTTypedHandlers } from '../../shared/types/mqtt';

/**
 * MQTT Client connection options
 */
export interface MQTTClientOptions {
  /** Broker WebSocket URL */
  url: string;
  
  /** Username for authentication */
  username: string;
  
  /** Password/token for authentication */
  password: string;
  
  /** Client ID (auto-generated if not provided) */
  clientId?: string;
  
  /** Quality of Service level */
  qos?: 0 | 1 | 2;
  
  /** Keep-alive interval in seconds */
  keepAlive?: number;
  
  /** Clean session flag */
  cleanSession?: boolean;
  
  /** Reconnection options */
  reconnect?: {
    enabled: boolean;
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
  };
}

/**
 * Topic subscription with handler
 */
export interface TopicSubscription {
  topic: string;
  qos: 0 | 1 | 2;
  handler: (topic: string, message: MQTTMessage | unknown) => void;
}

/**
 * MQTT Client event callbacks
 */
export interface MQTTClientCallbacks {
  /** Called when connection status changes */
  onStatusChange?: (status: MQTTConnectionStatus) => void;
  
  /** Called when a message is received */
  onMessage?: (topic: string, message: MQTTMessage) => void;
  
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  
  /** Typed handlers for specific message types */
  typedHandlers?: MQTTTypedHandlers;
}

/**
 * Generate a unique MQTT client ID
 */
export function generateClientId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `gst-web-${timestamp}-${random}`;
}
