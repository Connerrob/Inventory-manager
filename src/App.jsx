import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";  // Import Firebase Auth functions

import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Import from './pages/Import';

function App() {
  const [user, setUser] = useState(null);  // State to hold the user object

  useEffect(() => {
    const auth = getAuth();  // Get Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // If user is logged in, store user in state
    });
    return () => unsubscribe();  // Clean up the listener when component unmounts
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(null);  // Clear user state on sign-out
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/" />} />
        <Route path="/import" element={user ? <Import /> : <Navigate to="/" />} />
      </Routes>

      {/* Optionally, you can add a sign-out button */}
      {user && (
        <button onClick={handleSignOut}>Sign Out</button>
      )}
    </Router>
  );
}

export default App;
