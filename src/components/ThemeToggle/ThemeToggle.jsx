import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import 'primeicons/primeicons.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
        isDarkMode
          ? 'bg-gray-800 text-white hover:bg-gray-700'
          : `bg-${colors.primary} text-${colors.primaryTextColor} hover:bg-${colors.primaryDark}`
      }`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <i className="pi pi-sun text-xl"></i>
      ) : (
        <i className="pi pi-moon text-xl"></i>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
