import React from 'react';
import { Button } from '../../../shared/components/Button';
import type { Setup } from '../../../services/mock/setups';

interface ScannerFiltersProps {
  currentStatus: Setup['status'] | 'all';
  onStatusChange: (status: Setup['status'] | 'all') => void;
}

export const ScannerFilters: React.FC<ScannerFiltersProps> = ({ 
  currentStatus, 
  onStatusChange 
}) => {
  return (
    <div className="filter-group">
      <label>Status:</label>
      <Button
        variant={currentStatus === 'all' ? 'primary' : 'secondary'}
        size="small"
        onClick={() => onStatusChange('all')}
      >
        All
      </Button>
      <Button
        variant={currentStatus === 'pending' ? 'primary' : 'secondary'}
        size="small"
        onClick={() => onStatusChange('pending')}
      >
        Pending
      </Button>
      <Button
        variant={currentStatus === 'triggered' ? 'primary' : 'secondary'}
        size="small"
        onClick={() => onStatusChange('triggered')}
      >
        Triggered
      </Button>
      <Button
        variant={currentStatus === 'invalidated' ? 'primary' : 'secondary'}
        size="small"
        onClick={() => onStatusChange('invalidated')}
      >
        Invalidated
      </Button>
    </div>
  );
};
