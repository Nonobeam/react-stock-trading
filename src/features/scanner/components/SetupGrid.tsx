import React from 'react';
import { SetupCard } from './SetupCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import type { Setup } from '../../../services/mock/setups';

interface SetupGridProps {
  setups: Setup[];
  onSetupClick: (setup: Setup) => void;
}

export const SetupGrid: React.FC<SetupGridProps> = ({ setups, onSetupClick }) => {
  if (setups.length === 0) {
    return (
      <EmptyState
        title="No Setups Found"
        message="No trade setups match your current filters."
      />
    );
  }

  return (
    <div className="scanner__grid">
      {setups.map((setup) => (
        <SetupCard 
          key={setup.id} 
          setup={setup} 
          onClick={onSetupClick} 
        />
      ))}
    </div>
  );
};
