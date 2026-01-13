/**
 * Mock Positions Data Service
 * Generates realistic Vietnamese stock positions with proper financials
 */

import { 
  calculateNetPnL, 
  calculateBreakevenPrice,
  calculateRMultiple
} from '../vietnam/commission';

export interface Position {
  id: string;
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM';
  shares: number;
  entryPrice: number;
  entryDate: Date;
  currentPrice: number;
  stopPrice: number;
  targetPrice: number;
  entryValue: number;
  currentValue: number;
  entryCommission: number;
  breakeven: number;
  grossPnL: number;
  netPnL: number;
  netPnLPercent: number;
  rMultiple: number;
  risk: number; // Amount at risk if stop is hit
  status: 'green' | 'red';
  daysHeld: number;
}

export interface ClosedPosition extends Position {
  exitPrice: number;
  exitDate: Date;
  exitCommission: number;
  exitTax: number;
  exitReason: 'target' | 'stop' | 'manual' | 'trailing-stop';
  holdingDays: number;
}

const mockStocks = [
  { symbol: 'VCB', name: 'Vietcombank', exchange: 'HOSE' as const, basePrice: 85600 },
  { symbol: 'HPG', name: 'Hoa Phat Group', exchange: 'HOSE' as const, basePrice: 24500 },
  { symbol: 'VHM', name: 'Vinhomes', exchange: 'HOSE' as const, basePrice: 41200 },
  { symbol: 'VNM', name: 'Vinamilk', exchange: 'HOSE' as const, basePrice: 62800 },
  { symbol: 'FPT', name: 'FPT Corporation', exchange: 'HOSE' as const, basePrice: 128000 },
  { symbol: 'MSN', name: 'Masan Group', exchange: 'HOSE' as const, basePrice: 67500 },
  { symbol: 'VIC', name: 'Vingroup', exchange: 'HOSE' as const, basePrice: 38900 },
  { symbol: 'TCB', name: 'Techcombank', exchange: 'HOSE' as const, basePrice: 23450 },
  { symbol: 'MBB', name: 'MB Bank', exchange: 'HOSE' as const, basePrice: 24300 },
  { symbol: 'VPB', name: 'VPBank', exchange: 'HOSE' as const, basePrice: 18900 }
];

/**
 * Generate a realistic open position
 */
export function generatePosition(
  stock: typeof mockStocks[0],
  shares: number = 100,
  daysSinceEntry: number = Math.floor(Math.random() * 30)
): Position {
  const entryPrice = Math.round(stock.basePrice * (1 + (Math.random() - 0.5) * 0.1));
  const currentPriceVariation = (Math.random() - 0.3) * 0.15; // -30% to +70% bias towards up
  const currentPrice = Math.round(entryPrice * (1 + currentPriceVariation));
  
  const stopPrice = Math.round(entryPrice * 0.95); // 5% stop loss
  const targetPrice = Math.round(entryPrice * 1.15); // 15% target
  
  const entryDate = new Date();
  entryDate.setDate(entryDate.getDate() - daysSinceEntry);
  
  // Calculate financials using Vietnam rules
  const pnlData = calculateNetPnL(entryPrice, currentPrice, shares);
  const breakeven = calculateBreakevenPrice(entryPrice, shares);
  const rMultiple = calculateRMultiple(entryPrice, currentPrice, stopPrice, shares);
  const risk = shares * (entryPrice - stopPrice);
  
  const status: 'green' | 'red' = currentPrice >= entryPrice ? 'green' : 'red';
  
  return {
    id: `${stock.symbol}-${Date.now()}-${Math.random()}`,
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    shares,
    entryPrice,
    entryDate,
    currentPrice,
    stopPrice,
    targetPrice,
    entryValue: shares * entryPrice,
    currentValue: shares * currentPrice,
    entryCommission: pnlData.entryCommission,
    breakeven,
    grossPnL: pnlData.grossPnL,
    netPnL: pnlData.netPnL,
    netPnLPercent: pnlData.netPnLPercent,
    rMultiple: Math.round(rMultiple * 100) / 100,
    risk: Math.round(risk),
    status,
    daysHeld: daysSinceEntry
  };
}

/**
 * Generate multiple open positions
 */
export function generateOpenPositions(count: number = 5): Position[] {
  const positions: Position[] = [];
  const selectedStocks = mockStocks.slice(0, count);
  
  selectedStocks.forEach((stock) => {
    const shares = (Math.floor(Math.random() * 5) + 2) * 100; // 200-600 shares
    const daysHeld = Math.floor(Math.random() * 45); // 0-45 days
    positions.push(generatePosition(stock, shares, daysHeld));
  });
  
  return positions;
}

/**
 * Generate a closed position (historical trade)
 */
