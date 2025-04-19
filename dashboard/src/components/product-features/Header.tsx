import React from 'react';

interface HeaderProps {
  className?: string; // Add className as an optional prop
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
        Product Management
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Manage your products efficiently
      </p>
    </div>
  );
};

export default Header;
