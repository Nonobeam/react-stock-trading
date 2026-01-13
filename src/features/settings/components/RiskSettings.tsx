import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function RiskSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Risk & Loss Limits</h2>
      <p className="section-description">Configure risk management and loss limit rules</p>

      <div className="settings-grid">
        <div className="setting-item">
          <label>Daily Loss Limit (VND)</label>
          <input
            type="number"
            min="0"
            value={settings.lossLimits.dailyLossLimit}
            onChange={(e) =>
              updateSettings({
                lossLimits: {
                  ...settings.lossLimits,
                  dailyLossLimit: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Weekly Loss Limit (VND)</label>
          <input
            type="number"
            min="0"
            value={settings.lossLimits.weeklyLossLimit}
            onChange={(e) =>
              updateSettings({
                lossLimits: {
                  ...settings.lossLimits,
                  weeklyLossLimit: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Max Consecutive Losses</label>
          <input
            type="number"
            min="1"
            value={settings.lossLimits.maxConsecutiveLosses}
            onChange={(e) =>
              updateSettings({
                lossLimits: {
                  ...settings.lossLimits,
                  maxConsecutiveLosses: parseInt(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.lossLimits.stopTradingOnLimitHit}
              onChange={(e) =>
                updateSettings({
                  lossLimits: {
                    ...settings.lossLimits,
                    stopTradingOnLimitHit: e.target.checked,
                  },
                })
              }
            />
            Automatically stop trading when loss limit is hit
          </label>
        </div>
      </div>
    </div>
  );
}
