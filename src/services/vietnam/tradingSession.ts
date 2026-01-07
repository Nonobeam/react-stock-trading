/**
 * Vietnam Trading Session Detection
 * Trading hours: 9:00-11:30 (Morning), 13:00-15:00 (Afternoon)
 * ATO: 09:00-09:15
 * ATC: 14:30-14:45
 */

export type TradingSession = 
  | 'PRE_MARKET'
  | 'ATO'
  | 'MORNING'
  | 'BREAK'
  | 'AFTERNOON'
  | 'ATC'
  | 'POST_MARKET';

export interface SessionInfo {
  session: TradingSession;
  isTrading: boolean;
  nextSessionStart?: Date;
  message: string;
}

/**
 * Get current trading session based on time
 */
export function getCurrentSession(now: Date = new Date()): SessionInfo {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  // Session boundaries (in minutes from midnight)
  const ATO_START = 9 * 60; // 09:00
  const ATO_END = 9 * 60 + 15; // 09:15
  const MORNING_END = 11 * 60 + 30; // 11:30
  const AFTERNOON_START = 13 * 60; // 13:00
  const ATC_START = 14 * 60 + 30; // 14:30
  const ATC_END = 14 * 60 + 45; // 14:45
  const MARKET_CLOSE = 15 * 60; // 15:00
  
  if (timeInMinutes < ATO_START) {
    return {
      session: 'PRE_MARKET',
      isTrading: false,
      nextSessionStart: getNextSessionTime(now, 9, 0),
      message: 'Market opens at 09:00'
    };
  }
  
  if (timeInMinutes >= ATO_START && timeInMinutes < ATO_END) {
    return {
      session: 'ATO',
      isTrading: true,
      message: 'ATO Session (09:00-09:15)'
    };
  }
  
  if (timeInMinutes >= ATO_END && timeInMinutes < MORNING_END) {
    return {
      session: 'MORNING',
      isTrading: true,
      message: 'Morning Trading Session'
    };
  }
  
  if (timeInMinutes >= MORNING_END && timeInMinutes < AFTERNOON_START) {
    return {
      session: 'BREAK',
      isTrading: false,
      nextSessionStart: getNextSessionTime(now, 13, 0),
      message: 'Lunch Break (11:30-13:00)'
    };
  }
  
  if (timeInMinutes >= AFTERNOON_START && timeInMinutes < ATC_START) {
    return {
      session: 'AFTERNOON',
      isTrading: true,
      message: 'Afternoon Trading Session'
    };
  }
  
  if (timeInMinutes >= ATC_START && timeInMinutes < ATC_END) {
    return {
      session: 'ATC',
      isTrading: true,
      message: 'ATC Session (14:30-14:45)'
    };
  }
  
  if (timeInMinutes >= ATC_END && timeInMinutes < MARKET_CLOSE) {
    return {
      session: 'AFTERNOON',
      isTrading: true,
      message: 'Final Trading Minutes'
    };
  }
  
  return {
    session: 'POST_MARKET',
    isTrading: false,
    nextSessionStart: getNextSessionTime(now, 9, 0, true),
    message: 'Market Closed'
  };
}

/**
 * Check if market is currently open for trading
 */
export function isMarketOpen(now: Date = new Date()): boolean {
  return getCurrentSession(now).isTrading;
}

/**
 * Get next session start time
 */
function getNextSessionTime(
  now: Date,
  hours: number,
  minutes: number,
  nextDay = false
): Date {
  const next = new Date(now);
  
  if (nextDay) {
    next.setDate(next.getDate() + 1);
  }
  
  next.setHours(hours, minutes, 0, 0);
  return next;
}

/**
 * Check if current time allows order placement
 */
export function canPlaceOrder(now: Date = new Date()): {
  allowed: boolean;
  reason?: string;
} {
  const sessionInfo = getCurrentSession(now);
  
  if (!sessionInfo.isTrading) {
    return {
      allowed: false,
      reason: sessionInfo.message
    };
  }
  
  return { allowed: true };
}
