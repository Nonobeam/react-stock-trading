import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { generateSparklineData, calculateChange } from '../../utils/sparklineGenerator';
import './WatchlistPanel.css';

export interface WatchlistItem {
  symbol: string;
  addedAt: number;
  isFavorite: boolean;
  price?: number;
  sparklineData?: number[];
}

const STORAGE_KEY = 'trading-watchlist';
const MAX_ITEMS = 20;

const WatchlistItemComponent: React.FC<{
  item: WatchlistItem;
  onRemove: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}> = ({ item, onRemove, onToggleFavorite }) => {
  const price = item.price || 90000 + Math.random() * 20000;
  const sparklineData = item.sparklineData || generateSparklineData(20, price, price * 0.02);
  const change = calculateChange(sparklineData);
  const isPositive = change >= 0;

  return (
    <div className="watchlist-item">
      <div className="watchlist-item__header">
        <button
          className={`watchlist-item__favorite ${item.isFavorite ? 'watchlist-item__favorite--active' : ''}`}
          onClick={() => onToggleFavorite(item.symbol)}
          aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {item.isFavorite ? '★' : '☆'}
        </button>
        <span className="watchlist-item__symbol">{item.symbol}</span>
        <button
          className="watchlist-item__remove"
          onClick={() => onRemove(item.symbol)}
          aria-label="Remove from watchlist"
        >
          ×
        </button>
      </div>
      <div className="watchlist-item__content">
        <div className="watchlist-item__price-section">
          <div className="watchlist-item__price">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className={`watchlist-item__change ${isPositive ? 'watchlist-item__change--positive' : 'watchlist-item__change--negative'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </div>
        </div>
        <div className="watchlist-item__sparkline">
          <ResponsiveContainer width="100%" height={24}>
            <LineChart data={sparklineData.map((value, index) => ({ value, index }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const WatchlistPanel: React.FC<{ maxItems?: number }> = ({ maxItems = MAX_ITEMS }) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [error, setError] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.warn('Failed to load watchlist from localStorage:', err);
      setItems([]);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err);
    }
  }, [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.addedAt - a.addedAt;
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return sortedItems;
    const query = searchQuery.toLowerCase();
    return sortedItems.filter(item => item.symbol.toLowerCase().includes(query));
  }, [sortedItems, searchQuery]);

  const handleAdd = () => {
    const symbol = newSymbol.trim().toUpperCase();
    
    if (!symbol) {
      setError('Symbol cannot be empty');
      return;
    }

    if (!/^[A-Z]{3,4}$/.test(symbol)) {
      setError('Invalid symbol format. Use 3-4 letters (e.g., VNM)');
      return;
    }

    if (items.some(item => item.symbol === symbol)) {
      setError(`${symbol} is already in your watchlist`);
      return;
    }

    if (items.length >= maxItems) {
      setError(`Watchlist limit reached (${maxItems} items)`);
      return;
    }

    const newItem: WatchlistItem = {
      symbol,
      addedAt: Date.now(),
      isFavorite: false
    };

    setItems(prev => [newItem, ...prev]);
    setNewSymbol('');
    setIsAdding(false);
    setError('');
  };

  const handleRemove = (symbol: string) => {
    setItems(prev => prev.filter(item => item.symbol !== symbol));
  };

  const handleToggleFavorite = (symbol: string) => {
    setItems(prev =>
      prev.map(item =>
        item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSymbol('');
      setError('');
    }
  };

  return (
    <div className="watchlist-panel">
      <div className="watchlist-panel__header">
        <h3 className="watchlist-panel__title">
          Watchlist {items.length > 0 && <span className="watchlist-panel__count">({items.length})</span>}
        </h3>
        <button
          className="watchlist-panel__add-btn"
          onClick={() => setIsAdding(!isAdding)}
          disabled={items.length >= maxItems}
          aria-label="Add symbol to watchlist"
        >
          {isAdding ? '×' : '+'}
        </button>
      </div>

      {isAdding && (
        <div className="watchlist-panel__add-form">
          <input
            type="text"
            className="watchlist-panel__input"
            placeholder="Enter symbol (e.g., VNM)"
            value={newSymbol}
            onChange={(e) => {
              setNewSymbol(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={4}
          />
          {error && <div className="watchlist-panel__error">{error}</div>}
        </div>
      )}

      {items.length > 0 && (
        <input
          type="text"
          className="watchlist-panel__search"
          placeholder="Search symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      <div className="watchlist-panel__list">
        {filteredItems.length === 0 && items.length === 0 && (
          <div className="watchlist-panel__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="watchlist-panel__empty-icon">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="var(--muted)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <p className="watchlist-panel__empty-title">No items in watchlist</p>
            <p className="watchlist-panel__empty-text">Click + to add symbols you want to track</p>
          </div>
        )}
        {filteredItems.length === 0 && items.length > 0 && (
          <div className="watchlist-panel__empty">
            <p className="watchlist-panel__empty-title">No results found</p>
            <p className="watchlist-panel__empty-text">Try a different search term</p>
          </div>
        )}
        {filteredItems.map((item) => (
          <WatchlistItemComponent
            key={item.symbol}
            item={item}
            onRemove={handleRemove}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
