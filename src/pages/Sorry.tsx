import React from 'react';

export default function Wait() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  };

  const messageStyle = {
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  };

  const paragraphStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#666',
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: 'relative' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="200px"
          height="200px"
        >
          {/* Man */}
          <circle cx="100" cy="80" r="10" fill="#FFD700" /> {/* Head */}
          <rect x="90" y="90" width="20" height="40" fill="#000" /> {/* Body */}
          <line
            x1="100"
            y1="130"
            x2="80"
            y2="160"
            stroke="#000"
            strokeWidth="5"
          /> {/* Left Leg */}
          <line
            x1="100"
            y1="130"
            x2="120"
            y2="160"
            stroke="#000"
            strokeWidth="5"
          /> {/* Right Leg */}
          <line
            id="hammer-arm"
            x1="100"
            y1="100"
            x2="140"
            y2="80"
            stroke="#000"
            strokeWidth="5"
          /> {/* Arm with Hammer */}
          <line
            x1="140"
            y1="80"
            x2="155"
            y2="70"
            stroke="#000"
            strokeWidth="10"
          /> {/* Hammer */}
          {/* Rock */}
          <ellipse cx="160" cy="160" rx="20" ry="10" fill="#888" />
        </svg>
      </div>
      <h2 style={messageStyle}>Sorry for the inconvenience</h2>
      <p style={paragraphStyle}>
        You are not authorized  to Work on this Page or We are Still Working On it.
      </p>

      {/* Inline keyframes for hammer animation */}
      <style>
        {`
          @keyframes hammer-hit {
            0% { transform: rotate(0deg); transform-origin: 100px 100px; }
            50% { transform: rotate(-45deg); transform-origin: 100px 100px; }
            100% { transform: rotate(0deg); transform-origin: 100px 100px; }
          }

          #hammer-arm {
            animation: hammer-hit 1s infinite;
          }
        `}
      </style>
    </div>
  );
}
