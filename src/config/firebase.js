import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_I6Mq3-9UPG0PT7cc4Eb5gL1b6ByLnDQ",
  authDomain: "fir-tutorial-27204.firebaseapp.com",
  projectId: "fir-tutorial-27204",
  storageBucket: "fir-tutorial-27204.appspot.com",
  messagingSenderId: "804928271913",
  appId: "1:804928271913:web:1587bdc713d2761cb94e38",
  measurementId: "G-NQSP69BT4F",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
