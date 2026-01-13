export interface Recommendation {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  rationale: string;
  targetPrice?: number;
  stopLoss?: number;
  timeframe?: 'short-term' | 'medium-term' | 'long-term';
}

const mockRecommendations: Recommendation[] = [
  {
    symbol: 'VNM',
    action: 'buy',
    confidence: 78,
    rationale: 'Technical indicators show bullish divergence with increasing volume. Market regime supports upward movement with strong fundamentals.',
    targetPrice: 92500,
    stopLoss: 86000,
    timeframe: 'short-term'
  },
  {
    symbol: 'VIC',
    action: 'buy',
    confidence: 85,
    rationale: 'Momentum indicators signal strong buying pressure. Price action breaking above key resistance with institutional accumulation.',
    targetPrice: 45000,
    stopLoss: 41000,
    timeframe: 'medium-term'
  },
  {
    symbol: 'HPG',
    action: 'sell',
    confidence: 72,
    rationale: 'Overbought conditions detected on multiple timeframes. Volume declining while price remains elevated, suggesting potential reversal.',
    targetPrice: 28000,
    stopLoss: 32000,
    timeframe: 'short-term'
  },
  {
    symbol: 'FPT',
    action: 'hold',
    confidence: 65,
    rationale: 'Mixed signals across indicators. Wait for clearer direction before establishing new positions. Monitor for breakout above 95k.',
    timeframe: 'medium-term'
  }
];

let currentIndex = 0;

export const fetchRecommendation = async (): Promise<Recommendation> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Rotate through recommendations
  const recommendation = mockRecommendations[currentIndex];
  currentIndex = (currentIndex + 1) % mockRecommendations.length;

  return recommendation;
};
