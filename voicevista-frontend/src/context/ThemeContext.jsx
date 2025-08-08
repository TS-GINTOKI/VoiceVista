import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default: system (light), ya localStorage
  const getInitialMode = () => {
    const saved = localStorage.getItem('themeMode');
    return saved ? saved : 'light';
  };

  const [mode, setMode] = useState(getInitialMode());

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    const root = document.documentElement;
    if (mode === 'dark') {
      root.style.setProperty('--theme-bg', '#000'); // pure black
      root.style.setProperty('--theme-text', '#fff'); // white
      root.style.setProperty('--theme-heading', '#3abff8'); // blue (from image)
      root.style.setProperty('--theme-toggle', '#3abff8'); // toggle blue
    } else {
      root.style.setProperty('--theme-bg', '#fff');
      root.style.setProperty('--theme-text', '#000');
      root.style.setProperty('--theme-heading', '#0ea5e9'); // default blue
      root.style.setProperty('--theme-toggle', '#0ea5e9'); // default toggle blue
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);