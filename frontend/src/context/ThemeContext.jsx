import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to light mode if no preference
    return false;
  });

  // Apply initial theme
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    console.log('Theme effect running, isDarkMode:', isDarkMode);
    console.log('Root element:', root);
    console.log('Current classes:', root.className);
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Dark mode enabled, classes after:', root.className);
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Light mode enabled, classes after:', root.className);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Toggle theme called, current:', isDarkMode);
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
