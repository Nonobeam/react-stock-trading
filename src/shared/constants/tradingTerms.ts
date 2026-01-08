/**
 * Trading Terminology Dictionary
 * 
 * Centralized definitions for all trading terms used throughout the application.
 * Each term includes a name, concise definition, and category for organization.
 */

/**
 * Category of trading term
 */
export type TermCategory = 'INDICATOR' | 'METRIC' | 'METHOD' | 'PATTERN' | 'CONCEPT';

/**
 * All supported trading term keys
 */
export type TermKey = 
  // Technical Indicators
  | 'RSI' 
  | 'MACD' 
  | 'ADX' 
  | 'ATR' 
  | 'STOCHASTIC' 
  | 'BOLLINGER_BANDS' 
  | 'VWAP' 
  | 'OBV' 
  | 'SMA' 
  | 'EMA'
  // Performance Metrics
  | 'WIN_RATE' 
  | 'SHARPE_RATIO' 
  | 'PROFIT_FACTOR' 
  | 'DRAWDOWN'
  | 'EXPECTANCY' 
  | 'SORTINO_RATIO' 
  | 'CALMAR_RATIO'
  // Risk Concepts
  | 'R_MULTIPLE' 
  | 'RISK_REWARD_RATIO' 
  | 'POSITION_SIZING'
  // Setup Types
  | 'PULLBACK' 
  | 'BREAKOUT' 
  | 'MEAN_REVERSION' 
  | 'CROSSOVER';

/**
 * Definition of a trading term
 */
export interface TermDefinition {
  /** Full display name of the term */
  name: string;
  /** Concise 1-3 sentence definition */
  definition: string;
  /** Category for organization */
  category: TermCategory;
  /** Alternative name or abbreviation (optional) */
  aka?: string;
}

/**
 * Complete trading terminology dictionary
 */
