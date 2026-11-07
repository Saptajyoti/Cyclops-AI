import React from 'react';
import { RotateCcw } from 'lucide-react';
import CyclopsLogo from './CyclopsLogo';

/**
 * LoadingState component
 * Analytical, minimal threat scanning state without neon glowing rings.
 */
export default function LoadingState({ message = 'Analyzing content with neural safety models...' }) {
  return (
    <div
      className="loading-state-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '10px',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          position: 'relative'
        }}
      >
        <CyclopsLogo size={32} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <RotateCcw size={15} className="spin" style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {message}
        </h3>
      </div>

      <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
        Evaluating threat indicators, toxicity, harassment, and linguistic patterns...
      </span>
    </div>
  );
}
