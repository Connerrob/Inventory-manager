import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importing Firebase Auth
import { getFirestore } from "firebase/firestore"; // If you're using Firestore for data storage

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0K7Lbxz67NK1y2LXd9EdTMRgdl_VhF7M",
  authDomain: "inventoryapp-5d955.firebaseapp.com",
  projectId: "inventoryapp-5d955",
  storageBucket: "inventoryapp-5d955.firebasestorage.app",
  messagingSenderId: "593660543855",
  appId: "1:593660543855:web:f92272b7b000bc2a441e9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

// Get Firestore instance (if needed)
const db = getFirestore(app);

export { auth, db };
