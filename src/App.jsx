// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginForm from './components/LoginForm'; 
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for login form and dashboard */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;
