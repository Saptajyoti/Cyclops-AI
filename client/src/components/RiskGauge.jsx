import React from 'react';

/**
 * RiskGauge component
 * Circular SVG gauge rendering the backend-provided riskScore (0-100)
 * and riskLevel label with smooth SVG stroke animations.
 * Theme-aware and free of neon glows.
 */
export default function RiskGauge({ score = 0, level = 'low', size = 160 }) {
  const numericScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const normalizedLevel = (level || '').toLowerCase().trim();

  let primaryColor = 'var(--color-risk-low)';
  let levelLabel = 'Low Risk';

  if (normalizedLevel === 'high' || numericScore >= 61) {
    primaryColor = 'var(--color-risk-high)';
    levelLabel = 'High Risk';
  } else if (normalizedLevel === 'medium' || numericScore >= 31) {
    primaryColor = 'var(--color-risk-medium)';
    levelLabel = 'Medium Risk';
  } else if (normalizedLevel === 'safe' || numericScore === 0) {
    primaryColor = 'var(--color-safe)';
    levelLabel = 'Safe';
  }

  const strokeWidth = 9;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  return (
    <div 
      className="risk-gauge-container" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease'
            }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span
              style={{
                fontSize: size > 140 ? '2.375rem' : '1.75rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                lineHeight: 1,
                fontFamily: 'var(--font-mono)'
              }}
            >
              {numericScore}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
              /100
            </span>
          </div>

          <span
            style={{
              fontSize: '0.6875rem',
              color: primaryColor,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: '4px'
            }}
          >
            {levelLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
