import React from 'react';
import { Activity, Info } from 'lucide-react';

/**
 * DetectionSignals component
 * Renders the detected signals returned from backend analysis using design tokens.
 */
export default function DetectionSignals({ signals = [] }) {
  if (!signals || !Array.isArray(signals) || signals.length === 0) {
    return (
      <div
        className="detection-signals-empty"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
          fontSize: '0.84375rem'
        }}
      >
        <Info size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        <span>No specific threat signals were flagged for this input.</span>
      </div>
    );
  }

  const getSeverityStyle = (severity) => {
    const s = (severity || '').toLowerCase();
    if (s === 'high' || s === 'severe') {
      return { 
        color: 'var(--color-risk-high)', 
        bg: 'var(--color-risk-high-bg)', 
        border: 'var(--color-risk-high-border)' 
      };
    }
    if (s === 'medium' || s === 'moderate') {
      return { 
        color: 'var(--color-risk-medium)', 
        bg: 'var(--color-risk-medium-bg)', 
        border: 'var(--color-risk-medium-border)' 
      };
    }
    return { 
      color: 'var(--color-safe)', 
      bg: 'var(--color-safe-bg)', 
      border: 'var(--color-safe-border)' 
    };
  };

  return (
    <div className="detection-signals-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {signals.map((sig, index) => {
        const isObj = typeof sig === 'object' && sig !== null;
        const name = isObj ? sig.name || sig.signal || 'Signal' : String(sig);
        const explanation = isObj ? sig.explanation || sig.description : null;
        const severity = isObj ? sig.severity : null;
        const style = getSeverityStyle(severity);

        return (
          <div
            key={index}
            className="detection-signal-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid var(--border-primary)`,
              borderRadius: '8px',
              borderLeft: `3px solid ${style.color}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={15} style={{ color: style.color, flexShrink: 0 }} />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.84375rem' }}>
                  {name}
                </span>
              </div>
              {severity && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: style.color,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: style.bg,
                    border: `1px solid ${style.border}`
                  }}
                >
                  {severity}
                </span>
              )}
            </div>

            {explanation && (
              <p style={{ margin: 0, paddingLeft: '23px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
