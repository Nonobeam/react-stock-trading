import React from 'react';
import type { PortfolioSummary } from '../../../shared/types';
import './PortfolioSummaryCards.css';

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary;
}

export const PortfolioSummaryCards: React.FC<PortfolioSummaryCardsProps> = ({ summary }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatRMultiple = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}R`;
  };

  const getRiskStatusClass = (): string => {
    if (summary.riskPercent > 8) return 'risk-high';
    if (summary.riskPercent > 5) return 'risk-medium';
    return 'risk-low';
  };

  const getRiskStatusText = (): string => {
    if (summary.riskPercent > 8) return 'High Risk';
    if (summary.riskPercent > 5) return 'Moderate Risk';
    return 'Good Risk';
  };

  return (
    <div className="portfolio-summary-cards">
      {/* Total Positions */}
      <div className="summary-card">
        <div className="card-header">
          <div className="card-label">Positions</div>
        </div>
        <div className="card-content">
          <div className="card-value">{summary.totalPositions}</div>
        </div>
      </div>

      {/* Total Value */}
      <div className="summary-card">
        <div className="card-header">
          <div className="card-label">Capital</div>
        </div>
        <div className="card-content">
          <div className="card-value">{formatCurrency(summary.totalValue)}</div>
        </div>
      </div>

      {/* Total P&L */}
      <div className={`summary-card ${summary.totalUnrealizedPL >= 0 ? 'profit' : 'loss'}`}>
        <div className="card-header">
          <div className="card-label">P&L</div>
          <span className={`card-indicator ${summary.totalUnrealizedPL >= 0 ? 'indicator-up' : 'indicator-down'}`}></span>
        </div>
        <div className="card-content">
          <div className="card-value">
            {formatCurrency(summary.totalUnrealizedPL)}
          </div>
          <div className="card-subtitle">
            {formatPercent(summary.totalUnrealizedPLPercent)}
          </div>
        </div>
      </div>

      {/* Average R-Multiple */}
      <div className={`summary-card ${summary.avgRMultiple >= 0 ? 'profit' : 'loss'}`}>
        <div className="card-header">
          <div className="card-label">Target</div>
        </div>
        <div className="card-content">
          <div className="card-value">{formatRMultiple(summary.avgRMultiple)}</div>
        </div>
      </div>

      {/* Risk at Risk */}
      <div className={`summary-card ${getRiskStatusClass()}`}>
        <div className="card-header">
          <div className="card-label">Risk</div>
        </div>
        <div className="card-content">
          <div className="card-value">{formatCurrency(summary.totalCapitalAtRisk)}</div>
          <div className="card-subtitle">
            {formatPercent(summary.riskPercent)} - {getRiskStatusText()}
          </div>
        </div>
      </div>

      {/* Best Performer */}
      {summary.bestPerformer && (
        <div className="summary-card profit">
          <div className="card-header">
            <div className="card-label">Best Performer</div>
          </div>
          <div className="card-content">
            <div className="card-value performer-symbol">{summary.bestPerformer.symbol}</div>
            <div className="card-subtitle">
              {formatCurrency(summary.bestPerformer.pl)}
            </div>
          </div>
        </div>
      )}

      {/* Worst Performer */}
      {summary.worstPerformer && summary.totalPositions > 1 && (
        <div className="summary-card loss">
          <div className="card-header">
            <div className="card-label">Worst Performer</div>
          </div>
          <div className="card-content">
            <div className="card-value performer-symbol">{summary.worstPerformer.symbol}</div>
            <div className="card-subtitle">
              {formatCurrency(summary.worstPerformer.pl)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
