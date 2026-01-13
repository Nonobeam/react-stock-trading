/**
 * TradesList - Display list of trades with search and filters
 */

import type { Trade } from '../../../shared/types/Trade';
import './TradesList.css';

interface TradesListProps {
  trades: Trade[];
  selectedTradeId: string | null;
  onSelectTrade: (tradeId: string) => void;
}

export function TradesList({ trades, selectedTradeId, onSelectTrade }: TradesListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="trades-list">
      <div className="trades-list-header">
        <h3>Trades ({trades.length})</h3>
      </div>
      <div className="trades-list-content">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className={`trade-item ${selectedTradeId === trade.id ? 'selected' : ''}`}
            onClick={() => onSelectTrade(trade.id)}
          >
            <div className="trade-item-header">
              <div className="trade-symbol">{trade.symbol}</div>
              <div
                className={`trade-pnl ${
                  trade.netProfit
                    ? trade.netProfit > 0
                      ? 'positive'
                      : 'negative'
                    : ''
                }`}
              >
                {trade.netProfit ? formatCurrency(trade.netProfit) : '-'}
              </div>
            </div>
            <div className="trade-item-details">
              <div className="trade-setup">{trade.setup.name}</div>
              <div className="trade-date">{formatDate(trade.entry.timestamp)}</div>
            </div>
            <div className="trade-item-footer">
              <div className="trade-side">
                <span className={`side-badge ${trade.entry.side}`}>
                  {trade.entry.side}
                </span>
              </div>
              <div className="trade-status">
                <span className={`status-badge ${trade.exit ? 'closed' : 'open'}`}>
                  {trade.exit ? 'Closed' : 'Open'}
                </span>
              </div>
            </div>
            {trade.tags && trade.tags.length > 0 && (
              <div className="trade-tags">
                {trade.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
