import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">GreenPrint</Link>
      <Link to="/">Dashboard</Link>
      <Link to="/summary">Summary</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;