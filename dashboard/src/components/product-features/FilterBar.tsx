import React, { ChangeEvent } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';

interface FilterBarProps {
  onAddProduct: () => void;
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: string) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onAddProduct,
  onSearch,
  onSort,
  className,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSort(e.target.value);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            onChange={handleSearchChange}
            className="h-12 w-full rounded-xl border border-gray-200 bg-[#E6F2F5] pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
        <select
          onChange={handleSortChange}
          className="h-12 w-full sm:w-48 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="date-newest">Date: Newest</option>
          <option value="date-oldest">Date: Oldest</option>
        </select>
      </div>
      <button
        onClick={onAddProduct}
        className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center w-full sm:w-auto"
      >
        <FiPlus /> Add Product
      </button>
    </div>
  );
};

export default FilterBar;
