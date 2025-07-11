// src/components/FallingLeaves.tsx

import React from 'react';
import './FallingLeaves.css';

const FallingLeaves = () => {
  return (
    <div className="leaves-container">
      {Array.from({ length: 12 }).map((_, i) => (
        <div className="leaf" key={i} />
      ))}
    </div>
  );
};

export default FallingLeaves;
