import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import PageMeta from '../components/common/PageMeta';
import Header from '../components/product-features/Header';
import FilterBar from '../components/product-features/FilterBar';
import CategoryFilters from '../components/product-features/CategoryFilters';
import ProductTable from '../components/product-features/ProductTable';
import Pagination from '../components/product-features/Pagination';
import ProductFormModal from '../components/product-features/ProductFormModal';
import ColorModal from '../components/product-features/ColorModal';
import Alert from '../components/ui/alert/Alert';
import { Product } from '../types';

interface Brand {
  id: number;
  name: string;
  createdAt: string;
}

interface Color {
  name: string;
  code?: string;
}

const ProductFeatures: React.FC = () => {
  const initialProducts: Product[] = [];
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  const [colors, setColors] = useState<Color[]>(() => {
    const savedColors = localStorage.getItem('colors');
    return savedColors ? JSON.parse(savedColors) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const productsPerPage = 7;
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({ status: '' });
  const toast = useRef<Toast>(null);

  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    variant: 'info',
    title: '',
    message: '',
  });

  // Hàm fetch dữ liệu sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/products/filter',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      // Giả sử API trả về mảng sản phẩm trong thuộc tính `products`
      setProducts(data.products || data); // Điều chỉnh theo cấu trúc dữ liệu API thực tế
      localStorage.setItem('products', JSON.stringify(data.products || data));
      showAlert('success', 'Products Loaded', 'Products fetched successfully!');
    } catch (error: any) {
      console.error('Error fetching products:', error);
      showAlert(
        'error',
        'Fetch Error',
        'Failed to fetch products from the server.'
      );
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const loadBrandSuggestions = () => {
    const savedBrands = localStorage.getItem('brands');
    if (savedBrands) {
      const parsedBrands: Brand[] = JSON.parse(savedBrands);
      const brandNames = parsedBrands.map((brand) => brand.name);
      setBrandSuggestions(brandNames);
    } else {
      setBrandSuggestions([]);
    }
  };

  useEffect(() => {
    loadBrandSuggestions();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'brands') {
        loadBrandSuggestions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('colors', JSON.stringify(colors));
  }, [products, colors]);

  useEffect(() => {
    if (isColorModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isColorModalOpen]);

  const showAlert = (
    variant: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlert({ show: true, variant, title, message });
    setTimeout(() => {
      setAlert({ show: false, variant: 'info', title: '', message: '' });
    }, 5000);
  };

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
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        } else if (sortOption === 'price-desc') {
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        } else if (sortOption === 'name-asc') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'name-desc') {
          return b.name.localeCompare(a.name);
        } else if (sortOption === 'date-newest') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortOption === 'date-oldest') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      });
    }

    return filteredProducts;
  };

  const handleAddColor = (colorName: string) => {
    setColors([...colors, { name: colorName }]);
    showAlert('success', 'Color Added', 'New color added successfully!');
  };

  const filteredAndSortedProducts = getFilteredAndSortedProducts();
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    showAlert(
      'success',
      'Product Deleted',
      'Product was successfully deleted.'
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddProduct = () => {
    loadBrandSuggestions();
    setIsEditing(false);
    setProductToEdit(null);
    setIsFormVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    loadBrandSuggestions();
    setIsEditing(true);
    setProductToEdit(product);
    setIsFormVisible(true);
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    showAlert(
      'success',
      'Status Updated',
      'Product status updated successfully!'
    );
  };

  const handleSaveProduct = (newProduct: Product) => {
    try {
      if (isEditing && productToEdit) {
        setProducts(
          products.map((p) => (p.id === newProduct.id ? newProduct : p))
        );
        showAlert(
          'success',
          'Product Updated',
          'Product updated successfully!'
        );
      } else {
        const existingProduct = products.find((p) => {
          const normalizedName = (p.name || '').trim().toLowerCase();
          const normalizedBrand = (p.brand || '').trim().toLowerCase();
          const normalizedColor = (p.color || '').trim().toLowerCase();
          const newNormalizedName = (newProduct.name || '')
            .trim()
            .toLowerCase();
          const newNormalizedBrand = (newProduct.brand || '')
            .trim()
            .toLowerCase();
          const newNormalizedColor = (newProduct.color || '')
            .trim()
            .toLowerCase();

          return (
            normalizedName === newNormalizedName &&
            normalizedBrand === newNormalizedBrand &&
            normalizedColor === newNormalizedColor
          );
        });

        if (existingProduct) {
          showAlert(
            'error',
            'Duplicate Product',
            'This product already exists.'
          );
          return;
        }

        setProducts([
          ...products,
          { ...newProduct, createdAt: new Date().toISOString() },
        ]);
        showAlert('success', 'Product Added', 'Product added successfully!');
      }
      setIsFormVisible(false);
      setIsEditing(false);
      setProductToEdit(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      showAlert(
        'error',
        'Error',
        error.message || 'An error occurred while saving the product.'
      );
    }
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setProductToEdit(null);
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
      <div className="p-4 sm:p-6 md:p-8 bg-[#F1F9FB] dark:bg-gray-800 min-h-screen transition-colors duration-300 relative">
        <Toast ref={toast} />
        <Header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8" />
        <FilterBar
          onAddProduct={handleAddProduct}
          onSearch={handleSearch}
          onSort={handleSort}
          onAddColor={() => setIsColorModalOpen(true)}
          className="flex flex-wrap items-center gap-3 mb-6"
        />
        {alert.show && (
          <div className="mb-6">
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
              showLink={false}
            />
          </div>
        )}

        {isFormVisible ? (
          <div className="max-w-3xl mx-auto">
            <ProductFormModal
              isOpen={true}
              onClose={handleCancelForm}
              onSave={handleSaveProduct}
              brandSuggestions={brandSuggestions}
              productToEdit={productToEdit}
              colors={colors}
            />
          </div>
        ) : (
          <>
            <CategoryFilters
              onFilterChange={handleFilterChange}
              className="flex flex-wrap items-center gap-3 mb-6"
            />
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <ProductTable
                products={currentProducts.map((product) => ({
                  ...product,
                  price: formatPrice(product.price || '0'),
                }))}
                onUpdate={handleUpdateProducts}
                onEdit={handleEditProduct}
              />
            </div>
            <Pagination
              className="flex flex-wrap justify-center gap-2 mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {isColorModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[1000]">
            <ColorModal
              isOpen={isColorModalOpen}
              onClose={() => setIsColorModalOpen(false)}
              onSave={handleAddColor}
              existingColors={colors.map((c) => c.name)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFeatures;
