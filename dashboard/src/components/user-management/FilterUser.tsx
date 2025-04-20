import React, { ChangeEvent } from 'react';

interface FilterUserProps {
  onAddUser: () => void;
  onSearch: (searchTerm: string) => void;
  onSort: (sortOption: string) => void;
}

const FilterUser: React.FC<FilterUserProps> = ({
  onAddUser,
  onSearch,
  onSort,
}) => {
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
            placeholder="Search user..."
            onChange={handleSearchChange}
            className="h-10 w-64 rounded-lg border border-gray-200 bg-[#E6F2F5] pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-300"
          />
        </div>
        <select
          onChange={handleSortChange}
          className="h-10 rounded-lg border border-gray-200 bg-[#E6F2F5] px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 transition-all duration-300"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
          <option value="date-newest">Date: Newest</option>
          <option value="date-oldest">Date: Oldest</option>
        </select>
      </div>
      <button
        onClick={onAddUser}
        className="h-10 rounded-lg bg-[#A8DCE7] px-5 py-2 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] focus:ring-2 focus:ring-[#A8DCE7] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
      >
        <i className="pi pi-plus mr-2" /> Generate User
      </button>
    </div>
  );
};

export default FilterUser;
