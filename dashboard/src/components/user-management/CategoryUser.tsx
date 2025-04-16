import React, { ChangeEvent } from 'react';

interface CategoryUserProps {
    onFilterChange: (filters: {
        status: string;
        role: string;
    }) => void;
}

const CategoryFilters: React.FC<CategoryUserProps> = ({ onFilterChange }) => {
    const [filters, setFilters] = React.useState({
        status: '',
        role: '',
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
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                    <option value="">Category: All</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
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
        </div>
    );
};

export default CategoryFilters;