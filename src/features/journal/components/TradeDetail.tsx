/**
 * TradeDetail - Display detailed trade information with tabs
 */

import { useState } from 'react';
import type { Trade } from '../../../shared/types/Trade';
import { TabNavigation } from '../../../shared/components';
import type { Tab } from '../../../shared/components';
import './TradeDetail.css';

interface TradeDetailProps {
  trade: Trade;
  onClose: () => void;
}

export function TradeDetail({ trade, onClose }: TradeDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'setup', label: 'Setup' },
    { id: 'execution', label: 'Execution' },
    { id: 'notes', label: 'Notes' },
    { id: 'analysis', label: 'Analysis' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const renderOverview = () => (
    <div className="tab-content">
      <div className="detail-section">
        <h4>Financial Summary</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Gross P/L</span>
            <span className={`detail-value ${trade.grossProfit && trade.grossProfit > 0 ? 'positive' : 'negative'}`}>
              {trade.grossProfit ? formatCurrency(trade.grossProfit) : '-'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Commission</span>
            <span className="detail-value">{formatCurrency(trade.commission || 0)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tax</span>
            <span className="detail-value">{formatCurrency(trade.tax || 0)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Net P/L</span>
            <span className={`detail-value ${trade.netProfit && trade.netProfit > 0 ? 'positive' : 'negative'}`}>
              {trade.netProfit ? formatCurrency(trade.netProfit) : '-'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">R Multiple</span>
            <span className="detail-value">{trade.rMultiple ? trade.rMultiple.toFixed(2) + 'R' : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">ROI</span>
            <span className={`detail-value ${trade.returnPercent && trade.returnPercent > 0 ? 'positive' : 'negative'}`}>
              {trade.returnPercent ? trade.returnPercent.toFixed(2) + '%' : '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h4>Entry Details</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Price</span>
            <span className="detail-value">{formatCurrency(trade.entry.price)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Quantity</span>
            <span className="detail-value">{trade.entry.quantity.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Side</span>
            <span className={`side-badge ${trade.entry.side}`}>{trade.entry.side}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time</span>
            <span className="detail-value">{formatDate(trade.entry.timestamp)}</span>
          </div>
        </div>
      </div>

      {trade.exit && (
        <div className="detail-section">
          <h4>Exit Details</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Price</span>
              <span className="detail-value">{formatCurrency(trade.exit.price)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantity</span>
              <span className="detail-value">{trade.exit.quantity.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Reason</span>
              <span className="detail-value">{trade.exit.reason}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{formatDate(trade.exit.timestamp)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSetup = () => (
    <div className="tab-content">
      <div className="detail-section">
        <h4>Trade Setup</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Setup Name</span>
            <span className="detail-value">{trade.setup.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Timeframe</span>
            <span className="detail-value">{trade.setup.timeframe}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Regime</span>
            <span className="detail-value">{trade.setup.regime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Quality</span>
            <span className="detail-value">{trade.setup.quality}/5</span>
          </div>
        </div>
        {trade.setup.description && (
          <div className="detail-description">
            <p>{trade.setup.description}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExecution = () => (
    <div className="tab-content">
      <div className="detail-section">
        <h4>Risk Management</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Stop Loss</span>
            <span className="detail-value">{trade.stopLoss ? formatCurrency(trade.stopLoss) : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Take Profit</span>
            <span className="detail-value">{trade.takeProfit ? formatCurrency(trade.takeProfit) : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Position Size</span>
            <span className="detail-value">{formatCurrency(trade.entry.price * trade.entry.quantity)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Risk Amount</span>
            <span className="detail-value">{trade.riskAmount ? formatCurrency(trade.riskAmount) : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="tab-content">
      <div className="detail-section">
        <h4>Trade Notes</h4>
        {trade.notes ? (
          <div className="detail-notes">
            <p>{trade.notes}</p>
          </div>
        ) : (
          <p className="detail-empty">No notes added</p>
        )}
      </div>
      {trade.tags && trade.tags.length > 0 && (
        <div className="detail-section">
          <h4>Tags</h4>
          <div className="detail-tags">
            {trade.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalysis = () => (
    <div className="tab-content">
      <div className="detail-section">
        <h4>Performance Analysis</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Hold Time</span>
            <span className="detail-value">
              {trade.exit
                ? `${Math.round((new Date(trade.exit.timestamp).getTime() - new Date(trade.entry.timestamp).getTime()) / (1000 * 60 * 60))} hours`
                : 'Open'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={`status-badge ${trade.exit ? 'closed' : 'open'}`}>
              {trade.exit ? 'Closed' : 'Open'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'setup':
        return renderSetup();
      case 'execution':
        return renderExecution();
      case 'notes':
        return renderNotes();
      case 'analysis':
        return renderAnalysis();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="trade-detail">
      <div className="trade-detail-header">
        <div className="trade-detail-title-group">
          <h2>{trade.symbol}</h2>
          <p className="trade-detail-subtitle">Trade Details</p>
        </div>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="trade-detail-content">{renderContent()}</div>
    </div>
  );
}
