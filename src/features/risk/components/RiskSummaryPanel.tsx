import React from 'react';
import type { PositionCalculation } from './PositionSizeCalculator';

interface RiskSummaryPanelProps {
  calculation: PositionCalculation | null;
  warnings: string[];
  viable: boolean;
}

export const RiskSummaryPanel: React.FC<RiskSummaryPanelProps> = ({
  calculation,
  warnings,
  viable
}) => {
  if (!calculation) {
    return (
      <div className="risk-summary-panel empty">
        <p className="empty-message">Enter trade parameters to see risk calculation</p>
      </div>
    );
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getViabilityStatus = () => {
    if (viable && warnings.length === 0) {
      return { label: 'Viable Trade', className: 'status-success' };
    } else if (viable && warnings.length > 0) {
      return { label: 'Viable with Warnings', className: 'status-warning' };
    } else {
      return { label: 'Not Viable', className: 'status-error' };
    }
  };

  const status = getViabilityStatus();

  return (
    <div className="risk-summary-panel">
      <div className="summary-header">
        <h3>Risk Summary</h3>
        <span className={`viability-badge ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="summary-metrics">
        <div className="metric-row">
          <span className="metric-label">Position Size</span>
          <span className="metric-value primary">
            {calculation.positionSize.toLocaleString()} shares
          </span>
        </div>

        <div className="metric-row">
          <span className="metric-label">Lots</span>
          <span className="metric-value">
            {calculation.lots} lots (×100 shares)
          </span>
        </div>

        <div className="metric-row">
          <span className="metric-label">Position Value</span>
          <span className="metric-value">
            {formatVND(calculation.positionValue)}
          </span>
        </div>

        <div className="metric-row highlight">
          <span className="metric-label">Risk Amount</span>
          <span className="metric-value danger">
            {formatVND(calculation.riskAmount)}
          </span>
        </div>

        <div className="metric-row">
          <span className="metric-label">Risk Per Share</span>
          <span className="metric-value">
            {formatVND(calculation.riskPerShare)}
          </span>
        </div>

        <div className="metric-row highlight">
          <span className="metric-label">Actual Risk %</span>
          <span className={`metric-value ${calculation.actualRiskPercent > 2 ? 'warning' : ''}`}>
            {calculation.actualRiskPercent.toFixed(2)}%
          </span>
        </div>

        {calculation.actualRiskPercent !== calculation.riskPercent && (
          <div className="adjustment-note">
            <small>
              Adjusted from {calculation.riskPercent}% due to lot size requirement
            </small>
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="warnings-section">
          <h4 className="warnings-title section-header--warning">Warnings</h4>
          <ul className="warnings-list">
            {warnings.map((warning, index) => (
              <li key={index} className="warning-item">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!viable && (
        <div className="not-viable-message">
          <strong>This trade cannot be executed.</strong> Please adjust your parameters.
        </div>
      )}
    </div>
  );
};
