/**
 * PerformanceSummary - Display aggregate trading performance metrics
 */

import type { Trade } from '../../../shared/types/Trade';
import './PerformanceSummary.css';

interface PerformanceSummaryProps {
  trades: Trade[];
}

export function PerformanceSummary({ trades }: PerformanceSummaryProps) {
  const closedTrades = trades.filter((t) => t.exit);
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter((t) => t.netProfit && t.netProfit > 0);
  const losingTrades = closedTrades.filter((t) => t.netProfit && t.netProfit < 0);
  
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.netProfit || 0), 0);
  const totalCommissions = closedTrades.reduce((sum, t) => sum + (t.commission || 0), 0);
  const totalTaxes = closedTrades.reduce((sum, t) => sum + (t.tax || 0), 0);
  
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + (t.netProfit || 0), 0) / winningTrades.length
    : 0;
  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.netProfit || 0), 0) / losingTrades.length)
    : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = [
    { label: 'Total Trades', value: totalTrades.toString(), change: null },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, change: null },
    { label: 'Net P/L', value: formatCurrency(totalPnL), change: totalPnL },
    { label: 'Avg Win', value: formatCurrency(avgWin), change: null },
    { label: 'Avg Loss', value: formatCurrency(avgLoss), change: null },
    { label: 'Profit Factor', value: profitFactor.toFixed(2), change: null },
    { label: 'Commissions', value: formatCurrency(totalCommissions), change: null },
    { label: 'Taxes', value: formatCurrency(totalTaxes), change: null },
  ];

  return (
    <div className="performance-summary">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card">
          <div className="metric-label">{metric.label}</div>
          <div
            className={`metric-value ${
              metric.change !== null
                ? metric.change > 0
                  ? 'positive'
                  : metric.change < 0
                  ? 'negative'
                  : ''
                : ''
            }`}
          >
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
}
