import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, getDocs, collection, limit } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics = null;

async function checkFirebaseConnection() {
  try {
    // Try to make a simple request to Firestore
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );
    
    // Try to get a single document from Firestore as a connection test
    const testQuery = await Promise.race([
      getDocs(collection(db, 'users'), limit(1)),
      timeout
    ]);

    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    if (error.code === 'permission-denied') {
      // If we get permission denied, it means we connected but don't have access
      return true;
    }
    return false;
  }
}

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize analytics only if supported and in production
  if (import.meta.env.PROD) {
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.error('Error initializing analytics:', error);
    });
  }

  // Check connection immediately
  checkFirebaseConnection().then(isConnected => {
    if (!isConnected) {
      console.error('Failed to establish Firebase connection');
    }
  });

} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db, storage, analytics, checkFirebaseConnection };
