// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "marketplacedashboard-21952",
  "appId": "1:637998853383:web:b1d3d5203531b739fa4219",
  "storageBucket": "marketplacedashboard-21952.appspot.com",
  "apiKey": "AIzaSyDSlqTj_94AIHImrjF4XvoqUnmmkYy40ac",
  "authDomain": "marketplacedashboard-21952.firebaseapp.com",
  "messagingSenderId": "637998853383"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
