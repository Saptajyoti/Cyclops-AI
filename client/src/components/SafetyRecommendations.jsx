import React from 'react';
import { 
  FileCheck2, 
  UserX, 
  Flag, 
  HeartHandshake, 
  Info,
  CheckCircle2
} from 'lucide-react';

/**
 * SafetyRecommendations component
 * Informational recommendations returned by the backend.
 * Uses theme design tokens without harsh neon highlights.
 */
export default function SafetyRecommendations({ recommendations = [] }) {
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return (
      <div
        className="recommendations-empty"
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
        <span>No specific safety recommendations provided for this message.</span>
      </div>
    );
  }

  const getActionIcon = (text) => {
    const t = (text || '').toLowerCase();
    if (t.includes('evidence') || t.includes('preserve') || t.includes('screenshot') || t.includes('record')) {
      return { icon: FileCheck2, color: 'var(--accent-primary)' };
    }
    if (t.includes('block') || t.includes('mute') || t.includes('sender') || t.includes('restrict')) {
      return { icon: UserX, color: 'var(--color-risk-high)' };
    }
    if (t.includes('report') || t.includes('flag') || t.includes('platform') || t.includes('moderator')) {
      return { icon: Flag, color: 'var(--color-risk-medium)' };
    }
    if (t.includes('support') || t.includes('counselor') || t.includes('help') || t.includes('trusted') || t.includes('family')) {
      return { icon: HeartHandshake, color: 'var(--color-safe)' };
    }
    return { icon: CheckCircle2, color: 'var(--accent-primary)' };
  };

  return (
    <div className="recommendations-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {recommendations.map((rec, index) => {
        const text = typeof rec === 'string' ? rec : rec?.text || rec?.title || JSON.stringify(rec);
        const { icon: IconComp, color } = getActionIcon(text);

        return (
          <div
            key={index}
            className="recommendation-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              transition: 'border-color 0.15s ease'
            }}
          >
            <div
              style={{
                marginTop: '2px',
                padding: '4px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <IconComp size={15} />
            </div>
            <div style={{ flex: 1, fontSize: '0.84375rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
