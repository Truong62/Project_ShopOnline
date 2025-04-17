import { useCallback, useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatCurrency } from '../../utils/formatCurrency';
import CardProduct from '../Card/Card';
import FilterSummary from '../FilterSummary';
import PropTypes from 'prop-types';
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

/**
 *
 * @param products{ProductType}
 * @param selectedCategory
 * @param onRemoveCategory
 * @param onProductClick
 * @returns {Element}
 * @constructor
 */
const ProductList = ({
  products,
  selectedCategory,
  onRemoveCategory,
  onProductClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Handle fetching more data as the user scrolls
  const fetchMoreData = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  // Slice the products array based on the current page
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return products.slice(0, end); // Display products up to the current page
  }, [products, currentPage]);

  const truncateDescription = useCallback((description, maxWords) => {
    if (typeof description !== 'string') {
      return description;
    }
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
  }, []);

  return (
    <div>
      <FilterSummary
        selectedCategory={selectedCategory}
        onRemoveCategory={onRemoveCategory}
      />
      <InfiniteScroll
        dataLength={currentItems.length}
        next={fetchMoreData}
        hasMore={currentItems.length < products.length}
        loader={
          <div className="flex justify-center my-4">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          </div>
        }
        endMessage={<p className="text-center">You have seen all products</p>}
      >
        <div className="grid gap-2 sm:gap-3 lg:gap-5 mb-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {currentItems.map((product, index) => (
            <CardProduct
              key={index}
              nameProduct={product.productName}
              description={truncateDescription(
                product.productDescription || '',
                14
              )}
              price={formatCurrency(product.variants[0].price)}
              brand={product.brandName}
              imageUrl={product.variants[0].images[0]}
              onClick={() => onProductClick(product.productName)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object.isRequired,
  onRemoveCategory: PropTypes.func.isRequired,
  onProductClick: PropTypes.func.isRequired,
};

export default ProductList;
