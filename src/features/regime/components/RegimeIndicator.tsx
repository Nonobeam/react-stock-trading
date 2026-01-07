import React from 'react';
import type { MarketRegime } from '../../../shared/types';
import './RegimeIndicator.css';

interface RegimeIndicatorProps {
  regime: MarketRegime | null;
  isLoading?: boolean;
  compact?: boolean;
}

const REGIME_CONFIG = {
  BULL: {
    label: 'Bull Market',
    color: '#26a69a',
    description: 'Strong upward trend with increasing momentum'
  },
  BEAR: {
    label: 'Bear Market',
    color: '#ef5350',
    description: 'Strong downward trend with declining prices'
  },
  RANGE: {
    label: 'Range Bound',
    color: '#9e9e9e',
    description: 'Sideways movement within defined boundaries'
  },
  TRANSITION: {
    label: 'Transition',
    color: '#ff9800',
    description: 'Market shifting between regimes'
  },
};

const getRegimeStrength = (score: number): { label: string; percentage: number } => {
  // Score is 3-12, normalize to 0-100%
  const normalized = ((score - 3) / 9) * 100;
  
  if (score >= 10) return { label: 'Very Strong', percentage: normalized };
  if (score >= 8) return { label: 'Strong', percentage: normalized };
  if (score >= 6) return { label: 'Moderate', percentage: normalized };
  if (score >= 4) return { label: 'Weak', percentage: normalized };
  return { label: 'Very Weak', percentage: normalized };
};

export const RegimeIndicator: React.FC<RegimeIndicatorProps> = ({
  regime,
  isLoading = false,
  compact = false,
}) => {
  if (isLoading) {
    return (
      <div className={`regime-indicator ${compact ? 'compact' : ''} loading`}>
        <div className="spinner-small"></div>
        <span>Loading regime...</span>
      </div>
    );
  }

  if (!regime) {
    return (
      <div className={`regime-indicator ${compact ? 'compact' : ''} empty`}>
        <span>No regime data</span>
      </div>
    );
  }

  const config = REGIME_CONFIG[regime.regime];
  const strength = getRegimeStrength(regime.score);
  const timeSinceChange = regime.changeDate 
    ? Math.floor((Date.now() / 1000 - regime.changeDate) / 86400)
    : null;

  if (compact) {
    return (
      <div 
        className="regime-indicator compact"
        style={{ borderLeftColor: config.color }}
      >
        <span className="regime-dot" style={{ backgroundColor: config.color }}></span>
        <div className="regime-info">
          <span className="regime-label" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="regime-score">Score: {regime.score}/12</span>
        </div>
      </div>
    );
  }

  return (
    <div className="regime-indicator" style={{ borderColor: config.color }}>
      <div className="regime-header">
        <div className="regime-title">
          <span className="regime-dot regime-dot--large" style={{ backgroundColor: config.color }}></span>
          <div>
            <h3 style={{ color: config.color }}>{config.label}</h3>
            <p className="regime-description">{config.description}</p>
          </div>
        </div>
        <div className="regime-score-badge" style={{ background: config.color }}>
          {regime.score}/12
        </div>
      </div>

      <div className="regime-strength">
        <div className="strength-label">
          <span>Strength:</span>
          <span className="strength-value">{strength.label}</span>
        </div>
        <div className="strength-bar">
          <div 
            className="strength-fill"
            style={{ 
              width: `${strength.percentage}%`,
              background: config.color 
            }}
          />
        </div>
      </div>

      {regime.confidence !== undefined && (
        <div className="regime-confidence">
          <span className="confidence-label">Confidence:</span>
          <span className="confidence-value">{(regime.confidence * 100).toFixed(0)}%</span>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ 
                width: `${regime.confidence * 100}%`,
                background: config.color 
              }}
            />
          </div>
        </div>
      )}

      <div className="regime-factors">
        <div className="factor-item">
          <span className="factor-label">Trend:</span>
          <span className={`factor-value ${regime.factors.trend > 0 ? 'positive' : 'negative'}`}>
            {regime.factors.trend > 0 ? '↑' : '↓'} {Math.abs(regime.factors.trend).toFixed(1)}
          </span>
        </div>
        <div className="factor-item">
          <span className="factor-label">Momentum:</span>
          <span className={`factor-value ${regime.factors.momentum > 0 ? 'positive' : 'negative'}`}>
            {regime.factors.momentum > 0 ? '↑' : '↓'} {Math.abs(regime.factors.momentum).toFixed(1)}
          </span>
        </div>
        <div className="factor-item">
          <span className="factor-label">Volatility:</span>
          <span className="factor-value">{regime.factors.volatility.toFixed(1)}%</span>
        </div>
        <div className="factor-item">
          <span className="factor-label">Volume Trend:</span>
          <span className={`factor-value ${regime.factors.volumeTrend > 0 ? 'positive' : 'negative'}`}>
            {regime.factors.volumeTrend > 0 ? '↑' : '↓'} {Math.abs(regime.factors.volumeTrend).toFixed(1)}
          </span>
        </div>
      </div>

      {timeSinceChange !== null && (
        <div className="regime-duration">
          <span className="duration-icon">⏱️</span>
          <span>
            Regime active for <strong>{timeSinceChange}</strong> day{timeSinceChange !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
