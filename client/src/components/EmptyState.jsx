import React from 'react';
import { Shield } from 'lucide-react';

/**
 * EmptyState component
 * Clean, informative fallback for empty data, search results, or zero activity.
 * Strict dual-theme compliance.
 */
export default function EmptyState({ 
  icon: IconComp = Shield, 
  title = 'No Records Found', 
  description = 'No analysis records are currently available.',
  action = null
}) {
  return (
    <div
      className="empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px dashed var(--border-primary)',
        borderRadius: '10px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: '14px'
        }}
      >
        <IconComp size={22} />
      </div>

      <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
        {title}
      </h3>

      <p style={{ margin: '0 0 16px 0', fontSize: '0.84375rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.5 }}>
        {description}
      </p>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
