import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

/**
 * RiskBadge component
 * Shows risk level with accessible icons, text, and strict theme-compliant severity tokens.
 * Safe: Light #246B45 / Dark #A5D6A7
 * Low: Light #547A46 / Dark #B7D98B
 * Medium: Light #946A18 / Dark #F2C66D
 * High: Light #B43B36 / Dark #FF8A80
 */
export default function RiskBadge({ level = 'unknown', size = 'md', showIcon = true }) {
  const normalized = (level || '').toLowerCase().trim();

  let config = {
    label: 'UNKNOWN',
    bg: 'var(--bg-secondary)',
    border: 'var(--border-primary)',
    color: 'var(--text-secondary)',
    icon: HelpCircle
  };

  if (normalized === 'safe') {
    config = {
      label: 'SAFE',
      bg: 'var(--color-safe-bg)',
      border: 'var(--color-safe-border)',
      color: 'var(--color-safe)',
      icon: ShieldCheck
    };
  } else if (normalized === 'low') {
    config = {
      label: 'LOW RISK',
      bg: 'var(--color-risk-low-bg)',
      border: 'var(--color-risk-low-border)',
      color: 'var(--color-risk-low)',
      icon: ShieldCheck
    };
  } else if (normalized === 'medium') {
    config = {
      label: 'MEDIUM RISK',
      bg: 'var(--color-risk-medium-bg)',
      border: 'var(--color-risk-medium-border)',
      color: 'var(--color-risk-medium)',
      icon: AlertTriangle
    };
  } else if (normalized === 'high') {
    config = {
      label: 'HIGH RISK',
      bg: 'var(--color-risk-high-bg)',
      border: 'var(--color-risk-high-border)',
      color: 'var(--color-risk-high)',
      icon: AlertOctagon
    };
  }

  const IconComponent = config.icon;
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <span
      className={`risk-badge risk-${normalized}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        padding: isSm ? '2px 8px' : isLg ? '6px 14px' : '4px 10px',
        borderRadius: '6px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: isSm ? '0.6875rem' : isLg ? '0.84375rem' : '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.2
      }}
    >
      {showIcon && <IconComponent size={isSm ? 12 : isLg ? 16 : 14} style={{ flexShrink: 0 }} />}
      <span>{config.label}</span>
    </span>
  );
}
