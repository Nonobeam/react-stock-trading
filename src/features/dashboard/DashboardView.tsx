import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { useAccount } from '../../context/AccountContext';
import { usePositions } from '../../context/PositionsContext';
import { useSetups } from '../../context/SetupsContext';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { LoadingSkeleton } from '../../shared/components/LoadingSkeleton';
import { Portfolio } from './components/Portfolio';
import { MarketIndexChart } from './components/MarketIndexChart';
import { WatchlistPanel } from './components/WatchlistPanel';
import { RecommendButton } from './components/RecommendButton';
import { RecommendModal } from './components/RecommendModal';
import { fetchRecommendation } from './utils/mockRecommendations';
import { recommendationsApi } from '../../services/api';
import { API_CONFIG } from '../../shared/constants/config';
import type { Recommendation } from './utils/mockRecommendations';
import type { RecommendationResponse } from '../../shared/types/dashboard';
import './DashboardView.css';

/**
 * Map API recommendation response to internal Recommendation type
 */
function mapRecommendationResponse(res: RecommendationResponse): Recommendation {
  return {
    symbol: res.symbol,
    action: res.action,
    confidence: res.confidence,
    rationale: res.rationale,
    targetPrice: res.targetPrice,
    stopLoss: res.stopLoss,
    timeframe: res.timeframe,
  };
}

export const DashboardView: React.FC = () => {
  const { isLoading: marketLoading } = useMarketData();
  const { account, isLoading: accountLoading } = useAccount();
  const { portfolioSummary, isLoading: positionsLoading } = usePositions();
  const { signals, isLoading: signalsLoading } = useSetups();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  const isLoading = marketLoading || accountLoading || positionsLoading || signalsLoading;

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__main">
          <div className="dashboard__left-column">
            <LoadingSkeleton variant="card" height="380px" />
            <LoadingSkeleton variant="card" height="300px" />
          </div>
          <div className="dashboard__right-column">
            <LoadingSkeleton variant="card" height="320px" />
            <LoadingSkeleton variant="card" height="180px" />
            <LoadingSkeleton variant="card" height="180px" />
            <LoadingSkeleton variant="card" height="200px" />
          </div>
        </div>
      </div>
    );
  }

  // Get top 5 signals by score
  const topSignals = signals.slice(0, 5);

  // Handle recommendation request
  const handleGetRecommendation = async () => {
    setIsLoadingRec(true);
    try {
      let rec: Recommendation;
      
      if (API_CONFIG.useMockData) {
        rec = await fetchRecommendation();
      } else {
        try {
          const response = await recommendationsApi.get({
            IncludePortfolio: true,
            IncludeMarketRegime: true,
            IncludeSignals: true,
          });
          rec = mapRecommendationResponse(response);
        } catch (apiError) {
          console.warn('API unavailable, falling back to mock data:', apiError);
          if (API_CONFIG.enableFallback) {
            rec = await fetchRecommendation();
          } else {
            throw apiError;
          }
        }
      }
      
      setRecommendation(rec);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch recommendation:', error);
    } finally {
      setIsLoadingRec(false);
    }
  };

  // Calculate stats for summary cards
  const totalBalance = account?.capital ?? 0;
  const totalEarnings = portfolioSummary?.totalPnL ?? 0 > 0 ? portfolioSummary?.totalPnL ?? 0 : 0;
  const totalLosses = portfolioSummary?.totalPnL ?? 0 < 0 ? Math.abs(portfolioSummary?.totalPnL ?? 0) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Trading Dashboard</h1>
        <p className="dashboard__subtitle">Real-time overview of your trading activity</p>
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard__main">
        {/* Left Column: Market Index Charts + Watchlist */}
        <div className="dashboard__left-column">
          <MarketIndexChart />
          <WatchlistPanel maxItems={20} />
        </div>

        {/* Right Column: Portfolio + Positions + Signals + AI Recommend */}
        <div className="dashboard__right-column">
          {/* Combined Portfolio: Pie Chart + Account Summary */}
          <Portfolio
            balance={totalBalance}
            earnings={totalEarnings}
            losses={totalLosses}
            isLoading={isLoading}
            account={account}
          />

          {/* Open Positions Card */}
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

          {/* Latest Signals Card */}
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

          {/* AI Recommendation Button */}
          <RecommendButton
            onRecommend={handleGetRecommendation}
            isLoading={isLoadingRec}
          />
        </div>
      </div>

      {/* Recommendation Modal */}
      <RecommendModal
        recommendation={recommendation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
