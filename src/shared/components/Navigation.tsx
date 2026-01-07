import React from 'react';
import { ConnectionStatus } from './ConnectionStatus';
import './Navigation.css';

type ViewType = 'dashboard' | 'market-data' | 'regime' | 'scanner' | 'risk' | 'monitoring' | 'analytics';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard' },
    { id: 'market-data' as ViewType, label: 'Market Data' },
    { id: 'regime' as ViewType, label: 'Regime' },
    { id: 'scanner' as ViewType, label: 'Scanner' },
    { id: 'risk' as ViewType, label: 'Risk' },
    { id: 'monitoring' as ViewType, label: 'Monitoring' },
    { id: 'analytics' as ViewType, label: 'Analytics' },
  ];

  return (
    <nav className="navigation">
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
          >
            <span className="navigation__label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navigation__status">
        <ConnectionStatus />
      </div>
    </nav>
  );
};
