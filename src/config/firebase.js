import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBx7HL8LPaAjyEtuAulNKKMAsN2-A_UzmQ",
  authDomain: "cssc-ac.firebaseapp.com",
  databaseURL: "https://cssc-ac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cssc-ac",
  storageBucket: "cssc-ac.firebasestorage.app",
  messagingSenderId: "366302623654",
  appId: "1:366302623654:web:a18c62c948cb68e4774167",
  measurementId: "G-XDDBYV3P0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getDatabase(app);