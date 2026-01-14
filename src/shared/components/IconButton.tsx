import React from 'react';
import './IconButton.css';

interface IconButtonProps {
  /** Icon content - string (e.g., '+', '×') or ReactNode */
  icon: React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';

  /** Button size */
  size?: 'small' | 'medium' | 'large';

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Required for accessibility */
  ariaLabel: string;

  /** Optional tooltip text (defaults to ariaLabel) */
  title?: string;

  /** Additional CSS class */
  className?: string;

  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ariaLabel,
  title,
  className = '',
  type = 'button',
}) => {
  const classNames = [
    'icon-button',
    `icon-button--${variant}`,
    `icon-button--${size}`,
    disabled || loading ? 'icon-button--disabled' : '',
    loading ? 'icon-button--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
    >
      {loading ? <span className="icon-button__spinner" /> : icon}
    </button>
  );
};
