import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
        User Management
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Manage All User efficiently
      </p>
    </div>
  );
};

export default Header;