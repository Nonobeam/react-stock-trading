import React, { useMemo } from 'react';
import { validatePrice } from '../../../services/vietnam/priceLimit';
import type { Exchange } from '../../../services/vietnam/priceLimit';

export type TargetMethod = 'R_MULTIPLE' | 'ATR' | 'TECHNICAL' | 'FIBONACCI';

interface Target {
  method: TargetMethod;
  label: string;
  price: number;
  distance: number;
  distancePercent: number;
  rMultiple: number;
  valid: boolean;
  reason?: string;
}

interface TargetPlannerProps {
  symbol: string;
  entryPrice: number;
  stopPrice: number;
  exchange: Exchange;
  referencePrice: number; // For limit validation
  atr?: number;
  resistance1?: number;
  resistance2?: number;
  onTargetsChange: (targets: number[]) => void;
}

export const TargetPlanner: React.FC<TargetPlannerProps> = ({
  entryPrice,
  stopPrice,
  exchange,
  referencePrice,
  atr,
  resistance1,
  resistance2,
  onTargetsChange
}) => {
  const [selectedTargets, setSelectedTargets] = React.useState<Set<string>>(new Set());

  const riskDistance = entryPrice - stopPrice;

  const targetOptions = useMemo<Target[]>(() => {
    const options: Target[] = [];

    // R-Multiple Targets
    [1.5, 2, 3, 4].forEach((r) => {
      const price = entryPrice + (riskDistance * r);
      const validation = validatePrice(price, referencePrice, exchange);
      options.push({
        method: 'R_MULTIPLE',
        label: `${r}R Target`,
        price,
        distance: price - entryPrice,
        distancePercent: ((price - entryPrice) / entryPrice) * 100,
        rMultiple: r,
        valid: validation.valid,
        reason: validation.reason
      });
    });

    // ATR-based Targets
    if (atr && atr > 0) {
      [2, 3, 4].forEach((multiplier) => {
        const price = entryPrice + (atr * multiplier);
        const validation = validatePrice(price, referencePrice, exchange);
        const r = (price - entryPrice) / riskDistance;
        options.push({
          method: 'ATR',
          label: `${multiplier}×ATR Target`,
          price,
          distance: price - entryPrice,
          distancePercent: ((price - entryPrice) / entryPrice) * 100,
          rMultiple: r,
          valid: validation.valid,
          reason: validation.reason
        });
      });
    }

    // Technical Resistance Targets
    if (resistance1 && resistance1 > entryPrice) {
      const validation = validatePrice(resistance1, referencePrice, exchange);
      const r = (resistance1 - entryPrice) / riskDistance;
      options.push({
        method: 'TECHNICAL',
        label: 'Resistance 1',
        price: resistance1,
        distance: resistance1 - entryPrice,
        distancePercent: ((resistance1 - entryPrice) / entryPrice) * 100,
        rMultiple: r,
        valid: validation.valid,
        reason: validation.reason
      });
    }

    if (resistance2 && resistance2 > entryPrice) {
      const validation = validatePrice(resistance2, referencePrice, exchange);
      const r = (resistance2 - entryPrice) / riskDistance;
      options.push({
        method: 'TECHNICAL',
        label: 'Resistance 2',
        price: resistance2,
        distance: resistance2 - entryPrice,
        distancePercent: ((resistance2 - entryPrice) / entryPrice) * 100,
        rMultiple: r,
        valid: validation.valid,
        reason: validation.reason
      });
    }

    // Fibonacci Extensions (1.618, 2.618)
    [1.618, 2.618].forEach((fib) => {
      const price = entryPrice + (riskDistance * fib);
      const validation = validatePrice(price, referencePrice, exchange);
      options.push({
        method: 'FIBONACCI',
        label: `Fib ${fib.toFixed(3)}`,
        price,
        distance: price - entryPrice,
        distancePercent: ((price - entryPrice) / entryPrice) * 100,
        rMultiple: fib,
        valid: validation.valid,
        reason: validation.reason
      });
    });

    return options.sort((a, b) => a.price - b.price);
  }, [entryPrice, stopPrice, riskDistance, exchange, referencePrice, atr, resistance1, resistance2]);

  // Find consensus targets (targets within 2% of each other)
  const consensusZones = useMemo(() => {
    const zones: { targets: Target[]; avgPrice: number; count: number }[] = [];
    const threshold = 0.02; // 2%

    targetOptions.forEach((target) => {
      if (!target.valid) return;

      let foundZone = false;
      for (const zone of zones) {
        const priceDiff = Math.abs(target.price - zone.avgPrice) / zone.avgPrice;
        if (priceDiff <= threshold) {
          zone.targets.push(target);
          zone.avgPrice = zone.targets.reduce((sum, t) => sum + t.price, 0) / zone.targets.length;
          zone.count = zone.targets.length;
          foundZone = true;
          break;
        }
      }

      if (!foundZone) {
        zones.push({
          targets: [target],
          avgPrice: target.price,
          count: 1
        });
      }
    });

    return zones.filter(z => z.count >= 2).sort((a, b) => b.count - a.count);
  }, [targetOptions]);

  const toggleTarget = (targetKey: string) => {
    const newSelected = new Set(selectedTargets);
    if (newSelected.has(targetKey)) {
      newSelected.delete(targetKey);
    } else {
      newSelected.add(targetKey);
    }
    setSelectedTargets(newSelected);

    // Update parent with selected target prices
    const targets = Array.from(newSelected)
      .map(key => {
        const target = targetOptions.find(t => `${t.method}-${t.label}` === key);
        return target?.price;
      })
      .filter((p): p is number => p !== undefined)
      .sort((a, b) => a - b);
    
    onTargetsChange(targets);
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="target-planner">
      <h3 className="planner-title">Target Planning</h3>
      <div className="risk-info">
        <span>Risk Distance: {formatVND(riskDistance)} ({((riskDistance / entryPrice) * 100).toFixed(2)}%)</span>
      </div>

      {consensusZones.length > 0 && (
        <div className="consensus-zones">
          <h4>Consensus Target Zones</h4>
          {consensusZones.map((zone, idx) => (
            <div key={idx} className="consensus-zone">
              <div className="zone-header">
                <span className="zone-price">{formatVND(zone.avgPrice)}</span>
                <span className="zone-count">{zone.count} methods agree</span>
              </div>
              <div className="zone-methods">
                {zone.targets.map(t => t.label).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="target-categories">
        {['R_MULTIPLE', 'ATR', 'TECHNICAL', 'FIBONACCI'].map(method => {
          const methodTargets = targetOptions.filter(t => t.method === method);
          if (methodTargets.length === 0) return null;

          return (
            <div key={method} className="target-category">
              <h4 className="category-title">
                {method === 'R_MULTIPLE' && 'Risk-Multiple Targets'}
                {method === 'ATR' && 'ATR-Based Targets'}
                {method === 'TECHNICAL' && 'Technical Resistance'}
                {method === 'FIBONACCI' && 'Fibonacci Extensions'}
              </h4>
              <div className="target-options">
                {methodTargets.map((target) => {
                  const targetKey = `${target.method}-${target.label}`;
                  const isSelected = selectedTargets.has(targetKey);
                  
                  return (
                    <div
                      key={targetKey}
                      className={`target-card ${isSelected ? 'selected' : ''} ${!target.valid ? 'invalid' : ''}`}
                      onClick={() => target.valid && toggleTarget(targetKey)}
                    >
                      <div className="target-header">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => target.valid && toggleTarget(targetKey)}
                          disabled={!target.valid}
                        />
                        <label className="target-label">{target.label}</label>
                      </div>

                      <div className="target-details">
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">{formatVND(target.price)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">R-Multiple:</span>
                          <span className={`detail-value ${target.rMultiple >= 2 ? 'good' : 'low'}`}>
                            {target.rMultiple.toFixed(2)}R
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Gain:</span>
                          <span className="detail-value">
                            +{target.distancePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {!target.valid && (
                        <div className="invalid-reason">
                          <span className="warning-text">Warning:</span> {target.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTargets.size > 0 && (
        <div className="selected-targets-summary">
          <h4>Selected Targets ({selectedTargets.size})</h4>
          <div className="summary-list">
            {Array.from(selectedTargets).map(key => {
              const target = targetOptions.find(t => `${t.method}-${t.label}` === key);
              if (!target) return null;
              return (
                <div key={key} className="summary-item">
                  <span>{target.label}:</span>
                  <strong>{formatVND(target.price)} ({target.rMultiple.toFixed(2)}R)</strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
