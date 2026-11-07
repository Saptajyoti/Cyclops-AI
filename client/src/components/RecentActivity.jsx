import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import RiskBadge from './RiskBadge';
import CategoryBadge from './CategoryBadge';
import EmptyState from './EmptyState';

/**
 * RecentActivity component
 * Displays latest analysis feed on Dashboard overview with theme tokens.
 */
export default function RecentActivity({ history = [], onSelectRecord, onGoToAnalyzer }) {
  const recentItems = history.slice(0, 5);

  if (recentItems.length === 0) {
    return (
      <EmptyState
        title="No Activity Yet"
        description="Analyze your first message to see threat telemetry, risk trends, and security breakdowns."
        action={
          onGoToAnalyzer && (
            <button
              onClick={onGoToAnalyzer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: 'var(--accent-primary)',
                border: 'none',
                color: 'var(--text-on-accent)',
                fontSize: '0.8125rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease'
              }}
            >
              <span>Analyze Message</span>
              <ArrowRight size={14} />
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="recent-activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {recentItems.map((item) => {
        const timeAgo = item.analyzedAt ? new Date(item.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

        return (
          <div
            key={item.id}
            onClick={() => onSelectRecord(item)}
            className="activity-item-card"
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, border-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
          >
            {/* Left: Snippet & Badges */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <RiskBadge level={item.riskLevel} size="sm" />
                <CategoryBadge category={item.category} size="sm" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto' }}>
                  <Clock size={11} />
                  <span>{timeAgo}</span>
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.84375rem',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.4
                }}
              >
                "{item.message}"
              </p>
            </div>

            {/* Right: Score and Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)'
                }}
              >
                {item.riskScore}
              </span>
              <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
