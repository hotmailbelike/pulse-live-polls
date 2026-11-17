import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const REQUIRED_CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

export const isFirebaseConfigured = REQUIRED_CONFIG_KEYS.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === 'string' && value.trim().length > 0;
});

let firestore: Firestore | null = null;

/** Lazily initialises Firestore. Callers must check isFirebaseConfigured first. */
export function getDb(): Firestore {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Copy .env.example to .env.local and fill it in.');
  }
  if (firestore === null) {
    firestore = getFirestore(initializeApp(firebaseConfig));
  }
  return firestore;
}
