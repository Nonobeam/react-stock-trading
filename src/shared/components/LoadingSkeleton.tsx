import React from 'react';
import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = ''
}) => {
  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'text':
        return '1rem';
      case 'circular':
        return width;
      case 'card':
        return '200px';
      default:
        return '100px';
    }
  };

  const skeletonStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof getHeight() === 'number' ? `${getHeight()}px` : getHeight(),
  };

  const classNames = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ');

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={classNames} style={skeletonStyle} />
        ))}
      </>
    );
  }

  return <div className={classNames} style={skeletonStyle} />;
};

// Specialized skeleton components
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="skeleton-chart">
      <div className="skeleton-chart__header">
        <LoadingSkeleton variant="text" width="200px" height="24px" />
        <LoadingSkeleton variant="text" width="150px" height="20px" />
      </div>
      <div className="skeleton-chart__body">
        <LoadingSkeleton variant="rectangular" height="400px" />
      </div>
      <div className="skeleton-chart__footer">
        <LoadingSkeleton variant="text" width="100px" count={5} />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="skeleton-table">
      {/* Header */}
      <div className="skeleton-table__row skeleton-table__row--header">
        {Array.from({ length: columns }).map((_, index) => (
          <LoadingSkeleton key={index} variant="text" height="20px" />
        ))}
      </div>
      {/* Body */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} variant="text" height="18px" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="skeleton-card">
      <LoadingSkeleton variant="text" width="60%" height="24px" />
      <LoadingSkeleton variant="text" width="100%" height="16px" count={3} />
      <div className="skeleton-card__footer">
        <LoadingSkeleton variant="rectangular" width="100px" height="32px" />
      </div>
    </div>
  );
};
