import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency } from '../utils/formatCurrency';
import { updateQuantity, removeItem, addToCart } from '../redux/cart/cartSlice';
import { Message } from 'primereact/message';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingBag,
  FaTrash,
  FaCreditCard,
  FaPaypal,
  FaArrowLeft,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  useEffect(() => {
    const buyNowItem = localStorage.getItem('buyNowTempProduct');
    if (buyNowItem) {
      try {
        const parsedItem = JSON.parse(buyNowItem);

        const exists = cartItems.some(
          (item) =>
            item.id === parsedItem.id &&
            item.color === parsedItem.color &&
            item.size === parsedItem.size
        );

        if (!exists) {
          dispatch(addToCart(parsedItem));
        }

        localStorage.removeItem('buyNowTempProduct');
      } catch (err) {
        console.error('Invalid buyNowTempProduct in localStorage', err);
      }
    }
  }, [dispatch]);

  const handleQuantityChange = (id, color, size, quantity, stock) => {
    if (quantity < 1 || quantity > stock) {
      setAlert(
        quantity < 1
          ? 'Quantity cannot be less than 1'
          : 'Not enough stock available'
      );
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    dispatch(updateQuantity({ id, color, size, quantity }));
  };

  const handleRemoveItem = (id, color, size) => {
    dispatch(removeItem({ id, color, size }));
    setAlert('Item removed from cart');
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCheckout = () => {
    const buyNowItem = localStorage.getItem('buyNowTempProduct');

    if (cartItems.length === 0 && !buyNowItem) {
      setAlert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const isInCart = (parsedItem) =>
      cartItems.some(
        (item) =>
          item.id === parsedItem.id &&
          item.color === parsedItem.color &&
          item.size === parsedItem.size
      );

    if (buyNowItem) {
      try {
        const parsedItem = JSON.parse(buyNowItem);
        if (!isInCart(parsedItem)) {
          dispatch(addToCart(parsedItem));
        }
      } catch (err) {
        console.error('Invalid buyNowTempProduct in localStorage', err);
        setAlert('There was an error processing your product.');
        return;
      }
    }

    navigate('/checkout');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <React.Fragment>
      <Header />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
        <div className="max-w-6xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-8"
          >
            <FaShoppingBag className="text-gray-800 dark:text-gray-200 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              Shopping Cart
            </h1>
          </motion.div>

          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <Message
                  severity="info"
                  text={alert}
                  className="bg-gradient-to-r from-blue-500 to-violet-500 text-white w-full p-3 rounded-lg shadow-md"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-2/3"
            >
              {cartItems.length === 0 ? (
                <motion.div
                  className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaShoppingBag className="text-gray-300 dark:text-gray-600 text-6xl mx-auto mb-4" />
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                  >
                    <FaArrowLeft className="mr-2" /> Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Products ({cartItems.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {cartItems.map((item) => {
                      const key = `${item.id}-${item.color}-${item.size}`;
                      return (
                        <motion.div
                          key={key}
                          variants={itemVariants}
                          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="flex items-center w-full sm:w-1/2 mb-4 sm:mb-0">
                              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap mt-1 gap-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    Color: {item.color}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    Size: {item.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-1/2">
                              <div className="flex items-center">
                                <span className="text-gray-600 dark:text-gray-400 mr-2 text-sm">
                                  Quantity:
                                </span>
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity - 1,
                                        item.stock
                                      )
                                    }
                                  >
                                    -
                                  </motion.button>
                                  <input
                                    type="number"
                                    value={item.quantity ?? ''}
                                    onChange={(e) => {
                                      const newQuantity =
                                        parseInt(e.target.value) || 0;
                                      handleQuantityChange(
                                        item.id,
                                        item.color,
                                        item.size,
                                        newQuantity,
                                        item.stock
                                      );
                                    }}
                                    className="w-10 h-8 text-center border-x border-gray-200 dark:border-gray-700 focus:outline-none text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                                  />
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity + 1,
                                        item.stock
                                      )
                                    }
                                  >
                                    +
                                  </motion.button>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  onClick={() =>
                                    handleRemoveItem(
                                      item.id,
                                      item.color,
                                      item.size
                                    )
                                  }
                                >
                                  <FaTrash />
                                </motion.button>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                  Price
                                </p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-1/3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Shipping & Handling</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Estimated Tax</span>
                      <span>-</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-800 dark:text-white">
                        Total
                      </span>
                      <span className="text-red-500 dark:text-red-400">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-black text-white font-medium rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                        cartItems.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      <FaCreditCard /> Continue to Checkout
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <FaPaypal /> Pay with PayPal
                    </motion.button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                      Your payment information is secure
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CartPage;
