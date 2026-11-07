import React from 'react';
import { UserCheck, ShieldAlert, KeyRound, DollarSign, ExternalLink, Clock } from 'lucide-react';

/**
 * ImpersonationIndicators Component
 * Highlights rule-based social engineering and impersonation patterns.
 * Explicitly labeled as rule-based indicators, NOT identity verification.
 * Dual-theme compliant.
 */
export default function ImpersonationIndicators({ indicators = [] }) {
  if (!indicators || indicators.length === 0) {
    return null;
  }

  const getCategoryIcon = (category = '') => {
    const c = category.toLowerCase();
    if (c.includes('credential')) return KeyRound;
    if (c.includes('financial')) return DollarSign;
    if (c.includes('urgency')) return Clock;
    if (c.includes('diversion')) return ExternalLink;
    return ShieldAlert;
  };

  return (
    <div
      className="impersonation-indicators-card"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--color-risk-medium-border)',
        borderRadius: '8px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header with clear disclaimer label */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '5px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-risk-medium-bg)',
              color: 'var(--color-risk-medium)',
              display: 'flex'
            }}
          >
            <UserCheck size={16} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Impersonation & Social Engineering Indicators ({indicators.length})
            </h4>
            <span style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>
              Rule-based heuristic signals — not cryptographic identity verification
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.6875rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-risk-medium-bg)',
            border: '1px solid var(--color-risk-medium-border)',
            color: 'var(--color-risk-medium)',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}
        >
          Heuristic Flags
        </span>
      </div>

      {/* Warning Notice */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-surface)',
          padding: '8px 12px',
          borderRadius: '6px',
          borderLeft: '3px solid var(--color-risk-medium)',
          lineHeight: 1.4
        }}
      >
        These indicators highlight common persuasion, urgency, and credential-harvesting patterns. They do not prove someone's identity or verify whether an account is authentic.
      </div>

      {/* Indicator List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {indicators.map((ind, idx) => {
          const IconComponent = getCategoryIcon(ind.category);
          const isHigh = ind.severity === 'high';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px'
              }}
            >
              <div
                style={{
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: isHigh ? 'var(--color-risk-high-bg)' : 'var(--color-risk-medium-bg)',
                  color: isHigh ? 'var(--color-risk-high)' : 'var(--color-risk-medium)',
                  marginTop: '1px',
                  display: 'flex',
                  flexShrink: 0
                }}
              >
                <IconComponent size={14} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {ind.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: isHigh ? 'var(--color-risk-high)' : 'var(--color-risk-medium)'
                    }}
                  >
                    {ind.severity}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {ind.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
