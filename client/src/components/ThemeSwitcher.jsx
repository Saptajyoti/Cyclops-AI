import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeSwitcher Component
 * Segmented control for switching between Light, Dark, and System modes.
 * Clean, minimal, icon-based, avoiding oversized controls.
 */
export default function ThemeSwitcher({ className = '' }) {
  const { themePreference, setThemePreference } = useTheme();

  const options = [
    {
      id: 'light',
      label: 'Light',
      title: 'Light Mode (Ivory × Deep Forest)',
      icon: Sun
    },
    {
      id: 'dark',
      label: 'Dark',
      title: 'Dark Mode (Obsidian × Acid Lime)',
      icon: Moon
    },
    {
      id: 'system',
      label: 'System',
      title: 'System Mode (Follows OS)',
      icon: Monitor
    }
  ];

  return (
    <div
      className={`theme-switcher ${className}`}
      role="group"
      aria-label="Theme mode switcher"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        gap: '2px'
      }}
    >
      {options.map((opt) => {
        const IconComponent = opt.icon;
        const isActive = themePreference === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setThemePreference(opt.id)}
            title={opt.title}
            aria-pressed={isActive}
            aria-label={opt.title}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <IconComponent size={14} strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}

