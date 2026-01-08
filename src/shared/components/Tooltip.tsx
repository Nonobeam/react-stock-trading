import React, { useState } from 'react';
import './Tooltip.css';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  transparent?: boolean;
  maxWidth?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
  transparent = false,
  maxWidth
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipClasses = [
    'tooltip',
    `tooltip--${position}`,
    transparent && 'tooltip--transparent',
    maxWidth && 'tooltip--wide'
  ].filter(Boolean).join(' ');

  const tooltipStyle = maxWidth ? { maxWidth: `${maxWidth}px` } : undefined;

  return (
    <div 
      className={`tooltip-wrapper ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={tooltipClasses} style={tooltipStyle}>
          {content}
          <div className={`tooltip__arrow tooltip__arrow--${position}`}></div>
        </div>
      )}
    </div>
  );
};
