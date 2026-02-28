import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'petscare_theme';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(THEME_KEY) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }, [theme]);

  const setTheme = (value) => {
    if (['light', 'dark', 'classic'].includes(value)) setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
