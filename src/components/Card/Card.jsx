import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import 'primeicons/primeicons.css';
import { useTheme } from '../../context/ThemeContext';

/**
 *
 * @param nameProduct
 * @param description
 * @param price
 * @param brand
 * @param nameTag
 * @param imageUrl
 * @param onClick
 * @returns {Element}
 * @constructor
 */
const CardProduct = ({
  nameProduct,
  description,
  price,
  brand,
  imageUrl,
  onClick,
}) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer rounded-lg shadow-md p-4 flex flex-col justify-between transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-800 hover:bg-gray-700'
          : 'bg-white hover:bg-gray-50'
      }`}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="overflow-hidden rounded-lg relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.img
          src={imageUrl}
          alt={nameProduct}
          className="w-full h-48 object-cover rounded-lg"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          } shadow-md`}
        >
          <i
            className="pi pi-heart text-lg"
            style={{ color: colors.primary }}
          ></i>
        </div>
      </motion.div>

      <div className="mt-4 flex justify-between items-center">
        <span
          className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {brand}
        </span>
        <div
          className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-2 py-1 rounded-lg shadow-sm text-xs font-bold flex items-center`}
        >
          <i className="pi pi-star-fill mr-1" style={{ color: '#FFD700' }}></i>
          <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
            5.0
          </span>
        </div>
      </div>

      <h4
        className={`text-lg font-bold mt-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        {nameProduct}
      </h4>

      <div
        className={`text-sm mt-1 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        {description}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p
          className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
          style={{ color: colors.primaryAccent }}
        >
          {price}
        </p>
        <motion.button
          className={`p-2 rounded-full ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i
            className="pi pi-shopping-cart"
            style={{ color: colors.primary }}
          ></i>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CardProduct;

CardProduct.propTypes = {
  nameProduct: PropTypes.string,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  brand: PropTypes.string,
  nameTag: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
