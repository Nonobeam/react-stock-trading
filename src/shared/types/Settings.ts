/**
 * Settings Model - System-wide configuration
 */

export interface Settings {
  // Trading Parameters
  tradingParameters: {
    defaultCommissionRate: number;
    minCommission: number;
    taxRate: number;
    defaultTimeframe: string;
    autoCalculateTargets: boolean;
  };
  
  // Position Sizing
  positionSizing: {
    method: 'fixed' | 'percent' | 'risk';
    fixedAmount?: number;
    percentOfCapital?: number;
    riskPerTrade?: number;
    defaultSize: number;
    maxPositionSize: number;
    minPositionSize: number;
    maxPositionValue: number;
    minPositionValue: number;
  };
  
  // Portfolio Limits
  portfolioLimits: {
    maxOpenPositions: number;
    maxPositionsPerSymbol: number;
    maxConcentrationPercent: number;
    maxSectorExposure: number;
    maxPortfolioRisk: number;
  };
  
  // Loss Limits
  lossLimits: {
    dailyLossLimit: number;
    weeklyLossLimit: number;
    maxConsecutiveLosses: number;
    stopTradingOnLimitHit: boolean;
    maxDailyLoss: number;
    maxWeeklyLoss: number;
    maxMonthlyLoss: number;
  };
  
  // Notifications
  notifications: {
    priceAlerts: boolean;
    setupSignals: boolean;
    orderFills: boolean;
    stopLossHits: boolean;
    targetHits: boolean;
    lossLimitWarnings: boolean;
    tradeEntryNotifications: boolean;
    tradeExitNotifications: boolean;
    riskLimitNotifications: boolean;
    marketUpdateNotifications: boolean;
  };
  
  // Appearance
  appearance: {
    theme: 'light' | 'dark' | 'system';
    chartType: 'candle' | 'line';
    chartStyle: 'candle' | 'line';
    showGridLines: boolean;
    compactMode: boolean;
    showAdvancedFeatures: boolean;
  };
  
  // Metadata
  version: string;
  lastUpdated: string;
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Settings = {
  tradingParameters: {
    defaultCommissionRate: 0.0025, // 0.25%
    minCommission: 500, // VND
    taxRate: 0.001, // 0.1%
    defaultTimeframe: '1D',
    autoCalculateTargets: true,
  },
  positionSizing: {
    method: 'fixed',
    fixedAmount: 10000000, // 10M VND
    percentOfCapital: 10, // 10%
    riskPerTrade: 1, // 1%
    defaultSize: 10000000, // 10M VND
    maxPositionSize: 100000000, // 100M VND
    minPositionSize: 1000000, // 1M VND
    maxPositionValue: 100000000, // 100M VND
    minPositionValue: 1000000, // 1M VND
  },
  portfolioLimits: {
    maxOpenPositions: 10,
    maxPositionsPerSymbol: 1,
    maxConcentrationPercent: 25, // 25%
    maxSectorExposure: 40, // 40%
    maxPortfolioRisk: 0.06, // 6%
  },
  lossLimits: {
    dailyLossLimit: 5000000, // 5M VND
    weeklyLossLimit: 15000000, // 15M VND
    maxConsecutiveLosses: 3,
    stopTradingOnLimitHit: true,
    maxDailyLoss: 5000000, // 5M VND
    maxWeeklyLoss: 15000000, // 15M VND
    maxMonthlyLoss: 50000000, // 50M VND
  },
  notifications: {
    priceAlerts: true,
    setupSignals: true,
    orderFills: true,
    stopLossHits: true,
    targetHits: true,
    lossLimitWarnings: true,
    tradeEntryNotifications: true,
    tradeExitNotifications: true,
    riskLimitNotifications: true,
    marketUpdateNotifications: false,
  },
  appearance: {
    theme: 'dark',
    chartType: 'candle',
    chartStyle: 'candle',
    showGridLines: true,
    compactMode: false,
    showAdvancedFeatures: false,
  },
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};
