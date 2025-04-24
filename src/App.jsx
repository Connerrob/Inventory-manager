
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginForm from './components/LoginForm'; 
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Import from './components/Import'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/Import" element={<Import />} />
      </Routes>
    </Router>
  );
}

export default App;
