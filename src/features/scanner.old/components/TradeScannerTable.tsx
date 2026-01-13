import React from 'react';
import type { TradeSetup, SetupType } from '../../../shared/types';
import { useSetups } from '../../../shared/hooks/useSetups';
import './TradeScannerTable.css';

const TradeScannerTable: React.FC = () => {
  const {
    filteredSetups,
    filters,
    sortBy,
    sortOrder,
    loading,
    error,
    selectSetup,
    updateFilters,
    clearFilters,
    setSortBy,
  } = useSetups();

  const getScoreQuality = (score: number): string => {
    if (score < 7) return 'poor';
    if (score < 9) return 'acceptable';
    if (score < 11) return 'good';
    return 'excellent';
  };

  const getScoreLabel = (score: number): string => {
    if (score < 7) return 'Poor';
    if (score < 9) return 'Acceptable';
    if (score < 11) return 'Good';
    return 'Excellent';
  };

  const handleRowClick = (setup: TradeSetup) => {
    selectSetup(setup);
  };

  const handleSort = (column: 'score' | 'riskReward' | 'symbol') => {
    setSortBy(column);
  };

  const getSortClass = (column: string): string => {
    if (sortBy !== column) return 'sortable';
    return sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc';
  };

  if (loading) {
    return (
      <div className="scanner-loading">
        <p>Loading trade setups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scanner-error">
        <strong>Error loading setups:</strong> {error}
      </div>
    );
  }

  return (
    <div className="scanner-table-container">
      {/* Filter Controls */}
      <div className="scanner-controls">
        <div className="scanner-control">
          <label>Min Score:</label>
          <input
            type="number"
            min="0"
            max="13"
            value={filters.minScore}
            onChange={(e) => updateFilters({ minScore: Number(e.target.value) })}
          />
        </div>

        <div className="scanner-control">
          <label>Setup Type:</label>
          <select
            multiple
            value={filters.setupTypes}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, opt => opt.value as SetupType);
              updateFilters({ setupTypes: selected });
            }}
          >
            <option value="PULLBACK">Pullback</option>
            <option value="BREAKOUT">Breakout</option>
            <option value="CROSSOVER">Crossover</option>
            <option value="MEAN_REVERSION">Mean Reversion</option>
          </select>
        </div>

        {(filters.minScore > 0 || filters.setupTypes.length > 0) && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Scanner Table */}
      {filteredSetups.length === 0 ? (
        <div className="scanner-empty">
          <h3>No setups found</h3>
          <p>
            {filters.minScore > 0 || filters.setupTypes.length > 0
              ? 'Try adjusting your filters'
              : 'No trade setups available at this time'}
          </p>
          {(filters.minScore > 0 || filters.setupTypes.length > 0) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="scanner-table">
          <table>
            <thead>
              <tr>
                <th className={getSortClass('symbol')} onClick={() => handleSort('symbol')}>
                  Symbol
                </th>
                <th>Type</th>
                <th className={getSortClass('score')} onClick={() => handleSort('score')}>
                  Score
                </th>
                <th>Quality</th>
                <th>Entry</th>
                <th>Stop</th>
                <th>Target</th>
                <th className={getSortClass('riskReward')} onClick={() => handleSort('riskReward')}>
                  R:R
                </th>
                <th>Confidence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSetups.map((setup) => (
                <tr key={setup.id} onClick={() => handleRowClick(setup)}>
                  <td>
                    <strong>{setup.symbol}</strong>
                  </td>
                  <td>
                    <span className="setup-type">
                      {setup.setupType.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`score-badge ${getScoreQuality(setup.score)}`}>
                      {setup.score}
                    </span>
                  </td>
                  <td>{getScoreLabel(setup.score)}</td>
                  <td>{setup.entry.toLocaleString()}</td>
                  <td>{setup.stop.toLocaleString()}</td>
                  <td>{setup.targets[0]?.toLocaleString() || 'N/A'}</td>
                  <td>
                    <strong>{setup.riskRewardRatio.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`confidence-badge ${setup.confidence}`}>
                      {setup.confidence}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectSetup(setup);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TradeScannerTable;
