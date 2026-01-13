import React, { useState, useCallback } from 'react';
import { useTrading } from '../../context/TradingContext';
import { OrderForm } from './components/OrderForm';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { OrdersTable } from './components/OrdersTable';
import type { OrderRequest } from '../../shared/types';
import './TradingView.css';

export const TradingView: React.FC = () => {
  const {
    orders,
    isLoadingOrders,
    ordersError,
    placeOrder,
    cancelOrder,
    isSubmitting,
    fetchOrders,
  } = useTrading();

  const [pendingOrder, setPendingOrder] = useState<OrderRequest | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = useCallback((order: OrderRequest) => {
    // Show confirmation modal
    setPendingOrder(order);
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  const handleConfirmOrder = useCallback(async () => {
    if (!pendingOrder) return;

    try {
      const response = await placeOrder(pendingOrder);
      setSuccessMessage(`Order placed successfully! Order ID: ${response.orderId}`);
      setPendingOrder(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      setErrorMessage(message);
      setPendingOrder(null);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [pendingOrder, placeOrder]);

  const handleCancelModal = useCallback(() => {
    setPendingOrder(null);
  }, []);

  const handleCancelOrder = useCallback(async (orderId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const response = await cancelOrder(orderId);
      setSuccessMessage(`Order cancelled: ${response.message}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order';
      setErrorMessage(message);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [cancelOrder]);

  const handleRefreshOrders = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="trading-view">
      <div className="view-header">
        <h1>Trading</h1>
        <p className="view-description">Place and manage your orders</p>
      </div>

      {successMessage && (
        <div className="message-banner success">
          <span className="icon">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="message-banner error">
          <span className="icon">✕</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="trading-content">
        <section className="order-form-section">
          <h2>New Order</h2>
          <OrderForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </section>

        <section className="orders-section">
          <div className="section-header">
            <h2>Orders</h2>
            <button className="refresh-button" onClick={handleRefreshOrders} disabled={isLoadingOrders}>
              <span className="icon">↻</span>
              <span>{isLoadingOrders ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {ordersError && (
            <div className="error-message">
              <span className="icon">⚠</span>
              <span>{ordersError}</span>
            </div>
          )}

          <OrdersTable
            orders={orders}
            onCancelOrder={handleCancelOrder}
            isLoading={isLoadingOrders}
          />
        </section>
      </div>

      {pendingOrder && (
        <OrderConfirmModal
          order={pendingOrder}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelModal}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
