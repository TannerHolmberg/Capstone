// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtZHzerVEMey20Vv0-ZDiuzARmnRFrtYE",
  authDomain: "classroomconnect-147a4.firebaseapp.com",
  projectId: "classroomconnect-147a4",
  storageBucket: "classroomconnect-147a4.firebasestorage.app",
  messagingSenderId: "834019036904",
  appId: "1:834019036904:web:8d9c37e90a31462c43c35d",
  measurementId: "G-YCHGV6WP6D"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);