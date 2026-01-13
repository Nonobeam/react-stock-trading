import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/api/client';
import { wsClient } from '../../../services/websocket/client';
import type { SymbolInfo, WebSocketMessage, StockInfoData } from '../../../shared/types';
import './SymbolInfoHeader.css';

interface SymbolInfoHeaderProps {
  symbol: string;
}

export const SymbolInfoHeader: React.FC<SymbolInfoHeaderProps> = ({ symbol }) => {
  const [symbolInfo, setSymbolInfo] = useState<SymbolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch symbol info
  useEffect(() => {
    const fetchSymbolInfo = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.getSymbolInfo(symbol);
        setSymbolInfo(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch symbol info';
        setError(message);
        console.error('Error fetching symbol info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymbolInfo();
  }, [symbol]);

  // Subscribe to real-time STOCK_INFO updates
  useEffect(() => {
    if (!symbol) return;

    // Subscribe to stock info topic
    wsClient.subscribeToTopics([`stock:${symbol}`]);

    // Handle STOCK_INFO messages
    const unsubscribe = wsClient.on('STOCK_INFO', (message: WebSocketMessage) => {
      if (message.type === 'STOCK_INFO' && message.data) {
        const stockData = message.data as StockInfoData;
        if (stockData.symbol === symbol && symbolInfo) {
          // Update only the real-time fields
          setSymbolInfo((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              lastPrice: stockData.lastPrice,
              change: stockData.change,
              changePercent: stockData.changePercent,
              volume: stockData.volume,
              timestamp: stockData.timestamp,
            };
          });
        }
      }
    });

    return () => {
      unsubscribe();
      wsClient.unsubscribeFromTopics([`stock:${symbol}`]);
    };
  }, [symbol, symbolInfo]);

  if (isLoading && !symbolInfo) {
    return (
      <div className="symbol-info-header loading">
        <div className="loading-placeholder">Loading symbol info...</div>
      </div>
    );
  }

  if (error && !symbolInfo) {
    return (
      <div className="symbol-info-header error">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!symbolInfo) {
    return null;
  }

  const priceChangeClass = symbolInfo.change > 0 ? 'positive' : symbolInfo.change < 0 ? 'negative' : 'neutral';
  const formatPrice = (price: number) => price.toFixed(2);
  const formatVolume = (volume: number) => new Intl.NumberFormat('vi-VN').format(volume);

  return (
    <div className="symbol-info-header">
      <div className="info-row primary">
        <div className="info-group">
          <span className="label">Symbol</span>
          <span className="value symbol-name">{symbolInfo.symbol}</span>
        </div>

        <div className="info-group">
          <span className="label">Last Price</span>
          <span className={`value price ${priceChangeClass}`}>
            {formatPrice(symbolInfo.lastPrice)}
          </span>
        </div>

        <div className="info-group">
          <span className="label">Change</span>
          <span className={`value change ${priceChangeClass}`}>
            {symbolInfo.change > 0 ? '+' : ''}{formatPrice(symbolInfo.change)} 
            ({symbolInfo.changePercent > 0 ? '+' : ''}{symbolInfo.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="info-group">
          <span className="label">Volume</span>
          <span className="value">{formatVolume(symbolInfo.volume)}</span>
        </div>
      </div>

      <div className="info-row secondary">
        <div className="info-group">
          <span className="label">Reference</span>
          <span className="value reference">{formatPrice(symbolInfo.reference)}</span>
        </div>

        <div className="info-group">
          <span className="label">Ceiling</span>
          <span className="value ceiling">{formatPrice(symbolInfo.ceiling)}</span>
        </div>

        <div className="info-group">
          <span className="label">Floor</span>
          <span className="value floor">{formatPrice(symbolInfo.floor)}</span>
        </div>

        <div className="info-group">
          <span className="label">Bid/Ask</span>
          <span className="value">
            {formatPrice(symbolInfo.bidPrice)} / {formatPrice(symbolInfo.askPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
