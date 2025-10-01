import React from 'react';

const SuperCoins = ({ size = 64 }) => {
  const pxSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <span style={{ width: pxSize, height: pxSize }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Super Coin Icon"
      >
        <defs>
          <radialGradient id="coinFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedb8" />
            <stop offset="60%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#d68000" />
          </radialGradient>

          <linearGradient id="diamondFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0099ff" />
          </linearGradient>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Outer Coin */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#coinFill)"
          stroke="#ffa000"
          strokeWidth="2"
          filter="url(#shadow)"
        />

        {/* Inner Diamond */}
        <g transform="translate(0,2)">
          <polygon
            points="32,18 23,28 32,44 41,28"
            fill="url(#diamondFill)"
            stroke="#007acc"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="23" y1="28" x2="41" y2="28" stroke="#007acc" strokeWidth="1.6" />
          <line x1="28" y1="28" x2="32" y2="36" stroke="#007acc" strokeWidth="1.6" />
          <line x1="36" y1="28" x2="32" y2="36" stroke="#007acc" strokeWidth="1.6" />
        </g>
      </svg>
    </span>
  );
};

export default SuperCoins;
