import React, { ChangeEvent } from 'react';

interface CategoryFiltersProps {
  onFilterChange: (filters: {
    category: string;
    status: string;
    priceRange: string;
    store: string;
  }) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    category: '',
    status: '',
    priceRange: '',
    store: '',
  });

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-3 mb-6">
      <div>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="">Category: All</option>
          <option value="Jackets">Jackets (132)</option>
          <option value="Shirts">Shirts (50)</option>
          <option value="Pants">Pants (30)</option>
        </select>
      </div>
      <div>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div>
        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="">Price: All</option>
          <option value="50000-100000">50.000 - 100.000 VND</option>
          <option value="100000-500000">100.000 - 500.000 VND</option>
          <option value="500000-1000000">500.000 - 1.000.000 VND</option>
        </select>
      </div>
      <div>
        <select
          name="store"
          value={filters.store}
          onChange={handleFilterChange}
          className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="">Store: All</option>
          <option value="Store1">Store 1</option>
          <option value="Store2">Store 2</option>
          <option value="Store3">Store 3</option>
        </select>
      </div>
    </div>
  );
};

export default CategoryFilters;