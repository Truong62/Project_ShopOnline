import React, { useState } from 'react';
import { Product } from '../../types';
import { FiEdit } from 'react-icons/fi';

interface ProductTableProps {
  products: Product[];
  onUpdate: (updatedProducts: Product[]) => void;
  onEdit: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onUpdate,
  onEdit,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [dropdownOpenForProduct, setDropdownOpenForProduct] = useState<
    number | null
  >(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    'Released' | 'Unreleased' | null
  >(null);

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const handleBulkStatusChange = (status: 'Released' | 'Unreleased') => {
    if (selectedProducts.length === 0) return;

    setPendingStatus(status);
    setIsConfirmModalOpen(true);
    setIsBulkDropdownOpen(false);
  };

  const confirmBulkStatusChange = () => {
    if (!pendingStatus) return;

    const updatedProducts = products.map((product) => {
      if (
        selectedProducts.includes(product.id) &&
        product.status !== pendingStatus
      ) {
        return { ...product, status: pendingStatus };
      }
      return product;
    });

    // Kiểm tra nếu có thay đổi thực sự
    const hasChanges = updatedProducts.some(
      (p, index) => p.status !== products[index].status
    );
    if (hasChanges) {
      onUpdate(updatedProducts);
    }

    setSelectedProducts([]);
    setIsConfirmModalOpen(false);
    setPendingStatus(null);
  };

  const handleStatusChange = (
    product: Product,
    status: 'Released' | 'Unreleased'
  ) => {
    if (product.status === status) return; // Không thay đổi nếu trạng thái đã giống

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, status } : p
    );
    onUpdate(updatedProducts);
    setDropdownOpenForProduct(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-[#E6F2F5] dark:bg-gray-800">
            <tr>
              <th className="px-2 sm:px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#A8DCE7] focus:ring-[#A8DCE7] border-gray-300 rounded"
                />
              </th>
              <th className="px-2 sm:px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-2 sm:px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-2 sm:px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <div className="relative flex items-center">
                  <span>Status</span>
                  {selectedProducts.length > 0 && (
                    <div className="ml-2">
                      <button
                        onClick={() =>
                          setIsBulkDropdownOpen(!isBulkDropdownOpen)
                        }
                        className="text-gray-600 dark:text-gray-300 hover:text-[#A8DCE7] dark:hover:text-[#A8DCE7] transition-colors duration-300"
                      >
                        <i
                          className={`pi pi-chevron-${isBulkDropdownOpen ? 'up' : 'down'}`}
                        />
                      </button>
                      {isBulkDropdownOpen && (
                        <div className="absolute top-8 left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                          <div
                            onClick={() => handleBulkStatusChange('Released')}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Released
                          </div>
                          <div
                            onClick={() => handleBulkStatusChange('Unreleased')}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Unreleased
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-4 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const firstVariant =
                product.variants && product.variants.length > 0
                  ? product.variants[0]
                  : null;
              return (
                <tr
                  key={product.id}
                  className="hover:bg-[#F1F9FB] dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 text-[#A8DCE7] focus:ring-[#A8DCE7] border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          firstVariant?.mainImage ||
                          product.mainImage ||
                          'placeholder-image-url'
                        }
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {firstVariant?.price || product.price || 'N/A'}
                  </td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpenForProduct(
                            dropdownOpenForProduct === product.id
                              ? null
                              : product.id
                          )
                        }
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          product.status === 'Released'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : product.status === 'Unreleased'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        }`}
                      >
                        {product.status}
                        <i
                          className={`ml-2 pi pi-chevron-${
                            dropdownOpenForProduct === product.id
                              ? 'up'
                              : 'down'
                          }`}
                        />
                      </button>
                      {dropdownOpenForProduct === product.id && (
                        <div className="absolute top-8 left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                          <div
                            onClick={() =>
                              handleStatusChange(product, 'Released')
                            }
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Released
                          </div>
                          <div
                            onClick={() =>
                              handleStatusChange(product, 'Unreleased')
                            }
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            Unreleased
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-right text-sm font-medium w-16">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-[#A8DCE7] hover:text-[#95C8D2] transition-colors duration-300 transform hover:scale-110"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-sm w-full p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Confirm Status Change
              </h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-300"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to change the status of{' '}
              {selectedProducts.length} product(s) to "{pendingStatus}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkStatusChange}
                className="h-10 rounded-xl bg-[#A8DCE7] px-4 py-2 text-sm font-medium text-gray-800 hover:bg-[#95C8D2] transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
