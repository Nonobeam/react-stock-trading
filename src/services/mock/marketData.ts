/**
 * Mock Market Data Service
 * Generates realistic VN-Index and market regime data for development
 */

export interface DataPoint {
  timestamp: number;
  value: number;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  data: DataPoint[];
}

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
  // Extended indices data
  indices: {
    vnIndex: IndexData;
    vn30: IndexData;
    vn100: IndexData;
  };
}

// Base VN-Index value
let mockVnIndex = 1265.43;
let mockVn30 = 1320.15;
let mockVn100 = 1185.67;
let previousClose = 1262.87;
let previousCloseVn30 = 1315.42;
let previousCloseVn100 = 1182.34;

// Historical data storage
let vnIndexHistory: DataPoint[] = [];
let vn30History: DataPoint[] = [];
let vn100History: DataPoint[] = [];

/**
 * Generate initial historical data points (50 points for intraday view)
 */
function initializeHistoricalData(): void {
  const now = Date.now();
  const intervalMs = 60000; // 1 minute intervals
  
  vnIndexHistory = [];
  vn30History = [];
  vn100History = [];
  
  let tempVnIndex = previousClose;
  let tempVn30 = previousCloseVn30;
  let tempVn100 = previousCloseVn100;
  
  for (let i = 49; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    
    // Random walk with slight trend
    tempVnIndex *= (1 + (Math.random() - 0.48) * 0.002);
    tempVn30 *= (1 + (Math.random() - 0.48) * 0.0022); // Beta ~1.1
    tempVn100 *= (1 + (Math.random() - 0.48) * 0.0018); // Beta ~0.9
    
    vnIndexHistory.push({ timestamp, value: Math.round(tempVnIndex * 100) / 100 });
    vn30History.push({ timestamp, value: Math.round(tempVn30 * 100) / 100 });
    vn100History.push({ timestamp, value: Math.round(tempVn100 * 100) / 100 });
  }
  
  // Set current values to last historical point
  mockVnIndex = vnIndexHistory[49].value;
  mockVn30 = vn30History[49].value;
  mockVn100 = vn100History[49].value;
}

// Initialize on module load
initializeHistoricalData();

/**
 * Generate realistic market data with random fluctuations
 */
export function generateMarketData(): MarketData {
  const now = Date.now();
  
  // Simulate price movement (-0.5% to +0.5% per update)
  const changePercent = (Math.random() - 0.5) * 1.0;
  mockVnIndex = mockVnIndex * (1 + changePercent / 100);
  
  // VN30 with beta ~1.1 (slightly more volatile)
  mockVn30 = mockVn30 * (1 + (changePercent * 1.1) / 100);
  
  // VN100 with beta ~0.9 (slightly less volatile)
  mockVn100 = mockVn100 * (1 + (changePercent * 0.9) / 100);
  
  // Update historical data (shift and add new point)
  vnIndexHistory.shift();
  vnIndexHistory.push({ timestamp: now, value: Math.round(mockVnIndex * 100) / 100 });
  
  vn30History.shift();
  vn30History.push({ timestamp: now, value: Math.round(mockVn30 * 100) / 100 });
  
  vn100History.shift();
  vn100History.push({ timestamp: now, value: Math.round(mockVn100 * 100) / 100 });
  
  const change = mockVnIndex - previousClose;
  const changePercentFromOpen = (change / previousClose) * 100;
  
  const vn30Change = mockVn30 - previousCloseVn30;
  const vn30ChangePercent = (vn30Change / previousCloseVn30) * 100;
  
  const vn100Change = mockVn100 - previousCloseVn100;
  const vn100ChangePercent = (vn100Change / previousCloseVn100) * 100;
  
  // Generate volume (10M to 30M shares per update)
  const volume = Math.floor(Math.random() * 20000000) + 10000000;
  
  // Determine market status based on time
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
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
    lastUpdate: new Date(),
    indices: {
      vnIndex: {
        name: 'VNINDEX',
        value: Math.round(mockVnIndex * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercentFromOpen * 100) / 100,
        data: [...vnIndexHistory]
      },
      vn30: {
        name: 'VN30',
        value: Math.round(mockVn30 * 100) / 100,
        change: Math.round(vn30Change * 100) / 100,
        changePercent: Math.round(vn30ChangePercent * 100) / 100,
        data: [...vn30History]
      },
      vn100: {
        name: 'VN100',
        value: Math.round(mockVn100 * 100) / 100,
        change: Math.round(vn100Change * 100) / 100,
        changePercent: Math.round(vn100ChangePercent * 100) / 100,
        data: [...vn100History]
      }
    }
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
  mockVn30 = 1320.15;
  mockVn100 = 1185.67;
  previousClose = 1262.87;
  previousCloseVn30 = 1315.42;
  previousCloseVn100 = 1182.34;
  initializeHistoricalData();
}
