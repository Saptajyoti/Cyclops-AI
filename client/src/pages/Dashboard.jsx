import React, { useMemo } from 'react';
import { 
  ShieldAlert, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  PieChart as PieIcon, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import EmptyState from '../components/EmptyState';
import { useTheme } from '../context/ThemeContext';

/**
 * Dashboard page
 * Overview of cyber safety intelligence, aggregate telemetry,
 * real-time risk distribution chart, and recent detection activity.
 * Full dual-theme adherence (Ivory × Deep Forest vs. Obsidian × Acid Lime).
 */
export default function Dashboard({
  stats,
  history,
  onSelectRecord,
  onNavigateToAnalyzer
}) {
  const { isDark } = useTheme();
  const { totalAnalyzed, threatsDetected, highRiskCount, safeCount, riskDistribution = [] } = stats;

  const hasData = totalAnalyzed > 0;

  // Theme-compliant distribution chart colors
  const themedDistribution = useMemo(() => {
    return riskDistribution.map((entry) => {
      let color = entry.color;
      if (entry.key === 'low') {
        color = isDark ? '#B7D98B' : '#547A46';
      } else if (entry.key === 'medium') {
        color = isDark ? '#F2C66D' : '#946A18';
      } else if (entry.key === 'high') {
        color = isDark ? '#FF8A80' : '#B43B36';
      }
      return { ...entry, color };
    });
  }, [riskDistribution, isDark]);

  // Custom Recharts tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            padding: '8px 12px',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem'
          }}
        >
          <span style={{ fontWeight: '600', color: data.payload.color }}>
            {data.name}:
          </span>{' '}
          <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
            {data.value}
          </span>{' '}
          ({totalAnalyzed ? Math.round((data.value / totalAnalyzed) * 100) : 0}%)
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 4px 0',
              fontSize: '1.625rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Threat Intelligence Overview
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Continuous monitoring and multi-modal harm telemetry across communication vectors.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToAnalyzer}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-primary)',
            border: 'none',
            color: 'var(--text-on-accent)',
            fontSize: '0.84375rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span>Open Analyzer</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        <StatCard
          icon={MessageSquare}
          label="Total Analyzed"
          value={totalAnalyzed}
          description="Total online messages processed and evaluated."
          accentColor="var(--accent-primary)"
        />

        <StatCard
          icon={Flame}
          label="Threats Detected"
          value={threatsDetected}
          description="Harmful, toxic, or bullying communication patterns."
          accentColor="var(--color-risk-high)"
          badgeText={totalAnalyzed ? `${Math.round((threatsDetected / totalAnalyzed) * 100)}%` : null}
        />

        <StatCard
          icon={AlertTriangle}
          label="High Risk Messages"
          value={highRiskCount}
          description="Critical severity flags requiring prompt escalation."
          accentColor="var(--color-risk-medium)"
          badgeText={totalAnalyzed ? `${Math.round((highRiskCount / totalAnalyzed) * 100)}%` : null}
        />

        <StatCard
          icon={ShieldCheck}
          label="Safe Messages"
          value={safeCount}
          description="Neutral, positive, or benign communication."
          accentColor="var(--color-safe)"
          badgeText={totalAnalyzed ? `${Math.round((safeCount / totalAnalyzed) * 100)}%` : null}
        />
      </div>

      {/* Analytics & Activity Row */}
      <div
        className="dashboard-two-col"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Risk Distribution Chart */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Risk Distribution
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {hasData ? `${totalAnalyzed} evaluated` : 'Zero records'}
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!hasData ? (
              <EmptyState
                icon={PieIcon}
                title="No Data to Chart"
                description="Analyze messages to generate interactive risk breakdown charts."
              />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={themedDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {themedDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-surface)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78125rem' }}>{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Recent Threat Analyses
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Latest {Math.min(5, history.length)} of {history.length}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <RecentActivity
              history={history}
              onSelectRecord={onSelectRecord}
              onGoToAnalyzer={onNavigateToAnalyzer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
