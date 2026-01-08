import React from 'react';
import type { PerformanceMetrics } from '../../../shared/types';
import { TradingTerm } from '../../../shared/components';
import './PerformanceOverviewCards.css';

interface PerformanceOverviewCardsProps {
  metrics: PerformanceMetrics | null;
}

interface MetricCardProps {
  title: React.ReactNode;
  value: string | number;
  subtitle?: string;
  status?: 'excellent' | 'good' | 'poor';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, status }) => {
  return (
    <div className={`metric-card metric-card--${status || 'neutral'}`}>
      <div className="metric-card__title">{title}</div>
      <div className="metric-card__value">{value}</div>
      {subtitle && <div className="metric-card__subtitle">{subtitle}</div>}
      {status && (
        <span className={`metric-card__badge metric-card__badge--${status}`}>
          {status.toUpperCase()}
        </span>
      )}
    </div>
  );
};

const getWinRateStatus = (winRate: number): 'excellent' | 'good' | 'poor' => {
  if (winRate >= 60) return 'excellent';
  if (winRate >= 45) return 'good';
  return 'poor';
};

const getExpectancyStatus = (expectancy: number): 'excellent' | 'good' | 'poor' => {
  if (expectancy >= 0.5) return 'excellent';
  if (expectancy >= 0.2) return 'good';
  return 'poor';
};

const getProfitFactorStatus = (profitFactor: number): 'excellent' | 'good' | 'poor' => {
  if (profitFactor >= 2.0) return 'excellent';
  if (profitFactor >= 1.5) return 'good';
  return 'poor';
};

const getMaxDrawdownStatus = (maxDrawdown: number): 'excellent' | 'good' | 'poor' => {
  const absDrawdown = Math.abs(maxDrawdown);
  if (absDrawdown <= 10) return 'excellent';
  if (absDrawdown <= 20) return 'good';
  return 'poor';
};

export const PerformanceOverviewCards: React.FC<PerformanceOverviewCardsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="performance-overview-cards">
        <div className="performance-overview-cards__loading">
          Loading performance metrics...
        </div>
      </div>
    );
  }

  const winRate = (metrics.winRate * 100).toFixed(1);
  const expectancy = metrics.expectancy.toFixed(2);
  const profitFactor = metrics.profitFactor.toFixed(2);
  const maxDrawdown = (metrics.maxDrawdown * 100).toFixed(1);

  return (
    <div className="performance-overview-cards">
      <MetricCard
        title={<TradingTerm term="WIN_RATE">Win Rate</TradingTerm>}
        value={`${winRate}%`}
        subtitle={`${Math.round(metrics.winRate * metrics.totalTrades)} of ${metrics.totalTrades} trades`}
        status={getWinRateStatus(parseFloat(winRate))}
      />
      
      <MetricCard
        title={<TradingTerm term="EXPECTANCY">Expectancy</TradingTerm>}
        value={`${expectancy}R`}
        subtitle="Average R per trade"
        status={getExpectancyStatus(metrics.expectancy)}
      />
      
      <MetricCard
        title={<TradingTerm term="PROFIT_FACTOR">Profit Factor</TradingTerm>}
        value={profitFactor}
        subtitle={`Wins: ${metrics.avgWin.toFixed(0)}k / Losses: ${Math.abs(metrics.avgLoss).toFixed(0)}k`}
        status={getProfitFactorStatus(metrics.profitFactor)}
      />
      
      <MetricCard
        title={<TradingTerm term="DRAWDOWN">Max Drawdown</TradingTerm>}
        value={`${maxDrawdown}%`}
        subtitle={`Recovery: ${metrics.recoveryFactor.toFixed(2)}x`}
        status={getMaxDrawdownStatus(parseFloat(maxDrawdown))}
      />
    </div>
  );
};
