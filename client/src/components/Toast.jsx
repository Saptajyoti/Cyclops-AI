import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast component for system feedback with dual-theme design tokens.
 */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'info', message, duration = 4000 } = toast;

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  const configs = {
    success: {
      border: 'var(--color-safe)',
      icon: CheckCircle2,
      color: 'var(--color-safe)'
    },
    error: {
      border: 'var(--color-risk-high)',
      icon: AlertCircle,
      color: 'var(--color-risk-high)'
    },
    info: {
      border: 'var(--accent-primary)',
      icon: Info,
      color: 'var(--accent-primary)'
    }
  };

  const current = configs[type] || configs.info;
  const IconComp = current.icon;

  return (
    <div
      className="toast-notification"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${current.border}`,
        borderRadius: '8px',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: '0.84375rem',
        maxWidth: '420px',
        animation: 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <IconComp size={16} style={{ color: current.color, flexShrink: 0 }} />
      <span style={{ flex: 1, lineHeight: 1.4, color: 'var(--text-primary)' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
