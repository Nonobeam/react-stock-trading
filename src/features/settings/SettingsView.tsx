/**
 * SettingsView - Application settings management
 */

import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TabNavigation } from '../../shared/components';
import type { Tab } from '../../shared/components';
import { TradingSettings } from './components/TradingSettings';
import { PositionSettings } from './components/PositionSettings';
import { PortfolioSettings } from './components/PortfolioSettings';
import { RiskSettings } from './components/RiskSettings';
import { NotificationSettings } from './components/NotificationSettings';
import { AppearanceSettings } from './components/AppearanceSettings';
import { DataSettings } from './components/DataSettings';
import { StockPreferencesSettings } from './components/StockPreferencesSettings';
import './SettingsView.css';

export function SettingsView() {
  const { isLoading, error } = useSettings();
  const [activeTab, setActiveTab] = useState('trading');

  const tabs: Tab[] = [
    { id: 'trading', label: 'Trading' },
    { id: 'position', label: 'Position Sizing' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'risk', label: 'Risk Limits' },
    { id: 'stock-preferences', label: 'Stock Preferences' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'data', label: 'Data' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'trading':
        return <TradingSettings />;
      case 'position':
        return <PositionSettings />;
      case 'portfolio':
        return <PortfolioSettings />;
      case 'risk':
        return <RiskSettings />;
      case 'stock-preferences':
        return <StockPreferencesSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'data':
        return <DataSettings />;
      default:
        return <TradingSettings />;
    }
  };

  if (isLoading) {
    return (
      <div className="settings-view">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-view">
      <header className="settings-header">
        <div className="settings-title-group">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Configure your trading application</p>
        </div>
      </header>

      {error && <div className="settings-error">{error}</div>}

      <div className="settings-content">
        <div className="settings-tabs">
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="settings-main">{renderContent()}</div>
      </div>
    </div>
  );
}
