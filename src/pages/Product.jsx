import React, { useCallback, useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Layout from '../components/Layout';
import ProductList from '../components/ProductList/ProductList';
import Sidebar from '../components/Sidebar.jsx';
import SortBy from '../components/SortBy';
import BreadCrumb from '../components/BreadCrumb.jsx';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productFilters, setProductFilters] = useState({
    brand: '',
    price: '',
    size: '',
    sortOption: 'Popularity',
  });

  const updateProductFilters = useCallback((updates) => {
    setProductFilters((prevFilters) => ({
      ...prevFilters,
      ...updates,
    }));
  }, []);

  const handleCategoryChange = useCallback(
    (category) => {
      const [group, value] = category.split(':');
      updateProductFilters({ [group]: value });
    },
    [updateProductFilters]
  );

  const handleRemoveCategory = useCallback(
    (group) => {
      updateProductFilters({ [group]: '' });
    },
    [updateProductFilters]
  );

  const handleProductClick = (product) => {
    if (!product || typeof product !== 'object') {
      console.error('Invalid product:', product);
      return;
    }
    // Chuyển hướng truyền kèm state
    navigate(`/products/${product.product__Name}`, { state: { product } });
  };

  useEffect(() => {
    fetch('https://18.139.41.39:444/api/products/filter')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      <Header />
      <Layout>
        <div className="flex flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-2xl font-bold">Products</p>
            <SortBy
              sortOption={productFilters.sortOption}
              setSortOption={(newSortOption) =>
                updateProductFilters({ sortOption: newSortOption })
              }
            />
          </div>
          <div className="my-5">
            <BreadCrumb />
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4">
              <Sidebar
                onCategoryChange={handleCategoryChange}
                selectedCategory={productFilters}
              />
            </div>
            <div className="w-full md:w-3/4 ml-0 md:ml-4">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <ProductList
                  products={products}
                  selectedCategory={productFilters}
                  onCategoryChange={handleCategoryChange}
                  onRemoveCategory={handleRemoveCategory}
                  onProductClick={handleProductClick}
                />
              )}
            </div>
          </div>
        </div>
        <br />
      </Layout>
      <Footer />
    </React.Fragment>
  );
};

export default React.memo(Product);
