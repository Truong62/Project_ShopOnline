import React from 'react';

const CategoryFilters: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
      <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
        <option>Category: Jackets (132)</option>
        <option>Category: Shirts</option>
        <option>Category: Pants</option>
      </select>
      <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
        <option>Status: All Status</option>
        <option>Status: Active</option>
        <option>Status: Inactive</option>
      </select>
      <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
        <option>Price: $50 - $100</option>
        <option>Price: $0 - $50</option>
        <option>Price: $100 - $200</option>
      </select>
      <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
        <option>Store: All Store</option>
        <option>Store: Store 1</option>
        <option>Store: Store 2</option>
      </select>
    </div>
  );
};

export default CategoryFilters;