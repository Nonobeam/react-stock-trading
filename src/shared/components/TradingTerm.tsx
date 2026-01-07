import React from 'react';
import { Tooltip } from './Tooltip';
import { TRADING_TERMS, type TermKey } from '../constants/tradingTerms';
import './TradingTerm.css';

/**
 * Props for the TradingTerm component
 */
export interface TradingTermProps {
  /** Trading term key from the dictionary */
  term: TermKey;
  /** Custom display text (optional, defaults to term name) */
  display?: string;
  /** Tooltip position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Child elements to wrap (alternative to display prop) */
  children?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * TradingTerm Component
 * 
 * Displays trading terminology with hover-activated definition tooltips.
 * Wraps any trading term with a standardized tooltip showing its definition
 * from the centralized terminology dictionary.
 * 
 * @example
 * ```tsx
 * // Simple usage
 * <TradingTerm term="RSI" />
 * 
 * // With custom display text
 * <TradingTerm term="ATR" display="ATR (14)" />
 * 
 * // With children
 * <TradingTerm term="SHARPE_RATIO">
 *   <strong>Sharpe Ratio</strong>
 * </TradingTerm>
 * ```
 */
export const TradingTerm: React.FC<TradingTermProps> = ({
  term,
  display,
  position = 'top',
  children,
  className = '',
}) => {
  const definition = TRADING_TERMS[term];
  
  // Fallback if term not found
  if (!definition) {
    console.warn(`TradingTerm: No definition found for term "${term}"`);
    return <span className={className}>{children || display || term}</span>;
  }

  const displayText = children || display || definition.name;
  const tooltipContent = definition.definition;

  return (
    <Tooltip
      content={tooltipContent}
      position={position}
      transparent={true}
      maxWidth={300}
      className="trading-term-tooltip"
    >
      <span
        className={`trading-term ${className}`}
        role="term"
        aria-label={definition.name}
        aria-describedby={`tooltip-${term}`}
        tabIndex={0}
      >
        {displayText}
      </span>
    </Tooltip>
  );
};

// Re-export types for convenience
export type { TermKey, TermCategory } from '../constants/tradingTerms';
