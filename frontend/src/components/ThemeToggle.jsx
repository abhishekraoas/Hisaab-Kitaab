import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('ThemeToggle button clicked');
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? (
        <FaSun className="w-5 h-5 text-yellow-300 transition-transform hover:rotate-180 duration-500" />
      ) : (
        <FaMoon className="w-5 h-5 text-white transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}
