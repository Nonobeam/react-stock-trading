import React from 'react';
import type { Position } from '../../../shared/types';
import { Badge } from '../../../shared/components/Badge';
import './PositionsTable.css';

interface PositionsTableProps {
  positions: Position[];
  onSelectPosition: (positionId: string) => void;
  selectedPositionId?: string | null;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onSelectPosition,
  selectedPositionId,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatRMultiple = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}R`;
  };

  const getStatusBadge = (position: Position) => {
    if (position.stopHit) {
      return <Badge variant="danger" size="small">STOP HIT</Badge>;
    }
    if (position.targetHit) {
      return <Badge variant="success" size="small">TARGET HIT</Badge>;
    }
    if (position.isStagnant) {
      return <Badge variant="warning" size="small">STAGNANT</Badge>;
    }
    
    switch (position.status) {
      case 'PROFIT':
        return <Badge variant="success" size="small">PROFIT</Badge>;
      case 'LOSS':
        return <Badge variant="danger" size="small">LOSS</Badge>;
      case 'BREAKEVEN':
        return <Badge variant="neutral" size="small">BREAKEVEN</Badge>;
    }
  };

  const getPLClassName = (pl: number): string => {
    if (pl > 0) return 'pl-positive';
    if (pl < 0) return 'pl-negative';
    return 'pl-neutral';
  };

  if (positions.length === 0) {
    return (
      <div className="positions-table-empty">
        <h3>No Active Positions</h3>
        <p>You don't have any open positions yet.</p>
        <p>Visit the <a href="/scanner">Trade Scanner</a> to find setups.</p>
      </div>
    );
  }

  return (
    <div className="positions-table-container">
      <table className="positions-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Entry</th>
            <th>Current</th>
            <th>P&L</th>
            <th>R-Multiple</th>
            <th>Stop</th>
            <th>Days</th>
            <th>Size</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr
              key={position.id}
              className={`
                position-row 
                ${selectedPositionId === position.id ? 'selected' : ''}
                ${position.stopHit ? 'stop-hit-flash' : ''}
                ${position.targetHit ? 'target-hit-flash' : ''}
              `}
              onClick={() => onSelectPosition(position.id)}
            >
              <td className="symbol-cell">
                <strong>{position.symbol}</strong>
                <div className="entry-date">
                  {new Date(position.entryDate).toLocaleDateString('vi-VN')}
                </div>
              </td>
              
              <td className="price-cell">
                {formatCurrency(position.entryPrice)}
              </td>
              
              <td className="price-cell current-price">
                {formatCurrency(position.currentPrice)}
              </td>
              
              <td className={`pl-cell ${getPLClassName(position.unrealizedPL)}`}>
                <div>{formatCurrency(position.unrealizedPL)}</div>
                <div className="pl-percent">{formatPercent(position.unrealizedPLPercent)}</div>
              </td>
              
              <td className={`r-multiple-cell ${getPLClassName(position.rMultiple)}`}>
                <strong>{formatRMultiple(position.rMultiple)}</strong>
              </td>
              
              <td className="price-cell">
                {formatCurrency(position.currentStop)}
              </td>
              
              <td className="days-cell">
                {position.daysHeld} {position.daysHeld === 1 ? 'day' : 'days'}
              </td>
              
              <td className="size-cell">
                {position.size.toLocaleString()} shares
              </td>
              
              <td className="status-cell">
                {getStatusBadge(position)}
              </td>
              
              <td className="actions-cell">
                <button
                  className="btn-action btn-adjust"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPosition(position.id);
                  }}
                  title="Manage Stop"
                >
                  ⚙️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
