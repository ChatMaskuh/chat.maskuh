// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "new-prototype-pzcbz",
  "appId": "1:761462500863:web:8a1acdcd28a8f6de3c0bca",
  "storageBucket": "new-prototype-pzcbz.firebasestorage.app",
  "apiKey": "AIzaSyBBM1V_DP6jbAwJrB4rkxTRC_Cz-8ihpPc",
  "authDomain": "new-prototype-pzcbz.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "761462500863"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
