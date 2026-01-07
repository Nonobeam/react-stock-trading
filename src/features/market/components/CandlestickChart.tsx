import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  type IChartApi, 
  type CandlestickData, 
  type Time,
  CandlestickSeries,
  HistogramSeries 
} from 'lightweight-charts';
import type { OHLCVBar } from '../../../shared/types';

interface CandlestickChartProps {
  data: OHLCVBar[];
  height?: number;
  onVisibleRangeChange?: (from: number, to: number) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = 400,
  onVisibleRangeChange,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1, // Normal crosshair
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Create volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Visible range change handler
    if (onVisibleRangeChange) {
      chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range) {
          // Get the visible time range
          const visibleData = data.slice(
            Math.max(0, Math.floor(range.from)),
            Math.min(data.length, Math.ceil(range.to) + 1)
          );
          if (visibleData.length > 0) {
            onVisibleRangeChange(
              visibleData[0].time,
              visibleData[visibleData.length - 1].time
            );
          }
        }
      });
    }

    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, onVisibleRangeChange]);

  // Update chart data
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || data.length === 0) {
      return;
    }

    // Convert OHLCVBar to Lightweight Charts format
    const candlestickData: CandlestickData[] = data.map((bar) => ({
      time: bar.time as Time,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
    }));

    const volumeData = data.map((bar) => ({
      time: bar.time as Time,
      value: bar.volume,
      color: bar.close >= bar.open ? '#26a69a80' : '#ef535080',
    }));

    candlestickSeriesRef.current.setData(candlestickData);
    volumeSeriesRef.current.setData(volumeData);

    // Fit content to visible range
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          Loading chart...
        </div>
      )}
      <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px` }} />
    </div>
  );
};
