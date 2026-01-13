import React, { useState } from 'react';
import { usePositions } from '../../context/PositionsContext';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Table, type TableColumn } from '../../shared/components/Table';
import { Modal } from '../../shared/components/Modal';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Position, ClosedPosition } from '../../services/mock/positions';
import './PortfolioView.css';

export const PortfolioView: React.FC = () => {
  const { openPositions, closedPositions, portfolioSummary, isLoading } = usePositions();
  const [selectedPosition, setSelectedPosition] = useState<Position | ClosedPosition | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return (
      <div className="portfolio">
        <LoadingSkeleton variant="card" height="400px" />
      </div>
    );
  }

  // Table columns for open positions
  const openPositionsColumns: TableColumn<Position>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      sortable: true,
      render: (pos) => (
        <div className="symbol-cell">
          <span className="symbol-name">{pos.symbol}</span>
          <span className="symbol-exchange">{pos.exchange}</span>
        </div>
      ),
    },
    {
      key: 'shares',
      header: 'Shares',
      sortable: true,
      align: 'right',
      render: (pos) => pos.shares.toLocaleString(),
    },
    {
      key: 'entryPrice',
      header: 'Entry',
      sortable: true,
      align: 'right',
      render: (pos) => pos.entryPrice.toLocaleString(),
    },
    {
      key: 'currentPrice',
      header: 'Current',
      sortable: true,
      align: 'right',
      render: (pos) => (
        <span className={pos.status === 'green' ? 'text-success' : 'text-danger'}>
          {pos.currentPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'netPnL',
      header: 'P&L',
      sortable: true,
      align: 'right',
      render: (pos) => (
        <div className="pnl-cell">
          <span className={pos.netPnL >= 0 ? 'text-success' : 'text-danger'}>
            {pos.netPnL >= 0 ? '+' : ''}{pos.netPnL.toLocaleString()}
          </span>
          <span className={`pnl-percent ${pos.netPnL >= 0 ? 'text-success' : 'text-danger'}`}>
            ({pos.netPnLPercent >= 0 ? '+' : ''}{pos.netPnLPercent.toFixed(2)}%)
          </span>
        </div>
      ),
    },
    {
      key: 'rMultiple',
      header: 'R-Multiple',
      sortable: true,
      align: 'right',
      render: (pos) => (
        <Badge variant={pos.rMultiple >= 1 ? 'success' : pos.rMultiple < 0 ? 'danger' : 'neutral'}>
          {pos.rMultiple.toFixed(2)}R
        </Badge>
      ),
    },
    {
      key: 'daysHeld',
      header: 'Days',
      sortable: true,
      align: 'right',
    },
  ];

  // Table columns for closed positions
  const closedPositionsColumns: TableColumn<ClosedPosition>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      sortable: true,
    },
    {
      key: 'exitDate',
      header: 'Exit Date',
      sortable: true,
      render: (pos) => new Date(pos.exitDate).toLocaleDateString(),
    },
    {
      key: 'entryPrice',
      header: 'Entry',
      sortable: true,
      align: 'right',
      render: (pos) => pos.entryPrice.toLocaleString(),
    },
    {
      key: 'exitPrice',
      header: 'Exit',
      sortable: true,
      align: 'right',
      render: (pos) => pos.exitPrice.toLocaleString(),
    },
    {
      key: 'netPnL',
      header: 'Net P&L',
      sortable: true,
      align: 'right',
      render: (pos) => (
        <span className={pos.netPnL >= 0 ? 'text-success' : 'text-danger'}>
          {pos.netPnL >= 0 ? '+' : ''}{pos.netPnL.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'rMultiple',
      header: 'R-Multiple',
      sortable: true,
      align: 'right',
      render: (pos) => (
        <Badge variant={pos.rMultiple >= 1 ? 'success' : 'danger'} size="small">
          {pos.rMultiple.toFixed(2)}R
        </Badge>
      ),
    },
    {
      key: 'exitReason',
      header: 'Reason',
      render: (pos) => (
        <Badge variant="neutral" size="small">
          {pos.exitReason.replace('-', ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <div className="portfolio">
      <div className="portfolio__header">
        <div>
          <h1>Portfolio</h1>
          <p className="portfolio__subtitle">Track your positions and trading history</p>
        </div>
        <div className="portfolio__actions">
          <button 
            className={`tab-button ${!showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(false)}
          >
            Open Positions ({openPositions.length})
          </button>
          <button 
            className={`tab-button ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(true)}
          >
            History ({closedPositions.length})
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      {!showHistory && portfolioSummary && (
        <Card className="portfolio__summary" variant="elevated">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Positions</span>
              <span className="summary-value">{portfolioSummary.totalPositions}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Value</span>
              <span className="summary-value">{portfolioSummary.totalValue.toLocaleString()} VND</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Unrealized P&L</span>
              <span className={`summary-value ${portfolioSummary.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                {portfolioSummary.totalPnL >= 0 ? '+' : ''}{portfolioSummary.totalPnL.toLocaleString()} VND
                <span className="summary-percent">
                  ({portfolioSummary.totalPnLPercent >= 0 ? '+' : ''}{portfolioSummary.totalPnLPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg R-Multiple</span>
              <span className="summary-value">{portfolioSummary.avgRMultiple.toFixed(2)}R</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Risk</span>
              <span className="summary-value">{portfolioSummary.totalRisk.toLocaleString()} VND</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Risk %</span>
              <span className="summary-value">{portfolioSummary.riskPercent.toFixed(2)}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* Positions Table */}
      <Card className="portfolio__table">
        {!showHistory ? (
          openPositions.length === 0 ? (
            <EmptyState
              title="No Open Positions"
              message="You don't have any open positions at the moment."
            />
          ) : (
            <Table
              columns={openPositionsColumns}
              data={openPositions}
              keyExtractor={(pos) => pos.id}
              hoverable
              onRowClick={(pos) => setSelectedPosition(pos)}
              stickyHeader
            />
          )
        ) : (
          closedPositions.length === 0 ? (
            <EmptyState
              title="No Trading History"
              message="Your closed positions will appear here."
            />
          ) : (
            <Table
              columns={closedPositionsColumns}
              data={closedPositions}
              keyExtractor={(pos) => pos.id}
              hoverable
              onRowClick={(pos) => setSelectedPosition(pos)}
              stickyHeader
            />
          )
        )}
      </Card>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPosition(null)}
          title={`${selectedPosition.symbol} - ${selectedPosition.name}`}
          size="large"
        >
          <div className="position-detail">
            <div className="position-detail__section">
              <h3>Position Info</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Shares:</span>
                  <span className="value">{selectedPosition.shares.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Entry Price:</span>
                  <span className="value">{selectedPosition.entryPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current Price:</span>
                  <span className="value">{selectedPosition.currentPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Breakeven:</span>
                  <span className="value">{selectedPosition.breakeven.toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            <div className="position-detail__section">
              <h3>Vietnam Financials</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Entry Commission:</span>
                  <span className="value">{selectedPosition.entryCommission.toLocaleString()} VND</span>
                </div>
                {'exitCommission' in selectedPosition && (
                  <>
                    <div className="detail-item">
                      <span className="label">Exit Commission:</span>
                      <span className="value">{selectedPosition.exitCommission.toLocaleString()} VND</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Exit Tax:</span>
                      <span className="value">{selectedPosition.exitTax.toLocaleString()} VND</span>
                    </div>
                  </>
                )}
                <div className="detail-item">
                  <span className="label">Gross P&L:</span>
                  <span className="value">{selectedPosition.grossPnL.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Net P&L:</span>
                  <span className={`value ${selectedPosition.netPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                    {selectedPosition.netPnL >= 0 ? '+' : ''}{selectedPosition.netPnL.toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>

            <div className="position-detail__section">
              <h3>Risk Management</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Stop Price:</span>
                  <span className="value">{selectedPosition.stopPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Target Price:</span>
                  <span className="value">{selectedPosition.targetPrice.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">Risk Amount:</span>
                  <span className="value">{selectedPosition.risk.toLocaleString()} VND</span>
                </div>
                <div className="detail-item">
                  <span className="label">R-Multiple:</span>
                  <span className="value">
                    <Badge variant={selectedPosition.rMultiple >= 1 ? 'success' : selectedPosition.rMultiple < 0 ? 'danger' : 'neutral'}>
                      {selectedPosition.rMultiple.toFixed(2)}R
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
