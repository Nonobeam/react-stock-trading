import React, { useState } from 'react';
import { useSetups } from '../../context/SetupsContext';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Table, type TableColumn } from '../../shared/components/Table';
import { Modal } from '../../shared/components/Modal';
import { Button } from '../../shared/components/Button';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Setup } from '../../services/mock/setups';
import './WatchlistView.css';

export const WatchlistView: React.FC = () => {
  const { setups, isLoading, filterSetups } = useSetups();
  const [selectedSetup, setSelectedSetup] = useState<Setup | null>(null);
  const [statusFilter, setStatusFilter] = useState<Setup['status'] | 'all'>('all');

  if (isLoading) {
    return (
      <div className="watchlist">
        <LoadingSkeleton variant="card" height="500px" />
      </div>
    );
  }

  const filteredSetups = statusFilter === 'all' ? setups : filterSetups(statusFilter);

  const columns: TableColumn<Setup>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      sortable: true,
      render: (setup) => (
        <div className="symbol-cell">
          <span className="symbol-name">{setup.symbol}</span>
          <span className="symbol-exchange">{setup.exchange}</span>
        </div>
      ),
    },
    {
      key: 'currentPrice',
      header: 'Price',
      sortable: true,
      align: 'right',
      render: (setup) => setup.currentPrice.toLocaleString(),
    },
    {
      key: 'pattern',
      header: 'Pattern',
      sortable: true,
      render: (setup) => (
        <Badge variant="neutral" size="small">
          {setup.pattern}
        </Badge>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      align: 'center',
      render: (setup) => (
        <Badge 
          variant={
            setup.score >= 8 ? 'success' :
            setup.score >= 6 ? 'warning' :
            'neutral'
          }
        >
          {setup.score}/10
        </Badge>
      ),
    },
    {
      key: 'riskRewardRatio',
      header: 'R:R',
      sortable: true,
      align: 'right',
      render: (setup) => `${setup.riskRewardRatio.toFixed(1)}:1`,
    },
    {
      key: 'potentialGainPercent',
      header: 'Upside',
      sortable: true,
      align: 'right',
      render: (setup) => (
        <span className="text-success">+{setup.potentialGainPercent.toFixed(1)}%</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (setup) => (
        <Badge 
          variant={
            setup.status === 'triggered' ? 'success' :
            setup.status === 'invalidated' ? 'danger' :
            'warning'
          }
          size="small"
        >
          {setup.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="watchlist">
      <div className="watchlist__header">
        <div>
          <h1>Watchlist</h1>
          <p className="watchlist__subtitle">Track potential trade setups and entry points</p>
        </div>
        <div className="watchlist__filters">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setStatusFilter('all')}
          >
            All ({setups.length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({filterSetups('pending').length})
          </Button>
          <Button
            variant={statusFilter === 'triggered' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setStatusFilter('triggered')}
          >
            Triggered ({filterSetups('triggered').length})
          </Button>
          <Button
            variant={statusFilter === 'invalidated' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setStatusFilter('invalidated')}
          >
            Invalidated ({filterSetups('invalidated').length})
          </Button>
        </div>
      </div>

      <Card>
        {filteredSetups.length === 0 ? (
          <EmptyState
            title="No Setups Found"
            message="No trading setups match your current filter."
          />
        ) : (
          <Table
            columns={columns}
            data={filteredSetups}
            keyExtractor={(setup) => setup.id}
            hoverable
            onRowClick={(setup) => setSelectedSetup(setup)}
            stickyHeader
          />
        )}
      </Card>

      {selectedSetup && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSetup(null)}
          title={`${selectedSetup.symbol} - ${selectedSetup.name}`}
          size="large"
        >
          <div className="setup-detail">
            <div className="setup-detail__section">
              <h3>Setup Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Pattern:</span>
                  <span className="value">{selectedSetup.pattern}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Timeframe:</span>
                  <span className="value">{selectedSetup.timeframe}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Score:</span>
                  <Badge 
                    variant={
                      selectedSetup.score >= 8 ? 'success' :
                      selectedSetup.score >= 6 ? 'warning' :
                      'neutral'
                    }
                  >
                    {selectedSetup.score}/10
                  </Badge>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <Badge 
                    variant={
                      selectedSetup.status === 'triggered' ? 'success' :
                      selectedSetup.status === 'invalidated' ? 'danger' :
                      'warning'
                    }
                  >
                    {selectedSetup.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="setup-detail__section">
              <h3>Price Levels</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Current Price:</span>
                  <span className="value">{selectedSetup.currentPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Entry Price:</span>
                  <span className="value text-info">{selectedSetup.entryPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Stop Price:</span>
                  <span className="value text-danger">{selectedSetup.stopPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Target Price:</span>
                  <span className="value text-success">{selectedSetup.targetPrice.toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            <div className="setup-detail__section">
              <h3>Risk/Reward Analysis</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Risk:</span>
                  <span className="value text-danger">{selectedSetup.riskPercent.toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Potential Gain:</span>
                  <span className="value text-success">+{selectedSetup.potentialGainPercent.toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">R:R Ratio:</span>
                  <span className="value">{selectedSetup.riskRewardRatio.toFixed(1)}:1</span>
                </div>
                <div className="detail-item">
                  <span className="label">Added:</span>
                  <span className="value">{new Date(selectedSetup.addedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="setup-detail__section">
              <h3>Notes</h3>
              <div className="setup-notes">{selectedSetup.notes}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};