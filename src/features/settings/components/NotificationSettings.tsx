import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Notifications</h2>
      <p className="section-description">Configure alerts and notification preferences</p>

      <div className="settings-grid">
        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.priceAlerts}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    priceAlerts: e.target.checked,
                  },
                })
              }
            />
            Enable price alerts
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.setupSignals}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    setupSignals: e.target.checked,
                  },
                })
              }
            />
            Notify when trade setups trigger
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.orderFills}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    orderFills: e.target.checked,
                  },
                })
              }
            />
            Notify on order fills
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.stopLossHits}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    stopLossHits: e.target.checked,
                  },
                })
              }
            />
            Alert when stop loss is hit
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.targetHits}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    targetHits: e.target.checked,
                  },
                })
              }
            />
            Alert when profit target is hit
          </label>
        </div>

        <div className="setting-item setting-item-full">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.lossLimitWarnings}
              onChange={(e) =>
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    lossLimitWarnings: e.target.checked,
                  },
                })
              }
            />
            Warn when approaching loss limits
          </label>
        </div>
      </div>
    </div>
  );
}
