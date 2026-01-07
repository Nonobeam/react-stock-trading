/**
 * Risk:Reward Validation Utility
 * Calculates and validates R:R ratio for trades
 */

export const MIN_RR_RATIO = 1.5;
export const GOOD_RR_RATIO = 2.0;
export const EXCELLENT_RR_RATIO = 3.0;

export interface RRValidation {
  ratio: number;
  valid: boolean;
  quality: 'POOR' | 'ACCEPTABLE' | 'GOOD' | 'EXCELLENT';
  message: string;
}

/**
 * Calculate Risk:Reward ratio
 */
export function calculateRR(
  entryPrice: number,
  stopPrice: number,
  targetPrice: number
): number {
  const risk = entryPrice - stopPrice;
  const reward = targetPrice - entryPrice;
  
  if (risk <= 0) return 0;
  
  return reward / risk;
}

/**
 * Validate Risk:Reward ratio
 */
export function validateRR(
  entryPrice: number,
  stopPrice: number,
  targetPrice: number
): RRValidation {
  const ratio = calculateRR(entryPrice, stopPrice, targetPrice);
  
  if (ratio < MIN_RR_RATIO) {
    return {
      ratio,
      valid: false,
      quality: 'POOR',
      message: `R:R ratio ${ratio.toFixed(2)}:1 is below minimum ${MIN_RR_RATIO}:1`
    };
  }
  
  if (ratio >= EXCELLENT_RR_RATIO) {
    return {
      ratio,
      valid: true,
      quality: 'EXCELLENT',
      message: `Excellent R:R ratio ${ratio.toFixed(2)}:1`
    };
  }
  
  if (ratio >= GOOD_RR_RATIO) {
    return {
      ratio,
      valid: true,
      quality: 'GOOD',
      message: `Good R:R ratio ${ratio.toFixed(2)}:1`
    };
  }
  
  return {
    ratio,
    valid: true,
    quality: 'ACCEPTABLE',
    message: `Acceptable R:R ratio ${ratio.toFixed(2)}:1`
  };
}

/**
 * Validate multiple targets and return the best R:R
 */
export function validateMultipleTargets(
  entryPrice: number,
  stopPrice: number,
  targets: number[]
): {
  individual: RRValidation[];
  best: RRValidation;
  worst: RRValidation;
  average: number;
} {
  if (targets.length === 0) {
    const emptyValidation: RRValidation = {
      ratio: 0,
      valid: false,
      quality: 'POOR',
      message: 'No targets specified'
    };
    return {
      individual: [],
      best: emptyValidation,
      worst: emptyValidation,
      average: 0
    };
  }

  const validations = targets.map(target => 
    validateRR(entryPrice, stopPrice, target)
  );
  
  const sortedByRatio = [...validations].sort((a, b) => b.ratio - a.ratio);
  const avgRatio = validations.reduce((sum, v) => sum + v.ratio, 0) / validations.length;
  
  return {
    individual: validations,
    best: sortedByRatio[0],
    worst: sortedByRatio[sortedByRatio.length - 1],
    average: avgRatio
  };
}

/**
 * Get color class for R:R display
 */
export function getRRColorClass(ratio: number): string {
  if (ratio < MIN_RR_RATIO) return 'rr-poor';
  if (ratio >= EXCELLENT_RR_RATIO) return 'rr-excellent';
  if (ratio >= GOOD_RR_RATIO) return 'rr-good';
  return 'rr-acceptable';
}

/**
 * Calculate minimum target price for desired R:R
 */
export function calculateMinTargetForRR(
  entryPrice: number,
  stopPrice: number,
  desiredRR: number
): number {
  const risk = entryPrice - stopPrice;
  return entryPrice + (risk * desiredRR);
}

/**
 * Check if trade setup meets R:R requirements
 */
export function meetsRRRequirements(
  entryPrice: number,
  stopPrice: number,
  targets: number[]
): boolean {
  if (targets.length === 0) return false;
  
  // At least one target must meet minimum R:R
  return targets.some(target => {
    const validation = validateRR(entryPrice, stopPrice, target);
    return validation.valid;
  });
}
