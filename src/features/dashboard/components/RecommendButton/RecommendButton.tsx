import React from 'react';
import './RecommendButton.css';

interface RecommendButtonProps {
  onRecommend: () => Promise<void>;
  isLoading?: boolean;
}

export const RecommendButton: React.FC<RecommendButtonProps> = ({
  onRecommend,
  isLoading = false
}) => {
  const handleClick = async () => {
    try {
      await onRecommend();
    } catch (error) {
      console.error('Failed to get recommendation:', error);
    }
  };

  return (
    <button
      className="recommend-button"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="recommend-button__spinner"></span>
          <span>Generating recommendation...</span>
        </>
      ) : (
        <>
          <span className="recommend-button__icon">✨</span>
          <span>Get AI Recommendation</span>
        </>
      )}
    </button>
  );
};
