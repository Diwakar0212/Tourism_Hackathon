import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_your_api_key_here",
  authDomain: "safesolo-hackathon.firebaseapp.com",
  projectId: "safesolo-hackathon",
  storageBucket: "safesolo-hackathon.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:your_app_id_here",
  measurementId: "G-YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
