import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { WebSocketClient } from '../services/websocket/client';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface WebSocketContextValue {
  client: WebSocketClient | null;
  status: WebSocketStatus;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  url, 
  autoConnect = true 
}) => {
  const [client] = useState(() => new WebSocketClient(url));
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');

  useEffect(() => {
    // Set up status callback
    client.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    // Auto-connect if enabled
    if (autoConnect) {
      client.connect();
    }

    // Cleanup on unmount
    return () => {
      client.disconnect();
    };
  }, [client, autoConnect]);

  const connect = useCallback(() => {
    client.connect();
  }, [client]);

  const disconnect = useCallback(() => {
    client.disconnect();
  }, [client]);

  const value: WebSocketContextValue = {
    client,
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextValue => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
