import React, { useState } from 'react';
import { usePositions } from '../../context/PositionsContext';
import { PortfolioSummaryCards } from './components/PortfolioSummaryCards';
import { PositionsTable } from './components/PositionsTable';
import { StopManagementPanel } from './components/StopManagementPanel';
import { ClosePositionModal } from './components/ClosePositionModal';
import './MonitoringView.css';

export const MonitoringView: React.FC = () => {
  const {
    positions,
    portfolioSummary,
    selectedPosition,
    isLoading,
    error,
    selectPosition,
    adjustStop,
    closePosition,
  } = usePositions();

  const [showStopPanel, setShowStopPanel] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const handleSelectPosition = (positionId: string) => {
    selectPosition(positionId);
    setShowStopPanel(true);
  };

  const handleCloseStopPanel = () => {
    setShowStopPanel(false);
    setTimeout(() => selectPosition(null), 300);
  };

  const handleAdjustStop = async (newStop: number, method: string, reason: string) => {
    if (!selectedPosition) return;

    try {
      await adjustStop({
        positionId: selectedPosition.id,
        newStop,
        method,
        reason,
      });
      setShowStopPanel(false);
      setTimeout(() => selectPosition(null), 300);
    } catch (error) {
      console.error('Failed to adjust stop:', error);
    }
  };

  const handleClosePosition = async (shares?: number, reason?: string) => {
    if (!selectedPosition) return;

    try {
      await closePosition({
        positionId: selectedPosition.id,
        shares,
        reason: reason || 'Position closed',
      });
      setShowCloseModal(false);
      setShowStopPanel(false);
      selectPosition(null);
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="monitoring-view">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading positions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="monitoring-view">
        <div className="error-state">
          <div className="error-indicator"></div>
          <h3>Error Loading Positions</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-view">
      <div className="monitoring-header">
        <div className="header-content">
          <h1>Position Monitoring</h1>
          <p className="header-subtitle">
            Track your open positions, manage stops, and monitor real-time P&L
          </p>
        </div>
      </div>

      <div className="monitoring-content">
        {portfolioSummary && positions.length > 0 && (
          <PortfolioSummaryCards summary={portfolioSummary} />
        )}

        <div className="positions-section">
          <div className="section-header">
            <h2>Open Positions</h2>
            {positions.length > 0 && (
              <div className="section-actions">
                <span className="position-count">
                  {positions.length} {positions.length === 1 ? 'position' : 'positions'}
                </span>
              </div>
            )}
          </div>

          <PositionsTable
            positions={positions}
            onSelectPosition={handleSelectPosition}
            selectedPositionId={selectedPosition?.id}
          />
        </div>

        {/* Stagnation Warnings */}
        {positions.some(p => p.isStagnant) && (
          <div className="stagnation-alerts">
            <h3 className="section-header--warning">Stagnation Alerts</h3>
            {positions
              .filter(p => p.isStagnant)
              .map(position => (
                <div key={position.id} className="stagnation-alert">
                  <div className="alert-header">
                    <strong>{position.symbol}</strong> - {position.stagnantDays} days with minimal progress
                  </div>
                  <div className="alert-body">
                    <p>Current R: {position.rMultiple.toFixed(2)}R over {position.daysHeld} days</p>
                    <p className="alert-suggestion">
                      Consider tightening stop, setting a time deadline, or taking partial profits
                    </p>
                  </div>
                  <div className="alert-actions">
                    <button
                      className="btn-alert-action"
                      onClick={() => handleSelectPosition(position.id)}
                    >
                      Manage Stop
                    </button>
                    <button
                      className="btn-alert-action btn-close-position"
                      onClick={() => {
                        selectPosition(position.id);
                        setShowCloseModal(true);
                      }}
                    >
                      Close Position
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Emergency Alerts */}
        {positions.some(p => p.stopHit || p.targetHit) && (
          <div className="emergency-alerts">
            {positions
              .filter(p => p.stopHit)
              .map(position => (
                <div key={`stop-${position.id}`} className="emergency-alert stop-hit">
                  <div className="alert-label alert-label--danger">Stop Alert</div>
                  <div className="alert-content">
                    <strong>{position.symbol} - STOP HIT!</strong>
                    <p>Current price {position.currentPrice.toLocaleString()} VND has crossed your stop at {position.currentStop.toLocaleString()} VND</p>
                  </div>
                  <button
                    className="btn-emergency"
                    onClick={() => {
                      selectPosition(position.id);
                      setShowCloseModal(true);
                    }}
                  >
                    Close Now
                  </button>
                </div>
              ))}

            {positions
              .filter(p => p.targetHit)
              .map(position => (
                <div key={`target-${position.id}`} className="emergency-alert target-hit">
                  <div className="alert-label">Target Alert</div>
                  <div className="alert-content">
                    <strong>{position.symbol} - TARGET HIT!</strong>
                    <p>Consider taking profits or adjusting your stop to lock in gains</p>
                  </div>
                  <button
                    className="btn-emergency"
                    onClick={() => handleSelectPosition(position.id)}
                  >
                    Adjust Stop
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Stop Management Panel (Slide-in) */}
      {showStopPanel && selectedPosition && (
        <div className={`stop-panel-overlay ${showStopPanel ? 'active' : ''}`}>
          <div className="stop-panel-container">
            <StopManagementPanel
              position={selectedPosition}
              onAdjustStop={handleAdjustStop}
              onClose={handleCloseStopPanel}
            />
            <button
              className="btn-close-position-secondary"
              onClick={() => setShowCloseModal(true)}
            >
              Close Position
            </button>
          </div>
        </div>
      )}

      {/* Close Position Modal */}
      {showCloseModal && selectedPosition && (
        <ClosePositionModal
          position={selectedPosition}
          onClose={() => setShowCloseModal(false)}
          onConfirm={handleClosePosition}
        />
      )}
    </div>
  );
};
