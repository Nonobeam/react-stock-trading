/**
 * PositionSettings - Position sizing configuration
 */

import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function PositionSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Position Sizing</h2>
      <p className="section-description">Configure how position sizes are calculated</p>

      <div className="settings-grid">
        <div className="setting-item">
          <label>Position Sizing Method</label>
          <select
            value={settings.positionSizing.method}
            onChange={(e) =>
              updateSettings({
                positionSizing: {
                  ...settings.positionSizing,
                  method: e.target.value as 'fixed' | 'percent' | 'risk',
                },
              })
            }
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percent">Percentage of Capital</option>
            <option value="risk">Risk-Based</option>
          </select>
        </div>

        {settings.positionSizing.method === 'fixed' && (
          <div className="setting-item">
            <label>Fixed Position Size (VND)</label>
            <input
              type="number"
              min="0"
              value={settings.positionSizing.fixedAmount}
              onChange={(e) =>
                updateSettings({
                  positionSizing: {
                    ...settings.positionSizing,
                    fixedAmount: parseFloat(e.target.value),
                  },
                })
              }
            />
          </div>
        )}

        {settings.positionSizing.method === 'percent' && (
          <div className="setting-item">
            <label>Capital Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.positionSizing.percentOfCapital}
              onChange={(e) =>
                updateSettings({
                  positionSizing: {
                    ...settings.positionSizing,
                    percentOfCapital: parseFloat(e.target.value),
                  },
                })
              }
            />
          </div>
        )}

        {settings.positionSizing.method === 'risk' && (
          <div className="setting-item">
            <label>Risk Per Trade (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={settings.positionSizing.riskPerTrade}
              onChange={(e) =>
                updateSettings({
                  positionSizing: {
                    ...settings.positionSizing,
                    riskPerTrade: parseFloat(e.target.value),
                  },
                })
              }
            />
          </div>
        )}

        <div className="setting-item">
          <label>Max Position Size (VND)</label>
          <input
            type="number"
            min="0"
            value={settings.positionSizing.maxPositionSize}
            onChange={(e) =>
              updateSettings({
                positionSizing: {
                  ...settings.positionSizing,
                  maxPositionSize: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Min Position Size (VND)</label>
          <input
            type="number"
            min="0"
            value={settings.positionSizing.minPositionSize}
            onChange={(e) =>
              updateSettings({
                positionSizing: {
                  ...settings.positionSizing,
                  minPositionSize: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
