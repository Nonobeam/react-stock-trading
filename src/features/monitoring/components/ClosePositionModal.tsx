import React, { useState } from 'react';
import type { Position } from '../../../shared/types';
import './ClosePositionModal.css';

interface ClosePositionModalProps {
  position: Position;
  onClose: () => void;
  onConfirm: (shares?: number, reason?: string) => void;
}

export const ClosePositionModal: React.FC<ClosePositionModalProps> = ({
  position,
  onClose,
  onConfirm,
}) => {
  const [closeType, setCloseType] = useState<'full' | 'partial'>('full');
  const [shares, setShares] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculatePartialPL = (): number => {
    if (closeType === 'full' || !shares) return position.unrealizedPL;
    
    const sharesToClose = parseInt(shares);
    return (position.unrealizedPL / position.size) * sharesToClose;
  };

  const handleConfirm = () => {
    if (closeType === 'full') {
      onConfirm(undefined, reason || 'Full position close');
    } else {
      const sharesToClose = parseInt(shares);
      if (sharesToClose > 0 && sharesToClose <= position.size) {
        onConfirm(sharesToClose, reason || 'Partial position close');
      }
    }
  };

  const isLockingLoss = position.unrealizedPL < 0;
  const partialPL = calculatePartialPL();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="close-position-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Close Position: {position.symbol}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Position Summary */}
          <div className="position-info">
            <div className="info-row">
              <span>Current Price:</span>
              <strong>{formatCurrency(position.currentPrice)}</strong>
            </div>
            <div className="info-row">
              <span>Entry Price:</span>
              <strong>{formatCurrency(position.entryPrice)}</strong>
            </div>
            <div className="info-row">
              <span>Position Size:</span>
              <strong>{position.size} shares</strong>
            </div>
            <div className="info-row">
              <span>Total P&L:</span>
              <strong className={position.unrealizedPL >= 0 ? 'positive' : 'negative'}>
                {formatCurrency(position.unrealizedPL)} ({position.unrealizedPLPercent.toFixed(2)}%)
              </strong>
            </div>
          </div>

          {/* Close Type Selection */}
          <div className="close-type-section">
            <h4>Close Type:</h4>
            <div className="close-type-options">
              <label className="close-type-option">
                <input
                  type="radio"
                  name="close-type"
                  value="full"
                  checked={closeType === 'full'}
                  onChange={() => setCloseType('full')}
                />
                <div>
                  <strong>Full Close</strong>
                  <p>Close entire position ({position.size} shares)</p>
                </div>
              </label>

              <label className="close-type-option">
                <input
                  type="radio"
                  name="close-type"
                  value="partial"
                  checked={closeType === 'partial'}
                  onChange={() => setCloseType('partial')}
                />
                <div>
                  <strong>Partial Close</strong>
                  <p>Close a portion of the position</p>
                </div>
              </label>
            </div>
          </div>

          {/* Partial Close Input */}
          {closeType === 'partial' && (
            <div className="partial-close-section">
              <label htmlFor="shares-input">Shares to Close:</label>
              <input
                id="shares-input"
                type="number"
                className="shares-input"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="Enter number of shares"
                min="1"
                max={position.size}
              />
              
              <div className="preset-buttons">
                <button onClick={() => setShares(Math.floor(position.size * 0.25).toString())}>
                  25% ({Math.floor(position.size * 0.25)} shares)
                </button>
                <button onClick={() => setShares(Math.floor(position.size * 0.5).toString())}>
                  50% ({Math.floor(position.size * 0.5)} shares)
                </button>
                <button onClick={() => setShares(Math.floor(position.size * 0.75).toString())}>
                  75% ({Math.floor(position.size * 0.75)} shares)
                </button>
              </div>

              {shares && parseInt(shares) > 0 && (
                <div className="partial-summary">
                  <div className="summary-item">
                    <span>Shares Closing:</span>
                    <strong>{shares} shares</strong>
                  </div>
                  <div className="summary-item">
                    <span>P&L on Closed Portion:</span>
                    <strong className={partialPL >= 0 ? 'positive' : 'negative'}>
                      {formatCurrency(partialPL)}
                    </strong>
                  </div>
                  <div className="summary-item">
                    <span>Remaining Position:</span>
                    <strong>{position.size - parseInt(shares)} shares</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reason Input */}
          <div className="reason-section">
            <label htmlFor="reason-input">Reason (Optional):</label>
            <textarea
              id="reason-input"
              className="reason-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Target hit, stop triggered, taking profits..."
              rows={3}
            />
          </div>

          {/* Warning for Loss */}
          {isLockingLoss && (
            <div className="warning-box">
              <strong>Warning:</strong> You are about to lock in a loss of{' '}
              {formatCurrency(Math.abs(closeType === 'full' ? position.unrealizedPL : partialPL))}.
              Please confirm this is intentional.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn-confirm ${isLockingLoss ? 'btn-warning' : ''}`}
            onClick={handleConfirm}
            disabled={closeType === 'partial' && (!shares || parseInt(shares) <= 0 || parseInt(shares) > position.size)}
          >
            {closeType === 'full' ? 'Close Full Position' : 'Close Partial Position'}
          </button>
        </div>
      </div>
    </div>
  );
};
