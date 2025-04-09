import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';

interface Product {
  id: number;
  name: string;
  sku: string;
  image: string;
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
    image: '/images/products/gabriela-cashmere-blazer.jpg',
    price: '$113.99',
    purchaseUnit: 113,
    stock: 14012,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Loewe Blend Jacket - Blue',
    sku: 'TI4116',
    image: '/images/products/loewe-blend-jacket-blue.jpg',
    price: '$113.99',
    purchaseUnit: 721,
    stock: 13212,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Sandro - Jacket - Black',
    sku: 'TI4116',
    image: '/images/products/sandro-jacket-black.jpg',
    price: '$113.99',
    purchaseUnit: 407,
    stock: 8201,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Adidas By Stella McCartney',
    sku: 'TI4116',
    image: '/images/products/adidas-stella-mccartney.jpg',
    price: '$113.99',
    purchaseUnit: 1203,
    stock: 1002,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Meteo Hooded Wool Jacket',
    sku: 'TI4116',
    image: '/images/products/meteo-hooded-wool-jacket.jpg',
    price: '$113.99',
    purchaseUnit: 306,
    stock: 807,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Hida Down Ski Jacket - Red',
    sku: 'TI4116',
    image: '/images/products/hida-down-ski-jacket-red.jpg',
    price: '$113.99',
    purchaseUnit: 201,
    stock: 406,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Dolce & Gabbana',
    sku: 'TI4116',
    image: '/images/products/dolce-gabbana.jpg',
    price: '$113.99',
    purchaseUnit: 108,
    stock: 204,
    status: 'Active',
  },
];

const ProductFeatures: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7; // Số sản phẩm mỗi trang

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tính tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý xóa sản phẩm
  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <PageMeta
        title="Product Features | TailAdmin - React.js Admin Dashboard Template"
        description="Manage products in TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="p-6">
        {/* Header với tìm kiếm và bộ lọc */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customer..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder:text-gray-500 dark:focus:ring-primary/30"
              />
              <i className="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
                <option>Show: All Products</option>
                <option>Show: 10 Products</option>
                <option>Show: 20 Products</option>
              </select>
              <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
                <option>Sort by: Default</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
              </select>
              <button className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                <i className="pi pi-filter mr-2" />
                Filter
              </button>
            </div>
          </div>
          <Link
            to="/product-features/add"
            className="h-11 rounded-lg bg-primary px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-primary/90"
          >
            + Add Product
          </Link>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
            <option>Category: Jackets (132)</option>
            <option>Category: Shirts</option>
            <option>Category: Pants</option>
          </select>
          <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
            <option>Status: All Status</option>
            <option>Status: Active</option>
            <option>Status: Inactive</option>
          </select>
          <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
            <option>Price: $50 - $100</option>
            <option>Price: $0 - $50</option>
            <option>Price: $100 - $200</option>
          </select>
          <select className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-3 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-primary/30">
            <option>Store: All Store</option>
            <option>Store: Store 1</option>
            <option>Store: Store 2</option>
          </select>
        </div>

        {/* Bảng danh sách sản phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                  Purchase Unit
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {product.price}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.purchaseUnit} / {product.stock}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === 'Active'
                          ? 'bg-success/20 text-success'
                          : 'bg-danger/20 text-danger'
                      }`}
                    >
                      <i
                        className={`pi pi-circle-fill mr-1 text-[8px] ${
                          product.status === 'Active' ? 'text-success' : 'text-danger'
                        }`}
                      />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/product-features/edit/${product.id}`}
                        className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90"
                      >
                        <i className="pi pi-pencil" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="h-9 w-9 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <i className="pi pi-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 rounded-lg border border-gray-300 flex items-center justify-center text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <i className="pi pi-chevron-right" />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default ProductFeatures;