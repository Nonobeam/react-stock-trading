/**
 * SettingsContext - Manages application settings
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Settings } from '../shared/types/Settings';
import { DEFAULT_SETTINGS } from '../shared/types/Settings';
import { LocalStorageProvider } from '../services/storage/StorageService';

interface SettingsContextValue {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (settingsJson: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const storage = new LocalStorageProvider();
const SETTINGS_KEY = 'settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from storage on mount
  useEffect(() => {
    try {
      const storedSettings = storage.get<Settings>(SETTINGS_KEY);
      if (storedSettings) {
        // Merge with defaults to ensure all new fields are present
        setSettings({ ...DEFAULT_SETTINGS, ...storedSettings });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist settings to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        storage.set(SETTINGS_KEY, settings);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save settings');
      }
    }
  }, [settings, isLoading]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [settings]);

  const importSettings = useCallback((settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson);
      // Merge with defaults to ensure all fields are present
      setSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
      setError(null);
    } catch (err) {
      setError('Invalid settings file format');
    }
  }, []);

  const value: SettingsContextValue = {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
