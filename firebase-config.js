// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import {
  getAuth,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDsYQ1RTsh57k_XYQ4L4mF8BBqf_kQkjTc',
  authDomain: 'bankist-c2d80.firebaseapp.com',
  projectId: 'bankist-c2d80',
  storageBucket: 'bankist-c2d80.firebasestorage.app',
  messagingSenderId: '348475723317',
  appId: '1:348475723317:web:8477660cb868536bc9eb7c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, signOut, db }; // Export Firestore
