import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArOOOz_AHmTzIfebHBFmszZnw-5nCc9TA",
  authDomain: "quickooauthapp.firebaseapp.com",
  projectId: "quickooauthapp",
  storageBucket: "quickooauthapp.firebasestorage.app",
  messagingSenderId: "997695194081",
  appId: "1:997695194081:web:2ac809839b813f35c108a0",
  measurementId: "G-H2J4L629EN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
