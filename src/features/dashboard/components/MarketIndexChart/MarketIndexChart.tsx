import React, { useMemo, useState, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useMarketData } from '../../../../context/MarketDataContext';
import { useIndexQuotes } from '../../../../shared/hooks/useIndexQuotes';
import { LoadingSkeleton } from '../../../../shared/components/LoadingSkeleton';
import { IndexQuotesDisplay } from '../../../../shared/components/IndexQuotesDisplay';
import { IndexSubscriptionInput } from '../../../../shared/components/IndexSubscriptionInput';
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
  mqttValue?: number;     // Real-time MQTT value (overrides indexData.value)
  mqttChange?: number;    // Real-time MQTT change
  mqttChangePercent?: number; // Real-time MQTT change percent
}

// Memoize the chart component to prevent re-renders when parent updates
// Only re-render when the actual data changes
const SingleIndexChart: React.FC<SingleIndexChartProps> = memo(({ 
  indexData, 
  label,
  mqttValue,
  mqttChange,
  mqttChangePercent
}) => {
  // Use MQTT values when available, otherwise fall back to mock data
  const displayValue = mqttValue ?? indexData.value;
  const displayChange = mqttChange ?? indexData.change;
  const displayChangePercent = mqttChangePercent ?? indexData.changePercent;
  // Memoize chart data - depend on the actual data array
  const chartData = useMemo(() => {
    if (!indexData?.data || indexData.data.length === 0) {
      console.log('[Chart] No data for', label);
      return [];
    }
    console.log('[Chart] Rendering', label, 'with', indexData.data.length, 'points');
    return indexData.data.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
    }));
  }, [indexData?.data, label]);

  const isPositive = displayChangePercent >= 0;
  const lineColor = isPositive ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="market-index-chart__item">
      {/* Index Header */}
      <div className="market-index-chart__item-header">
        <span className="market-index-chart__item-label">{label}</span>
        <div className="market-index-chart__item-values">
          <span className="market-index-chart__item-value">
            {displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`market-index-chart__item-change ${isPositive ? 'market-index-chart__item-change--positive' : 'market-index-chart__item-change--negative'}`}>
            {isPositive ? '+' : ''}{displayChange.toFixed(2)} ({isPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%)
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
});

// Display name for debugging
SingleIndexChart.displayName = 'SingleIndexChart';

export const MarketIndexChart: React.FC = () => {
  const { marketData, isLoading, lastUpdated } = useMarketData();
  const { getQuote, quotesVersion, isConnected: isMqttConnected } = useIndexQuotes();
  const [showMqttPanel, setShowMqttPanel] = useState(false);

  // Get MQTT quotes for each index, memoized based on quotesVersion
  const mqttQuotes = useMemo(() => {
    if (!isMqttConnected) {
      console.log('[MarketIndexChart] MQTT not connected, using mock data');
      return {};
    }
    const quotes = {
      vnIndex: getQuote('VNINDEX'),
      vn30: getQuote('VN30'),
      vn100: getQuote('VN100'),
    };
    console.log('[MarketIndexChart] MQTT quotes:', quotes, 'version:', quotesVersion);
    return quotes;
  }, [isMqttConnected, getQuote, quotesVersion]);

  // Use lastUpdated from context (the refresh timestamp), not marketData.lastUpdate
  const lastUpdateTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', {
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
        <div className="market-index-chart__header-right">
          {isMqttConnected && (
            <span className="market-index-chart__live-badge">LIVE</span>
          )}
          <button
            className="market-index-chart__mqtt-toggle"
            onClick={() => setShowMqttPanel(!showMqttPanel)}
            title="Manage subscriptions"
          >
            {showMqttPanel ? '−' : '+'}
          </button>
          <span className="market-index-chart__update-time">
            Updated: {lastUpdateTime}
          </span>
        </div>
      </div>

      {/* MQTT Real-Time Quotes */}
      {isMqttConnected && (
        <div className="market-index-chart__mqtt-quotes">
          <IndexQuotesDisplay />
        </div>
      )}

      {/* Subscription Management Panel */}
      {showMqttPanel && (
        <div className="market-index-chart__mqtt-panel">
          <IndexSubscriptionInput />
        </div>
      )}

      <div className="market-index-chart__list">
        {INDICES.map((index) => {
          const indexData = marketData.indices[index.key];
          if (!indexData) return null;
          
          // Get MQTT real-time quote for this index (from memoized object)
          const mqttQuote = mqttQuotes[index.key];
          
          return (
            <SingleIndexChart
              key={index.key}
              indexData={indexData}
              label={index.label}
              mqttValue={mqttQuote?.value}
              mqttChange={mqttQuote?.change}
              mqttChangePercent={mqttQuote?.changePercent}
            />
          );
        })}
      </div>
    </div>
  );
};
