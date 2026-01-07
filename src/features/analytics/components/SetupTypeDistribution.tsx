import React from 'react';
import './SetupTypeDistribution.css';

interface SetupTypeDistributionProps {
  distribution: Record<string, {
    winRate: number;
    avgR: number;
    count: number;
  }>;
}

export const SetupTypeDistribution: React.FC<SetupTypeDistributionProps> = ({ distribution }) => {
  if (!distribution || Object.keys(distribution).length === 0) {
    return (
      <div className="setup-type-distribution">
        <div className="setup-type-distribution__empty">
          No setup type data available
        </div>
      </div>
    );
  }

  // Sort by performance (avgR descending)
  const sortedSetups = Object.entries(distribution).sort(
    ([, a], [, b]) => b.avgR - a.avgR
  );

  const getBadgeClass = (avgR: number): string => {
    if (avgR >= 0.5) return 'excellent';
    if (avgR >= 0.2) return 'good';
    if (avgR >= 0) return 'neutral';
    return 'poor';
  };

  const getWinRateBadge = (winRate: number): string => {
    if (winRate >= 0.6) return 'excellent';
    if (winRate >= 0.45) return 'good';
    return 'poor';
  };

  return (
    <div className="setup-type-distribution">
      <div className="setup-type-distribution__header">
        <h3 className="setup-type-distribution__title">Performance by Setup Type</h3>
      </div>

      <div className="setup-type-distribution__table">
        <div className="setup-type-distribution__table-header">
          <div className="setup-type-distribution__col setup-type-distribution__col--setup">Setup Type</div>
          <div className="setup-type-distribution__col setup-type-distribution__col--count">Trades</div>
          <div className="setup-type-distribution__col setup-type-distribution__col--winrate">Win Rate</div>
          <div className="setup-type-distribution__col setup-type-distribution__col--avgr">Avg R</div>
        </div>

        {sortedSetups.map(([setupType, stats], index) => {
          const totalProfit = stats.avgR * stats.count;
          
          return (
            <div 
              key={setupType} 
              className={`setup-type-distribution__row ${index === 0 ? 'setup-type-distribution__row--best' : ''}`}
            >
              <div className="setup-type-distribution__col setup-type-distribution__col--setup">
                <span className="setup-type-distribution__setup-name">{setupType}</span>
                {index === 0 && (
                  <span className="setup-type-distribution__badge setup-type-distribution__badge--best">
                    BEST
                  </span>
                )}
              </div>
              
              <div className="setup-type-distribution__col setup-type-distribution__col--count">
                {stats.count}
              </div>
              
              <div className="setup-type-distribution__col setup-type-distribution__col--winrate">
                <span className={`setup-type-distribution__winrate setup-type-distribution__winrate--${getWinRateBadge(stats.winRate)}`}>
                  {(stats.winRate * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="setup-type-distribution__col setup-type-distribution__col--avgr">
                <span className={`setup-type-distribution__avgr setup-type-distribution__avgr--${getBadgeClass(stats.avgR)}`}>
                  {stats.avgR >= 0 ? '+' : ''}{stats.avgR.toFixed(2)}R
                </span>
                <span className="setup-type-distribution__total">
                  ({totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(1)}R total)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="setup-type-distribution__insights">
        <h4 className="setup-type-distribution__insights-title">Key Insights:</h4>
        <ul className="setup-type-distribution__insights-list">
          <li>
            <strong>{sortedSetups[0][0]}</strong> is your most profitable setup with{' '}
            <strong>{sortedSetups[0][1].avgR.toFixed(2)}R</strong> average return
          </li>
          {sortedSetups.length > 1 && sortedSetups[sortedSetups.length - 1][1].avgR < 0 && (
            <li className="setup-type-distribution__warning">
              Consider avoiding <strong>{sortedSetups[sortedSetups.length - 1][0]}</strong> setups 
              (negative expectancy: {sortedSetups[sortedSetups.length - 1][1].avgR.toFixed(2)}R)
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
