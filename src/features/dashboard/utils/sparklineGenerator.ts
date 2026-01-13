/**
 * Generate mock sparkline data for watchlist items
 * Creates a random walk pattern with slight upward or downward bias
 */
export const generateSparklineData = (
  points: number = 20,
  startValue: number = 100,
  volatility: number = 2,
  trend: 'up' | 'down' | 'neutral' = 'neutral'
): number[] => {
  const data: number[] = [startValue];
  
  const trendBias = trend === 'up' ? 0.3 : trend === 'down' ? -0.3 : 0;
  
  for (let i = 1; i < points; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    const change = randomChange + trendBias;
    const newValue = data[i - 1] + change;
    
    // Ensure value stays positive
    data.push(Math.max(newValue, startValue * 0.5));
  }
  
  return data;
};

/**
 * Calculate percentage change from sparkline data
 */
export const calculateChange = (data: number[]): number => {
  if (data.length < 2) return 0;
  
  const first = data[0];
  const last = data[data.length - 1];
  
  return ((last - first) / first) * 100;
};
