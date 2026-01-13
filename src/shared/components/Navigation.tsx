import React, { useState, useCallback } from 'react';
import { ConnectionStatus } from './ConnectionStatus';
import './Navigation.css';

type ViewType = 'dashboard' | 'market-data' | 'regime' | 'scanner' | 'risk' | 'monitoring' | 'analytics' | 'account' | 'trading';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const navItems = [
    { 
      id: 'dashboard' as ViewType, 
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    { 
      id: 'market-data' as ViewType, 
      label: 'Market Data',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    { 
      id: 'regime' as ViewType, 
      label: 'Regime',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    { 
      id: 'scanner' as ViewType, 
      label: 'Scanner',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      )
    },
    { 
      id: 'risk' as ViewType, 
      label: 'Risk',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
    { 
      id: 'monitoring' as ViewType, 
      label: 'Monitoring',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    },
    { 
      id: 'analytics' as ViewType, 
      label: 'Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    { 
      id: 'account' as ViewType, 
      label: 'Account',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    { 
      id: 'trading' as ViewType, 
      label: 'Trading',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
  ];

  const handleToggleClick = useCallback(() => {
    if (isPinned) {
      // If pinned, unpin and collapse
      setIsPinned(false);
      setIsExpanded(false);
    } else {
      // If not pinned, pin and expand
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, [isPinned]);

  const handleMouseEnter = useCallback(() => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  }, [isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  }, [isPinned]);

  return (
    <>
      <nav 
        className={`navigation ${isExpanded ? 'navigation--expanded' : 'navigation--collapsed'} ${isPinned ? 'navigation--pinned' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <div className="navigation__brand">
        <h1 className="navigation__title">GST</h1>
        <p className="navigation__subtitle">General Stock Trading</p>
      </div>

      <div className="navigation__items">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`navigation__item ${currentView === item.id ? 'navigation__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
          >
            <span className="navigation__icon">{item.icon}</span>
            <span className="navigation__label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navigation__status">
        <ConnectionStatus />
      </div>
    </nav>
    <div className={`navigation-spacer ${isExpanded ? 'navigation-spacer--expanded' : 'navigation-spacer--collapsed'}`} />
    </>
  );
};
