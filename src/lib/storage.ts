/**
 * Storage utility for persisting Valentine's Day app data
 * Uses localStorage for offline access and Firebase for cloud sync
 */

import { saveAnswersToFirebase, loadAnswersFromFirebase } from './firebase';

export const STORAGE_KEYS = {
  MY_PAGES: 'valentine-my-pages',
  HER_PAGES: 'valentine-her-pages',
} as const;

export interface StorageStats {
  totalPages: number;
  filledPages: number;
  lastUpdated: string | null;
}

/**
 * Check if localStorage is available and working
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error('localStorage is not available:', e);
    return false;
  }
};

/**
 * Get storage statistics for debugging
 */
export const getStorageStats = (): Record<string, StorageStats> => {
  const stats: Record<string, StorageStats> = {};

  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          stats[key] = {
            totalPages: parsed.length,
            filledPages: parsed.filter(p => p && p.trim()).length,
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.error(`Error reading ${key}:`, e);
    }
  });

  return stats;
};

/**
 * Get total localStorage usage
 */
export const getStorageSize = (): { used: number; usedFormatted: string } => {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }

  const kb = (total / 1024).toFixed(2);
  return {
    used: total,
    usedFormatted: `${kb} KB`,
  };
};

/**
 * Clear all Valentine's app data
 */
export const clearAllData = async (): Promise<void> => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Also clear from Firebase
  try {
    const { clearFirebaseData } = await import('./firebase');
    await clearFirebaseData();
  } catch (error) {
    console.error('Failed to clear Firebase data:', error);
  }

  console.log('🗑️ Cleared all Valentine\'s app data');
};

/**
 * Export all data as JSON for backup
 */
export const exportData = (): string => {
  const data: Record<string, any> = {};
  Object.values(STORAGE_KEYS).forEach(key => {
    const saved = localStorage.getItem(key);
    if (saved) {
      data[key] = JSON.parse(saved);
    }
  });
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from JSON backup
 */
export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    console.log('✅ Data imported successfully');
    return true;
  } catch (e) {
    console.error('❌ Failed to import data:', e);
    return false;
  }
};

// Debug helper - add to window in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).valentineStorage = {
    stats: getStorageStats,
    size: getStorageSize,
    clear: clearAllData,
    export: exportData,
    import: importData,
    isAvailable: isLocalStorageAvailable,
  };

  console.log('💝 Valentine Storage Debug Tools Available:');
  console.log('  - valentineStorage.stats() - View storage statistics');
  console.log('  - valentineStorage.size() - Check storage size');
  console.log('  - valentineStorage.export() - Export all data');
  console.log('  - valentineStorage.import(json) - Import data');
  console.log('  - valentineStorage.clear() - Clear all data');
}

