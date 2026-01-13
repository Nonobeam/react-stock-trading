import React from 'react';
import './RMultipleDistribution.css';

interface RMultipleDistributionProps {
  distribution: Record<string, number>;
}

export const RMultipleDistribution: React.FC<RMultipleDistributionProps> = ({ distribution }) => {
  if (!distribution || Object.keys(distribution).length === 0) {
    return (
      <div className="rmultiple-distribution">
        <div className="rmultiple-distribution__empty">
          No R-multiple distribution data available
        </div>
      </div>
    );
  }

  // Sort ranges for proper display
  const sortedRanges = Object.entries(distribution).sort(([a], [b]) => {
    const aStart = parseFloat(a.split(' to ')[0].replace('R', ''));
    const bStart = parseFloat(b.split(' to ')[0].replace('R', ''));
    return aStart - bStart;
  });

  const maxCount = Math.max(...sortedRanges.map(([, count]) => count));
  const totalTrades = sortedRanges.reduce((sum, [, count]) => sum + count, 0);

  const getRangeColor = (range: string): string => {
    const startValue = parseFloat(range.split(' to ')[0].replace('R', ''));
    if (startValue < -2) return '#dc2626'; // Deep red
    if (startValue < -1) return '#ef4444'; // Red
    if (startValue < 0) return '#f87171'; // Light red
    if (startValue < 1) return '#fbbf24'; // Yellow/amber
    if (startValue < 2) return '#84cc16'; // Light green
    if (startValue < 3) return '#22c55e'; // Green
    return '#16a34a'; // Deep green
  };

  return (
    <div className="rmultiple-distribution">
      <div className="rmultiple-distribution__header">
        <h3 className="rmultiple-distribution__title">R-Multiple Distribution</h3>
        <span className="rmultiple-distribution__subtitle">
          {totalTrades} total trades
        </span>
      </div>
      
      <div className="rmultiple-distribution__chart">
        {sortedRanges.map(([range, count]) => {
          const percentage = ((count / totalTrades) * 100).toFixed(1);
          const barHeight = (count / maxCount) * 100;
          const color = getRangeColor(range);

          return (
            <div key={range} className="rmultiple-distribution__bar-container">
              <div 
                className="rmultiple-distribution__bar"
                style={{ 
                  height: `${barHeight}%`,
                  backgroundColor: color
                }}
                title={`${count} trades (${percentage}%)`}
              >
                <span className="rmultiple-distribution__bar-value">
                  {count}
                </span>
              </div>
              <div className="rmultiple-distribution__label">
                <span className="rmultiple-distribution__range">{range}</span>
                <span className="rmultiple-distribution__percentage">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rmultiple-distribution__legend">
        <div className="rmultiple-distribution__legend-item">
          <span className="rmultiple-distribution__legend-dot" style={{ backgroundColor: '#dc2626' }}></span>
          <span>Large Loss (&lt; -2R)</span>
        </div>
        <div className="rmultiple-distribution__legend-item">
          <span className="rmultiple-distribution__legend-dot" style={{ backgroundColor: '#fbbf24' }}></span>
          <span>Small Loss/Win (-1R to 1R)</span>
        </div>
        <div className="rmultiple-distribution__legend-item">
          <span className="rmultiple-distribution__legend-dot" style={{ backgroundColor: '#16a34a' }}></span>
          <span>Large Win (&gt; 3R)</span>
        </div>
      </div>
    </div>
  );
};
