import React, { useState, useEffect } from 'react';
import { RegimeIndicator } from './components/RegimeIndicator';
import { RegimeHistory } from './components/RegimeHistory';
import { RegimeAlerts } from './components/RegimeAlerts';
import { useRegimeData } from '../../shared/hooks/useRegimeData';
import './RegimeView.css';

interface RegimeViewProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
}

export const RegimeView: React.FC<RegimeViewProps> = ({
  symbol,
  // onSymbolChange, // Reserved for future use when adding symbol picker UI
}) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const { currentRegime, regimeHistory, isLoading, error, fetchRegime, fetchHistory } = useRegimeData();

  // Initial data load
  useEffect(() => {
    fetchRegime(symbol);
    fetchHistory(symbol, 90); // Last 90 days
  }, [symbol, fetchRegime, fetchHistory]);

  // Auto-refresh regime every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRegime(symbol);
    }, 60000);

    return () => clearInterval(interval);
  }, [symbol, fetchRegime]);

  // Simulate regime change detection for alerts
  useEffect(() => {
    if (currentRegime && regimeHistory.length > 0) {
      const latestHistory = regimeHistory[0];
      if (latestHistory.regime !== currentRegime.regime) {
        // New regime detected, create alert
        const newAlert = {
          id: `${Date.now()}-${symbol}`,
          timestamp: Math.floor(Date.now() / 1000),
          symbol,
          previousRegime: latestHistory.regime,
          newRegime: currentRegime.regime,
          score: currentRegime.score,
          confidence: currentRegime.confidence,
          read: false,
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }
  }, [currentRegime, regimeHistory, symbol]);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleDismissAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="regime-view">
      <div className="regime-header">
        <div>
          <h2>Market Regime Analysis</h2>
          <p className="regime-subtitle">
            Understanding current market conditions for <strong>{symbol}</strong>
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="regime-grid">
        <div className="regime-main">
          <RegimeIndicator 
            regime={currentRegime} 
            isLoading={isLoading}
          />
        </div>

        <div className="regime-sidebar">
          <RegimeAlerts
            alerts={alerts}
            onDismiss={handleDismissAlert}
            onDismissAll={handleDismissAllAlerts}
            maxDisplay={3}
          />
        </div>
      </div>

      <div className="regime-history-section">
        <RegimeHistory
          symbol={symbol}
          data={regimeHistory}
          isLoading={isLoading}
        />
      </div>

      <div className="regime-info-panel">
        <h3>Understanding Market Regimes</h3>
        <div className="info-grid">
          <div className="info-card">
            <span className="regime-indicator regime-indicator--bullish"></span>
            <h4>Bull Market</h4>
            <p>Strong upward trend with increasing momentum. Prices consistently making higher highs and higher lows.</p>
          </div>
          <div className="info-card">
            <span className="regime-indicator regime-indicator--bearish"></span>
            <h4>Bear Market</h4>
            <p>Strong downward trend with declining prices. Characterized by lower highs and lower lows with negative momentum.</p>
          </div>
          <div className="info-card">
            <span className="regime-indicator regime-indicator--ranging"></span>
            <h4>Range Bound</h4>
            <p>Sideways movement within defined support and resistance levels. Low directional momentum.</p>
          </div>
          <div className="info-card">
            <span className="regime-indicator regime-indicator--transition"></span>
            <h4>Transition</h4>
            <p>Market shifting between regimes. Mixed signals with increasing uncertainty and volatility.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
