import React, { useState, useEffect } from 'react';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/product-features/Header';
import FilterBar from '../components/product-features/FilterBar';
import CategoryFilters from '../components/product-features/CategoryFilters';
import ProductTable from '../components/product-features/ProductTable';
import Pagination from '../components/product-features/Pagination';
import AddProductModal from '../components/product-features/AddProductModal';

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  mainImage: string;
  subImages: string[];
  color: string;
  sizes: Size[];
  brand: string;
  description: string;
  price: string;
  purchaseUnit: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Gabriela Cashmere Blazer',
    sku: 'TI4116',
    mainImage: '/images/products/gabriela-cashmere-blazer.jpg',
    subImages: [],
    color: 'Red',
    sizes: [
      { size: '38', quantity: 50 },
      { size: '39', quantity: 40 },
    ],
    brand: 'GABRIELA',
    description: 'A luxurious cashmere blazer for all seasons.',
    price: '$113.99',
    purchaseUnit: 113,
    stock: 14012,
    status: 'Active',
  },
];

const ProductFeatures: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productsPerPage = 7;
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);

  // Lấy danh sách hãng từ localStorage để gợi ý
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const products: Product[] = JSON.parse(savedProducts);
      const brands = [...new Set(products.map((p) => p.brand))];
      setBrandSuggestions(brands);
    }
  }, []);

  // Lưu sản phẩm vào localStorage khi products thay đổi
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  return (
    <>
      <PageMeta
        title="Product Features | TailAdmin - React.js Admin Dashboard Template"
        description="Manage products in TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header />
        <FilterBar onAddProduct={() => setIsModalOpen(true)} />
        {isModalOpen ? (
          <div className="flex justify-center mb-6">
            <AddProductModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddProduct={handleAddProduct}
              brandSuggestions={brandSuggestions}
            />
          </div>
        ) : (
          <>
            <CategoryFilters />
            <ProductTable products={currentProducts} onDelete={handleDelete} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProductFeatures;