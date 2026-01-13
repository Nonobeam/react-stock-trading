import React, { useState, useCallback } from 'react';
import { PositionSizeCalculator } from './components/PositionSizeCalculator';
import type { PositionCalculation } from './components/PositionSizeCalculator';
import { RiskSummaryPanel } from './components/RiskSummaryPanel';
import { StopLossPlanner } from './components/StopLossPlanner';
import type { StopMethod } from './components/StopLossPlanner';
import { TargetPlanner } from './components/TargetPlanner';
import { ViabilityChecklist } from './components/ViabilityChecklist';
import type { Exchange } from '../../services/vietnam/priceLimit';
import { validateMultipleTargets } from './utils/rrValidation';
import './RiskView.css';

interface RiskViewProps {
  // Can be pre-filled from scanner
  initialSymbol?: string;
  initialEntry?: number;
  initialStop?: number;
  initialExchange?: Exchange;
}

export const RiskView: React.FC<RiskViewProps> = ({
  initialSymbol = '',
  initialEntry = 0,
  initialStop = 0,
  initialExchange = 'HOSE'
}) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [exchange, setExchange] = useState<Exchange>(initialExchange);
  const [calculation, setCalculation] = useState<PositionCalculation | null>(null);
  const [stopPrice, setStopPrice] = useState(initialStop);
  const [targets, setTargets] = useState<number[]>([]);
  
  // Mock data - would come from API in production
  const [atr] = useState(2500);
  const [swingLow] = useState(80000);
  const [technicalSupport] = useState(78000);
  const [resistance1] = useState(95000);
  const [resistance2] = useState(102000);
  const [referencePrice] = useState(85000);

  const handleCalculation = useCallback((calc: PositionCalculation) => {
    setCalculation(calc);
  }, []);

  const handleStopChange = useCallback((price: number, _method: StopMethod) => {
    setStopPrice(price);
  }, []);

  const handleTargetsChange = useCallback((newTargets: number[]) => {
    setTargets(newTargets);
  }, []);

  // Calculate warnings and viability
  const warnings: string[] = [];
  let viable = false;

  if (calculation && stopPrice > 0) {
    // Check capital sufficiency
    if (calculation.positionValue > calculation.capital) {
      warnings.push('Insufficient capital for this position size');
    } else {
      viable = true;
    }

    // Check risk percentage
    if (calculation.actualRiskPercent > 2) {
      warnings.push(`Risk ${calculation.actualRiskPercent.toFixed(2)}% exceeds recommended 2% maximum`);
    }

    // Check if any target meets minimum R:R
    if (targets.length > 0) {
      const rrValidation = validateMultipleTargets(
        calculation.entryPrice,
        stopPrice,
        targets
      );
      
      if (rrValidation.best.ratio < 1.5) {
        warnings.push('Best target R:R below minimum 1.5:1');
        viable = false;
      }
    } else {
      warnings.push('No targets selected');
    }
  }

  return (
    <div className="risk-view">
      <div className="risk-header">
        <h1>Risk & Position Calculator</h1>
        <p className="subtitle">Plan your trade with precise position sizing and risk management</p>
      </div>

      <div className="trade-setup-inputs">
        <div className="input-group">
          <label htmlFor="symbol">Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., FPT, VNM, HPG"
          />
        </div>

        <div className="input-group">
          <label htmlFor="exchange">Exchange</label>
          <select
            id="exchange"
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
          >
            <option value="HOSE">HOSE (±7%)</option>
            <option value="HNX">HNX (±10%)</option>
          </select>
        </div>
      </div>

      <div className="risk-content">
        <div className="left-column">
          <PositionSizeCalculator
            initialValues={{
              entryPrice: initialEntry,
              stopPrice: initialStop
            }}
            onCalculate={handleCalculation}
          />

          {calculation && calculation.entryPrice > 0 && (
            <>
              <StopLossPlanner
                symbol={symbol}
                entryPrice={calculation.entryPrice}
                exchange={exchange}
                atr={atr}
                swingLow={swingLow}
                technicalSupport={technicalSupport}
                onStopChange={handleStopChange}
              />

              {stopPrice > 0 && (
                <TargetPlanner
                  symbol={symbol}
                  entryPrice={calculation.entryPrice}
                  stopPrice={stopPrice}
                  exchange={exchange}
                  referencePrice={referencePrice}
                  atr={atr}
                  resistance1={resistance1}
                  resistance2={resistance2}
                  onTargetsChange={handleTargetsChange}
                />
              )}
            </>
          )}
        </div>

        <div className="right-column">
          <RiskSummaryPanel
            calculation={calculation}
            warnings={warnings}
            viable={viable}
          />

          {calculation && stopPrice > 0 && (
            <ViabilityChecklist
              capital={calculation.capital}
              positionValue={calculation.positionValue}
              positionSize={calculation.positionSize}
              entryPrice={calculation.entryPrice}
              stopPrice={stopPrice}
              targets={targets}
              exchange={exchange}
              actualRiskPercent={calculation.actualRiskPercent}
            />
          )}

          {calculation && stopPrice > 0 && targets.length > 0 && viable && (
            <div className="action-panel">
              <button className="btn-primary btn-large">
                Save Trade Plan
              </button>
              <button className="btn-secondary">
                Export to CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
