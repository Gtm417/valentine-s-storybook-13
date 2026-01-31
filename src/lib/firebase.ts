import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAAI2CHFiVwwj2Nyh-wxRfvsngwTmQJBjY",
  authDomain: "valentine-e0781.firebaseapp.com",
  databaseURL: "https://valentine-e0781-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "valentine-e0781",
  storageBucket: "valentine-e0781.firebasestorage.app",
  messagingSenderId: "171635069098",
  appId: "1:171635069098:web:41d880079bcb58e307c0d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Generate or get couple ID (unique identifier for the couple)
const getCoupleId = (): string => {
  let coupleId = localStorage.getItem('valentine-couple-id');
  if (!coupleId) {
    // Generate a unique ID for this couple
    coupleId = `couple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('valentine-couple-id', coupleId);
    console.log('🆔 Generated new couple ID:', coupleId);
  }
  return coupleId;
};

/**
 * Save answers to Firebase
 */
export const saveAnswersToFirebase = async (
  tab: 'my' | 'her',
  pages: string[]
): Promise<void> => {
  try {
    const coupleId = getCoupleId();
    const dataRef = ref(db, `couples/${coupleId}/${tab}`);

    await set(dataRef, {
      pages,
      updatedAt: Date.now(),
      lastModified: new Date().toISOString()
    });

    console.log(`☁️ Synced ${pages.filter(p => p).length} filled pages to Firebase (${tab})`);
  } catch (error) {
    console.error('Failed to save to Firebase:', error);
    throw error;
  }
};

/**
 * Load answers from Firebase
 */
export const loadAnswersFromFirebase = async (
  tab: 'my' | 'her'
): Promise<string[] | null> => {
  try {
    const coupleId = getCoupleId();
    const dataRef = ref(db, `couples/${coupleId}/${tab}/pages`);
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`☁️ Loaded ${data.filter((p: string) => p).length} filled pages from Firebase (${tab})`);
      return data;
    }

    console.log(`☁️ No Firebase data found for ${tab}`);
    return null;
  } catch (error) {
    console.error('Failed to load from Firebase:', error);
    return null;
  }
};

/**
 * Listen to real-time changes from Firebase
 */
export const listenToAnswers = (
  tab: 'my' | 'her',
  callback: (pages: string[]) => void
): (() => void) => {
  const coupleId = getCoupleId();
  const dataRef = ref(db, `couples/${coupleId}/${tab}/pages`);

  const listener = onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        console.log(`🔄 Real-time update received for ${tab}`);
        callback(data);
      }
    }
  });

  // Return unsubscribe function
  return () => {
    off(dataRef, 'value', listener);
  };
};

/**
 * Get the shareable couple ID
 */
export const getShareableCoupleId = (): string => {
  return getCoupleId();
};

/**
 * Set couple ID (for partner to join the same session)
 */
export const setCoupleId = (id: string): void => {
  if (id && id.trim()) {
    localStorage.setItem('valentine-couple-id', id.trim());
    console.log('🔗 Joined couple session:', id.trim());
  }
};

/**
 * Check if Firebase is connected
 */
export const isFirebaseConnected = async (): Promise<boolean> => {
  try {
    const connectedRef = ref(db, '.info/connected');
    const snapshot = await get(connectedRef);
    return snapshot.val() === true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
};

/**
 * Export all couple data from Firebase
 */
export const exportFirebaseData = async (): Promise<any> => {
  try {
    const coupleId = getCoupleId();
    const dataRef = ref(db, `couples/${coupleId}`);
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Failed to export Firebase data:', error);
    return null;
  }
};

/**
 * Clear all data for current couple from Firebase
 */
export const clearFirebaseData = async (): Promise<void> => {
  try {
    const coupleId = getCoupleId();
    const dataRef = ref(db, `couples/${coupleId}`);
    await set(dataRef, null);
    console.log('🗑️ Cleared Firebase data');
  } catch (error) {
    console.error('Failed to clear Firebase data:', error);
    throw error;
  }
};

