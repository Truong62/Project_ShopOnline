import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import 'primeicons/primeicons.css';

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
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="overflow-hidden rounded-lg"
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
      </motion.div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">{brand}</span>
        <div className="bg-white text-gray-700 px-2 py-1 rounded-lg shadow-sm text-xs font-bold">
          <i className="pi pi-star-fill text-yellow-500 mr-1"></i>5.0
        </div>
      </div>

      <h4 className="text-lg font-bold mt-2 text-gray-800">{nameProduct}</h4>

      <div className="text-sm text-gray-500 mt-1">{description}</div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-lg font-semibold text-gray-800">{price}</p>
        <motion.button
          className=" text-gray-600 p-2 rounded-full"
          whileHover={{ scale: 1.1, backgroundColor: '#e5e7eb' }}
          whileTap={{ scale: 0.9 }}
        ></motion.button>
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
