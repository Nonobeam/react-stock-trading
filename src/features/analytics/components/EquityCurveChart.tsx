import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  ColorType, 
  type IChartApi,
  AreaSeries,
  LineSeries 
} from 'lightweight-charts';
import type { EquityPoint } from '../../../shared/types';
import './EquityCurveChart.css';

interface EquityCurveChartProps {
  data: EquityPoint[];
  showBenchmark?: boolean;
  benchmarkData?: EquityPoint[];
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ 
  data, 
  showBenchmark = false,
  benchmarkData = [] 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const equitySeriesRef = useRef<any>(null);
  const benchmarkSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Create equity series
    const equitySeries = chart.addSeries(AreaSeries, {
      lineColor: '#2563eb',
      topColor: 'rgba(37, 99, 235, 0.3)',
      bottomColor: 'rgba(37, 99, 235, 0.05)',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1,
      },
    } as any);

    equitySeriesRef.current = equitySeries;

    // Create benchmark series if needed
    if (showBenchmark) {
      const benchmarkSeries = chart.addSeries(LineSeries, {
        color: '#94a3b8',
        lineWidth: 2,
        lineStyle: 2, // Dashed
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 1,
        },
      } as any);

      benchmarkSeriesRef.current = benchmarkSeries;
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [showBenchmark]);

  // Update data
  useEffect(() => {
    if (!equitySeriesRef.current || data.length === 0) return;

    const formattedData = data.map(point => ({
      time: Math.floor(point.date.getTime() / 1000) as any,
      value: point.equity,
    }));

    equitySeriesRef.current.setData(formattedData);
    
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  // Update benchmark data
  useEffect(() => {
    if (!benchmarkSeriesRef.current || !showBenchmark || benchmarkData.length === 0) return;

    const formattedData = benchmarkData.map(point => ({
      time: Math.floor(point.date.getTime() / 1000) as any,
      value: point.equity,
    }));

    benchmarkSeriesRef.current.setData(formattedData);
  }, [benchmarkData, showBenchmark]);

  if (data.length === 0) {
    return (
      <div className="equity-curve-chart">
        <div className="equity-curve-chart__empty">
          No equity curve data available
        </div>
      </div>
    );
  }

  const startEquity = data[0]?.equity || 0;
  const currentEquity = data[data.length - 1]?.equity || 0;
  const totalReturn = startEquity > 0 
    ? ((currentEquity - startEquity) / startEquity * 100).toFixed(2)
    : '0.00';

  return (
    <div className="equity-curve-chart">
      <div className="equity-curve-chart__header">
        <h3 className="equity-curve-chart__title">Equity Curve</h3>
        <div className="equity-curve-chart__stats">
          <div className="equity-curve-chart__stat">
            <span className="equity-curve-chart__stat-label">Start:</span>
            <span className="equity-curve-chart__stat-value">
              {startEquity.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="equity-curve-chart__stat">
            <span className="equity-curve-chart__stat-label">Current:</span>
            <span className="equity-curve-chart__stat-value">
              {currentEquity.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="equity-curve-chart__stat">
            <span className="equity-curve-chart__stat-label">Return:</span>
            <span className={`equity-curve-chart__stat-value ${parseFloat(totalReturn) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(totalReturn) >= 0 ? '+' : ''}{totalReturn}%
            </span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="equity-curve-chart__container" />
      {showBenchmark && (
        <div className="equity-curve-chart__legend">
          <div className="equity-curve-chart__legend-item">
            <span className="equity-curve-chart__legend-line equity-curve-chart__legend-line--equity"></span>
            <span>Your Equity</span>
          </div>
          <div className="equity-curve-chart__legend-item">
            <span className="equity-curve-chart__legend-line equity-curve-chart__legend-line--benchmark"></span>
            <span>VN-Index</span>
          </div>
        </div>
      )}
    </div>
  );
};
