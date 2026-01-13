/**
 * Trade Model - Complete trade lifecycle tracking for Journal
 */

export interface Trade {
  id: string;
  symbol: string;
  
  // Entry details
  entry: {
    side: 'long' | 'short';
    price: number;
    quantity: number;
    timestamp: string; // ISO 8601
  };
  
  // Exit details (optional for open positions)
  exit?: {
    price: number;
    quantity: number;
    timestamp: string;
    reason: 'target' | 'stop' | 'time' | 'manual';
  };
  
  // Setup information
  setup: {
    name: string;
    timeframe: string;
    regime: string;
    quality: number; // 1-5
    description?: string;
  };
  
  // Risk management
  stopLoss?: number;
  takeProfit?: number;
  riskAmount?: number;
  
  // Financials (Vietnam-specific)
  commission?: number;
  tax?: number;
  grossProfit?: number;
  netProfit?: number;
  returnPercent?: number;
  rMultiple?: number;
  
  // Additional info
  notes?: string;
  tags?: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper functions for Trade calculations
 */
export const TradeCalculations = {
  /**
   * Calculate entry commission (0.25%, min 500 VND)
   */
  calculateEntryCommission(entryPrice: number, quantity: number): number {
    const value = entryPrice * quantity;
    const commission = value * 0.0025; // 0.25%
    return Math.max(commission, 500);
  },

  /**
   * Calculate exit commission (0.25%, min 500 VND)
   */
  calculateExitCommission(exitPrice: number, quantity: number): number {
    const value = exitPrice * quantity;
    const commission = value * 0.0025; // 0.25%
    return Math.max(commission, 500);
  },

  /**
   * Calculate exit tax (0.1% of exit value)
   */
  calculateExitTax(exitPrice: number, quantity: number): number {
    const value = exitPrice * quantity;
    return value * 0.001; // 0.1%
  },

  /**
   * Calculate complete trade P/L with Vietnam costs
   */
  calculatePL(trade: Trade): {
    grossProfit: number;
    netProfit: number;
    returnPercent: number;
    rMultiple: number;
    commission: number;
    tax: number;
  } | null {
    if (!trade.exit) return null;

    const entryValue = trade.entry.price * trade.entry.quantity;
    const exitValue = trade.exit.price * trade.exit.quantity;
    const grossProfit = exitValue - entryValue;

    const entryCommission = this.calculateEntryCommission(trade.entry.price, trade.entry.quantity);
    const exitCommission = this.calculateExitCommission(trade.exit.price, trade.exit.quantity);
    const exitTax = this.calculateExitTax(trade.exit.price, trade.exit.quantity);
    const totalCommission = entryCommission + exitCommission;

    const netProfit = grossProfit - totalCommission - exitTax;
    const returnPercent = (netProfit / entryValue) * 100;

    // Calculate R-multiple (using stop loss)
    let rMultiple = 0;
    if (trade.stopLoss && trade.riskAmount) {
      rMultiple = netProfit / trade.riskAmount;
    } else if (trade.stopLoss) {
      const riskPerShare = trade.entry.price - trade.stopLoss;
      const totalRisk = riskPerShare * trade.entry.quantity;
      rMultiple = totalRisk > 0 ? netProfit / totalRisk : 0;
    }

    return {
      grossProfit,
      netProfit,
      returnPercent,
      rMultiple,
      commission: totalCommission,
      tax: exitTax,
    };
  },

  /**
   * Calculate days held
   */
  calculateDaysHeld(entryTimestamp: string, exitTimestamp?: string): number {
    const entry = new Date(entryTimestamp);
    const exit = exitTimestamp ? new Date(exitTimestamp) : new Date();
    const diffTime = Math.abs(exit.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
};

/**
 * Trade creation helper
 */
export function createTrade(params: Partial<Trade> & {
  symbol: string;
  entry: {
    side: 'long' | 'short';
    price: number;
    quantity: number;
    timestamp: string;
  };
  setup: {
    name: string;
    timeframe: string;
    regime: string;
    quality: number;
    description?: string;
  };
}): Trade {
  const now = new Date().toISOString();

  return {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...params,
  } as Trade;
}
