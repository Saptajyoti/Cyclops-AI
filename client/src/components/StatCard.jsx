import React from 'react';

/**
 * StatCard component
 * Displays a single key metric with icon, value, label, and contextual description.
 * Adheres to minimal, analytical, theme-compliant aesthetic (no glowing gradients).
 */
export default function StatCard({ 
  icon: IconComponent, 
  label, 
  value, 
  description, 
  accentColor = 'var(--accent-primary)',
  badgeText = null
}) {
  return (
    <div
      className="stat-card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {IconComponent && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor
            }}
          >
            <IconComponent size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
        <span
          style={{
            fontSize: '1.875rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badgeText && (
          <span
            style={{
              fontSize: '0.6875rem',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: accentColor,
              fontWeight: '700',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {description && (
        <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {description}
        </span>
      )}
    </div>
  );
}
