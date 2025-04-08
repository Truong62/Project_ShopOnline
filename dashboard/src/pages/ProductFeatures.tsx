import React, { useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import { Modal } from '../components/ui/modal';
import { useModal } from '../hooks/useModal';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
}

const ProductFeatures = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Sản phẩm 1',
      description: 'Mô tả sản phẩm 1',
      category: 'Điện tử',
    },
    {
      id: '2',
      name: 'Sản phẩm 2',
      description: 'Mô tả sản phẩm 2',
      category: 'Thời trang',
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { isOpen, openModal, closeModal } = useModal(false); // Thêm tham số false

  const handleAddOrUpdateProduct = () => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, name, description, category }
            : product
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        description,
        category,
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    }
    closeModal();
    resetModalFields();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    openModal();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    }
  };

  const resetModalFields = () => {
    setName('');
    setDescription('');
    setCategory('');
    setSelectedProduct(null);
  };

  return (
    <>
      <PageMeta
        title="Product Features | TailAdmin - React.js Admin Dashboard Template"
        description="Manage product features with add, edit, and delete functionalities."
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Danh mục sản phẩm
          </h2>
          <button
            onClick={() => {
              resetModalFields();
              openModal();
            }}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Thêm sản phẩm
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              Không có sản phẩm nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-theme-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <path
                      d="M20 7H4C3.44772 7 3 7.44772 3 8V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V8C21 7.44772 20.5523 7 20 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3H8C7.44772 3 7 3.44772 7 4V7H17V4C17 3.44772 16.5523 3 16 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {product.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <path
                        d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-red-600 dark:text-red-400"
                    >
                      <path
                        d="M3 6H5H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 11V17M14 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[600px] p-6 lg:p-8"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Điền thông tin để {selectedProduct ? 'sửa' : 'thêm'} sản phẩm
              </p>
            </div>
            <div className="mt-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Nhập danh mục"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Đóng
              </button>
              <button
                onClick={handleAddOrUpdateProduct}
                type="button"
                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProductFeatures;