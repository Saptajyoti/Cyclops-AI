import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  AlertCircle, 
  Users, 
  Skull, 
  MessageSquareWarning,
  HelpCircle 
} from 'lucide-react';

/**
 * CategoryBadge component
 * Displays category classifications using theme design tokens:
 * safe | harassment | threat | hate_speech | cyberbullying | toxic | neutral fallback
 */
export default function CategoryBadge({ category = 'unknown', size = 'md' }) {
  const raw = (category || '').toLowerCase().trim();

  const configs = {
    safe: {
      label: 'Safe Content',
      color: 'var(--color-safe)',
      bg: 'var(--color-safe-bg)',
      border: 'var(--color-safe-border)',
      icon: ShieldCheck
    },
    harassment: {
      label: 'Harassment',
      color: 'var(--color-risk-medium)',
      bg: 'var(--color-risk-medium-bg)',
      border: 'var(--color-risk-medium-border)',
      icon: MessageSquareWarning
    },
    threat: {
      label: 'Threat / Violent',
      color: 'var(--color-risk-high)',
      bg: 'var(--color-risk-high-bg)',
      border: 'var(--color-risk-high-border)',
      icon: AlertCircle
    },
    hate_speech: {
      label: 'Hate Speech',
      color: 'var(--color-risk-high)',
      bg: 'var(--color-risk-high-bg)',
      border: 'var(--color-risk-high-border)',
      icon: Skull
    },
    cyberbullying: {
      label: 'Cyberbullying',
      color: 'var(--color-risk-medium)',
      bg: 'var(--color-risk-medium-bg)',
      border: 'var(--color-risk-medium-border)',
      icon: Users
    },
    toxic: {
      label: 'Toxic Communication',
      color: 'var(--color-risk-medium)',
      bg: 'var(--color-risk-medium-bg)',
      border: 'var(--color-risk-medium-border)',
      icon: Flame
    }
  };

  const selected = configs[raw] || {
    label: category ? category.replace(/_/g, ' ').toUpperCase() : 'UNSPECIFIED',
    color: 'var(--text-secondary)',
    bg: 'var(--bg-secondary)',
    border: 'var(--border-primary)',
    icon: HelpCircle
  };

  const IconComp = selected.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`category-badge category-${raw}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        padding: isSm ? '2px 8px' : '4px 10px',
        borderRadius: '6px',
        backgroundColor: selected.bg,
        border: `1px solid ${selected.border}`,
        color: selected.color,
        fontSize: isSm ? '0.6875rem' : '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.03em',
        lineHeight: 1.2
      }}
    >
      <IconComp size={isSm ? 12 : 14} style={{ flexShrink: 0 }} />
      <span>{selected.label}</span>
    </span>
  );
}
