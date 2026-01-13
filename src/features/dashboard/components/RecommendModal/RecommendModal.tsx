import React, { useEffect } from 'react';
import type { Recommendation } from '../../utils/mockRecommendations';
import './RecommendModal.css';

interface RecommendModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist?: (symbol: string) => void;
}

export const RecommendModal: React.FC<RecommendModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onAddToWatchlist
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !recommendation) {
    return null;
  }

  const getActionColor = () => {
    switch (recommendation.action) {
      case 'buy':
        return 'var(--success)';
      case 'sell':
        return 'var(--danger)';
      case 'hold':
        return 'var(--warning)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getActionIcon = () => {
    switch (recommendation.action) {
      case 'buy':
        return '↑';
      case 'sell':
        return '↓';
      case 'hold':
        return '—';
      default:
        return '';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToWatchlist = () => {
    if (onAddToWatchlist && recommendation.symbol) {
      onAddToWatchlist(recommendation.symbol);
      onClose();
    }
  };

  return (
    <div className="recommend-modal__overlay" onClick={handleBackdropClick}>
      <div className="recommend-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="recommend-modal__header">
          <h2 id="modal-title" className="recommend-modal__title">AI Recommendation</h2>
          <button
            className="recommend-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="recommend-modal__content">
          <div className="recommend-modal__symbol-badge">
            {recommendation.symbol}
          </div>

          <div
            className="recommend-modal__action-pill"
            style={{ background: getActionColor() }}
          >
            <span className="recommend-modal__action-icon">{getActionIcon()}</span>
            <span className="recommend-modal__action-text">{recommendation.action.toUpperCase()}</span>
          </div>

          <div className="recommend-modal__confidence">
            <div className="recommend-modal__confidence-label">
              {recommendation.confidence}% Confidence
            </div>
            <div className="recommend-modal__confidence-bar">
              <div
                className="recommend-modal__confidence-fill"
                style={{ width: `${recommendation.confidence}%` }}
              />
            </div>
          </div>

          <div className="recommend-modal__rationale">
            <h3 className="recommend-modal__rationale-title">Analysis</h3>
            <p className="recommend-modal__rationale-text">{recommendation.rationale}</p>
          </div>

          {(recommendation.targetPrice || recommendation.stopLoss) && (
            <div className="recommend-modal__targets">
              {recommendation.targetPrice && (
                <div className="recommend-modal__target">
                  <span className="recommend-modal__target-label">Target Price</span>
                  <span className="recommend-modal__target-value">
                    ${recommendation.targetPrice.toLocaleString()}
                  </span>
                </div>
              )}
              {recommendation.stopLoss && (
                <div className="recommend-modal__target">
                  <span className="recommend-modal__target-label">Stop Loss</span>
                  <span className="recommend-modal__target-value">
                    ${recommendation.stopLoss.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="recommend-modal__footer">
          {onAddToWatchlist && (
            <button
              className="recommend-modal__button recommend-modal__button--primary"
              onClick={handleAddToWatchlist}
            >
              Add to Watchlist
            </button>
          )}
          <button
            className="recommend-modal__button recommend-modal__button--secondary"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
