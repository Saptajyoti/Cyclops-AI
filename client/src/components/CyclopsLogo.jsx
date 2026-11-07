import React from 'react';

/**
 * CyclopsLogo Component
 * Renders the official Cyclops AI geometric eye emblem.
 * Uses CSS variables so it renders in Deep Forest green in Light Mode
 * and Acid Lime in Dark Mode.
 */
export default function CyclopsLogo({ size = 28, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Central Eye Outline */}
      <path
        d="M 12 50 C 26 28 74 28 88 50 C 74 72 26 72 12 50 Z"
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* Pupil / Center Aperture */}
      <ellipse
        cx="50"
        cy="50"
        rx="12"
        ry="10"
        fill="var(--accent-primary)"
      />

      {/* Top Vertical Bar */}
      <rect
        x="46"
        y="12"
        width="8"
        height="26"
        rx="3"
        fill="var(--accent-primary)"
      />

      {/* Bottom Vertical Bar */}
      <rect
        x="46"
        y="62"
        width="8"
        height="26"
        rx="3"
        fill="var(--accent-primary)"
      />

      {/* Top-Left Diagonal Arm */}
      <line
        x1="16"
        y1="16"
        x2="35"
        y2="38"
        stroke="var(--accent-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Top-Right Diagonal Arm */}
      <line
        x1="84"
        y1="16"
        x2="65"
        y2="38"
        stroke="var(--accent-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Bottom-Left Diagonal Leg */}
      <line
        x1="16"
        y1="84"
        x2="35"
        y2="62"
        stroke="var(--accent-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Bottom-Right Diagonal Leg */}
      <line
        x1="84"
        y1="84"
        x2="65"
        y2="62"
        stroke="var(--accent-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

