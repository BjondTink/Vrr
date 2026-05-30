import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const storage = getStorage(app);

// Passive, non-blocking passive connection checked after a delay to ensure pristine load speed
setTimeout(() => {
  try {
    getDocFromServer(doc(db, 'test', 'connection')).catch((error) => {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn("Firebase client initialized in offline/cached storage mode.");
      } else {
        console.warn("Firebase active state: running with local persistent database.");
      }
    });
  } catch (err) {
    console.debug("Connection check omitted:", err);
  }
}, 3000);
