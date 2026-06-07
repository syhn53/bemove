import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bemove-e5cc4.firebaseapp.com",
  projectId: "bemove-e5cc4",
  storageBucket: "bemove-e5cc4.firebasestorage.app",
  messagingSenderId: "961856201766",
  appId: "1:961856201766:web:7b40087b16073662c032e7",
  measurementId: "G-ZBT2QXZG34"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);