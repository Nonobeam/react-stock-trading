import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function PortfolioSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="settings-section">
      <h2>Portfolio Limits</h2>
      <p className="section-description">Configure portfolio-wide position and concentration limits</p>

      <div className="settings-grid">
        <div className="setting-item">
          <label>Max Open Positions</label>
          <input
            type="number"
            min="1"
            value={settings.portfolioLimits.maxOpenPositions}
            onChange={(e) =>
              updateSettings({
                portfolioLimits: {
                  ...settings.portfolioLimits,
                  maxOpenPositions: parseInt(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Max Positions Per Symbol</label>
          <input
            type="number"
            min="1"
            value={settings.portfolioLimits.maxPositionsPerSymbol}
            onChange={(e) =>
              updateSettings({
                portfolioLimits: {
                  ...settings.portfolioLimits,
                  maxPositionsPerSymbol: parseInt(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Max Concentration (%)</label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={settings.portfolioLimits.maxConcentrationPercent}
            onChange={(e) =>
              updateSettings({
                portfolioLimits: {
                  ...settings.portfolioLimits,
                  maxConcentrationPercent: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="setting-item">
          <label>Max Sector Exposure (%)</label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={settings.portfolioLimits.maxSectorExposure}
            onChange={(e) =>
              updateSettings({
                portfolioLimits: {
                  ...settings.portfolioLimits,
                  maxSectorExposure: parseFloat(e.target.value),
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
