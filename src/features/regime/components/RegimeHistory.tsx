import React, { useState } from 'react';
import type { MarketRegime } from '../../../shared/types';
import './RegimeHistory.css';

interface RegimeHistoryProps {
  symbol: string;
  data?: Array<MarketRegime & { timestamp: number }>;
  isLoading?: boolean;
}

const REGIME_COLORS = {
  BULL: '#26a69a',
  BEAR: '#ef5350',
  RANGE: '#9e9e9e',
  TRANSITION: '#ff9800',
};

export const RegimeHistory: React.FC<RegimeHistoryProps> = ({
  symbol,
  data = [],
  isLoading = false,
}) => {
  const [selectedRegime, setSelectedRegime] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="regime-history loading">
        <div className="spinner-small"></div>
        <p>Loading regime history...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="regime-history empty">
        <p>No regime history available for {symbol}</p>
      </div>
    );
  }

  // Sort by timestamp descending (most recent first)
  const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getDuration = (current: number, next?: number) => {
    const end = next || Math.floor(Date.now() / 1000);
    const days = Math.floor((end - current) / 86400);
    
    if (days === 0) return 'Less than 1 day';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''}`;
  };

  return (
    <div className="regime-history">
      <h3>Regime History - {symbol}</h3>
      
      <div className="timeline">
        {sortedData.map((regime, index) => {
          const nextRegime = sortedData[index + 1];
          const duration = getDuration(regime.timestamp, nextRegime?.timestamp);
          const isSelected = selectedRegime === index;
          const isCurrent = index === 0;

          return (
            <div 
              key={regime.timestamp}
              className={`timeline-item ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => setSelectedRegime(isSelected ? null : index)}
            >
              <div 
                className="timeline-marker"
                style={{ background: REGIME_COLORS[regime.regime] }}
              >
              </div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4 style={{ color: REGIME_COLORS[regime.regime] }}>
                    {regime.regime.replace('_', ' ')}
                    {isCurrent && <span className="current-badge">Current</span>}
                  </h4>
                  <span className="timeline-date">{formatDate(regime.timestamp)}</span>
                </div>
                
                <div className="timeline-details">
                  <div className="detail-row">
                    <span>Score:</span>
                    <span className="detail-value">{regime.score}/12</span>
                  </div>
                  {regime.confidence !== undefined && (
                    <div className="detail-row">
                      <span>Confidence:</span>
                      <span className="detail-value">{(regime.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span>Duration:</span>
                    <span className="detail-value">{duration}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="timeline-expanded">
                    <div className="factors-grid">
                      <div className="factor">
                        <span className="factor-label">Trend</span>
                        <span className={`factor-val ${regime.factors.trend > 0 ? 'pos' : 'neg'}`}>
                          {regime.factors.trend > 0 ? '↑' : '↓'} {Math.abs(regime.factors.trend).toFixed(1)}
                        </span>
                      </div>
                      <div className="factor">
                        <span className="factor-label">Momentum</span>
                        <span className={`factor-val ${regime.factors.momentum > 0 ? 'pos' : 'neg'}`}>
                          {regime.factors.momentum > 0 ? '↑' : '↓'} {Math.abs(regime.factors.momentum).toFixed(1)}
                        </span>
                      </div>
                      <div className="factor">
                        <span className="factor-label">Volatility</span>
                        <span className="factor-val">{regime.factors.volatility.toFixed(1)}%</span>
                      </div>
                      <div className="factor">
                        <span className="factor-label">Volume</span>
                        <span className={`factor-val ${regime.factors.volumeTrend > 0 ? 'pos' : 'neg'}`}>
                          {regime.factors.volumeTrend > 0 ? '↑' : '↓'} {Math.abs(regime.factors.volumeTrend).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="timeline-time">
                      Changed at {formatTime(regime.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
