import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/api/client';
import { wsClient } from '../services/websocket/client';
import type { Order, OrderRequest, WebSocketMessage } from '../shared/types';

interface TradingContextType {
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  fetchOrders: () => Promise<void>;
  placeOrder: (request: OrderRequest) => Promise<{ orderId: string; status: string; message: string }>;
  cancelOrder: (orderId: string) => Promise<{ orderId: string; status: string; message: string }>;
  isSubmitting: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      setOrdersError(message);
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  const placeOrder = useCallback(async (request: OrderRequest) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.placeOrder(request);
      // Refresh orders list after successful placement
      await fetchOrders();
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (orderId: string) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.cancelOrder(orderId);
      // Refresh orders list after successful cancellation
      await fetchOrders();
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchOrders]);

  // Update order status from WebSocket ORDER_UPDATE messages
  useEffect(() => {
    const unsubscribe = wsClient.on('ORDER_UPDATE', (message: WebSocketMessage) => {
      if (message.type === 'ORDER_UPDATE' && message.data) {
        const updatedOrder = message.data as Order;
        setOrders((prevOrders) => {
          const existingIndex = prevOrders.findIndex((o) => o.orderId === updatedOrder.orderId);
          if (existingIndex >= 0) {
            // Update existing order
            const newOrders = [...prevOrders];
            newOrders[existingIndex] = updatedOrder;
            return newOrders;
          } else {
            // Add new order
            return [...prevOrders, updatedOrder];
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const value: TradingContextType = {
    orders,
    isLoadingOrders,
    ordersError,
    fetchOrders,
    placeOrder,
    cancelOrder,
    isSubmitting,
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};

export const useTrading = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
