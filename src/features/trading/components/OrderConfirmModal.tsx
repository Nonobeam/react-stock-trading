import React from 'react';
import type { OrderRequest } from '../../../shared/types';
import { Button } from '../../../shared/components/Button';
import './OrderConfirmModal.css';

interface OrderConfirmModalProps {
  order: OrderRequest;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  order,
  onConfirm,
  onCancel,
  isSubmitting,
}) => {
  const estimatedValue = order.price
    ? (order.quantity * order.price * 1000).toLocaleString('vi-VN')
    : 'Market Price';

  const sideClass = order.side === 'BUY' ? 'buy' : 'sell';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Order</h3>
        </div>

        <div className="modal-body">
          <div className="order-detail-row">
            <span className="label">Symbol:</span>
            <span className="value symbol">{order.symbol}</span>
          </div>

          <div className="order-detail-row">
            <span className="label">Side:</span>
            <span className={`value side ${sideClass}`}>
              {order.side === 'BUY' ? 'BUY' : 'SELL'}
            </span>
          </div>

          <div className="order-detail-row">
            <span className="label">Order Type:</span>
            <span className="value">{order.orderType}</span>
          </div>

          <div className="order-detail-row">
            <span className="label">Quantity:</span>
            <span className="value">{order.quantity.toLocaleString()}</span>
          </div>

          {order.price && (
            <div className="order-detail-row">
              <span className="label">Price:</span>
              <span className="value">{order.price} VND</span>
            </div>
          )}

          <div className="order-detail-row total">
            <span className="label">Estimated Value:</span>
            <span className="value">{estimatedValue} VND</span>
          </div>

          <div className="warning-message">
            Are you sure you want to place this order? This action cannot be undone.
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={sideClass}
          >
            {isSubmitting ? 'Placing...' : 'Confirm Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
