import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LoadingSkeleton } from "../../../../shared/components/LoadingSkeleton";
import "./Portfolio.css";

interface PortfolioProps {
  balance: number;
  earnings: number;
  losses: number;
  watchlistValue?: number;
  isLoading?: boolean;
  account?: {
    capital: number;
    cash: number;
    positionsValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    riskPercent: number;
  } | null;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  total?: number;
}

// Theme colors from FINTECH_NEON_THEME.md
const COLORS = {
  balance: "var(--accent)", // #dadd56 - Neon yellow-green
  earnings: "var(--success)", // #4ade80 - Green
  losses: "var(--danger)", // #ef4444 - Red
  watchlist: "var(--info)", // #3b82f6 - Blue
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const total = data.payload.total;
    const percentage = ((value / total) * 100).toFixed(1);

    return (
      <div className="portfolio-card__tooltip">
        <p className="portfolio-card__tooltip-label">{data.name}</p>
        <p className="portfolio-card__tooltip-value">
          $
          {value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="portfolio-card__tooltip-percent">{percentage}%</p>
      </div>
    );
  }
  return null;
};

export const Portfolio: React.FC<PortfolioProps> = ({
  balance,
  earnings,
  losses,
  watchlistValue = 0,
  isLoading = false,
  account,
}) => {
  const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set());

  const chartData = useMemo(() => {
    const data: ChartData[] = [];
    const total = balance + earnings + losses + watchlistValue;

    if (balance > 0) {
      data.push({
        name: "Total Balance",
        value: balance,
        color: COLORS.balance,
      });
    }
    if (earnings > 0) {
      data.push({
        name: "Total Earned",
        value: earnings,
        color: COLORS.earnings,
      });
    }
    if (losses > 0) {
      data.push({ name: "Total Lost", value: losses, color: COLORS.losses });
    }
    if (watchlistValue > 0) {
      data.push({
        name: "Watchlist Value",
        value: watchlistValue,
        color: COLORS.watchlist,
      });
    }

    // Add total for percentage calculations
    return data.map((item) => ({ ...item, total }));
  }, [balance, earnings, losses, watchlistValue]);

  const visibleData = useMemo(() => {
    return chartData.filter((item) => !hiddenSegments.has(item.name));
  }, [chartData, hiddenSegments]);

  const handleLegendClick = (entry: any) => {
    const name = entry.value;
    setHiddenSegments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="portfolio">
        <LoadingSkeleton variant="card" height="320px" />
      </div>
    );
  }

  const hasChartData =
    chartData.length > 0 && chartData.some((d) => d.value > 0);

  return (
    <div className="portfolio-card">
      <div className="portfolio-card__header">
        <span className="portfolio-card__title">Portfolio</span>
      </div>

      <div className="portfolio-card__content">
        {/* Left: Pie Chart */}
        <div className="portfolio-card__chart">
          {!hasChartData ? (
            <div className="portfolio-card__empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="portfolio-card__empty-icon"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="var(--muted)"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4m0 4h.01"
                  stroke="var(--muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="portfolio-card__empty-title">No portfolio data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={visibleData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-out"
                >
                  {visibleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  onClick={handleLegendClick}
                  wrapperStyle={{ cursor: "pointer" }}
                  formatter={(value: string) => (
                    <span
                      style={{
                        textDecoration: hiddenSegments.has(value)
                          ? "line-through"
                          : "none",
                        opacity: hiddenSegments.has(value) ? 0.5 : 1,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right: Account Summary */}
        <div className="portfolio-card__summary">
          <h4 className="portfolio-card__summary-title">Account Summary</h4>
          <div className="portfolio-card__summary-content">
            <div className="portfolio-card__summary-row">
              <span className="portfolio-card__summary-label">
                Total Capital:
              </span>
              <span className="portfolio-card__summary-value">
                {account?.capital.toLocaleString()} VND
              </span>
            </div>
            <div className="portfolio-card__summary-row">
              <span className="portfolio-card__summary-label">
                Available Cash:
              </span>
              <span className="portfolio-card__summary-value">
                {account?.cash.toLocaleString()} VND
              </span>
            </div>
            <div className="portfolio-card__summary-row">
              <span className="portfolio-card__summary-label">
                Positions Value:
              </span>
              <span className="portfolio-card__summary-value">
                {account?.positionsValue.toLocaleString()} VND
              </span>
            </div>
            <div className="portfolio-card__summary-divider"></div>
            <div className="portfolio-card__summary-row portfolio-card__summary-row--highlight">
              <span className="portfolio-card__summary-label">Total P&L:</span>
              <span
                className={`portfolio-card__summary-value ${(account?.totalPnL ?? 0) >= 0 ? "text-success" : "text-danger"}`}
              >
                {(account?.totalPnL ?? 0) >= 0 ? "+" : ""}
                {account?.totalPnL.toLocaleString()} VND
                <span className="portfolio-card__summary-percentage">
                  ({(account?.totalPnLPercent ?? 0) >= 0 ? "+" : ""}
                  {account?.totalPnLPercent?.toFixed(2)}%)
                </span>
              </span>
            </div>
            <div className="portfolio-card__summary-row">
              <span className="portfolio-card__summary-label">
                Risk Exposure:
              </span>
              <span className="portfolio-card__summary-value">
                {account?.riskPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
