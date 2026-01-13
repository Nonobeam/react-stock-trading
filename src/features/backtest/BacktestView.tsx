/**
 * BacktestView - Backtest Lab for strategy testing
 */

import { useState } from 'react';
import { useBacktest } from '../../context/BacktestContext';
import type { BacktestConfig } from '../../shared/types/Backtest';
import type { Tab } from '../../shared/components';
import { TabNavigation, EmptyState } from '../../shared/components';
import './BacktestView.css';

export function BacktestView() {
  const { backtests, currentBacktest, isRunning, runBacktest } = useBacktest();
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState<BacktestConfig>({
    id: `backtest-${Date.now()}`,
    name: 'Test Strategy',
    symbols: ['VCB'],
    dateRange: {
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    },
    startingCapital: 100000000, // 100M VND
    setupTypes: ['pullback-20ema'],
    fastEMA: 20,
    slowEMA: 50,
    rsiPeriod: 14,
    atrPeriod: 14,
    minimumScore: 7,
    requireVolumeConfirmation: true,
    requireTrendAlignment: true,
    stopLossMethod: 'atr',
    atrMultiplier: 2.0,
    target1: { rMultiple: 2, exitPercent: 25 },
    target2: { rMultiple: 3, exitPercent: 25 },
    target3: { method: 'trail', value: '20EMA' },
    riskPerTrade: 1.0,
    maxPositions: 6,
    maxAggregateRisk: 6.0,
    commission: 0.0025,
    tax: 0.001,
    slippage: 0.003,
    createdAt: new Date().toISOString(),
  });

  const tabs: Tab[] = [
    { id: 'config', label: 'Configuration' },
    { id: 'results', label: 'Results', count: backtests.length },
  ];

  const handleRunBacktest = async () => {
    await runBacktest(config);
    setActiveTab('results');
  };

  const renderConfig = () => (
    <div className="backtest-config">
      <div className="config-section">
        <h3>Strategy Parameters</h3>
        <div className="config-grid">
          <div className="config-field">
            <label>Symbol</label>
            <input
              type="text"
              value={config.symbols[0] || ''}
              onChange={(e) => setConfig({ ...config, symbols: [e.target.value] })}
            />
          </div>
          <div className="config-field">
            <label>Start Date</label>
            <input
              type="date"
              value={config.dateRange.from}
              onChange={(e) => setConfig({ ...config, dateRange: { ...config.dateRange, from: e.target.value } })}
            />
          </div>
          <div className="config-field">
            <label>End Date</label>
            <input
              type="date"
              value={config.dateRange.to}
              onChange={(e) => setConfig({ ...config, dateRange: { ...config.dateRange, to: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <div className="config-actions">
        <button className="btn-primary" onClick={handleRunBacktest} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Backtest'}
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!currentBacktest) {
      return (
        <EmptyState
          title="No backtest results. Run a backtest to see results."
          action={{ label: 'Configure Backtest', onClick: () => setActiveTab('config') }}
        />
      );
    }

    return (
      <div className="backtest-results">
        <div className="results-summary">
          <div className="metric-card">
            <span className="metric-label">Total Trades</span>
            <span className="metric-value">{currentBacktest.summary.totalTrades}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Win Rate</span>
            <span className="metric-value">{currentBacktest.summary.winRate.toFixed(1)}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Total P/L</span>
            <span className={`metric-value ${currentBacktest.summary.totalReturnVND > 0 ? 'positive' : 'negative'}`}>
              {currentBacktest.summary.totalReturnVND.toLocaleString()} VND
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Sharpe Ratio</span>
            <span className="metric-value">{currentBacktest.summary.sharpeRatio.toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Profit Factor</span>
            <span className="metric-value">{currentBacktest.summary.profitFactor.toFixed(2)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Max Drawdown</span>
            <span className="metric-value negative">
              {currentBacktest.summary.maxDrawdown.toLocaleString()} VND
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="backtest-view">
      <header className="backtest-header">
        <div className="backtest-title-group">
          <h1 className="backtest-title">Backtest Lab</h1>
          <p className="backtest-subtitle">Test trading strategies on historical data</p>
        </div>
      </header>

      <div className="backtest-content">
        <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="backtest-main">
          {activeTab === 'config' && renderConfig()}
          {activeTab === 'results' && renderResults()}
        </div>
      </div>
    </div>
  );
}
