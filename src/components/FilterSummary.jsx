import PropTypes from 'prop-types';
import React from 'react';

/**
 *
 * @param selectedCategory
 * @param onRemoveCategory
 * @returns {Element}
 * @constructor
 */
const FilterSummary = ({ selectedCategory, onRemoveCategory }) => {
  return (
    <div
      className="flex justify-between items-center p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm mb-5 transition-all duration-300 hover:shadow-md"
      style={{ minHeight: '60px' }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 font-medium text-gray-700">Filters by: </span>
        {Object.entries(selectedCategory).map(
          ([key, value]) =>
            key !== 'sortOption' &&
            value && (
              <div
                key={key}
                className="flex items-center px-3 py-1.5 rounded-full bg-[rgba(65,179,199,0.15)] text-[rgb(65,179,199)] border border-[rgba(65,179,199,0.2)] transition-all duration-200 hover:shadow-sm"
              >
                <span className="text-sm font-medium">{`${value}`}</span>
                <button
                  className="ml-2 w-5 h-5 rounded-full flex items-center justify-center bg-[rgba(65,179,199,0.1)] hover:bg-[rgba(65,179,199,0.25)] text-[rgb(65,179,199)] transition-colors duration-200"
                  onClick={() => onRemoveCategory(key)}
                  aria-label={`Remove ${value} filter`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )
        )}
        {!Object.values(selectedCategory).some((value) => value) && (
          <span className="text-gray-400 italic text-sm">
            No active filters
          </span>
        )}
      </div>
      {Object.values(selectedCategory).some((value) => value) && (
        <button
          className="text-sm text-[rgb(65,179,199)] hover:text-[rgb(45,159,179)] font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-[rgba(65,179,199,0.08)]"
          onClick={() =>
            Object.keys(selectedCategory).forEach((key) =>
              onRemoveCategory(key)
            )
          }
        >
          Clear all
        </button>
      )}
    </div>
  );
};

FilterSummary.propTypes = {
  selectedCategory: PropTypes.object.isRequired,
  onRemoveCategory: PropTypes.func.isRequired,
};

export default FilterSummary;
