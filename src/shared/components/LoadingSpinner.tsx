import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'neutral';
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  message
}) => {
  const spinner = (
    <>
      <div className={`spinner spinner--${size} spinner--${color}`}>
        <div className="spinner__circle"></div>
      </div>
      {message && <p className="spinner__message">{message}</p>}
    </>
  );

  if (fullScreen) {
    return (
      <div className="spinner-container spinner-container--fullscreen">
        {spinner}
      </div>
    );
  }

  return (
    <div className="spinner-container">
      {spinner}
    </div>
  );
};
