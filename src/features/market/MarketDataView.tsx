import React, { useState, useEffect } from 'react';
import { CandlestickChart } from './components/CandlestickChart';
import { TimeframeSelector, type Timeframe } from './components/TimeframeSelector';
import { IndicatorsPanel } from './components/IndicatorsPanel';
import { SymbolInfoHeader } from './components/SymbolInfoHeader';
import { useMarketData as useMarketDataHook } from '../../shared/hooks/useMarketData';
import { useMarketData as useMarketDataContext } from '../../context';
import { apiClient } from '../../services/api/client';
import { wsClient } from '../../services/websocket/client';
import type { OHLCVBar, WebSocketMessage, OHLCData } from '../../shared/types';
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
  const [historicalData, setHistoricalData] = useState<OHLCVBar[]>([]);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);
  const [historicalError, setHistoricalError] = useState<string | null>(null);

  const { ohlcvData, indicators, isLoading, error, fetchData, refreshIndicators } = useMarketDataHook();
  const { setSelectedSymbol } = useMarketDataContext();

  // Initial data load
  useEffect(() => {
    fetchData(symbol, timeframe);
    setSelectedSymbol(symbol);
  }, [symbol, timeframe, fetchData, setSelectedSymbol]);

  // Fetch historical data from backend API
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!symbol) return;

      setIsLoadingHistorical(true);
      setHistoricalError(null);

      try {
        // Calculate date range (last 90 days for daily, last 7 days for intraday)
        const to = new Date();
        const from = new Date();
        
        if (timeframe === 'D' || timeframe === 'W') {
          from.setDate(from.getDate() - 90);
          const dailyBars = await apiClient.getHistoricalDaily(
            symbol,
            from.toISOString().split('T')[0],
            to.toISOString().split('T')[0]
          );
          
          // Convert to OHLCVBar format
          const converted: OHLCVBar[] = dailyBars.map((bar) => ({
            time: new Date(bar.date).getTime(),
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close,
            volume: bar.volume,
          }));
          setHistoricalData(converted);
        } else {
          from.setDate(from.getDate() - 7);
          const intradayBars = await apiClient.getHistoricalIntraday(
            symbol,
            timeframe,
            from.toISOString(),
            to.toISOString()
          );
          
          // Convert to OHLCVBar format
          const converted: OHLCVBar[] = intradayBars.map((bar) => ({
            time: new Date(bar.timestamp).getTime(),
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close,
            volume: bar.volume,
          }));
          setHistoricalData(converted);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch historical data';
        setHistoricalError(message);
        console.error('Error fetching historical data:', err);
      } finally {
        setIsLoadingHistorical(false);
      }
    };

    fetchHistoricalData();
  }, [symbol, timeframe]);

  // Subscribe to real-time OHLC updates
  useEffect(() => {
    if (!symbol || !timeframe) return;

    // Subscribe to OHLC topic for real-time candlestick updates
    const topic = `ohlc:${symbol}:${timeframe}`;
    wsClient.subscribeToTopics([topic]);

    const unsubscribe = wsClient.on('OHLC', (message: WebSocketMessage) => {
      if (message.type === 'OHLC' && message.data) {
        const ohlcData = message.data as OHLCData;
        if (ohlcData.symbol === symbol && ohlcData.interval === timeframe) {
          // Update or append the latest bar
          setHistoricalData((prev) => {
            const timestamp = new Date(ohlcData.timestamp).getTime();
            const newBar: OHLCVBar = {
              time: timestamp,
              open: ohlcData.open,
              high: ohlcData.high,
              low: ohlcData.low,
              close: ohlcData.close,
              volume: ohlcData.volume,
            };

            // Check if we should update the last bar or append a new one
            if (prev.length > 0) {
              const lastBar = prev[prev.length - 1];
              // If same time period, update; otherwise append
              if (Math.abs(lastBar.time - timestamp) < 60000) {
                return [...prev.slice(0, -1), newBar];
              }
            }
            return [...prev, newBar];
          });
        }
      }
    });

    return () => {
      unsubscribe();
      wsClient.unsubscribeFromTopics([topic]);
    };
  }, [symbol, timeframe]);

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

  // Use historical data if available, fallback to existing ohlcvData
  const chartData = historicalData.length > 0 ? historicalData : ohlcvData;
  const isLoadingChart = isLoading || isLoadingHistorical;
  const chartError = error || historicalError;

  return (
    <div className="market-data-view">
      <SymbolInfoHeader symbol={symbol} />

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
            {chartData.length > 0 && (
              <div className="current-price">
                <span className="price">{chartData[chartData.length - 1].close.toFixed(2)}</span>
                <span className="change">
                  {((chartData[chartData.length - 1].close - chartData[chartData.length - 1].open) / 
                    chartData[chartData.length - 1].open * 100).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <TimeframeSelector selected={timeframe} onChange={handleTimeframeChange} />
      </div>

      {chartError && (
        <div className="error-message">
          <strong>Error:</strong> {chartError}
        </div>
      )}

      {isLoadingChart ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading market data...</p>
        </div>
      ) : (
        <>
          <div className="chart-container">
            <CandlestickChart data={chartData} height={500} />
          </div>

          <div className="indicators-container">Chart
            <h3>Technical Indicators</h3>
            <IndicatorsPanel indicators={indicators} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};
