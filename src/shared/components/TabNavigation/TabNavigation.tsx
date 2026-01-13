/**
 * TabNavigation - Reusable tab navigation component
 */

import type { ReactNode } from 'react';
import './TabNavigation.css';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({ tabs, activeTab, onChange, className = '' }: TabNavigationProps) {
  return (
    <nav className={`tab-navigation ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span className="tab-label">{tab.label}</span>
          {tab.count !== undefined && tab.count > 0 && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
