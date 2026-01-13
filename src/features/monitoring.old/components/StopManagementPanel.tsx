import React, { useState } from 'react';
import type { Position, TrailingStopMethod } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import './StopManagementPanel.css';

interface StopManagementPanelProps {
  position: Position;
  onAdjustStop: (newStop: number, method: string, reason: string) => void;
  onClose: () => void;
}

export const StopManagementPanel: React.FC<StopManagementPanelProps> = ({
  position,
  onAdjustStop,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<TrailingStopMethod | 'MANUAL'>('ATR');
  const [manualStopPrice, setManualStopPrice] = useState<string>(position.currentStop.toString());

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRMultiple = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}R`;
  };

  const handleApplyAdjustment = () => {
    let newStop: number;
    let method: string;
    let reason: string;

    if (selectedMethod === 'MANUAL') {
      newStop = parseFloat(manualStopPrice);
      method = 'MANUAL';
      reason = 'Manual adjustment';
    } else {
      const suggestion = position.trailingSuggestions.find(s => s.method === selectedMethod);
      if (!suggestion) return;
      
      newStop = suggestion.price;
      method = suggestion.method;
      reason = suggestion.reason;
    }

    if (newStop && newStop > 0 && newStop < position.currentPrice) {
      onAdjustStop(newStop, method, reason);
    }
  };

  const getBestSuggestion = () => {
    if (position.trailingSuggestions.length === 0) return null;
    
    // Best suggestion is the one with highest riskReduction
    return position.trailingSuggestions.reduce((best, current) => 
      current.riskReduction > best.riskReduction ? current : best
    );
  };

  const bestSuggestion = getBestSuggestion();

  return (
    <div className="stop-management-panel">
      <div className="panel-header">
        <h3>Stop Management: {position.symbol}</h3>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>

      <div className="position-summary">
        <div className="summary-row">
          <span className="label">Entry:</span>
          <span className="value">{formatCurrency(position.entryPrice)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Current:</span>
          <span className="value current-price">{formatCurrency(position.currentPrice)}</span>
        </div>
        <div className="summary-row">
          <span className="label">P&L:</span>
          <span className={`value ${position.unrealizedPL >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(position.unrealizedPL)} ({formatRMultiple(position.rMultiple)})
          </span>
        </div>
        <div className="summary-row">
          <span className="label">Current Stop:</span>
          <span className="value">{formatCurrency(position.currentStop)}</span>
        </div>
      </div>

      {bestSuggestion && (
        <div className="suggested-adjustment">
          <div className="suggestion-header">
            ⚡ SUGGESTED ADJUSTMENT
          </div>
          <div className="suggestion-body">
            <div className="suggestion-method">
              <strong>Trailing {bestSuggestion.method} Stop:</strong> {formatCurrency(bestSuggestion.price)}
            </div>
            <div className="suggestion-reason">
              {bestSuggestion.reason}
            </div>
            <div className="suggestion-impact">
              Risk Reduction: {formatCurrency(bestSuggestion.riskReduction)}
              {position.rMultiple > 1 && bestSuggestion.price > position.entryPrice && (
                <Badge variant="success" size="small">Risk-Free Position</Badge>
              )}
            </div>
            <button
              className="btn-apply-suggestion"
              onClick={() => {
                setSelectedMethod(bestSuggestion.method);
                handleApplyAdjustment();
              }}
            >
              Apply Adjustment
            </button>
          </div>
        </div>
      )}

      <div className="stop-methods">
        <h4>Stop Methods:</h4>
        
        {position.trailingSuggestions.map((suggestion) => (
          <label key={suggestion.method} className="method-option">
            <input
              type="radio"
              name="stop-method"
              value={suggestion.method}
              checked={selectedMethod === suggestion.method}
              onChange={(e) => setSelectedMethod(e.target.value as TrailingStopMethod)}
            />
            <div className="method-details">
              <div className="method-name">
                {suggestion.method} Trail: {formatCurrency(suggestion.price)}
              </div>
              <div className="method-description">
                {suggestion.reason}
              </div>
            </div>
          </label>
        ))}

        <label className="method-option">
          <input
            type="radio"
            name="stop-method"
            value="MANUAL"
            checked={selectedMethod === 'MANUAL'}
            onChange={(e) => setSelectedMethod(e.target.value as 'MANUAL')}
          />
          <div className="method-details">
            <div className="method-name">Manual Stop</div>
            <div className="manual-input-group">
              <input
                type="number"
                className="manual-stop-input"
                value={manualStopPrice}
                onChange={(e) => setManualStopPrice(e.target.value)}
                disabled={selectedMethod !== 'MANUAL'}
                placeholder="Enter stop price"
              />
            </div>
          </div>
        </label>
      </div>

      <div className="stop-history">
        <h4>Stop History:</h4>
        <div className="history-list">
          {position.stopHistory.slice().reverse().map((adjustment, index) => (
            <div key={index} className="history-item">
              <div className="history-date">
                {new Date(adjustment.date).toLocaleString('vi-VN')}
              </div>
              <div className="history-details">
                <span className="history-price">{formatCurrency(adjustment.price)}</span>
                <span className="history-method">({adjustment.method})</span>
              </div>
              <div className="history-reason">{adjustment.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-actions">
        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-apply"
          onClick={handleApplyAdjustment}
          disabled={selectedMethod !== 'MANUAL' && position.trailingSuggestions.length === 0}
        >
          Apply Stop Adjustment
        </button>
      </div>
    </div>
  );
};
