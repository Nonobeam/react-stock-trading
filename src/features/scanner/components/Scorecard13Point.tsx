import React from 'react';
import type { Setup } from '../../../services/mock/setups';

interface Scorecard13PointProps {
  setup: Setup;
}

export const Scorecard13Point: React.FC<Scorecard13PointProps> = ({ setup }) => {
  // In a real implementation, these points would come from the backend.
  // For the UI prototype, we'll derive them from the overall setup score.
  const totalPoints = setup.score + 3; // mapping 1-10 mock score to roughly 13 points
  
  const categories = [
    { 
      name: 'Trend Alignment', 
      items: [
        { label: 'Long-term Trend', value: setup.score > 7 ? 1 : 0 },
        { label: 'Medium-term Trend', value: setup.score > 5 ? 1 : 0 },
        { label: 'Short-term Momentum', value: setup.score > 6 ? 1 : 0 },
      ]
    },
    { 
      name: 'Volume & Liquidity', 
      items: [
        { label: 'Volume Confirmation', value: setup.score > 4 ? 1 : 0 },
        { label: 'Liquidity Filter', value: 1 }, // Assume passed for mock
        { label: 'Relative Volume', value: setup.score > 8 ? 1 : 0 },
      ]
    },
    { 
      name: 'Technical Setup', 
      items: [
        { label: 'Pattern Quality', value: setup.score > 5 ? 1 : 0 },
        { label: 'Support/Resistance', value: setup.score > 3 ? 1 : 0 },
        { label: 'Indicator Alignment', value: setup.score > 6 ? 1 : 0 },
        { label: 'Price Action', value: setup.score > 4 ? 1 : 0 },
      ]
    },
    { 
      name: 'Risk/Reward', 
      items: [
        { label: 'R:R > 2:1', value: setup.riskRewardRatio > 2 ? 1 : 0 },
        { label: 'Tight Stop', value: setup.riskPercent < 5 ? 1 : 0 },
        { label: 'Clean Path to Target', value: setup.score > 7 ? 1 : 0 },
      ]
    }
  ];

  return (
    <div className="scorecard-13">
      <div className="scorecard-13__header">
        <h3>13-Point Quality Scorecard</h3>
        <div className="scorecard-13__total">{totalPoints}/13</div>
      </div>
      
      <div className="scorecard-13__content">
        {categories.map((cat, idx) => (
          <div key={idx} className="scorecard-category">
            <h4 className="category-title">{cat.name}</h4>
            <div className="scorecard-13__items">
              {cat.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className={`score-item ${item.value === 1 ? 'score-item--pass' : ''}`}
                >
                  <span className="score-item__label">{item.label}</span>
                  <span className="score-item__value">
                    {item.value === 1 ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scorecard-category {
          margin-bottom: var(--gap-4);
        }
        .category-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin-bottom: var(--gap-2);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: var(--gap-1);
        }
      `}</style>
    </div>
  );
};
