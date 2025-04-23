import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from 'primereact/dialog';
import {
  FaCheckCircle,
  FaShippingFast,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaMoon,
  FaSun,
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserAlt,
  FaCalendarAlt,
  FaClipboardList,
} from 'react-icons/fa';
import Header from '../components/Header/Header';
import { Tag } from 'primereact/tag';

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [accountId] = useState('user1'); // Mock account ID
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  // Add state for modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  // Function to handle opening the modal with order details
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

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
        orderDate: '2023-12-01',
        paymentMethod: 'Credit Card',
        estimatedDelivery: '2023-12-07',
        notes: 'Please leave at the front door',
        orderItems: [
          { name: 'T-shirt (Blue)', quantity: 1, price: 100000 },
          { name: 'T-shirt (Red)', quantity: 1, price: 100000 },
        ],
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
        orderDate: '2023-12-05',
        paymentMethod: 'PayPal',
        estimatedDelivery: '2023-12-10',
        notes: '',
        orderItems: [
          { name: 'Premium Running Sneakers', quantity: 1, price: 800000 },
        ],
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
        orderDate: '2023-11-20',
        paymentMethod: 'Cash on Delivery',
        estimatedDelivery: '2023-11-25',
        deliveryDate: '2023-11-24',
        notes: 'Gift wrapped please',
        orderItems: [
          { name: 'Travel Backpack (Black)', quantity: 2, price: 200000 },
          { name: 'Mini Backpack (Gray)', quantity: 1, price: 100000 },
        ],
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

  // Status tag rendering with animations
  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Tag
            value="Pending"
            icon={<FaBoxOpen className="mr-2" />}
            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full"
          />
        );
      case 'paid':
        return (
          <Tag
            value="Paid"
            icon={<FaShippingFast className="mr-2" />}
            className="bg-[#d2f2f7] text-[#2c7d90] dark:bg-[#2c7d90] dark:text-[#d2f2f7] px-3 py-1.5 rounded-full"
          />
        );
      case 'delivering':
        return (
          <Tag
            value="Delivering"
            icon={<FaTruck className="mr-2 animate-pulse" />}
            className="bg-[#f7e4c2] text-[#b7852f] dark:bg-[#8a6525] dark:text-[#f7e4c2] px-3 py-1.5 rounded-full"
          />
        );
      case 'delivered':
        return (
          <Tag
            value="Delivered"
            icon={<FaCheckCircle className="mr-2" />}
            className="bg-[#d1f7d9] text-[#2c8a48] dark:bg-[#2c8a48] dark:text-[#d1f7d9] px-3 py-1.5 rounded-full"
          />
        );
      case 'cancelled':
        return (
          <Tag
            value="Cancelled"
            icon={<FaTimesCircle className="mr-2" />}
            className="bg-[#ffd1d1] text-[#a73636] dark:bg-[#a73636] dark:text-[#ffd1d1] px-3 py-1.5 rounded-full"
          />
        );
      default:
        return (
          <Tag
            value={status}
            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full"
          />
        );
    }
  };

  // Format price with proper currency
  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });
  };

  // Function to create a color based on text - replaces placeholder API
  const getInitialBgColor = useMemo(() => {
    return (text) => {
      // Simple hash function to get consistent color for same text
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      // Use #A8DCE7 color family (lighter versions)
      return `rgba(168, 220, 231, ${0.5 + (Math.abs(hash) % 50) / 100})`;
    };
  }, []);

  // Render Order Details Modal
  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const productInitial = selectedOrder.product.charAt(0).toUpperCase();
    const productBgColor = getInitialBgColor(selectedOrder.product);

    return (
      <Dialog
        visible={modalVisible}
        onHide={closeModal}
        className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border-none rounded-xl overflow-hidden`}
        style={{ width: '90%', maxWidth: '700px' }}
        showHeader={false}
        modal
        dismissableMask
      >
        <div
          className={`p-0 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          {/* Modal Header */}
          <div
            className={`relative p-5 pb-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <button
              onClick={closeModal}
              className={`absolute right-5 top-5 p-2 rounded-full transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTimes size={16} />
            </button>
            <h2 className="text-xl font-bold">
              Order Details{' '}
              <span className="text-[#A8DCE7]">#{selectedOrder.id}</span>
            </h2>
            <p
              className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Placed on {selectedOrder.orderDate}
            </p>
          </div>

          <div className="p-5">
            {/* Order Status Section */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Status</h3>
              {getStatusTag(selectedOrder.status)}
            </div>

            {/* Product Summary */}
            <div
              className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-[#f8fdfe]'}`}
            >
              <div className="flex items-center">
                <div
                  className={`h-16 w-16 rounded-lg mr-4 overflow-hidden flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-[#eaf8fb]'}`}
                >
                  {selectedOrder.imageUrl ? (
                    <img
                      src={selectedOrder.imageUrl}
                      alt={selectedOrder.product}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.style.backgroundColor =
                          productBgColor;
                        e.target.parentNode.innerText = productInitial;
                      }}
                    />
                  ) : (
                    <div
                      className="h-full w-full flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: productBgColor }}
                    >
                      {productInitial}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedOrder.product}</h3>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                    >
                      Qty: {selectedOrder.quantity}
                    </span>
                    <span className="font-medium text-[#2c7d90] dark:text-[#A8DCE7]">
                      {formatPrice(selectedOrder.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Order Items</h3>
              <div
                className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                      >
                        Item
                      </th>
                      <th
                        className={`px-4 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                      >
                        Quantity
                      </th>
                      <th
                        className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}
                  >
                    {selectedOrder.orderItems &&
                      selectedOrder.orderItems.map((item, idx) => (
                        <tr
                          key={idx}
                          className={darkMode ? 'bg-gray-800' : 'bg-white'}
                        >
                          <td
                            className={`px-4 py-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}
                          >
                            {item.name}
                          </td>
                          <td
                            className={`px-4 py-3 text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={`px-4 py-3 text-sm text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}
                          >
                            {formatPrice(item.price)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <td
                        colSpan="2"
                        className={`px-4 py-3 text-sm font-medium text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        Total:
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-bold text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        {formatPrice(selectedOrder.price)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-3">Shipping Information</h3>
                <div
                  className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex mb-3">
                    <FaUserAlt
                      className={`mt-1 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <div>
                      <p className="text-sm font-medium">Recipient</p>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {selectedOrder.senderName}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    <FaPhoneAlt
                      className={`mt-1 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {selectedOrder.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <FaMapMarkerAlt
                      className={`mt-1 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-medium mb-3">Payment Details</h3>
                <div
                  className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex mb-3">
                    <FaClipboardList
                      className={`mt-1 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <FaCalendarAlt
                      className={`mt-1 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                    <div>
                      <p className="text-sm font-medium">Expected Delivery</p>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {selectedOrder.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {selectedOrder.notes && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Notes</h3>
                <p
                  className={`text-sm p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className={`px-4 py-2 mr-3 rounded-lg border transition-colors ${
                  darkMode
                    ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                }`}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  darkMode
                    ? 'bg-[#2c7d90] hover:bg-[#236a7a] text-white'
                    : 'bg-[#A8DCE7] hover:bg-[#8ecbd9] text-[#236a7a]'
                }`}
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8fdfe] text-gray-800'}`}
    >
      <Header />

      <motion.div
        className="p-6 md:p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white/90' : 'text-gray-800'}`}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Your Orders
          </motion.h2>

          <motion.button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 text-[#A8DCE7] hover:bg-gray-600'
                : 'bg-[#d2f2f7] text-[#2c7d90] hover:bg-[#bfe8f0]'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center relative w-full">
              <FaSearch className="absolute left-4 z-10 text-[#A8DCE7]" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID or product name..."
                className={`h-12 w-full rounded-full border px-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A8DCE7] 
                ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500'
                    : 'border-gray-200 bg-white text-gray-700 placeholder:text-gray-400'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex justify-center items-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ProgressSpinner
                    style={{ width: '64px', height: '64px' }}
                    strokeWidth="4"
                    fill="none"
                    animationDuration=".7s"
                    color="#A8DCE7"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-[#A8DCE7]">
                  <FaBoxOpen size={24} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders List */}
        <AnimatePresence>
          {!loading && filteredOrders.length === 0 && (
            <motion.div
              className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <FaBoxOpen size={48} className="text-[#A8DCE7] mb-4" />
                <h3
                  className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  No Orders Found
                </h3>
                <p
                  className={`max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  We couldn't find any orders matching your search criteria. Try
                  using different keywords or browse all your orders.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders Cards */}
        {!loading && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order, index) => {
              const productInitial = order.product.charAt(0).toUpperCase();
              const productBgColor = getInitialBgColor(order.product);

              return (
                <motion.div
                  key={order.id}
                  className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`font-medium text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        Order #{order.id}
                      </span>
                      <span
                        className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {order.orderDate}
                      </span>
                    </div>

                    <div className="flex items-center mb-4">
                      <div
                        className={`w-16 h-16 rounded-lg mr-4 flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-[#eaf8fb]'}`}
                      >
                        {order.imageUrl ? (
                          <img
                            src={order.imageUrl}
                            alt={order.product}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentNode.style.backgroundColor =
                                productBgColor;
                              e.target.parentNode.innerText = productInitial;
                            }}
                          />
                        ) : (
                          <div
                            className="h-full w-full flex items-center justify-center text-xl font-bold text-white rounded-lg"
                            style={{ backgroundColor: productBgColor }}
                          >
                            {productInitial}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}
                        >
                          {order.product}
                        </h3>
                        <div className="flex items-center">
                          <span
                            className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mr-2`}
                          >
                            Qty: {order.quantity}
                          </span>
                          <span className="font-medium text-[#2c7d90] dark:text-[#A8DCE7]">
                            {formatPrice(order.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          Status
                        </span>
                        {getStatusTag(order.status)}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4
                        className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Shipping Address
                      </h4>
                      <p
                        className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {order.shippingAddress}
                      </p>
                    </div>

                    <button
                      className={`w-full mt-4 py-2.5 rounded-lg font-medium text-sm transition-colors 
                      ${
                        darkMode
                          ? 'bg-[#2c7d90] text-white hover:bg-[#236a7a]'
                          : 'bg-[#A8DCE7] text-[#236a7a] hover:bg-[#8ecbd9]'
                      }`}
                      onClick={() => openOrderDetails(order)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      {renderOrderDetailsModal()}
    </div>
  );
};

export default YourOrders;
