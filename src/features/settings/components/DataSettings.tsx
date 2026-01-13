import { useSettings } from '../../../context/SettingsContext';
import './SettingsComponents.css';

export function DataSettings() {
  const { updateSettings, resetSettings, exportSettings } = useSettings();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          try {
            const importedSettings = JSON.parse(content);
            updateSettings(importedSettings);
            alert('Settings imported successfully');
          } catch (err) {
            alert('Failed to import settings: Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all trading data? This cannot be undone.')) {
      localStorage.clear();
      alert('All data cleared. Please refresh the page.');
    }
  };

  return (
    <div className="settings-section">
      <h2>Data Management</h2>
      <p className="section-description">Manage your application data and settings</p>

      <div className="settings-grid">
        <div className="setting-item setting-item-full">
          <label>Storage Usage</label>
          <p className="setting-hint">
            Using approximately {Math.round(JSON.stringify(localStorage).length / 1024)} KB of local storage
          </p>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-export" onClick={exportSettings}>
          Export Settings
        </button>
        <button className="btn-import" onClick={handleImport}>
          Import Settings
        </button>
        <button className="btn-reset" onClick={resetSettings}>
          Reset to Defaults
        </button>
        <button className="btn-reset" onClick={handleClearData}>
          Clear All Data
        </button>
      </div>
    </div>
  );
}
