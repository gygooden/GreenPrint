import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#2f855a', padding: '1rem', color: 'white' }}>
    <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
      GreenPrint
    </Link>
    <div style={{ float: 'right' }}>
      <Link to="/summary" style={{ color: 'white', marginLeft: '1.5rem' }}>
        Summary
      </Link>
      <Link to="/logout" style={{ color: 'white', marginLeft: '1.5rem' }}>
        Logout
      </Link>
    </div>
  </nav>
);

export default Navbar;