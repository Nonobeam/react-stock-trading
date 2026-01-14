import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useMarketData } from '../../../../context/MarketDataContext';
import { LoadingSkeleton } from '../../../../shared/components/LoadingSkeleton';
import type { IndexData } from '../../../../services/mock/marketData';
import './MarketIndexChart.css';

type IndexKey = 'vnIndex' | 'vn30' | 'vn100';

interface IndexConfig {
  key: IndexKey;
  label: string;
}

const INDICES: IndexConfig[] = [
  { key: 'vnIndex', label: 'VNINDEX' },
  { key: 'vn30', label: 'VN30' },
  { key: 'vn100', label: 'VN100' },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const time = new Date(label).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="market-index-chart__tooltip">
        <p className="market-index-chart__tooltip-time">{time}</p>
        <p className="market-index-chart__tooltip-value">
          {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

interface SingleIndexChartProps {
  indexData: IndexData;
  label: string;
}

const SingleIndexChart: React.FC<SingleIndexChartProps> = ({ indexData, label }) => {
  const chartData = useMemo(() => {
    if (!indexData?.data) return [];
    return indexData.data.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
    }));
  }, [indexData]);

  const isPositive = (indexData?.changePercent ?? 0) >= 0;
  const lineColor = isPositive ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="market-index-chart__item">
      {/* Index Header */}
      <div className="market-index-chart__item-header">
        <span className="market-index-chart__item-label">{label}</span>
        <div className="market-index-chart__item-values">
          <span className="market-index-chart__item-value">
            {indexData.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`market-index-chart__item-change ${isPositive ? 'market-index-chart__item-change--positive' : 'market-index-chart__item-change--negative'}`}>
            {isPositive ? '+' : ''}{indexData.change.toFixed(2)} ({isPositive ? '+' : ''}{indexData.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="market-index-chart__item-chart">
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--border)"
              strokeOpacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              stroke="var(--muted)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="var(--muted)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: lineColor, stroke: 'var(--panel)', strokeWidth: 2 }}
              style={{
                filter: isPositive ? 'drop-shadow(0 0 6px rgba(74, 222, 128, 0.4))' : undefined,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MarketIndexChart: React.FC = () => {
  const { marketData, isLoading } = useMarketData();

  const lastUpdateTime = marketData?.lastUpdate
    ? new Date(marketData.lastUpdate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--';

  if (isLoading) {
    return (
      <div className="market-index-chart">
        <LoadingSkeleton variant="card" height="400px" />
      </div>
    );
  }

  if (!marketData?.indices) {
    return (
      <div className="market-index-chart market-index-chart--empty">
        <div className="market-index-chart__empty-state">
          <p className="market-index-chart__empty-title">No market data available</p>
          <p className="market-index-chart__empty-text">Market data will appear when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="market-index-chart">
      <div className="market-index-chart__header">
        <span className="market-index-chart__title">Market Indices</span>
        <span className="market-index-chart__update-time">
          Updated: {lastUpdateTime}
        </span>
      </div>

      <div className="market-index-chart__list">
        {INDICES.map((index) => {
          const indexData = marketData.indices[index.key];
          if (!indexData) return null;
          return (
            <SingleIndexChart
              key={index.key}
              indexData={indexData}
              label={index.label}
            />
          );
        })}
      </div>
    </div>
  );
};
