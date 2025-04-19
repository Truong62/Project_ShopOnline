import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  FaCheckCircle,
  FaShippingFast,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
} from 'react-icons/fa';
import Header from '../components/Header/Header';

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [accountId] = useState('user1'); // Mock account ID
  const orderAcc = [
    [
      {
        id: 1,
        product: 'T-shirt',
        shippingAddress: '123 Main Street, City A',
        senderName: 'John Doe',
        phone: '0901234567',
        quantity: 2,
        price: 200000,
        status: 'pending',
        imageUrl: 'https://example.com/images/tshirt.jpg',
        accountId: 'user1',
      },
      {
        id: 2,
        product: 'Sneakers',
        shippingAddress: '456 Oak Avenue, City B',
        senderName: 'John Doe',
        phone: '0901234567',
        quantity: 1,
        price: 800000,
        status: 'delivering',
        imageUrl: 'https://example.com/images/sneakers.jpg',
        accountId: 'user1',
      },
      {
        id: 3,
        product: 'Backpack',
        shippingAddress: '789 Pine Road, City C',
        senderName: 'John Doe',
        phone: '0901234567',
        quantity: 3,
        price: 300000,
        status: 'delivered',
        imageUrl: 'https://example.com/images/backpack.jpg',
        accountId: 'user1',
      },
    ],
  ];

  // Simulate fetching orders with delay
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const allOrders = orderAcc.flat(); // gộp mảng hai chiều thành mảng một chiều
        const userOrders = allOrders.filter(
          (order) => order.accountId === accountId
        );
        setOrders(userOrders);
        setFilteredOrders(userOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        setLoading(false);
      }
    }, 1000);
  }, [accountId]);

  // Handle search
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Status tag rendering
  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Tag
            value="Pending"
            icon={<FaBoxOpen className="mr-2" />}
            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-lg"
          />
        );
      case 'paid':
        return (
          <Tag
            value="Paid"
            icon={<FaShippingFast className="mr-2" />}
            className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-lg"
          />
        );
      case 'delivering':
        return (
          <Tag
            value="Delivering"
            icon={<FaTruck className="mr-2" />}
            className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-lg"
          />
        );
      case 'delivered':
        return (
          <Tag
            value="Delivered"
            icon={<FaCheckCircle className="mr-2" />}
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-lg"
          />
        );
      case 'cancelled':
        return (
          <Tag
            value="Cancelled"
            icon={<FaTimesCircle className="mr-2" />}
            className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-lg"
          />
        );
      default:
        return (
          <Tag
            value={status}
            className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-lg"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
          Your Orders
        </h2>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center relative w-full">
              <i className="pi pi-search absolute left-3 z-10 text-gray-400 dark:text-gray-500" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or product..."
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <>
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No orders found.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${order.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {getStatusTag(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.shippingAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default YourOrders;
