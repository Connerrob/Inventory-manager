import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Import from './pages/Import';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/import" element={<Import />} />
      </Routes>
    </Router>
  );
}

export default App;

