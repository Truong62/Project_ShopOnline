import React, { ChangeEvent } from 'react';

interface FilterBarProps {
  onAddProduct: () => void;
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddProduct, onSearch, onSort }) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSort(e.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            onChange={handleSearchChange}
            className="h-10 w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <select
          onChange={handleSortChange}
          className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
        className="h-10 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200"
      >
        <i className="pi pi-plus mr-2" /> Add Product
      </button>
    </div>
  );
};

export default FilterBar;