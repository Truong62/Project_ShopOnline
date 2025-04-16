import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/product-features/Header';
import FilterBar from '../components/product-features/FilterBar';
import CategoryFilters from '../components/product-features/CategoryFilters';
import ProductTable from '../components/product-features/ProductTable';
import Pagination from '../components/product-features/Pagination';
import ProductFormModal from '../components/product-features/ProductFormModal';
import { Product } from '../types';

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
    price: '113990',
    purchaseUnit: 113,
    stock: 14012,
    status: 'Released',
    createdAt: new Date('2025-04-01').toISOString(),
  },
];

const ProductFeatures: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const productsPerPage = 7;
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const products: Product[] = JSON.parse(savedProducts);
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
      setBrandSuggestions(brands);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('vi-VN') + ' VND';
  };

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === filters.status
      );
    }

    if (sortOption) {
      filteredProducts.sort((a, b) => {
        if (sortOption === 'price-asc') {
          return parseFloat(a.price) - parseFloat(b.price);
        } else if (sortOption === 'price-desc') {
          return parseFloat(b.price) - parseFloat(a.price);
        } else if (sortOption === 'name-asc') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'name-desc') {
          return b.name.localeCompare(a.name);
        } else if (sortOption === 'date-newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === 'date-oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      });
    }

    return filteredProducts;
  };

  const filteredAndSortedProducts = getFilteredAndSortedProducts();
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (newProduct: Product) => {
    try {
      console.log('New Product:', newProduct);

      if (isEditing && productToEdit) {
        // Cập nhật sản phẩm
        setProducts(
          products.map((p) => (p.id === newProduct.id ? newProduct : p))
        );
        setIsModalOpen(false);
        setIsEditing(false);
        setProductToEdit(null);
        toast.success('Product updated successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });
      } else {
        // Kiểm tra sản phẩm trùng
        const existingProduct = products.find((p) => {
          const normalizedName = (p.name || '').trim().toLowerCase();
          const normalizedBrand = (p.brand || '').trim().toLowerCase();
          const normalizedColor = (p.color || '').trim().toLowerCase();

          const newNormalizedName = (newProduct.name || '').trim().toLowerCase();
          const newNormalizedBrand = (newProduct.brand || '').trim().toLowerCase();
          const newNormalizedColor = (newProduct.color || '').trim().toLowerCase();

          console.log('Comparing:', {
            existing: { name: normalizedName, brand: normalizedBrand, color: normalizedColor },
            new: { name: newNormalizedName, brand: newNormalizedBrand, color: newNormalizedColor },
          });

          return (
            normalizedName === newNormalizedName &&
            normalizedBrand === newNormalizedBrand &&
            normalizedColor === newNormalizedColor
          );
        });

        if (existingProduct) {
          console.log('Duplicate found:', existingProduct);
          toast.error('This product already exists.', {
            position: 'top-center',
            autoClose: 5000,
          });
          return;
        }

        // Thêm sản phẩm mới
        setProducts([...products, { ...newProduct, createdAt: new Date().toISOString() }]);
        setIsModalOpen(false);
        setIsEditing(false);
        setProductToEdit(null);
        toast.success('Product added successfully!', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'An error occurred while saving the product.', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: { status: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="Product Features | TailAdmin - React.js Admin Dashboard Template"
        description="Manage products in TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ToastContainer style={{ zIndex: 10000 }} position="top-center" />
        <Header />
        <FilterBar
          onAddProduct={handleAddProduct}
          onSearch={handleSearch}
          onSort={handleSort}
        />
        {isModalOpen ? (
          <div className="flex justify-center mb-6">
            <ProductFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveProduct}
              brandSuggestions={brandSuggestions}
              productToEdit={productToEdit}
            />
          </div>
        ) : (
          <>
            <CategoryFilters onFilterChange={handleFilterChange} />
            <ProductTable
              products={currentProducts.map((product) => ({
                ...product,
                price: formatPrice(product.price),
              }))}
              onDelete={handleDelete}
              onEdit={handleEditProduct}
            />
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