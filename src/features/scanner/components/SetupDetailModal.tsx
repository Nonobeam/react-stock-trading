import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { Scorecard13Point } from './Scorecard13Point';
import type { Setup } from '../../../services/mock/setups';

interface SetupDetailModalProps {
  setup: Setup;
  isOpen: boolean;
  onClose: () => void;
}

export const SetupDetailModal: React.FC<SetupDetailModalProps> = ({ 
  setup, 
  isOpen, 
  onClose 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${setup.symbol} - ${setup.pattern} (${setup.timeframe})`}
      size="large"
    >
      <div className="signal-detail">
        <div className="signal-detail__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Setup Information</h3>
            <Button variant="primary" size="small" onClick={() => alert('Navigating to Risk Planner...')}>
              Plan Trade
            </Button>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Current Price:</span>
              <span className="value">{setup.currentPrice.toLocaleString()} VND</span>
            </div>
            <div className="detail-item">
              <span className="label">Entry Zone:</span>
              <span className="value">{setup.entryPrice.toLocaleString()} VND</span>
            </div>
            <div className="detail-item">
              <span className="label">Stop Loss:</span>
              <span className="value">{setup.stopPrice.toLocaleString()} VND</span>
            </div>
            <div className="detail-item">
              <span className="label">Target:</span>
              <span className="value">{setup.targetPrice.toLocaleString()} VND</span>
            </div>
            <div className="detail-item">
              <span className="label">Risk/Reward:</span>
              <span className="value text-accent">{setup.riskRewardRatio}:1</span>
            </div>
            <div className="detail-item">
              <span className="label">Potential:</span>
              <span className="value text-success">{setup.potentialGainPercent}%</span>
            </div>
          </div>
        </div>

        <div className="signal-detail__section">
          <Scorecard13Point setup={setup} />
        </div>

        <div className="signal-detail__section">
          <h3>Technical Analysis</h3>
          <div className="signal-reason">
            <p><strong>Pattern:</strong> {setup.pattern}</p>
            <p><strong>Notes:</strong> {setup.notes}</p>
            <div style={{ marginTop: 'var(--gap-3)', display: 'flex', gap: 'var(--gap-2)' }}>
              <Badge variant="info">LIQUIDITY PASS</Badge>
              <Badge variant="info">VOLATILITY NORMAL</Badge>
              <Badge variant="info">{setup.timeframe} TIMEFRAME</Badge>
            </div>
          </div>
        </div>

        <div className="signal-detail__section">
          <h3>Timing</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Added to Scanner:</span>
              <span className="value">{new Date(setup.addedDate).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Last Price Update:</span>
              <span className="value">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
