/**
 * ChartContainer - Wrapper for chart components with loading/error states
 */

import type { ReactNode } from 'react';
import './ChartContainer.css';

interface ChartContainerProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function ChartContainer({
  title,
  description,
  isLoading,
  error,
  children,
  actions,
}: ChartContainerProps) {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title-group">
          <h3 className="chart-title">{title}</h3>
          {description && <p className="chart-description">{description}</p>}
        </div>
        {actions && <div className="chart-actions">{actions}</div>}
      </div>

      <div className="chart-content">
        {isLoading && (
          <div className="chart-loading">
            <div className="spinner" />
            <span>Loading chart data...</span>
          </div>
        )}

        {error && (
          <div className="chart-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && children}
      </div>
    </div>
  );
}
