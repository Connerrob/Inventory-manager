import React from 'react';
import '../styles/Navbar.css';

const NavbarComponent = ({ title, searchQuery, onSearchChange }) => {
  return (
    <div className="navbar-custom">
      <span className="navbar-brand-text">{title}</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default NavbarComponent;
