import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaFileImport, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../styles/Sidebar.css'; 

const Sidebar = ({ collapsed, toggleSidebar, location }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleSidebar}>
        <FaBars />
      </button>
      <Nav className="flex-column">
      <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
      <FaHome />{!collapsed && <span>Home</span>}
      </Nav.Link>
        <Nav.Link as={Link} to="/reports" active={location.pathname === '/reports'}>
        <FaClipboardList /> {!collapsed && <span>Reports</span>}
        </Nav.Link>
        <Nav.Link as={Link} to="/import" active={location.pathname === '/import'}>
        <FaFileImport /> {!collapsed && <span>Import</span>}
        </Nav.Link>
        <Nav.Link href="#">
          <FaSignOutAlt /> {!collapsed && <span>Logout</span>}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
