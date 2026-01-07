import React, { useState, useEffect } from 'react';
import { CandlestickChart } from './components/CandlestickChart';
import { TimeframeSelector, type Timeframe } from './components/TimeframeSelector';
import { IndicatorsPanel } from './components/IndicatorsPanel';
import { useMarketData as useMarketDataHook } from '../../shared/hooks/useMarketData';
import { useMarketData as useMarketDataContext } from '../../context';
import './MarketDataView.css';

interface MarketDataViewProps {
  defaultSymbol?: string;
  defaultTimeframe?: Timeframe;
}

export const MarketDataView: React.FC<MarketDataViewProps> = ({
  defaultSymbol = 'VNM',
  defaultTimeframe = '15m',
}) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [timeframe, setTimeframe] = useState<Timeframe>(defaultTimeframe);
  const [symbolInput, setSymbolInput] = useState(defaultSymbol);

  const { ohlcvData, indicators, isLoading, error, fetchData, refreshIndicators } = useMarketDataHook();
  const { setSelectedSymbol } = useMarketDataContext();

  // Initial data load
  useEffect(() => {
    fetchData(symbol, timeframe);
    setSelectedSymbol(symbol);
  }, [symbol, timeframe, fetchData, setSelectedSymbol]);

  // Auto-refresh indicators every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshIndicators(symbol, timeframe);
    }, 30000);

    return () => clearInterval(interval);
  }, [symbol, timeframe, refreshIndicators]);

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upperSymbol = symbolInput.trim().toUpperCase();
    if (upperSymbol && upperSymbol !== symbol) {
      setSymbol(upperSymbol);
    }
  };

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="market-data-view">
      <div className="market-header">
        <div className="symbol-selector">
          <form onSubmit={handleSymbolSubmit}>
            <input
              type="text"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="Enter symbol (e.g., VNM)"
              className="symbol-input"
              maxLength={10}
            />
            <button type="submit" className="symbol-btn">
              Load
            </button>
          </form>
          <div className="symbol-display">
            <h2>{symbol}</h2>
            {ohlcvData.length > 0 && (
              <div className="current-price">
                <span className="price">{ohlcvData[ohlcvData.length - 1].close.toFixed(2)}</span>
                <span className="change">
                  {((ohlcvData[ohlcvData.length - 1].close - ohlcvData[ohlcvData.length - 1].open) / 
                    ohlcvData[ohlcvData.length - 1].open * 100).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <TimeframeSelector selected={timeframe} onChange={handleTimeframeChange} />
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading market data...</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            <CandlestickChart data={ohlcvData} height={500} />
          </div>

          <div className="indicators-container">
            <h3>Technical Indicators</h3>
            <IndicatorsPanel indicators={indicators} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};
