import { useCallback, useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatCurrency } from '../../utils/formatCurrency';
import CardProduct from '../Card/Card';
import FilterSummary from '../FilterSummary';
import PropTypes from 'prop-types';
import { ProgressSpinner } from 'primereact/progressspinner';

const ProductList = ({
  products,
  selectedCategory,
  onRemoveCategory,
  onProductClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const fetchMoreData = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return products.slice(0, end);
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
          {currentItems.map((product, index) => {
            const mainColor = product.productColors?.[0];
            return (
              <CardProduct
                key={product.product__Id || index}
                nameProduct={product.product__Name}
                description={truncateDescription(
                  mainColor?.productColor__Description || 'No description',
                  14
                )}
                price={formatCurrency(mainColor?.productColor__Price || 0)}
                brand={product.brand?.brand__Name || 'Unknown Brand'}
                imageUrl={
                  mainColor?.images?.[0] || 'https://via.placeholder.com/400'
                }
                onClick={() => {
                  onProductClick(product); // Truyền object product
                }}
              />
            );
          })}
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
