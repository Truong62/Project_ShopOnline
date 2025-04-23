import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from './SvgIcon/ArrowIcon';

/**
 *
 * @param onCategoryChange
 * @param selectedCategory
 * @returns {Element}
 * @constructor
 */
const Sidebar = ({ onCategoryChange, selectedCategory }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [openBrands, setOpenBrands] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openSize, setOpenSize] = useState(true);

  const toggleCategory = useCallback(() => {
    setIsCategoryOpen((prevState) => !prevState);
  }, []);

  const toggleBrands = useCallback(() => {
    setOpenBrands((prevState) => !prevState);
  }, []);

  const togglePrice = useCallback(() => {
    setOpenPrice((prevState) => !prevState);
  }, []);

  const toggleSize = useCallback(() => {
    setOpenSize((prevState) => !prevState);
  }, []);

  return (
    <div className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between text-xl font-bold px-4 py-3 mb-2 border-b border-gray-100">
        <span className="text-[rgb(65,179,199)]">Categories</span>
        <button
          className="p-2 rounded-lg md:hidden text-[rgb(65,179,199)] hover:bg-[rgba(65,179,199,0.1)] transition-colors duration-200"
          onClick={toggleCategory}
        >
          <ArrowIcon isOpen={isCategoryOpen} />
        </button>
      </div>

      <div className={`mt-2 md:block ${isCategoryOpen ? 'block' : 'hidden'}`}>
        {/* Brands */}
        <div className="mb-4">
          <button
            className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-[rgba(65,179,199,0.08)] transition-colors duration-200"
            onClick={toggleBrands}
          >
            <span className="font-medium">Brands</span>
            <div
              className={`transform transition-transform duration-200 ${openBrands ? 'rotate-180' : ''}`}
            >
              <ArrowIcon isOpen={openBrands} />
            </div>
          </button>
          {openBrands && (
            <form className="px-4 mt-3 space-y-3">
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="brand1"
                  type="radio"
                  name="brand"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('brand:Brand 1')}
                  checked={selectedCategory.brand === 'Brand 1'}
                />
                <label
                  htmlFor="brand1"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  Brand 1
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (10)
                </span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="brand2"
                  type="radio"
                  name="brand"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('brand:Brand 2')}
                  checked={selectedCategory.brand === 'Brand 2'}
                />
                <label
                  htmlFor="brand2"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  Brand 2
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (15)
                </span>
              </div>
            </form>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        {/* Price */}
        <div className="mb-4">
          <button
            className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-[rgba(65,179,199,0.08)] transition-colors duration-200"
            onClick={togglePrice}
          >
            <span className="font-medium">Price</span>
            <div
              className={`transform transition-transform duration-200 ${openPrice ? 'rotate-180' : ''}`}
            >
              <ArrowIcon isOpen={openPrice} />
            </div>
          </button>
          {openPrice && (
            <div className="px-4 mt-3 space-y-3">
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="price1"
                  type="radio"
                  name="price"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('price:Under $50')}
                  checked={selectedCategory.price === 'Under $50'}
                />
                <label
                  htmlFor="price1"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  Under $50
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (20)
                </span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="price2"
                  type="radio"
                  name="price"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('price:$50 to $100')}
                  checked={selectedCategory.price === '$50 to $100'}
                />
                <label
                  htmlFor="price2"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  $50 to $100
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (30)
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        {/* Size */}
        <div className="mb-2">
          <button
            className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-[rgba(65,179,199,0.08)] transition-colors duration-200"
            onClick={toggleSize}
          >
            <span className="font-medium">Size</span>
            <div
              className={`transform transition-transform duration-200 ${openSize ? 'rotate-180' : ''}`}
            >
              <ArrowIcon isOpen={openSize} />
            </div>
          </button>
          {openSize && (
            <div className="px-4 mt-3 space-y-3">
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="size1"
                  type="radio"
                  name="size"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('size:Small')}
                  checked={selectedCategory.size === 'Small'}
                />
                <label
                  htmlFor="size1"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  Small
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (25)
                </span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  id="size2"
                  type="radio"
                  name="size"
                  className="w-4 h-4 accent-[rgb(65,179,199)]"
                  onChange={() => onCategoryChange('size:Medium')}
                  checked={selectedCategory.size === 'Medium'}
                />
                <label
                  htmlFor="size2"
                  className="ml-3 cursor-pointer flex-grow"
                >
                  Medium
                </label>
                <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                  (35)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);

Sidebar.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.shape({
    brand: PropTypes.string,
    price: PropTypes.string,
    size: PropTypes.string,
  }).isRequired,
};
