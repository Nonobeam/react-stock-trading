import React, { useState } from 'react';
import { useSetups } from '../../shared/hooks/useSetups';
import TradeScannerTable from './components/TradeScannerTable';
import ScorecardDisplay from './components/ScorecardDisplay';
import SetupDetailDrawer from './components/SetupDetailDrawer';
import './ScannerView.css';

const ScannerView: React.FC = () => {
  const { selectedSetup, selectSetup } = useSetups();
  const [showScorecard, setShowScorecard] = useState(false);

  const handlePlanTrade = (setup: any) => {
    console.log('Planning trade for', setup.symbol);
    // TODO: Navigate to risk calculator with pre-filled data
    // For now, just log
    alert(`Planning trade for ${setup.symbol}\nEntry: ${setup.entry}\nStop: ${setup.stop}`);
  };

  const handleViewScorecard = () => {
    setShowScorecard(true);
  };

  return (
    <div className="scanner-view">
      <div className="scanner-header">
        <h1>Trade Setup Scanner</h1>
        <p className="scanner-subtitle">
          Discover high-probability trade setups with comprehensive scoring
        </p>
      </div>

      {/* Scanner Table */}
      <TradeScannerTable />

      {/* Scorecard Modal */}
      {showScorecard && selectedSetup && (
        <ScorecardDisplay
          setup={selectedSetup}
          onClose={() => setShowScorecard(false)}
        />
      )}

      {/* Detail Drawer */}
      {selectedSetup && !showScorecard && (
        <SetupDetailDrawer
          setup={selectedSetup}
          onClose={() => selectSetup(null)}
          onPlanTrade={handlePlanTrade}
        />
      )}

      {/* Quick Action for Scorecard */}
      {selectedSetup && !showScorecard && (
        <button className="floating-scorecard-btn" onClick={handleViewScorecard}>
          View Scorecard
        </button>
      )}
    </div>
  );
};

export default ScannerView;
