import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "krypton-tienda",
  appId: "1:1097352675962:web:6d717ddc145d008ca431c3",
  storageBucket: "krypton-tienda.firebasestorage.app",
  apiKey: "AIzaSyDtrp520YJoGh2U774w1k2xWbbBrdOob6w",
  authDomain: "krypton-tienda.firebaseapp.com",   
  messagingSenderId: "1097352675962",
  measurementId: "G-V6H7XRN3KP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
