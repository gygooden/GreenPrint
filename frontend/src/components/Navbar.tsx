import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navStyle: React.CSSProperties = {
    background: '#2f855a',
    padding: '1rem 2rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  };

  const linkStyle: React.CSSProperties = {
    color: 'white',
    marginLeft: '1.5rem',
    textDecoration: 'none',
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  const glowHoverStyle: React.CSSProperties = {
    ...linkStyle,
    textShadow: '0 0 10px rgba(144, 238, 144, 0.9)',
  };

  const [hovered, setHovered] = React.useState<string | null>(null);

  const handleHover = (link: string) => setHovered(link);
  const handleLeave = () => setHovered(null);

  return (
    <nav style={navStyle}>
      <Link
        to="/"
        style={{
          ...linkStyle,
          fontWeight: 'bold',
          fontSize: '1.6rem',
          textShadow: '0 0 10px rgba(255,255,255,0.3)',
        }}
      >
        GreenPrint
      </Link>

      <div>
        {['summary', 'logout'].map(link => (
          <Link
            key={link}
            to={`/${link}`}
            style={hovered === link ? glowHoverStyle : linkStyle}
            onMouseEnter={() => handleHover(link)}
            onMouseLeave={handleLeave}
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;