import React from 'react';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import type { Setup } from '../../../services/mock/setups';
import './SetupCard.css';

interface SetupCardProps {
  setup: Setup;
  onClick: (setup: Setup) => void;
}

export const SetupCard: React.FC<SetupCardProps> = ({ setup, onClick }) => {
  const getStatusVariant = (status: Setup['status']) => {
    switch (status) {
      case 'triggered': return 'success';
      case 'invalidated': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <Card className="setup-card" variant="hoverable" onClick={() => onClick(setup)}>
      <div className="setup-card__header">
        <div>
          <div className="setup-card__symbol">{setup.symbol}</div>
          <div className="setup-card__pattern">{setup.pattern}</div>
        </div>
        <Badge variant={getStatusVariant(setup.status)}>
          {setup.status.toUpperCase()}
        </Badge>
      </div>

      <div className="setup-card__price-row">
        <div className="setup-card__price-item">
          <span className="setup-card__price-label">Current</span>
          <span className="setup-card__price-value">{setup.currentPrice.toLocaleString()}</span>
        </div>
        <div className="setup-card__price-item">
          <span className="setup-card__price-label">Entry</span>
          <span className="setup-card__price-value">{setup.entryPrice.toLocaleString()}</span>
        </div>
        <div className="setup-card__price-item">
          <span className="setup-card__price-label">Stop</span>
          <span className="setup-card__price-value">{setup.stopPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="setup-card__metrics">
        <div className="setup-card__metric">
          <span className="setup-card__metric-label">R:R Ratio</span>
          <span className="setup-card__metric-value text-accent">{setup.riskRewardRatio}:1</span>
        </div>
        <div className="setup-card__metric">
          <span className="setup-card__metric-label">Potential</span>
          <span className="setup-card__metric-value text-success">+{setup.potentialGainPercent}%</span>
        </div>
      </div>

      <div className="setup-card__score-section">
        <div className="setup-card__score-bar">
          <div 
            className="setup-card__score-fill" 
            style={{ width: `${setup.score * 10}%` }}
          ></div>
        </div>
        <div className="setup-card__score-text">{setup.score}/10</div>
      </div>

      <div className="setup-card__footer">
        <span>{setup.timeframe} Chart</span>
        <span>Added {new Date(setup.addedDate).toLocaleDateString()}</span>
      </div>
    </Card>
  );
};
