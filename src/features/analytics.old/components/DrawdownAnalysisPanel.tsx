import React from 'react';
import type { PerformanceMetrics } from '../../../shared/types';
import './DrawdownAnalysisPanel.css';

interface DrawdownAnalysisPanelProps {
  metrics: PerformanceMetrics | null;
}

export const DrawdownAnalysisPanel: React.FC<DrawdownAnalysisPanelProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="drawdown-analysis-panel">
        <div className="drawdown-analysis-panel__empty">
          No drawdown data available
        </div>
      </div>
    );
  }

  const maxDrawdownPercent = (metrics.maxDrawdown * 100).toFixed(2);
  const recoveryFactor = metrics.recoveryFactor.toFixed(2);
  const consecutiveLosses = metrics.consecutiveLosses;
  const maxDrawdownDays = metrics.maxDrawdownDuration || 0;

  const getDrawdownSeverity = (drawdown: number): 'low' | 'moderate' | 'high' | 'severe' => {
    const absDrawdown = Math.abs(drawdown);
    if (absDrawdown <= 10) return 'low';
    if (absDrawdown <= 20) return 'moderate';
    if (absDrawdown <= 30) return 'high';
    return 'severe';
  };

  const severity = getDrawdownSeverity(parseFloat(maxDrawdownPercent));

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#f97316';
      case 'severe': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRecoveryStatus = (factor: number): 'excellent' | 'good' | 'poor' => {
    if (factor >= 2.0) return 'excellent';
    if (factor >= 1.0) return 'good';
    return 'poor';
  };

  const recoveryStatus = getRecoveryStatus(parseFloat(recoveryFactor));

  return (
    <div className="drawdown-analysis-panel">
      <div className="drawdown-analysis-panel__header">
        <h3 className="drawdown-analysis-panel__title">Drawdown Analysis</h3>
        <span 
          className={`drawdown-analysis-panel__severity-badge drawdown-analysis-panel__severity-badge--${severity}`}
        >
          {severity.toUpperCase()} RISK
        </span>
      </div>

      <div className="drawdown-analysis-panel__grid">
        <div className="drawdown-analysis-panel__metric-card">
          <div className="drawdown-analysis-panel__metric-label">Max Drawdown</div>
          <div 
            className="drawdown-analysis-panel__metric-value drawdown-analysis-panel__metric-value--large"
            style={{ color: getSeverityColor(severity) }}
          >
            -{maxDrawdownPercent}%
          </div>
          <div className="drawdown-analysis-panel__metric-subtitle">
            Peak-to-trough decline
          </div>
        </div>

        <div className="drawdown-analysis-panel__metric-card">
          <div className="drawdown-analysis-panel__metric-label">Recovery Factor</div>
          <div 
            className={`drawdown-analysis-panel__metric-value drawdown-analysis-panel__metric-value--large drawdown-analysis-panel__metric-value--${recoveryStatus}`}
          >
            {recoveryFactor}x
          </div>
          <div className="drawdown-analysis-panel__metric-subtitle">
            Net profit / Max drawdown
          </div>
        </div>

        <div className="drawdown-analysis-panel__metric-card">
          <div className="drawdown-analysis-panel__metric-label">Consecutive Losses</div>
          <div className="drawdown-analysis-panel__metric-value drawdown-analysis-panel__metric-value--large">
            {consecutiveLosses}
          </div>
          <div className="drawdown-analysis-panel__metric-subtitle">
            Max losing streak
          </div>
        </div>

        <div className="drawdown-analysis-panel__metric-card">
          <div className="drawdown-analysis-panel__metric-label">Drawdown Duration</div>
          <div className="drawdown-analysis-panel__metric-value drawdown-analysis-panel__metric-value--large">
            {maxDrawdownDays}
          </div>
          <div className="drawdown-analysis-panel__metric-subtitle">
            Days to recover
          </div>
        </div>
      </div>

      <div className="drawdown-analysis-panel__insights">
        <h4 className="drawdown-analysis-panel__insights-title">Risk Assessment:</h4>
        <div className="drawdown-analysis-panel__insights-content">
          {severity === 'low' && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--positive">
              <strong>Excellent risk management.</strong> Your max drawdown is under 10%, indicating 
              strong position sizing and stop discipline.
            </div>
          )}
          {severity === 'moderate' && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--neutral">
              <strong>Moderate drawdown.</strong> Your max drawdown of {maxDrawdownPercent}% is acceptable 
              but consider tightening stops or reducing position sizes during losing streaks.
            </div>
          )}
          {(severity === 'high' || severity === 'severe') && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--negative">
              <strong>High risk exposure.</strong> A {maxDrawdownPercent}% drawdown suggests position 
              sizing may be too aggressive. Consider implementing stricter risk limits.
            </div>
          )}

          {recoveryStatus === 'excellent' && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--positive">
              <strong>Strong recovery ability.</strong> Your recovery factor of {recoveryFactor}x shows 
              your system can bounce back effectively from losses.
            </div>
          )}
          {recoveryStatus === 'poor' && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--negative">
              <strong>Weak recovery.</strong> Low recovery factor indicates profits barely exceed drawdowns. 
              Focus on improving win rate or R:R ratio.
            </div>
          )}

          {consecutiveLosses >= 5 && (
            <div className="drawdown-analysis-panel__insight drawdown-analysis-panel__insight--warning">
              <strong>Extended losing streak:</strong> {consecutiveLosses} consecutive losses suggests 
              you may need circuit breakers to pause trading after 3-4 losses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
