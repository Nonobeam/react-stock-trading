import React from 'react';
import { usePerformance } from '../../context/PerformanceContext';
import { PerformanceOverviewCards } from './components/PerformanceOverviewCards';
import { EquityCurveChart } from './components/EquityCurveChart';
import { RMultipleDistribution } from './components/RMultipleDistribution';
import { SetupTypeDistribution } from './components/SetupTypeDistribution';
import { DrawdownAnalysisPanel } from './components/DrawdownAnalysisPanel';
import './PerformanceView.css';

export const PerformanceView: React.FC = () => {
  const { metrics, equityCurve, loading, error, refreshData } = usePerformance();

  if (loading && !metrics) {
    return (
      <div className="performance-view">
        <div className="performance-view__loading">
          <div className="performance-view__spinner"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-view">
        <div className="performance-view__error">
          <h3>Error Loading Performance Data</h3>
          <p>{error}</p>
          <button onClick={refreshData} className="performance-view__retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-view">
      <div className="performance-view__header">
        <h1 className="performance-view__title">Performance Analytics</h1>
        <button 
          onClick={refreshData} 
          className="performance-view__refresh-button"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="performance-view__content">
        {/* Overview metrics */}
        <section className="performance-view__section">
          <PerformanceOverviewCards metrics={metrics} />
        </section>

        {/* Equity curve */}
        <section className="performance-view__section">
          <EquityCurveChart 
            data={equityCurve}
            showBenchmark={false}
          />
        </section>

        {/* Distribution charts in a grid */}
        <section className="performance-view__section performance-view__section--grid">
          <div className="performance-view__grid">
            <div className="performance-view__grid-item">
              <RMultipleDistribution 
                distribution={metrics?.rMultipleDistribution || {}}
              />
            </div>
            <div className="performance-view__grid-item">
              <SetupTypeDistribution 
                distribution={metrics?.setupTypeDistribution || {}}
              />
            </div>
          </div>
        </section>

        {/* Drawdown analysis */}
        <section className="performance-view__section">
          <DrawdownAnalysisPanel metrics={metrics} />
        </section>

        {/* Risk-adjusted metrics */}
        {metrics && (
          <section className="performance-view__section">
            <div className="performance-view__risk-metrics">
              <h3 className="performance-view__section-title">Risk-Adjusted Metrics</h3>
              <div className="performance-view__metrics-grid">
                <div className="performance-view__metric-box">
                  <div className="performance-view__metric-label">Sharpe Ratio</div>
                  <div className="performance-view__metric-value">
                    {metrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="performance-view__metric-description">
                    Return per unit of risk
                  </div>
                </div>
                <div className="performance-view__metric-box">
                  <div className="performance-view__metric-label">Sortino Ratio</div>
                  <div className="performance-view__metric-value">
                    {metrics.sortinoRatio.toFixed(2)}
                  </div>
                  <div className="performance-view__metric-description">
                    Return per unit of downside risk
                  </div>
                </div>
                <div className="performance-view__metric-box">
                  <div className="performance-view__metric-label">Calmar Ratio</div>
                  <div className="performance-view__metric-value">
                    {metrics.calmarRatio.toFixed(2)}
                  </div>
                  <div className="performance-view__metric-description">
                    Annual return / Max drawdown
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
