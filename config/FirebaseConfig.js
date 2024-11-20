// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-app-a5d45.firebaseapp.com",
  projectId: "pet-adopt-app-a5d45",
  storageBucket: "pet-adopt-app-a5d45.firebasestorage.app",
  messagingSenderId: "872769709420",
  appId: "1:872769709420:web:348c82afb021145b94ff49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)