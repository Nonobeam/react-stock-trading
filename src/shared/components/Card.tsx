import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  padding?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default',
  padding = 'medium',
  onClick
}) => {
  const classNames = [
    'card',
    `card--${variant}`,
    `card--${padding}`,
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};
