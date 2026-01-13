import React, { type ReactNode } from 'react';
import { WebSocketProvider } from './WebSocketContext';
import { MarketDataProvider } from './MarketDataContext';
import { SetupsProvider } from './SetupsContext';
import { PositionsProvider } from './PositionsContext';
import { PerformanceProvider } from './PerformanceContext';
import { AccountProvider } from './AccountContext';
import { TradingProvider } from './TradingContext';
import { TradesProvider } from './TradesContext';
import { SettingsProvider } from './SettingsContext';
import { BacktestProvider } from './BacktestContext';
import { ChatProvider } from './ChatContext';

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
    <SettingsProvider>
      <WebSocketProvider url={wsUrl} autoConnect={true}>
        <MarketDataProvider>
          <SetupsProvider>
            <PositionsProvider>
              <PerformanceProvider>
                <AccountProvider>
                  <TradingProvider>
                    <TradesProvider>
                      <BacktestProvider>
                        <ChatProvider>
                          {children}
                        </ChatProvider>
                      </BacktestProvider>
                    </TradesProvider>
                  </TradingProvider>
                </AccountProvider>
              </PerformanceProvider>
            </PositionsProvider>
          </SetupsProvider>
        </MarketDataProvider>
      </WebSocketProvider>
    </SettingsProvider>
  );
};

// Re-export providers
export { MarketDataProvider } from './MarketDataContext';
export { AccountProvider } from './AccountContext';
export { PositionsProvider } from './PositionsContext';
export { SetupsProvider } from './SetupsContext';
export { TradesProvider } from './TradesContext';
export { SettingsProvider } from './SettingsContext';
export { BacktestProvider } from './BacktestContext';
export { ChatProvider } from './ChatContext';

// Re-export hooks for convenience
export { useWebSocket } from './WebSocketContext';
export { useMarketData } from './MarketDataContext';
export { useTrades } from './TradesContext';
export { useSettings } from './SettingsContext';
export { useBacktest } from './BacktestContext';
export { useChat } from './ChatContext';
export { useSetups } from './SetupsContext';
export { usePositions } from './PositionsContext';
export { usePerformance } from './PerformanceContext';
export { useAccount } from './AccountContext';
export { useTrading } from './TradingContext';
