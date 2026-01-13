import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAccount } from '../../context/AccountContext';
import { usePositions } from '../../context/PositionsContext';
import { useSetups } from '../../context/SetupsContext';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import './DashboardView.css';

export const DashboardView: React.FC = () => {
  const { marketData, isLoading: marketLoading } = useMarketData();
  const { account, isLoading: accountLoading } = useAccount();
  const { portfolioSummary, isLoading: positionsLoading } = usePositions();
  const { signals, isLoading: signalsLoading } = useSetups();

  const isLoading = marketLoading || accountLoading || positionsLoading || signalsLoading;

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__grid">
          <LoadingSkeleton variant="card" height="200px" count={4} />
        </div>
      </div>
    );
  }

  // Get top 5 signals by score
  const topSignals = signals.slice(0, 5);

  // Determine regime badge variant
  const getRegimeBadge = (regime: string) => {
    switch (regime) {
      case 'trending-up':
        return 'success';
      case 'trending-down':
        return 'danger';
      case 'choppy':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Trading Dashboard</h1>
        <p className="dashboard__subtitle">Real-time overview of your trading activity</p>
      </div>

      <div className="dashboard__grid">
        {/* Market Overview Card */}
        <Card title="Market Overview" variant="elevated">
          <div className="market-overview">
            <div className="market-overview__main">
              <div className="market-overview__index">
                <span className="market-overview__label">VN-Index</span>
                <span className="market-overview__value">
                  {marketData?.vnIndex.toFixed(2)}
                </span>
              </div>
              <div className={`market-overview__change ${(marketData?.change ?? 0) >= 0 ? 'positive' : 'negative'}`}>
                <span>{(marketData?.change ?? 0) >= 0 ? '+' : ''}{marketData?.change.toFixed(2)}</span>
                <span>({(marketData?.changePercent ?? 0) >= 0 ? '+' : ''}{marketData?.changePercent.toFixed(2)}%)</span>
              </div>
            </div>

            <div className="market-overview__details">
              <div className="market-overview__row">
                <span className="label">Status:</span>
                <Badge variant={marketData?.marketStatus === 'open' ? 'success' : 'neutral'}>
                  {marketData?.marketStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="market-overview__row">
                <span className="label">Regime:</span>
                <Badge variant={getRegimeBadge(marketData?.regime ?? 'choppy')}>
                  {marketData?.regime.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="market-overview__row">
                <span className="label">Score:</span>
                <span className="value">{marketData?.regimeScore}/10</span>
              </div>
              <div className="market-overview__row">
                <span className="label">Breadth:</span>
                <span className="value text-success">{marketData?.breadth.advances}</span>
                <span className="separator">/</span>
                <span className="value text-danger">{marketData?.breadth.declines}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Summary Card */}
        <Card title="Account Summary" variant="elevated">
          <div className="account-summary">
            <div className="account-summary__row">
              <span className="label">Total Capital:</span>
              <span className="value">{account?.capital.toLocaleString()} VND</span>
            </div>
            <div className="account-summary__row">
              <span className="label">Available Cash:</span>
              <span className="value">{account?.cash.toLocaleString()} VND</span>
            </div>
            <div className="account-summary__row">
              <span className="label">Positions Value:</span>
              <span className="value">{account?.positionsValue.toLocaleString()} VND</span>
            </div>
            <div className="account-summary__divider"></div>
            <div className="account-summary__row highlight">
              <span className="label">Total P&L:</span>
              <span className={`value ${(account?.totalPnL ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                {(account?.totalPnL ?? 0) >= 0 ? '+' : ''}{account?.totalPnL.toLocaleString()} VND
                <span className="percentage">
                  ({(account?.totalPnLPercent ?? 0) >= 0 ? '+' : ''}{account?.totalPnLPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
            <div className="account-summary__row">
              <span className="label">Risk Exposure:</span>
              <span className="value">{account?.riskPercent.toFixed(2)}%</span>
            </div>
          </div>
        </Card>

        {/* Positions Overview Card */}
        <Card title="Open Positions" variant="elevated">
          <div className="positions-overview">
            <div className="positions-overview__stat">
              <span className="stat-label">Total Positions</span>
              <span className="stat-value">{portfolioSummary?.totalPositions ?? 0}</span>
            </div>
            <div className="positions-overview__stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">{portfolioSummary?.totalValue.toLocaleString() ?? '0'} VND</span>
            </div>
            <div className="positions-overview__divider"></div>
            <div className="positions-overview__stat highlight">
              <span className="stat-label">Unrealized P&L</span>
              <span className={`stat-value ${(portfolioSummary?.totalPnL ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                {(portfolioSummary?.totalPnL ?? 0) >= 0 ? '+' : ''}{portfolioSummary?.totalPnL.toLocaleString() ?? '0'} VND
                <span className="percentage">
                  ({(portfolioSummary?.totalPnLPercent ?? 0) >= 0 ? '+' : ''}{portfolioSummary?.totalPnLPercent.toFixed(2)}%)
                </span>
              </span>
            </div>
            <div className="positions-overview__stat">
              <span className="stat-label">Avg R-Multiple</span>
              <span className="stat-value">{portfolioSummary?.avgRMultiple.toFixed(2) ?? '0.00'}R</span>
            </div>
            <div className="positions-overview__stat">
              <span className="stat-label">Portfolio Risk</span>
              <span className="stat-value">{portfolioSummary?.riskPercent.toFixed(2) ?? '0.00'}%</span>
            </div>
          </div>
        </Card>

        {/* Recent Signals Card */}
        <Card title="Latest Signals" variant="elevated">
          <div className="recent-signals">
            {topSignals.length === 0 ? (
              <div className="recent-signals__empty">No active signals</div>
            ) : (
              topSignals.map((signal) => (
                <div key={signal.id} className="signal-item">
                  <div className="signal-item__header">
                    <span className="signal-item__symbol">{signal.symbol}</span>
                    <Badge 
                      variant={
                        signal.signalType === 'buy' ? 'success' : 
                        signal.signalType === 'sell' ? 'danger' : 
                        'neutral'
                      }
                      size="small"
                    >
                      {signal.signalType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="signal-item__details">
                    <span className="signal-item__name">{signal.name}</span>
                    <div className="signal-item__meta">
                      <Badge 
                        variant={
                          signal.strength === 'strong' ? 'success' :
                          signal.strength === 'moderate' ? 'warning' :
                          'neutral'
                        }
                        size="small"
                      >
                        {signal.strength}
                      </Badge>
                      <span className="signal-item__score">Score: {signal.score}/10</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
