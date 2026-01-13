import React from 'react';
import type { TradeSetup } from '../../../shared/types';
import './SetupDetailDrawer.css';

interface SetupDetailDrawerProps {
  setup: TradeSetup;
  onClose: () => void;
  onPlanTrade?: (setup: TradeSetup) => void;
}

const SetupDetailDrawer: React.FC<SetupDetailDrawerProps> = ({
  setup,
  onClose,
  onPlanTrade,
}) => {
  const getRiskPercent = () => {
    return (((setup.entry - setup.stop) / setup.entry) * 100).toFixed(2);
  };

  const getRewardPercent = () => {
    if (setup.targets.length === 0) return 'N/A';
    return (((setup.targets[0] - setup.entry) / setup.entry) * 100).toFixed(2);
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="setup-drawer">
        <div className="drawer-header">
          <div>
            <h2>{setup.symbol}</h2>
            <span className="setup-type-badge">{setup.setupType.replace('_', ' ')}</span>
          </div>
          <button className="drawer-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="drawer-body">
          {/* Score Summary */}
          <div className="drawer-section">
            <h3>Score Summary</h3>
            <div className="score-grid">
              <div className="score-item">
                <span className="score-label">Total Score</span>
                <span className="score-value-large">{setup.score} / 13</span>
              </div>
              <div className="score-item">
                <span className="score-label">Confidence</span>
                <span className={`confidence-badge ${setup.confidence}`}>
                  {setup.confidence}
                </span>
              </div>
            </div>
          </div>

          {/* Price Levels */}
          <div className="drawer-section">
            <h3>Price Levels</h3>
            <div className="price-table">
              <div className="price-row">
                <span className="price-label">Entry:</span>
                <span className="price-value">{setup.entry.toLocaleString()} VND</span>
              </div>
              <div className="price-row">
                <span className="price-label">Stop Loss:</span>
                <span className="price-value price-stop">
                  {setup.stop.toLocaleString()} VND
                  <span className="price-percent">({getRiskPercent()}%)</span>
                </span>
              </div>
              {setup.targets.map((target, idx) => (
                <div key={idx} className="price-row">
                  <span className="price-label">Target {idx + 1}:</span>
                  <span className="price-value price-target">
                    {target.toLocaleString()} VND
                    {idx === 0 && (
                      <span className="price-percent">(+{getRewardPercent()}%)</span>
                    )}
                  </span>
                </div>
              ))}
              <div className="price-row highlight">
                <span className="price-label">Risk:Reward:</span>
                <span className="price-value">1:{setup.riskRewardRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Setup Narrative */}
          <div className="drawer-section">
            <h3>Setup Narrative</h3>
            <p className="narrative-text">{setup.narrative}</p>
          </div>

          {/* Triggers */}
          {setup.triggers && setup.triggers.length > 0 && (
            <div className="drawer-section">
              <h3>Entry Triggers</h3>
              <ul className="triggers-list">
                {setup.triggers.map((trigger, idx) => (
                  <li key={idx} className="trigger-item">
                    <span className="trigger-icon">✓</span>
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="drawer-section">
            <h3>Score Details</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span className="breakdown-label">Trend</span>
                <span className="breakdown-value">
                  {setup.scoreBreakdown.trend} / 3
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Setup</span>
                <span className="breakdown-value">
                  {setup.scoreBreakdown.setup} / 3
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Momentum</span>
                <span className="breakdown-value">
                  {setup.scoreBreakdown.momentum} / 2
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">R:R</span>
                <span className="breakdown-value">
                  {setup.scoreBreakdown.riskReward} / 2
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Context</span>
                <span className="breakdown-value">
                  {setup.scoreBreakdown.context} / 3
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {onPlanTrade && (
            <div className="drawer-actions">
              <button
                className="plan-trade-btn"
                onClick={() => onPlanTrade(setup)}
              >
                Plan Trade →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SetupDetailDrawer;
