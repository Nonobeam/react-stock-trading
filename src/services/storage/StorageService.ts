/**
 * Storage Service - Abstraction layer for data persistence
 * Provides localStorage implementation with error handling and future backend migration path
 */

export interface StorageProvider {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  getUsage(): StorageUsage;
}

export interface StorageUsage {
  used: number;
  total: number;
  percentage: number;
  breakdown: {
    trades: number;
    settings: number;
    backtests: number;
    chatHistory: number;
  };
}

/**
 * localStorage implementation of StorageProvider
 */
export class LocalStorageProvider implements StorageProvider {
  private readonly STORAGE_VERSION = 'v1';
  
  /**
   * Get item from localStorage
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getVersionedKey(key));
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: new Date().toISOString(),
        version: this.STORAGE_VERSION,
      });
      
      localStorage.setItem(this.getVersionedKey(key), serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new StorageQuotaError('Storage limit exceeded. Please free up space.');
      }
      throw new StorageError(`Failed to save data: ${error}`);
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getVersionedKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getUsage(): StorageUsage {
    let totalSize = 0;
    const breakdown = {
      trades: 0,
      settings: 0,
      backtests: 0,
      chatHistory: 0,
    };

    try {
      // Calculate size for each key
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const value = localStorage.getItem(key);
        if (!value) continue;

        const size = new Blob([value]).size;
        totalSize += size;

        // Categorize by key prefix
        if (key.includes('trades')) breakdown.trades += size;
        else if (key.includes('settings')) breakdown.settings += size;
        else if (key.includes('backtests')) breakdown.backtests += size;
        else if (key.includes('chat')) breakdown.chatHistory += size;
      }

      // localStorage typical limit is ~5-10MB, using 10MB as estimate
      const STORAGE_LIMIT = 10 * 1024 * 1024; // 10MB in bytes

      return {
        used: totalSize,
        total: STORAGE_LIMIT,
        percentage: (totalSize / STORAGE_LIMIT) * 100,
        breakdown,
      };
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return {
        used: 0,
        total: 10 * 1024 * 1024,
        percentage: 0,
        breakdown,
      };
    }
  }

  /**
   * Get versioned key for localStorage
   */
  private getVersionedKey(key: string): string {
    return `gst:${this.STORAGE_VERSION}:${key}`;
  }
}

/**
 * Custom error classes
 */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageQuotaError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

/**
 * Storage limits
 */
export const STORAGE_LIMITS = {
  TRADES_MAX: 500,
  BACKTESTS_MAX: 20,
  CONVERSATIONS_MAX: 50,
  TRADES_SIZE_MB: 5,
  BACKTESTS_SIZE_MB: 2,
  CHAT_SIZE_MB: 2,
};

/**
 * Singleton instance
 */
export const storageService = new LocalStorageProvider();
