import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBquwJFQdi4AhOd1tnY9LU_pEUhQb4om9k",
  authDomain: "portfolio-50e4a.firebaseapp.com",
  projectId: "portfolio-50e4a",
  storageBucket: "portfolio-50e4a.firebasestorage.app",
  messagingSenderId: "206717640503",
  appId: "1:206717640503:web:45d6cf765568ebe4f7c4b2",
  measurementId: "G-LDNN11W9FD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
