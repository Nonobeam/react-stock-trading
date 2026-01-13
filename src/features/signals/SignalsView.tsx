import React, { useState } from 'react';
import { useSetups } from '../../context/SetupsContext';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Signal } from '../../services/mock/setups';
import './SignalsView.css';

export const SignalsView: React.FC = () => {
  const { isLoading, filterSignals } = useSetups();
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [typeFilter, setTypeFilter] = useState<Signal['signalType'] | 'all'>('all');
  const [strengthFilter, setStrengthFilter] = useState<Signal['strength'] | 'all'>('all');

  if (isLoading) {
    return (
      <div className="signals">
        <LoadingSkeleton variant="card" height="500px" />
      </div>
    );
  }

  const filteredSignals = filterSignals(
    typeFilter === 'all' ? undefined : typeFilter,
    strengthFilter === 'all' ? undefined : strengthFilter
  );

  const getSignalBadgeVariant = (type: Signal['signalType']) => {
    return type === 'buy' ? 'success' : type === 'sell' ? 'danger' : 'neutral';
  };

  const getStrengthBadgeVariant = (strength: Signal['strength']) => {
    return strength === 'strong' ? 'success' : strength === 'moderate' ? 'warning' : 'neutral';
  };

  return (
    <div className="signals">
      <div className="signals__header">
        <div>
          <h1>Trading Signals</h1>
          <p className="signals__subtitle">AI-generated trading signals based on technical analysis</p>
        </div>
        <div className="signals__filters">
          <div className="filter-group">
            <label>Type:</label>
            <Button
              variant={typeFilter === 'all' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setTypeFilter('all')}
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'buy' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setTypeFilter('buy')}
            >
              Buy
            </Button>
            <Button
              variant={typeFilter === 'sell' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setTypeFilter('sell')}
            >
              Sell
            </Button>
            <Button
              variant={typeFilter === 'watch' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setTypeFilter('watch')}
            >
              Watch
            </Button>
          </div>
          <div className="filter-group">
            <label>Strength:</label>
            <Button
              variant={strengthFilter === 'all' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setStrengthFilter('all')}
            >
              All
            </Button>
            <Button
              variant={strengthFilter === 'strong' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setStrengthFilter('strong')}
            >
              Strong
            </Button>
            <Button
              variant={strengthFilter === 'moderate' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setStrengthFilter('moderate')}
            >
              Moderate
            </Button>
            <Button
              variant={strengthFilter === 'weak' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setStrengthFilter('weak')}
            >
              Weak
            </Button>
          </div>
        </div>
      </div>

      <div className="signals__grid">
        {filteredSignals.length === 0 ? (
          <EmptyState
            title="No Signals Found"
            message="No trading signals match your current filters."
          />
        ) : (
          filteredSignals.map((signal) => (
            <Card
              key={signal.id}
              className="signal-card"
              variant="hoverable"
              onClick={() => setSelectedSignal(signal)}
            >
              <div className="signal-card__header">
                <div>
                  <div className="signal-card__symbol">{signal.symbol}</div>
                  <div className="signal-card__name">{signal.name}</div>
                </div>
                <div className="signal-card__badges">
                  <Badge variant={getSignalBadgeVariant(signal.signalType)}>
                    {signal.signalType.toUpperCase()}
                  </Badge>
                  <Badge variant={getStrengthBadgeVariant(signal.strength)} size="small">
                    {signal.strength}
                  </Badge>
                </div>
              </div>

              <div className="signal-card__price">
                <span className="label">Price:</span>
                <span className="value">{signal.currentPrice.toLocaleString()} VND</span>
              </div>

              <div className="signal-card__score">
                <span className="label">Signal Score:</span>
                <div className="score-bar">
                  <div 
                    className="score-bar__fill" 
                    style={{ width: `${signal.score * 10}%` }}
                  ></div>
                </div>
                <span className="score-value">{signal.score}/10</span>
              </div>

              <div className="signal-card__indicators">
                {signal.indicators.slice(0, 3).map((indicator, idx) => (
                  <Badge key={idx} variant="neutral" size="small">
                    {indicator}
                  </Badge>
                ))}
              </div>

              <div className="signal-card__time">
                Generated {new Date(signal.generatedAt).toLocaleTimeString()}
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedSignal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSignal(null)}
          title={`${selectedSignal.symbol} - ${selectedSignal.name}`}
          size="large"
        >
          <div className="signal-detail">
            <div className="signal-detail__section">
              <h3>Signal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <Badge variant={getSignalBadgeVariant(selectedSignal.signalType)}>
                    {selectedSignal.signalType.toUpperCase()}
                  </Badge>
                </div>
                <div className="detail-item">
                  <span className="label">Strength:</span>
                  <Badge variant={getStrengthBadgeVariant(selectedSignal.strength)}>
                    {selectedSignal.strength.toUpperCase()}
                  </Badge>
                </div>
                <div className="detail-item">
                  <span className="label">Score:</span>
                  <span className="value">{selectedSignal.score}/10</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current Price:</span>
                  <span className="value">{selectedSignal.currentPrice.toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            <div className="signal-detail__section">
              <h3>Technical Indicators</h3>
              <div className="indicators-list">
                {selectedSignal.indicators.map((indicator, idx) => (
                  <Badge key={idx} variant="info">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="signal-detail__section">
              <h3>Analysis</h3>
              <div className="signal-reason">{selectedSignal.reason}</div>
            </div>

            <div className="signal-detail__section">
              <h3>Timing</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Generated:</span>
                  <span className="value">{new Date(selectedSignal.generatedAt).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Expires:</span>
                  <span className="value">{new Date(selectedSignal.expiresAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};