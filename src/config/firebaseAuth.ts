// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9PWHOns0_zu66nx3sXN6KlJZPb3sHHgo",
  authDomain: "urbaneats-526a0.firebaseapp.com",
  projectId: "urbaneats-526a0",
  storageBucket: "urbaneats-526a0.firebasestorage.app",
  messagingSenderId: "100154006319",
  appId: "1:100154006319:web:02de0fec61e82dc0661fda",
  measurementId: "G-N3Z9EBH12C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider;
const analytics = getAnalytics(app);