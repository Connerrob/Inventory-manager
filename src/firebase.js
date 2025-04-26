import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your new Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBG20S5ahfCSvPxrO4E2z34YICqpahciSw",
  authDomain: "inventory-2-c8b62.firebaseapp.com",
  projectId: "inventory-2-c8b62",
  storageBucket: "inventory-2-c8b62.appspot.com",
  messagingSenderId: "888326232942",
  appId: "1:888326232942:web:75e283cc8d6f0ae38a7f7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

// Get Firestore instance
const db = getFirestore(app);

export { auth, db };
