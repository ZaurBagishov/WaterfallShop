// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA37Qn0gKEpAKasE1LA-8lT2qON2mhK7hg",
  authDomain: "waterfall-shop.firebaseapp.com",
  projectId: "waterfall-shop",
  storageBucket: "waterfall-shop.firebasestorage.app",
  messagingSenderId: "1022996652243",
  appId: "1:1022996652243:web:a68d6261f1866522627426"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;