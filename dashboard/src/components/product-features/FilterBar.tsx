import React from 'react';

interface FilterBarProps {
  onAddProduct: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddProduct }) => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="h-12 w-full sm:w-64 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder:text-gray-500 dark:focus:ring-primary/30 transition-all duration-200"
          />
          <i className="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
            <option>Show: All Products</option>
            <option>Show: 10 Products</option>
            <option>Show: 20 Products</option>
          </select>
          <select className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30 transition-all duration-200">
            <option>Sort by: Default</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
          </select>
          <button className="h-12 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-200">
            <i className="pi pi-filter mr-2" />
            Filter
          </button>
        </div>
      </div>
      <button
        onClick={onAddProduct}
        className="h-12 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-primary/90 transition-all duration-200"
      >
        + Add Product
      </button>
    </div>
  );
};

export default FilterBar;