import React, { useState, useMemo } from 'react';
import { validateStopPrice } from '../../../services/vietnam/priceLimit';
import type { Exchange } from '../../../services/vietnam/priceLimit';

export type StopMethod = 'ATR' | 'SWING' | 'PERCENTAGE' | 'TECHNICAL';

interface StopLossPlannerProps {
  symbol: string;
  entryPrice: number;
  exchange: Exchange;
  atr?: number;
  swingLow?: number;
  technicalSupport?: number;
  onStopChange: (stopPrice: number, method: StopMethod) => void;
}

interface StopOption {
  method: StopMethod;
  label: string;
  price: number;
  distance: number;
  distancePercent: number;
  valid: boolean;
  reason?: string;
}

export const StopLossPlanner: React.FC<StopLossPlannerProps> = ({
  symbol,
  entryPrice,
  exchange,
  atr,
  swingLow,
  technicalSupport,
  onStopChange
}) => {
  const [selectedMethod, setSelectedMethod] = useState<StopMethod>('ATR');
  const [customPercentage, setCustomPercentage] = useState<number>(3);

  const stopOptions = useMemo<StopOption[]>(() => {
    const options: StopOption[] = [];

    // ATR Stop (entry - 2×ATR)
    if (atr && atr > 0) {
      const stopPrice = entryPrice - (2 * atr);
      const validation = validateStopPrice(entryPrice, stopPrice, exchange);
      options.push({
        method: 'ATR',
        label: `ATR Stop (2×ATR)`,
        price: stopPrice,
        distance: entryPrice - stopPrice,
        distancePercent: ((entryPrice - stopPrice) / entryPrice) * 100,
        valid: validation.valid,
        reason: validation.reason
      });
    }

    // Swing Low Stop
    if (swingLow && swingLow > 0) {
      const stopPrice = swingLow * 0.99; // 1% below swing low
      const validation = validateStopPrice(entryPrice, stopPrice, exchange);
      options.push({
        method: 'SWING',
        label: `Swing Low (1% below)`,
        price: stopPrice,
        distance: entryPrice - stopPrice,
        distancePercent: ((entryPrice - stopPrice) / entryPrice) * 100,
        valid: validation.valid,
        reason: validation.reason
      });
    }

    // Percentage Stop
    const percentStopPrice = entryPrice * (1 - customPercentage / 100);
    const percentValidation = validateStopPrice(entryPrice, percentStopPrice, exchange);
    options.push({
      method: 'PERCENTAGE',
      label: `${customPercentage}% Below Entry`,
      price: percentStopPrice,
      distance: entryPrice - percentStopPrice,
      distancePercent: customPercentage,
      valid: percentValidation.valid,
      reason: percentValidation.reason
    });

    // Technical Support Stop
    if (technicalSupport && technicalSupport > 0) {
      const stopPrice = technicalSupport * 0.99; // 1% below support
      const validation = validateStopPrice(entryPrice, stopPrice, exchange);
      options.push({
        method: 'TECHNICAL',
        label: `Technical Support (1% below)`,
        price: stopPrice,
        distance: entryPrice - stopPrice,
        distancePercent: ((entryPrice - stopPrice) / entryPrice) * 100,
        valid: validation.valid,
        reason: validation.reason
      });
    }

    return options;
  }, [entryPrice, exchange, atr, swingLow, technicalSupport, customPercentage]);

  const selectedStop = stopOptions.find(opt => opt.method === selectedMethod);

  React.useEffect(() => {
    if (selectedStop && selectedStop.valid) {
      onStopChange(selectedStop.price, selectedStop.method);
    }
  }, [selectedStop, onStopChange]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="stop-loss-planner">
      <h3 className="planner-title">Stop Loss Planning</h3>
      <div className="symbol-info">
        <span className="symbol">{symbol}</span>
        <span className="exchange-badge">{exchange}</span>
      </div>

      <div className="stop-methods">
        {stopOptions.map((option) => (
          <div
            key={option.method}
            className={`stop-method-card ${selectedMethod === option.method ? 'selected' : ''} ${!option.valid ? 'invalid' : ''}`}
            onClick={() => option.valid && setSelectedMethod(option.method)}
          >
            <div className="method-header">
              <input
                type="radio"
                name="stopMethod"
                checked={selectedMethod === option.method}
                onChange={() => option.valid && setSelectedMethod(option.method)}
                disabled={!option.valid}
              />
              <label className="method-label">{option.label}</label>
            </div>

            <div className="method-details">
              <div className="detail-row">
                <span className="detail-label">Stop Price:</span>
                <span className="detail-value">{formatVND(option.price)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Distance:</span>
                <span className="detail-value">
                  {formatVND(option.distance)} ({option.distancePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {!option.valid && (
              <div className="invalid-reason">
                <span className="warning-text">Warning:</span> {option.reason}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedMethod === 'PERCENTAGE' && (
        <div className="custom-percentage">
          <label htmlFor="customPercentage">Custom Stop Distance %</label>
          <input
            id="customPercentage"
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={customPercentage}
            onChange={(e) => setCustomPercentage(parseFloat(e.target.value))}
          />
        </div>
      )}

      {selectedStop && selectedStop.valid && (
        <div className="selected-stop-summary">
          <h4>Selected Stop</h4>
          <div className="summary-content">
            <div className="summary-row">
              <span>Method:</span>
              <strong>{selectedStop.label}</strong>
            </div>
            <div className="summary-row">
              <span>Stop Price:</span>
              <strong>{formatVND(selectedStop.price)}</strong>
            </div>
            <div className="summary-row">
              <span>Risk Distance:</span>
              <strong>{selectedStop.distancePercent.toFixed(2)}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
