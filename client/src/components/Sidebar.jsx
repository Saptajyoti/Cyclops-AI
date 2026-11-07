import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon,
  ScanText,
  History, 
  Info, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock,
  X
} from 'lucide-react';
import CyclopsLogo from './CyclopsLogo';

/**
 * Sidebar component
 * Dual-theme compliant (Ivory × Deep Forest in Light Mode; Obsidian × Acid Lime in Dark Mode).
 * Fixed on desktop, collapsible drawer on mobile/tablet.
 */
export default function Sidebar({
  activeTab,
  setActiveTab,
  backendStatus,
  isOpen,
  onClose
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Text Safety', icon: MessageSquare },
    { id: 'image-analyzer', label: 'Image Safety', icon: ImageIcon },
    { id: 'screenshot-analyzer', label: 'Screenshot OCR', icon: ScanText },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'about', label: 'About Cyclops', icon: Info }
  ];

  const isConnected = backendStatus?.available === true;
  const isChecking = backendStatus?.status === 'Checking...';

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--overlay-bg)',
            backdropFilter: 'blur(4px)',
            zIndex: 900
          }}
        />
      )}

      <aside
        className={`cyclops-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 950,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CyclopsLogo size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.1
                  }}
                >
                  CYCLOPS <span style={{ color: 'var(--accent-primary)' }}>AI</span>
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}
              >
                Threat Intelligence
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            className="mobile-sidebar-close"
            onClick={onClose}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav
          style={{
            flex: 1,
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 10px 8px'
            }}
          >
            Safety Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid transparent' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                    flexShrink: 0
                  }}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom System Status & Platform footer */}
        <div
          style={{
            padding: '16px 18px',
            borderTop: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* AI Connection status */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Backend Status
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isConnected ? 'var(--color-safe)' : isChecking ? 'var(--color-risk-medium)' : 'var(--color-risk-high)'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isConnected ? (
                <CheckCircle2 size={13} style={{ color: 'var(--color-safe)' }} />
              ) : isChecking ? (
                <Clock size={13} style={{ color: 'var(--color-risk-medium)' }} />
              ) : (
                <XCircle size={13} style={{ color: 'var(--color-risk-high)' }} />
              )}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: isConnected ? 'var(--color-safe)' : isChecking ? 'var(--color-risk-medium)' : 'var(--color-risk-high)'
                }}
              >
                {backendStatus?.status || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Platform motto badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.6875rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={12} style={{ color: 'var(--accent-primary)' }} />
              <span>Cyber Safety Instrument</span>
            </span>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-active)',
                color: 'var(--accent-primary)',
                fontWeight: '700',
                letterSpacing: '0.04em'
              }}
            >
              ACTIVE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
