import React, { type ReactNode } from 'react';
import { WebSocketProvider } from './WebSocketContext';
import { MarketDataProvider } from './MarketDataContext';
import { SetupsProvider } from './SetupsContext';
import { PositionsProvider } from './PositionsContext';
import { PerformanceProvider } from './PerformanceContext';

interface AppProvidersProps {
  children: ReactNode;
  wsUrl?: string;
}

/**
 * Central provider wrapper that composes all context providers
 * Ensures proper provider hierarchy and dependency order
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ 
  children, 
  wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws' 
}) => {
  return (
    <WebSocketProvider url={wsUrl} autoConnect={true}>
      <MarketDataProvider>
        <SetupsProvider>
          <PositionsProvider>
            <PerformanceProvider>
              {children}
            </PerformanceProvider>
          </PositionsProvider>
        </SetupsProvider>
      </MarketDataProvider>
    </WebSocketProvider>
  );
};

// Re-export hooks for convenience
export { useWebSocket } from './WebSocketContext';
export { useMarketData } from './MarketDataContext';
export { useSetups } from './SetupsContext';
export { usePositions } from './PositionsContext';
export { usePerformance } from './PerformanceContext';
