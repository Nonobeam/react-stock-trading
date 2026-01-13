import React from 'react';
import { LoadingSkeleton } from '../../../../shared/components/LoadingSkeleton';
import './StatCard.css';

export interface StatCardProps {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  variant?: 'default' | 'primary';
  isLoading?: boolean;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend = 'neutral',
  trendValue,
  variant = 'default',
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className={`stat-card stat-card--${variant}`}>
        <LoadingSkeleton variant="text" width="60%" height="14px" />
        <div style={{ marginTop: 'var(--gap-sm)' }}>
          <LoadingSkeleton variant="text" width="80%" height="32px" />
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return null;
  };

  const trendIcon = getTrendIcon();

  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value-row">
        <div className="stat-card__value">{formatCurrency(value)}</div>
        {trendIcon && (
          <div className={`stat-card__trend stat-card__trend--${trend}`}>
            <span className="stat-card__trend-icon">{trendIcon}</span>
            {trendValue !== undefined && (
              <span className="stat-card__trend-value">
                {Math.abs(trendValue).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
