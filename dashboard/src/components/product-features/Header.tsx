import React from 'react';
import { FiPackage } from 'react-icons/fi';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <FiPackage className="text-[#A8DCE7]" /> Product Management
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Manage your products efficiently
      </p>
    </div>
  );
};

export default Header;
