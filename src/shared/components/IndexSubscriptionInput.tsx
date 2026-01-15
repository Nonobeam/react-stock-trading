/**
 * IndexSubscriptionInput Component
 * Allows users to subscribe to additional market indices
 */

import React, { useState, useCallback } from 'react';
import { useIndexQuotes } from '../hooks/useIndexQuotes';
import { Button } from './Button';
import './IndexSubscriptionInput.css';

interface IndexSubscriptionInputProps {
  className?: string;
}

export const IndexSubscriptionInput: React.FC<IndexSubscriptionInputProps> = ({
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const {
    subscribedIndices,
    defaultIndices,
    customIndices,
    subscribeToIndex,
    unsubscribeFromIndex,
    isConnected,
    status,
  } = useIndexQuotes();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.toUpperCase());
    setError(null);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const indexCode = inputValue.trim();
    
    if (!indexCode) {
      setError('Please enter an index code');
      return;
    }
    
    if (subscribedIndices.includes(indexCode)) {
      setError('Already subscribed to this index');
      return;
    }
    
    subscribeToIndex(indexCode);
    setInputValue('');
    setError(null);
  }, [inputValue, subscribedIndices, subscribeToIndex]);

  const handleRemove = useCallback((indexCode: string) => {
    unsubscribeFromIndex(indexCode);
  }, [unsubscribeFromIndex]);

  const classNames = [
    'index-subscription',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="index-subscription__header">
        <h4 className="index-subscription__title">Index Subscriptions</h4>
        <span className={`index-subscription__status index-subscription__status--${status}`}>
          {isConnected ? 'Connected' : status}
        </span>
      </div>

      <form className="index-subscription__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="index-subscription__input"
          placeholder="Enter index code (e.g., HNX30)"
          value={inputValue}
          onChange={handleInputChange}
          disabled={!isConnected}
        />
        <Button
          type="submit"
          variant="primary"
          size="small"
          disabled={!isConnected || !inputValue.trim()}
        >
          Add
        </Button>
      </form>
      
      {error && (
        <p className="index-subscription__error">{error}</p>
      )}

      <div className="index-subscription__list">
        <div className="index-subscription__section">
          <span className="index-subscription__section-label">Default</span>
          <div className="index-subscription__tags">
            {defaultIndices.map((indexCode) => (
              <span key={indexCode} className="index-subscription__tag index-subscription__tag--default">
                {indexCode}
              </span>
            ))}
          </div>
        </div>

        {customIndices.length > 0 && (
          <div className="index-subscription__section">
            <span className="index-subscription__section-label">Custom</span>
            <div className="index-subscription__tags">
              {customIndices.map((indexCode) => (
                <span key={indexCode} className="index-subscription__tag index-subscription__tag--custom">
                  {indexCode}
                  <button
                    type="button"
                    className="index-subscription__tag-remove"
                    onClick={() => handleRemove(indexCode)}
                    aria-label={`Remove ${indexCode}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
