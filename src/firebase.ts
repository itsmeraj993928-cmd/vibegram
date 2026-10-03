import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv7LA4eWsOx8YE46LT91ZIBYeb7aIC310",
  authDomain: "vibegram-8e6bf.firebaseapp.com",
  projectId: "vibegram-8e6bf",
  storageBucket: "vibegram-8e6bf.firebasestorage.app",
  messagingSenderId: "1058216879180",
  appId: "1:1058216879180:web:764e706a45d1c13f70c0e9",
  measurementId: "G-VWN0CB0NXZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
