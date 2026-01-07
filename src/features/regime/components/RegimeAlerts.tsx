import React, { useState, useEffect } from 'react';
import type { MarketRegimeType } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import './RegimeAlerts.css';

interface RegimeAlert {
  id: string;
  timestamp: number;
  symbol: string;
  previousRegime: MarketRegimeType;
  newRegime: MarketRegimeType;
  score: number;
  confidence?: number;
  read: boolean;
}

interface RegimeAlertsProps {
  alerts: RegimeAlert[];
  onDismiss?: (id: string) => void;
  onDismissAll?: () => void;
  maxDisplay?: number;
}

const REGIME_LABELS = {
  BULL: 'Bull Market',
  BEAR: 'Bear Market',
  RANGE: 'Range Bound',
  TRANSITION: 'Transition',
};

export const RegimeAlerts: React.FC<RegimeAlertsProps> = ({
  alerts,
  onDismiss,
  onDismissAll,
  maxDisplay = 5,
}) => {
  const [displayedAlerts, setDisplayedAlerts] = useState<RegimeAlert[]>([]);

  useEffect(() => {
    // Sort by timestamp descending and limit display
    const sorted = [...alerts]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxDisplay);
    setDisplayedAlerts(sorted);
  }, [alerts, maxDisplay]);

  const handleDismiss = (id: string) => {
    if (onDismiss) {
      onDismiss(id);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getAlertClass = (newRegime: MarketRegimeType) => {
    switch (newRegime) {
      case 'BULL': return 'alert-bull';
      case 'BEAR': return 'alert-bear';
      case 'TRANSITION': return 'alert-transition';
      default: return 'alert-range';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="regime-alerts empty">
        <div className="empty-state">
          <p>No regime change alerts</p>
          <small>You'll be notified when market regimes change</small>
        </div>
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="regime-alerts">
      <div className="alerts-header">
        <h3>
          Regime Change Alerts
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h3>
        {onDismissAll && alerts.length > 0 && (
          <button onClick={onDismissAll} className="dismiss-all-btn">
            Clear All
          </button>
        )}
      </div>

      <div className="alerts-list">
        {displayedAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`alert-item ${getAlertClass(alert.newRegime)} ${alert.read ? 'read' : 'unread'}`}
          >
            <div className="alert-badge">
              <Badge variant={
                alert.newRegime === 'BULL' ? 'success' :
                alert.newRegime === 'BEAR' ? 'danger' :
                alert.newRegime === 'TRANSITION' ? 'warning' : 'neutral'
              } size="small">
                {REGIME_LABELS[alert.newRegime]}
              </Badge>
            </div>
            
            <div className="alert-content">
              <div className="alert-title">
                <strong>{alert.symbol}</strong> changed to {REGIME_LABELS[alert.newRegime]}
              </div>
              
              <div className="alert-details">
                <span className="alert-transition">
                  {REGIME_LABELS[alert.previousRegime]}
                  {' → '}
                  {REGIME_LABELS[alert.newRegime]}
                </span>
                <span className="alert-score">Score: {alert.score}/12</span>
                {alert.confidence !== undefined && (
                  <span className="alert-confidence">
                    Confidence: {(alert.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              
              <div className="alert-time">{formatTimeAgo(alert.timestamp)}</div>
            </div>

            {onDismiss && (
              <button
                className="dismiss-btn"
                onClick={() => handleDismiss(alert.id)}
                aria-label="Dismiss alert"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {alerts.length > maxDisplay && (
        <div className="alerts-footer">
          <span>Showing {maxDisplay} of {alerts.length} alerts</span>
        </div>
      )}
    </div>
  );
};
