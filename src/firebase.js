// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB0K7Lbxz67NK1y2LXd9EdTMRgdl_VhF7M',
  authDomain: 'inventoryapp-5d955.firebaseapp.com',
  projectId: 'inventoryapp-5d955',
  storageBucket: 'inventoryapp-5d955.firebasestorage.app',
  messagingSenderId: '593660543855',
  appId: '1:593660543855:web:f92272b7b000bc2a441e9a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
