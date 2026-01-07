import React from 'react';
import type { TradeSetup } from '../../../shared/types';
import './ScorecardDisplay.css';

interface ScorecardDisplayProps {
  setup: TradeSetup;
  onClose: () => void;
}

const ScorecardDisplay: React.FC<ScorecardDisplayProps> = ({ setup, onClose }) => {
  const { scoreBreakdown } = setup;

  const categories = [
    { name: 'Trend Alignment', score: scoreBreakdown.trend, max: 3 },
    { name: 'Setup Quality', score: scoreBreakdown.setup, max: 3 },
    { name: 'Momentum', score: scoreBreakdown.momentum, max: 2 },
    { name: 'Risk/Reward', score: scoreBreakdown.riskReward, max: 2 },
    { name: 'Market Context', score: scoreBreakdown.context, max: 3 },
  ];

  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const maxScore = categories.reduce((sum, cat) => sum + cat.max, 0);

  const getPercentage = (score: number, max: number) => (score / max) * 100;

  const getBarColor = (percentage: number): string => {
    if (percentage >= 80) return '#2e7d32';
    if (percentage >= 60) return '#689f38';
    if (percentage >= 40) return '#fbc02d';
    return '#d32f2f';
  };

  const getStrengths = (): string[] => {
    const strengths: string[] = [];
    
    if (scoreBreakdown.trend >= 2) {
      strengths.push('Strong trend alignment');
    }
    if (scoreBreakdown.setup >= 2) {
      strengths.push('High quality setup pattern');
    }
    if (scoreBreakdown.momentum >= 1.5) {
      strengths.push('Positive momentum indicators');
    }
    if (scoreBreakdown.riskReward >= 1.5) {
      strengths.push('Favorable risk/reward ratio');
    }
    if (scoreBreakdown.context >= 2) {
      strengths.push('Supportive market context');
    }
    
    return strengths;
  };

  const getWeaknesses = (): string[] => {
    const weaknesses: string[] = [];
    
    if (scoreBreakdown.trend < 2) {
      weaknesses.push('Weak trend alignment - consider waiting');
    }
    if (scoreBreakdown.setup < 2) {
      weaknesses.push('Setup pattern not fully formed');
    }
    if (scoreBreakdown.momentum < 1.5) {
      weaknesses.push('Limited momentum support');
    }
    if (scoreBreakdown.riskReward < 1.5) {
      weaknesses.push('Risk/reward ratio could be better');
    }
    if (scoreBreakdown.context < 2) {
      weaknesses.push('Market context not ideal');
    }
    
    return weaknesses;
  };

  const getRecommendation = (): string => {
    if (totalScore >= 11) {
      return 'Excellent setup. Strong candidate for position sizing at full allocation.';
    }
    if (totalScore >= 9) {
      return 'Good setup. Consider standard position sizing with normal allocation.';
    }
    if (totalScore >= 7) {
      return 'Acceptable setup. Use reduced position sizing or wait for confirmation.';
    }
    return 'Below threshold. Consider passing or waiting for better conditions.';
  };

  const strengths = getStrengths();
  const weaknesses = getWeaknesses();

  return (
    <div className="scorecard-overlay" onClick={onClose}>
      <div className="scorecard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scorecard-header">
          <h2>Setup Scorecard: {setup.symbol}</h2>
          <button className="scorecard-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="scorecard-body">
          {/* Total Score */}
          <div className="scorecard-total">
            <div className="total-score">
              <span className="score-value">{totalScore}</span>
              <span className="score-max">/ {maxScore}</span>
            </div>
            <div className="total-label">Total Score</div>
          </div>

          {/* Category Breakdown */}
          <div className="scorecard-categories">
            <h3>Score Breakdown</h3>
            {categories.map((cat) => {
              const percentage = getPercentage(cat.score, cat.max);
              return (
                <div key={cat.name} className="category-row">
                  <div className="category-label">
                    {cat.name}
                    <span className="category-score">
                      {cat.score} / {cat.max}
                    </span>
                  </div>
                  <div className="category-bar-container">
                    <div
                      className="category-bar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getBarColor(percentage),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="scorecard-section">
              <h3>✓ Strengths</h3>
              <ul className="strengths-list">
                {strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses.length > 0 && (
            <div className="scorecard-section">
              <h3>⚠ Weaknesses</h3>
              <ul className="weaknesses-list">
                {weaknesses.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          <div className="scorecard-recommendation">
            <h3>Recommendation</h3>
            <p>{getRecommendation()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorecardDisplay;
