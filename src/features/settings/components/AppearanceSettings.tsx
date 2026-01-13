import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Appearance</h2>
      <p className="section-description">Customize the look and feel of the application</p>

      <div className="settings-grid">
        <div className="setting-item">
          <label>Theme</label>
          <select
            value={settings.appearance.theme}
            onChange={(e) =>
              updateSettings({
                appearance: {
                  ...settings.appearance,
                  theme: e.target.value as 'dark' | 'light',
                },
              })
            }
          >
            <option value="dark">Dark (Fintech Neon)</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Chart Type</label>
          <select
            value={settings.appearance.chartType}
            onChange={(e) =>
              updateSettings({
                appearance: {
                  ...settings.appearance,
                  chartType: e.target.value as 'candle' | 'line',
                },
              })
            }
          >
            <option value="candle">Candlestick</option>
            <option value="line">Line</option>
          </select>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) =>
                updateSettings({
                  appearance: {
                    ...settings.appearance,
                    compactMode: e.target.checked,
                  },
                })
              }
            />
            Enable compact mode (reduced spacing)
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.appearance.showAdvancedFeatures}
              onChange={(e) =>
                updateSettings({
                  appearance: {
                    ...settings.appearance,
                    showAdvancedFeatures: e.target.checked,
                  },
                })
              }
            />
            Show advanced features
          </label>
        </div>
      </div>
    </div>
  );
}
