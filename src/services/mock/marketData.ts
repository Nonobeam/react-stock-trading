/**
 * Mock Market Data Service
 * Generates realistic VN-Index and market regime data for development
 */

export interface MarketData {
  vnIndex: number;
  change: number;
  changePercent: number;
  volume: number;
  marketStatus: 'pre-market' | 'open' | 'closed' | 'ato' | 'atc';
  regime: 'trending-up' | 'trending-down' | 'choppy' | 'volatile';
  regimeScore: number; // 1-10
  breadth: {
    advances: number;
    declines: number;
    unchanged: number;
  };
  lastUpdate: Date;
}

// Base VN-Index value
let mockVnIndex = 1265.43;
let previousClose = 1262.87;

/**
 * Generate realistic market data with random fluctuations
 */
export function generateMarketData(): MarketData {
  // Simulate price movement (-0.5% to +0.5% per update)
  const changePercent = (Math.random() - 0.5) * 1.0;
  mockVnIndex = mockVnIndex * (1 + changePercent / 100);
  
  const change = mockVnIndex - previousClose;
  const changePercentFromOpen = (change / previousClose) * 100;
  
  // Generate volume (10M to 30M shares per update)
  const volume = Math.floor(Math.random() * 20000000) + 10000000;
  
  // Determine market status based on time
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  let marketStatus: MarketData['marketStatus'];
  if (hour < 9) {
    marketStatus = 'pre-market';
  } else if (hour === 9 && minute < 15) {
    marketStatus = 'ato';
  } else if ((hour === 9 && minute >= 15) || (hour === 10) || (hour === 11 && minute < 30)) {
    marketStatus = 'open';
  } else if (hour === 14 && minute >= 30) {
    marketStatus = 'atc';
  } else {
    marketStatus = 'closed';
  }
  
  // Determine regime based on recent performance
  let regime: MarketData['regime'];
  let regimeScore: number;
  
  if (changePercentFromOpen > 0.5) {
    regime = 'trending-up';
    regimeScore = 8 + Math.floor(Math.random() * 2); // 8-9
  } else if (changePercentFromOpen < -0.5) {
    regime = 'trending-down';
    regimeScore = 3 + Math.floor(Math.random() * 2); // 3-4
  } else if (Math.abs(changePercentFromOpen) < 0.2) {
    regime = 'choppy';
    regimeScore = 5 + Math.floor(Math.random() * 2); // 5-6
  } else {
    regime = 'volatile';
    regimeScore = 4 + Math.floor(Math.random() * 3); // 4-6
  }
  
  // Generate breadth data
  const totalStocks = 800;
  const advanceRatio = Math.random() * 0.4 + 0.3; // 30-70%
  const advances = Math.floor(totalStocks * advanceRatio);
  const declines = Math.floor(totalStocks * (1 - advanceRatio) * 0.7);
  const unchanged = totalStocks - advances - declines;
  
  return {
    vnIndex: Math.round(mockVnIndex * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercentFromOpen * 100) / 100,
    volume,
    marketStatus,
    regime,
    regimeScore,
    breadth: {
      advances,
      declines,
      unchanged
    },
    lastUpdate: new Date()
  };
}

/**
 * Create a mock market data stream with periodic updates
 */
export function createMarketDataStream(
  callback: (data: MarketData) => void,
  intervalMs: number = 3000
): () => void {
  // Initial data
  callback(generateMarketData());
  
  // Update every intervalMs
  const interval = setInterval(() => {
    callback(generateMarketData());
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Reset market data to default values
 */
export function resetMarketData(): void {
  mockVnIndex = 1265.43;
  previousClose = 1262.87;
}
