// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);

export { auth };