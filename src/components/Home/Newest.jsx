import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardProduct from '../Card/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { truncateDescription } from '../../utils/truncateDescription';
import useFetchApi from '../../hooks/useFetchApi';
import { ProgressSpinner } from 'primereact/progressspinner';

const Newest = () => {
  const navigate = useNavigate();

  const {
    data: products,
    loading,
    error,
  } = useFetchApi('https://18.139.41.39:444/api/products/filter');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  console.log(products);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>0</div>;
  }

  const handleProductClick = (product) => {
    navigate(`/products/${product.product__Name}`, { state: { product } });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.slice(0, 4).map((product, index) => {
        const mainVariant = product.productColors?.[0] || {};
        const mainImage =
          mainVariant.images?.[0] || 'https://placehold.co/300x300';
        return (
          <CardProduct
            key={product.product__Id || index}
            nameProduct={product.product__Name}
            description={truncateDescription(
              product.product__Description || '',
              30
            )}
            price={formatCurrency(mainVariant.productColor__Price || 0)}
            brand={product.brand || 'NIKE'}
            nameTag={product.tag || []}
            imageUrl={mainImage}
            onClick={() => handleProductClick(product)}
            badgeText="NEW"
          />
        );
      })}
    </div>
  );
};

export default Newest;
