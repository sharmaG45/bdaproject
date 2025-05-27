import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoT9Xxgy0aJ2BWOHcu_oQ5Zy7noxLOBiA",
  authDomain: "bda-org-1148c.firebaseapp.com",
  projectId: "bda-org-1148c",
  storageBucket: "bda-org-1148c.firebasestorage.app",
  messagingSenderId: "519340011696",
  appId: "1:519340011696:web:aff77f613517982039cb75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
