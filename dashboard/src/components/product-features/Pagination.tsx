import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  return (
    <div className={`mt-6 flex justify-center ${className}`}>
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#A8DCE7] hover:text-gray-800 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-[#A8DCE7] dark:hover:text-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <FiChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                currentPage === page
                  ? 'bg-[#A8DCE7] text-gray-800 border-[#A8DCE7]'
                  : 'bg-white text-gray-700 hover:bg-[#E6F2F5] dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-[#E6F2F5] dark:hover:text-gray-800'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#A8DCE7] hover:text-gray-800 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-[#A8DCE7] dark:hover:text-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <FiChevronRight />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
