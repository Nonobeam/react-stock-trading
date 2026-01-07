import React from 'react';
import { useWebSocket } from '../../context';
import './ConnectionStatus.css';

export const ConnectionStatus: React.FC = () => {
  const { status } = useWebSocket();

  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`connection-status connection-status--${status}`}>
      <span className="connection-status__indicator"></span>
      <span className="connection-status__label">{getStatusLabel()}</span>
      {status === 'connecting' && (
        <span className="connection-status__spinner"></span>
      )}
    </div>
  );
};
