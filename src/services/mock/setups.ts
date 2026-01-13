/**
 * Mock Setups/Watchlist Data Service
 * Generates realistic stock setups and signals for Vietnamese stocks
 */

export interface Setup {
  id: string;
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM';
  currentPrice: number;
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
  score: number; // 1-10 setup quality score
  pattern: string;
  timeframe: '1D' | '1W' | '1M';
  addedDate: Date;
  status: 'pending' | 'triggered' | 'invalidated';
  notes: string;
  riskRewardRatio: number;
  potentialGainPercent: number;
  riskPercent: number;
}

export interface Signal {
  id: string;
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM';
  currentPrice: number;
  signalType: 'buy' | 'sell' | 'watch';
  strength: 'weak' | 'moderate' | 'strong';
  score: number; // 1-10
  indicators: string[];
  generatedAt: Date;
  expiresAt: Date;
  reason: string;
}

const mockStocks = [
  { symbol: 'VCB', name: 'Vietcombank', exchange: 'HOSE' as const, price: 85600 },
  { symbol: 'HPG', name: 'Hoa Phat Group', exchange: 'HOSE' as const, price: 24500 },
  { symbol: 'VHM', name: 'Vinhomes', exchange: 'HOSE' as const, price: 41200 },
  { symbol: 'VNM', name: 'Vinamilk', exchange: 'HOSE' as const, price: 62800 },
  { symbol: 'FPT', name: 'FPT Corporation', exchange: 'HOSE' as const, price: 128000 },
  { symbol: 'MSN', name: 'Masan Group', exchange: 'HOSE' as const, price: 67500 },
  { symbol: 'VIC', name: 'Vingroup', exchange: 'HOSE' as const, price: 38900 },
  { symbol: 'TCB', name: 'Techcombank', exchange: 'HOSE' as const, price: 23450 },
  { symbol: 'MBB', name: 'MB Bank', exchange: 'HOSE' as const, price: 24300 },
  { symbol: 'VPB', name: 'VPBank', exchange: 'HOSE' as const, price: 18900 },
  { symbol: 'PLX', name: 'Petrolimex', exchange: 'HOSE' as const, price: 48200 },
  { symbol: 'POW', name: 'PetroVietnam Power', exchange: 'HOSE' as const, price: 12500 },
  { symbol: 'GAS', name: 'PetroVietnam Gas', exchange: 'HOSE' as const, price: 95300 },
  { symbol: 'SSI', name: 'SSI Securities', exchange: 'HOSE' as const, price: 38700 },
  { symbol: 'HDB', name: 'HDBank', exchange: 'HOSE' as const, price: 28100 }
];

const patterns = [
  'Bull Flag',
  'Ascending Triangle',
  'Cup and Handle',
  'Breakout',
  'Support Bounce',
  'MA Crossover',
  'Double Bottom',
  'Reversal Pattern',
  'Consolidation Break'
];

const indicators = [
  'RSI > 60',
  'MACD Bullish',
  'Volume Spike',
  'Above 20 MA',
  'Bullish Divergence',
  'Breakout Confirmed',
  'Support Held',
  'Higher Lows',
  'Momentum Strong'
];

/**
 * Generate a realistic setup/watchlist entry
 */
export function generateSetup(
  stock: typeof mockStocks[0],
  status: Setup['status'] = 'pending'
): Setup {
  const currentPrice = Math.round(stock.price * (1 + (Math.random() - 0.5) * 0.05));
  const entryPrice = Math.round(currentPrice * (1 + Math.random() * 0.03)); // 0-3% above
  const stopPrice = Math.round(entryPrice * (0.92 + Math.random() * 0.03)); // 5-8% below
  const targetPrice = Math.round(entryPrice * (1.1 + Math.random() * 0.15)); // 10-25% above
  
  const riskPercent = ((entryPrice - stopPrice) / entryPrice) * 100;
  const potentialGainPercent = ((targetPrice - entryPrice) / entryPrice) * 100;
  const riskRewardRatio = potentialGainPercent / riskPercent;
  
  // Score based on risk/reward (higher is better)
  let score = Math.min(10, Math.max(1, Math.floor(riskRewardRatio * 2)));
  
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const timeframe = ['1D', '1W', '1M'][Math.floor(Math.random() * 3)] as Setup['timeframe'];
  
  const addedDate = new Date();
  addedDate.setDate(addedDate.getDate() - Math.floor(Math.random() * 14)); // Added in last 2 weeks
  
  const notes = `${pattern} forming on ${timeframe}. Entry at ${entryPrice.toLocaleString()} VND with ${Math.round(riskRewardRatio * 10) / 10}:1 R:R`;
  
  return {
    id: `${stock.symbol}-${Date.now()}-${Math.random()}`,
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    currentPrice,
    entryPrice,
    stopPrice,
    targetPrice,
    score,
    pattern,
    timeframe,
    addedDate,
    status,
    notes,
    riskRewardRatio: Math.round(riskRewardRatio * 10) / 10,
    potentialGainPercent: Math.round(potentialGainPercent * 10) / 10,
    riskPercent: Math.round(riskPercent * 10) / 10
  };
}

