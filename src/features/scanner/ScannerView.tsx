import React, { useState } from 'react';
import { useSetups } from '../../context/SetupsContext';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import { SetupGrid } from './components/SetupGrid';
import { ScannerFilters } from './components/ScannerFilters';
import { SetupDetailModal } from './components/SetupDetailModal';
import type { Setup } from '../../services/mock/setups';
import './ScannerView.css';

export const ScannerView: React.FC = () => {
  const { setups, isLoading } = useSetups();
  const [selectedSetup, setSelectedSetup] = useState<Setup | null>(null);
  const [statusFilter, setStatusFilter] = useState<Setup['status'] | 'all'>('all');

  if (isLoading) {
    return (
      <div className="scanner">
        <LoadingSkeleton variant="card" height="500px" />
      </div>
    );
  }

  const filteredSetups = statusFilter === 'all' 
    ? setups 
    : setups.filter(s => s.status === statusFilter);

  return (
    <div className="scanner">
      <div className="scanner__header">
        <div>
          <h1>Trade Setup Scanner</h1>
          <p className="scanner__subtitle">Discover high-probability trade setups with automated scoring</p>
        </div>
        <div className="scanner__filters">
          <ScannerFilters 
            currentStatus={statusFilter} 
            onStatusChange={setStatusFilter} 
          />
        </div>
      </div>

      <SetupGrid 
        setups={filteredSetups} 
        onSetupClick={setSelectedSetup} 
      />

      {selectedSetup && (
        <SetupDetailModal
          setup={selectedSetup}
          isOpen={!!selectedSetup}
          onClose={() => setSelectedSetup(null)}
        />
      )}
    </div>
  );
};
