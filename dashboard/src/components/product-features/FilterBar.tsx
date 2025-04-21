import React from 'react';

interface FilterBarProps {
  onAddProduct: () => void;
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: string) => void;
  onAddColor: () => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onAddProduct,
  onSearch,
  onSort,
  onAddColor,
  className,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const sortOptions = [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
    { label: 'Date: Newest', value: 'date-newest' },
    { label: 'Date: Oldest', value: 'date-oldest' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or SKU..."
          className="h-12 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        <select
          onChange={(e) => onSort(e.target.value)}
          className="h-12 rounded-xl border border-gray-200 bg-[#E6F2F5] px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Sort By</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={onAddProduct}
          className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <i className="pi pi-plus"></i> Add Product
        </button>
        <button
          onClick={onAddColor}
          className="h-12 rounded-xl bg-[#A8DCE7] px-6 py-3 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <i className="pi pi-palette"></i> Add Colors
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
