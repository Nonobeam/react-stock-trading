import React, { type ReactNode } from 'react';
import { MQTTProvider } from './MQTTContext';
import { MarketDataProvider } from './MarketDataContext';
import { SetupsProvider } from './SetupsContext';
import { PositionsProvider } from './PositionsContext';
import { PerformanceProvider } from './PerformanceContext';
import { AccountProvider } from './AccountContext';
import { TradesProvider } from './TradesContext';
import { SettingsProvider } from './SettingsContext';
import { BacktestProvider } from './BacktestContext';
import { ChatProvider } from './ChatContext';
import { WatchlistProvider } from './WatchlistContext';

interface AppProvidersProps {
  children: ReactNode;
  wsUrl?: string;
}

/**
 * Central provider wrapper that composes all context providers
 * Ensures proper provider hierarchy and dependency order
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ 
  children
}) => {
  return (
    <SettingsProvider>
      <MQTTProvider autoConnect={true}>
          <MarketDataProvider>
          <SetupsProvider>
            <WatchlistProvider>
              <PositionsProvider>
                <PerformanceProvider>
                  <AccountProvider>
                      <TradesProvider>
                        <BacktestProvider>
                          <ChatProvider>
                            {children}
                          </ChatProvider>
                        </BacktestProvider>
                      </TradesProvider>
                    </AccountProvider>
                </PerformanceProvider>
              </PositionsProvider>
            </WatchlistProvider>
          </SetupsProvider>
        </MarketDataProvider>
        </MQTTProvider>
    </SettingsProvider>
  );
};

// Re-export providers
export { MarketDataProvider } from './MarketDataContext';
export { MQTTProvider } from './MQTTContext';
export { AccountProvider } from './AccountContext';
export { PositionsProvider } from './PositionsContext';
export { SetupsProvider } from './SetupsContext';
export { TradesProvider } from './TradesContext';
export { SettingsProvider } from './SettingsContext';
export { BacktestProvider } from './BacktestContext';
export { ChatProvider } from './ChatContext';
export { WatchlistProvider } from './WatchlistContext';
export { OTPProvider } from './OTPContext';

// Re-export hooks for convenience
export { useMQTT } from './MQTTContext';
export { useMarketData } from './MarketDataContext';
export { useTrades } from './TradesContext';
export { useSettings } from './SettingsContext';
export { useBacktest } from './BacktestContext';
export { useChat } from './ChatContext';
export { useSetups } from './SetupsContext';
export { usePositions } from './PositionsContext';
export { usePerformance } from './PerformanceContext';
export { useAccount } from './AccountContext';
export { useWatchlist } from './WatchlistContext';
export { useOtp } from './OTPContext';
