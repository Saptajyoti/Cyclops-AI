import React from 'react';
import { Menu, RefreshCw, Activity } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * Navbar component
 * Top navigation bar showing current view title, system readiness,
 * verified backend connectivity status, theme switcher, and mobile drawer toggle.
 */
export default function Navbar({ 
  currentTitle = 'Overview', 
  subtitle = null,
  backendStatus, 
  onRefreshHealth,
  onOpenMobileMenu 
}) {
  const isConnected = backendStatus?.available === true;
  const isChecking = backendStatus?.status === 'Checking...';

  return (
    <header
      className="cyclops-navbar"
      style={{
        height: '68px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Left Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="mobile-nav-toggle"
          onClick={onOpenMobileMenu}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            padding: '7px',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.1875rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {currentTitle}
          </h1>
          {subtitle && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls & Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* System Readiness Badge */}
        <div
          className="navbar-system-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)'
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            System:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            Operational
          </span>
        </div>

        {/* Backend Connectivity Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '6px',
            backgroundColor: isConnected 
              ? 'var(--color-safe-bg)' 
              : isChecking 
                ? 'var(--color-risk-medium-bg)' 
                : 'var(--color-risk-high-bg)',
            border: `1px solid ${
              isConnected 
                ? 'var(--color-safe-border)' 
                : isChecking 
                  ? 'var(--color-risk-medium-border)' 
                  : 'var(--color-risk-high-border)'
            }`
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isConnected 
                ? 'var(--color-safe)' 
                : isChecking 
                  ? 'var(--color-risk-medium)' 
                  : 'var(--color-risk-high)'
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: isConnected 
                ? 'var(--color-safe)' 
                : isChecking 
                  ? 'var(--color-risk-medium)' 
                  : 'var(--color-risk-high)'
            }}
          >
            {backendStatus?.status || 'Unknown'}
          </span>

          {onRefreshHealth && (
            <button
              onClick={onRefreshHealth}
              title="Refresh connection status"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RefreshCw size={12} className={isChecking ? 'spin' : ''} />
            </button>
          )}
        </div>

        {/* Polished Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
