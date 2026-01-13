/**
 * JournalView - Trading journal for recording and analyzing trades
 */

import { useState } from 'react';
import { useTrades } from '../../context/TradesContext';
import { TabNavigation, EmptyState } from '../../shared/components';
import type { Tab } from '../../shared/components';
import { TradesList } from './components/TradesList';
import { TradeDetail } from './components/TradeDetail';
import { TradeEntryModal } from './components/TradeEntryModal';
import { PerformanceSummary } from './components/PerformanceSummary';
import './JournalView.css';

export function JournalView() {
  const { trades, isLoading } = useTrades();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const tabs: Tab[] = [
    { id: 'all', label: 'All Trades', count: trades.length },
    { id: 'open', label: 'Open', count: trades.filter((t) => !t.exit).length },
    { id: 'closed', label: 'Closed', count: trades.filter((t) => t.exit).length },
    { id: 'winning', label: 'Winners', count: trades.filter((t) => t.exit && t.netProfit && t.netProfit > 0).length },
    { id: 'losing', label: 'Losers', count: trades.filter((t) => t.exit && t.netProfit && t.netProfit < 0).length },
  ];

  const getFilteredTrades = () => {
    switch (activeTab) {
      case 'open':
        return trades.filter((t) => !t.exit);
      case 'closed':
        return trades.filter((t) => t.exit);
      case 'winning':
        return trades.filter((t) => t.exit && t.netProfit && t.netProfit > 0);
      case 'losing':
        return trades.filter((t) => t.exit && t.netProfit && t.netProfit < 0);
      default:
        return trades;
    }
  };

  const filteredTrades = getFilteredTrades();
  const selectedTrade = selectedTradeId ? trades.find((t) => t.id === selectedTradeId) : null;

  if (isLoading) {
    return (
      <div className="journal-view">
        <div className="journal-loading">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="journal-view">
      <header className="journal-header">
        <div className="journal-title-group">
          <h1 className="journal-title">Trading Journal</h1>
          <p className="journal-subtitle">Track and analyze your trading performance</p>
        </div>
        <div className="journal-actions">
          <button className="btn-export" onClick={() => {}}>
            Export
          </button>
          <button className="btn-primary" onClick={() => setIsEntryModalOpen(true)}>
            Add Trade
          </button>
        </div>
      </header>

      <PerformanceSummary trades={filteredTrades} />

      <div className="journal-content">
        <div className="journal-tabs">
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="journal-main">
          <div className="trades-list-container">
            {filteredTrades.length === 0 ? (
              <EmptyState
                title={
                  activeTab === 'all'
                    ? 'No trades recorded. Start recording your trades to build a comprehensive journal.'
                    : `No ${activeTab} trades found.`
                }
                action={{
                  label: 'Add Trade',
                  onClick: () => setIsEntryModalOpen(true),
                }}
              />
            ) : (
              <TradesList
                trades={filteredTrades}
                selectedTradeId={selectedTradeId}
                onSelectTrade={setSelectedTradeId}
              />
            )}
          </div>

          {selectedTrade && (
            <div className="trade-detail-container">
              <TradeDetail trade={selectedTrade} onClose={() => setSelectedTradeId(null)} />
            </div>
          )}
        </div>
      </div>

      {isEntryModalOpen && (
        <TradeEntryModal onClose={() => setIsEntryModalOpen(false)} />
      )}
    </div>
  );
}
