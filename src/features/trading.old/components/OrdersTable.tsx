import React, { useState } from 'react';
import type { Order } from '../../../shared/types';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import './OrdersTable.css';

interface OrdersTableProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => Promise<void>;
  isLoading: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onCancelOrder, isLoading }) => {
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleCancel = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      await onCancelOrder(orderId);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'FILLED':
        return 'success';
      case 'PENDING':
      case 'PARTIALLY_FILLED':
        return 'warning';
      case 'CANCELLED':
      case 'REJECTED':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="orders-loading">
        <LoadingSpinner size="large" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Filled</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const canCancel = order.status === 'PENDING' || order.status === 'PARTIALLY_FILLED';
            const isCancelling = cancellingOrderId === order.orderId;

            return (
              <tr key={order.orderId}>
                <td className="time-cell">{formatDate(order.timestamp)}</td>
                <td className="symbol-cell">{order.symbol}</td>
                <td className="side-cell">
                  <span className={`side-badge ${order.side.toLowerCase()}`}>
                    {order.side}
                  </span>
                </td>
                <td>{order.orderType}</td>
                <td className="number-cell">{order.quantity.toLocaleString()}</td>
                <td className="number-cell">
                  {order.price ? `${order.price.toFixed(2)}` : 'Market'}
                </td>
                <td className="number-cell">{(order.filledQuantity || 0).toLocaleString()}</td>
                <td>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </td>
                <td className="actions-cell">
                  {canCancel && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleCancel(order.orderId)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
