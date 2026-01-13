/**
 * TradingSettings - Trading parameters configuration
 */

import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function TradingSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Trading Parameters</h2>
      <p className="section-description">Configure default trading behavior and calculations</p>

      <div className="settings-grid">
        <div className="setting-item">
          <label>Default Commission Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.tradingParameters.defaultCommissionRate * 100}
            onChange={(e) =>
              updateSettings({
                tradingParameters: {
                  ...settings.tradingParameters,
                  defaultCommissionRate: parseFloat(e.target.value) / 100,
                },
              })
            }
          />
          <span className="setting-hint">Current: {(settings.tradingParameters.defaultCommissionRate * 100).toFixed(2)}%</span>
        </div>

        <div className="setting-item">
          <label>Minimum Commission (VND)</label>
          <input
            type="number"
            min="0"
            value={settings.tradingParameters.minCommission}
            onChange={(e) =>
              updateSettings({
                tradingParameters: {
                  ...settings.tradingParameters,
                  minCommission: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.tradingParameters.taxRate * 100}
            onChange={(e) =>
              updateSettings({
                tradingParameters: {
                  ...settings.tradingParameters,
                  taxRate: parseFloat(e.target.value) / 100,
                },
              })
            }
          />
          <span className="setting-hint">Current: {(settings.tradingParameters.taxRate * 100).toFixed(2)}%</span>
        </div>

        <div className="setting-item">
          <label>Default Timeframe</label>
          <select
            value={settings.tradingParameters.defaultTimeframe}
            onChange={(e) =>
              updateSettings({
                tradingParameters: {
                  ...settings.tradingParameters,
                  defaultTimeframe: e.target.value,
                },
              })
            }
          >
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.tradingParameters.autoCalculateTargets}
              onChange={(e) =>
                updateSettings({
                  tradingParameters: {
                    ...settings.tradingParameters,
                    autoCalculateTargets: e.target.checked,
                  },
                })
              }
            />
            Auto-calculate profit targets based on R-multiple
          </label>
        </div>
      </div>
    </div>
  );
}
