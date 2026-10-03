import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv7LA4eWsOx8YE46LT91ZI",
  authDomain: "vibegram-8e6bf.firebaseapp.com",
  projectId: "vibegram-8e6bf",
  storageBucket: "vibegram-8e6bf.firebasestorage.app",
  messagingSenderId: "1058216879180",
  appId: "1:1058216879180:web:764e706a4",
  measurementId: "G-VWN0CB0NXZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