export function generateClosedPosition(
  stock: typeof mockStocks[0],
  isWinner: boolean = Math.random() > 0.4 // 60% win rate
): ClosedPosition {
  const shares = (Math.floor(Math.random() * 5) + 2) * 100; // 200-600 shares
  const entryPrice = Math.round(stock.basePrice * (1 + (Math.random() - 0.5) * 0.2));
  
  let exitPrice: number;
  let exitReason: ClosedPosition['exitReason'];
  
  if (isWinner) {
    // Winner: 5% to 25% gain
    const gainPercent = Math.random() * 0.2 + 0.05;
    exitPrice = Math.round(entryPrice * (1 + gainPercent));
    exitReason = Math.random() > 0.3 ? 'target' : 'trailing-stop';
  } else {
    // Loser: -10% to -5% loss (good risk management)
    const lossPercent = Math.random() * 0.05 + 0.05;
    exitPrice = Math.round(entryPrice * (1 - lossPercent));
    exitReason = Math.random() > 0.5 ? 'stop' : 'manual';
  }
  
  const stopPrice = Math.round(entryPrice * 0.95);
  const targetPrice = Math.round(entryPrice * 1.15);
  
  const holdingDays = Math.floor(Math.random() * 60) + 1; // 1-60 days
  const exitDate = new Date();
  exitDate.setDate(exitDate.getDate() - Math.floor(Math.random() * 180)); // Last 6 months
  
  const entryDate = new Date(exitDate);
  entryDate.setDate(entryDate.getDate() - holdingDays);
  
  const pnlData = calculateNetPnL(entryPrice, exitPrice, shares);
  const breakeven = calculateBreakevenPrice(entryPrice, shares);
  const rMultiple = calculateRMultiple(entryPrice, exitPrice, stopPrice, shares);
  const risk = shares * (entryPrice - stopPrice);
  
  return {
    id: `${stock.symbol}-${exitDate.getTime()}-${Math.random()}`,
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    shares,
    entryPrice,
    entryDate,
    currentPrice: exitPrice, // For compatibility
    stopPrice,
    targetPrice,
    exitPrice,
    exitDate,
    entryValue: shares * entryPrice,
    currentValue: shares * exitPrice,
    entryCommission: pnlData.entryCommission,
    exitCommission: pnlData.exitCommission,
    exitTax: pnlData.exitTax,
    breakeven,
    grossPnL: pnlData.grossPnL,
    netPnL: pnlData.netPnL,
    netPnLPercent: pnlData.netPnLPercent,
    rMultiple: Math.round(rMultiple * 100) / 100,
    risk: Math.round(risk),
    status: exitPrice >= entryPrice ? 'green' : 'red',
    daysHeld: holdingDays,
    exitReason,
    holdingDays
  };
}

/**
 * Generate trade history with realistic win/loss distribution
 */
export function generateClosedPositions(count: number = 20): ClosedPosition[] {
  const positions: ClosedPosition[] = [];
  
  for (let i = 0; i < count; i++) {
    const stock = mockStocks[Math.floor(Math.random() * mockStocks.length)];
    const isWinner = Math.random() > 0.4; // 60% win rate
    positions.push(generateClosedPosition(stock, isWinner));
  }
  
  // Sort by exit date (most recent first)
  return positions.sort((a, b) => b.exitDate.getTime() - a.exitDate.getTime());
}

/**
 * Update position with new price (simulate real-time)
 */
export function updatePositionPrice(position: Position, newPrice: number): Position {
  const pnlData = calculateNetPnL(position.entryPrice, newPrice, position.shares);
  const rMultiple = calculateRMultiple(position.entryPrice, newPrice, position.stopPrice, position.shares);
  
  return {
    ...position,
    currentPrice: newPrice,
    currentValue: position.shares * newPrice,
    grossPnL: pnlData.grossPnL,
    netPnL: pnlData.netPnL,
    netPnLPercent: pnlData.netPnLPercent,
    rMultiple: Math.round(rMultiple * 100) / 100,
    status: newPrice >= position.entryPrice ? 'green' : 'red'
  };
}

/**
 * Create real-time price stream for positions
 */
export function createPositionPriceStream(
  positions: Position[],
  callback: (positions: Position[]) => void,
  intervalMs: number = 5000
): () => void {
  const interval = setInterval(() => {
    const updatedPositions = positions.map(pos => {
      // Simulate price movement (-1% to +1%)
      const changePercent = (Math.random() - 0.5) * 0.02;
      const newPrice = Math.round(pos.currentPrice * (1 + changePercent));
      return updatePositionPrice(pos, newPrice);
    });
    
    callback(updatedPositions);
  }, intervalMs);
  
  return () => clearInterval(interval);
}
