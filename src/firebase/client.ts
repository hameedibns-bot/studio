// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "prolife-ai-coach-vprqb",
  "appId": "1:626551473068:web:344dbb9d0b42490e4d3009",
  "storageBucket": "prolife-ai-coach-vprqb.firebasestorage.app",
  "apiKey": "AIzaSyDFuyH2mLy51kh7uQqtZhoH2hl4boajN1s",
  "authDomain": "prolife-ai-coach-vprqb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "626551473068"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
