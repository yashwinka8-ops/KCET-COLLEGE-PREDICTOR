import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9AM-7xHzpwXsiApqxv1fZFi3sz1CMUIw",
  authDomain: "kcet-college-predictor.firebaseapp.com",
  projectId: "kcet-college-predictor",
  storageBucket: "kcet-college-predictor.firebasestorage.app",
  messagingSenderId: "935886526771",
  appId: "1:935886526771:web:ac9c1996c71408d85f4646",
  measurementId: "G-E04ETMWCCV"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
