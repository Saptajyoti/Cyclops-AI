import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'cyclops_ai_theme';

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreferenceState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for theme persistence:', e);
    }
    return 'dark'; // Default to Dark mode (Obsidian x Acid Lime)
  });

  const getSystemTheme = useCallback(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (themePreference === 'system') {
      return getSystemTheme();
    }
    return themePreference;
  });

  // Apply theme to HTML root & persist
  useEffect(() => {
    let active = themePreference;
    if (themePreference === 'system') {
      active = getSystemTheme();
    }

    setResolvedTheme(active);
    document.documentElement.setAttribute('data-theme', active);

    try {
      localStorage.setItem(STORAGE_KEY, themePreference);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [themePreference, getSystemTheme]);

  // Listen to OS system theme changes when preference is 'system'
  useEffect(() => {
    if (themePreference !== 'system' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [themePreference]);

  const setThemePreference = (pref) => {
    if (pref === 'light' || pref === 'dark' || pref === 'system') {
      setThemePreferenceState(pref);
    }
  };

  const toggleTheme = () => {
    setThemePreferenceState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        setThemePreference,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

