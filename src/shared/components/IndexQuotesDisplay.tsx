/**
 * IndexQuotesDisplay Component
 * Displays real-time index quotes from MQTT
 */

import React from 'react';
import { useIndexQuotes } from '../hooks/useIndexQuotes';
import { Card } from './Card';
import './IndexQuotesDisplay.css';

interface IndexQuotesDisplayProps {
  className?: string;
  showSubscriptionInput?: boolean;
}

export const IndexQuotesDisplay: React.FC<IndexQuotesDisplayProps> = ({
  className = '',
  showSubscriptionInput: _showSubscriptionInput = false
}) => {
  const { quotesArray, isConnected, status, error } = useIndexQuotes();

  const formatValue = (value: number): string => {
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercent = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getChangeClass = (change: number): string => {
    if (change > 0) return 'index-quote--positive';
    if (change < 0) return 'index-quote--negative';
    return 'index-quote--neutral';
  };

  const classNames = [
    'index-quotes-display',
    className
  ].filter(Boolean).join(' ');

  if (!isConnected && quotesArray.length === 0) {
    return (
      <Card className={classNames}>
        <div className="index-quotes-display__status">
          <span className={`index-quotes-display__status-indicator index-quotes-display__status-indicator--${status}`} />
          <span className="index-quotes-display__status-text">
            {status === 'connecting' ? 'Connecting to market data...' :
             status === 'reconnecting' ? 'Reconnecting...' :
             error ? `Error: ${error.message}` :
             'Disconnected from market data'}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <div className={classNames}>
      <div className="index-quotes-display__grid">
        {quotesArray.map((quote) => (
          <div 
            key={quote.indexCode} 
            className={`index-quote ${getChangeClass(quote.change)}`}
          >
            <div className="index-quote__header">
              <span className="index-quote__code">{quote.indexCode}</span>
              <span className="index-quote__time">
                {quote.lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="index-quote__value">
              {formatValue(quote.value)}
            </div>
            <div className="index-quote__change">
              <span className="index-quote__change-value">
                {formatChange(quote.change)}
              </span>
              <span className="index-quote__change-percent">
                {formatPercent(quote.changePercent)}
              </span>
            </div>
            {quote.volume !== undefined && (
              <div className="index-quote__volume">
                Vol: {(quote.volume / 1000000).toFixed(2)}M
              </div>
            )}
          </div>
        ))}
      </div>
      
      {quotesArray.length === 0 && isConnected && (
        <div className="index-quotes-display__empty">
          Waiting for market data...
        </div>
      )}
    </div>
  );
};