/**
 * Generate multiple setups
 */
export function generateSetups(count: number = 10): Setup[] {
  const setups: Setup[] = [];
  const selectedStocks = [...mockStocks].sort(() => Math.random() - 0.5).slice(0, count);
  
  selectedStocks.forEach(stock => {
    const statusRoll = Math.random();
    const status: Setup['status'] = 
      statusRoll < 0.7 ? 'pending' : 
      statusRoll < 0.85 ? 'triggered' : 
      'invalidated';
    
    setups.push(generateSetup(stock, status));
  });
  
  // Sort by score (highest first)
  return setups.sort((a, b) => b.score - a.score);
}

/**
 * Generate a trading signal
 */
export function generateSignal(stock: typeof mockStocks[0]): Signal {
  const currentPrice = Math.round(stock.price * (1 + (Math.random() - 0.5) * 0.05));
  
  const signalTypeRoll = Math.random();
  const signalType: Signal['signalType'] = 
    signalTypeRoll < 0.5 ? 'buy' : 
    signalTypeRoll < 0.7 ? 'watch' : 
    'sell';
  
  const strengthRoll = Math.random();
  const strength: Signal['strength'] = 
    strengthRoll < 0.3 ? 'weak' : 
    strengthRoll < 0.7 ? 'moderate' : 
    'strong';
  
  const score = 
    strength === 'strong' ? Math.floor(Math.random() * 2) + 8 : // 8-9
    strength === 'moderate' ? Math.floor(Math.random() * 2) + 6 : // 6-7
    Math.floor(Math.random() * 2) + 4; // 4-5
  
  const selectedIndicators = [...indicators]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 2)); // 3-4 indicators
  
  const generatedAt = new Date();
  const expiresAt = new Date(generatedAt);
  expiresAt.setHours(expiresAt.getHours() + 4); // Signals expire in 4 hours
  
  const reasons = [
    `${signalType === 'buy' ? 'Bullish' : signalType === 'sell' ? 'Bearish' : 'Neutral'} momentum detected`,
    'Multiple indicators aligned',
    'Price action confirms trend',
    'Volume supporting move',
    'Technical setup forming'
  ];
  
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  
  return {
    id: `${stock.symbol}-signal-${Date.now()}-${Math.random()}`,
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    currentPrice,
    signalType,
    strength,
    score,
    indicators: selectedIndicators,
    generatedAt,
    expiresAt,
    reason
  };
}

/**
 * Generate multiple signals
 */
export function generateSignals(count: number = 8): Signal[] {
  const signals: Signal[] = [];
  const selectedStocks = [...mockStocks].sort(() => Math.random() - 0.5).slice(0, count);
  
  selectedStocks.forEach(stock => {
    signals.push(generateSignal(stock));
  });
  
  // Sort by score (highest first)
  return signals.sort((a, b) => b.score - a.score);
}

/**
 * Update setup prices (simulate real-time)
 */
export function updateSetupPrices(setups: Setup[]): Setup[] {
  return setups.map(setup => {
    const changePercent = (Math.random() - 0.5) * 0.02; // -1% to +1%
    const newPrice = Math.round(setup.currentPrice * (1 + changePercent));
    
    // Check if status should change
    let newStatus = setup.status;
    if (setup.status === 'pending') {
      if (newPrice >= setup.entryPrice) {
        newStatus = 'triggered';
      } else if (newPrice < setup.stopPrice * 0.98) {
        newStatus = 'invalidated';
      }
    }
    
    return {
      ...setup,
      currentPrice: newPrice,
      status: newStatus
    };
  });
}