export const TRADING_TERMS: Record<TermKey, TermDefinition> = {
  // Technical Indicators
  RSI: {
    name: 'RSI',
    definition: 'Relative Strength Index. Momentum indicator measuring speed and magnitude of price changes. Values above 70 indicate overbought conditions, below 30 indicate oversold.',
    category: 'INDICATOR',
  },
  
  MACD: {
    name: 'MACD',
    definition: 'Moving Average Convergence Divergence. Trend-following momentum indicator showing the relationship between two moving averages. Crossovers signal potential buy or sell opportunities.',
    category: 'INDICATOR',
  },
  
  ADX: {
    name: 'ADX',
    definition: 'Average Directional Index. Measures trend strength regardless of direction. Values above 25 indicate strong trend, below 20 indicate weak or ranging market.',
    category: 'INDICATOR',
  },
  
  ATR: {
    name: 'ATR',
    definition: 'Average True Range. Volatility indicator measuring the average range between high and low prices. Higher values indicate greater volatility, useful for stop placement.',
    category: 'INDICATOR',
  },
  
  STOCHASTIC: {
    name: 'Stochastic',
    definition: 'Momentum indicator comparing closing price to price range over time. Values above 80 suggest overbought, below 20 suggest oversold conditions.',
    category: 'INDICATOR',
  },
  
  BOLLINGER_BANDS: {
    name: 'Bollinger Bands',
    definition: 'Volatility bands placed above and below a moving average. Price touching upper band suggests overbought, lower band suggests oversold. Band width indicates volatility.',
    category: 'INDICATOR',
  },
  
  VWAP: {
    name: 'VWAP',
    definition: 'Volume Weighted Average Price. Average price weighted by volume, used to assess if current price is above or below typical trading price for the period.',
    category: 'INDICATOR',
  },
  
  OBV: {
    name: 'OBV',
    definition: 'On-Balance Volume. Cumulative indicator relating volume to price changes. Rising OBV suggests accumulation, falling OBV suggests distribution.',
    category: 'INDICATOR',
  },
  
  SMA: {
    name: 'SMA',
    definition: 'Simple Moving Average. Average price over a specified period, giving equal weight to all prices. Used to identify trend direction and support/resistance levels.',
    category: 'INDICATOR',
  },
  
  EMA: {
    name: 'EMA',
    definition: 'Exponential Moving Average. Weighted moving average giving more importance to recent prices. More responsive to recent price changes than SMA.',
    category: 'INDICATOR',
  },
  
  // Performance Metrics
  WIN_RATE: {
    name: 'Win Rate',
    definition: 'Percentage of trades that were profitable. Above 60% is excellent, 45-60% is good. Higher win rate generally indicates consistent strategy execution.',
    category: 'METRIC',
  },
  
  SHARPE_RATIO: {
    name: 'Sharpe Ratio',
    definition: 'Risk-adjusted return metric measuring excess return per unit of risk. Above 2.0 is excellent, 1.0-2.0 is good. Higher values indicate better risk-adjusted performance.',
    category: 'METRIC',
  },
  
  PROFIT_FACTOR: {
    name: 'Profit Factor',
    definition: 'Ratio of gross profit to gross loss. Above 2.0 is excellent, 1.5-2.0 is good. Values above 1.0 indicate profitable trading system.',
    category: 'METRIC',
  },
  
  DRAWDOWN: {
    name: 'Max Drawdown',
    definition: 'Largest peak-to-trough decline in account value. Under 10% is excellent, 10-20% is acceptable. Measures worst-case loss and risk exposure.',
    category: 'METRIC',
  },
  
  EXPECTANCY: {
    name: 'Expectancy',
    definition: 'Average amount expected to win or lose per trade. Positive expectancy indicates profitable system. Calculated as (Win% × Avg Win) - (Loss% × Avg Loss).',
    category: 'METRIC',
  },
  
  SORTINO_RATIO: {
    name: 'Sortino Ratio',
    definition: 'Risk-adjusted return focusing only on downside volatility. Similar to Sharpe Ratio but penalizes only negative returns. Higher values indicate better downside-risk adjusted returns.',
    category: 'METRIC',
  },
  
  CALMAR_RATIO: {
    name: 'Calmar Ratio',
    definition: 'Annual return divided by maximum drawdown. Measures return relative to worst loss. Higher values indicate better risk-adjusted performance with controlled drawdowns.',
    category: 'METRIC',
  },
  
  // Risk Concepts
  R_MULTIPLE: {
    name: 'R-Multiple',
    definition: 'Risk unit measurement expressing profit or loss as multiple of initial risk. 1R = initial risk amount, 2R = twice initial risk. Used to normalize trade performance.',
    category: 'CONCEPT',
  },
  
  RISK_REWARD_RATIO: {
    name: 'Risk:Reward Ratio',
    definition: 'Ratio of potential profit to potential loss on a trade. Minimum 1.5:1 recommended, 2:1 or higher preferred. Ensures potential gains outweigh potential losses.',
    category: 'CONCEPT',
    aka: 'R:R Ratio',
  },
  
  POSITION_SIZING: {
    name: 'Position Sizing',
    definition: 'Calculation of how many shares to buy based on account size, risk tolerance, and stop distance. Critical for risk management and capital preservation.',
    category: 'METHOD',
  },
  
  // Setup Types
  PULLBACK: {
    name: 'Pullback',
    definition: 'Trading setup where price temporarily retraces against the primary trend before continuing. Offers lower-risk entry in established trend with support from moving averages.',
    category: 'PATTERN',
  },
  
  BREAKOUT: {
    name: 'Breakout',
    definition: 'Price moves above resistance or below support with increased volume. Signals potential new trend or continuation. Requires volume confirmation to avoid false breakouts.',
    category: 'PATTERN',
  },
  
  MEAN_REVERSION: {
    name: 'Mean Reversion',
    definition: 'Strategy assuming price will return to its average after extreme moves. Trades overbought/oversold conditions expecting price to revert to mean. Works best in ranging markets.',
    category: 'PATTERN',
  },
  
  CROSSOVER: {
    name: 'Crossover',
    definition: 'Trading signal when one indicator crosses above or below another. Common examples: moving average crossovers, MACD line crossing signal line. Indicates potential trend change.',
    category: 'PATTERN',
  },
};
