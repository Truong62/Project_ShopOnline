import React from 'react';
import { Link } from 'react-router-dom';

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

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600">
              Product Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600">
              Purchase Unit
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={`${
                index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
              } hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-150 border-t border-gray-200 dark:border-gray-600`}
            >
              <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover shadow-sm"
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
              <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {product.price}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.purchaseUnit} / {product.stock}
                </p>
              </td>
              <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-600">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  <i
                    className={`pi pi-circle-fill mr-2 text-[8px] ${
                      product.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Link
                    to={`/product-features/edit/${product.id}`}
                    className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all duration-200 shadow-sm"
                  >
                    <i className="pi pi-pencil" />
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200 shadow-sm"
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
  );
};

export default ProductTable;