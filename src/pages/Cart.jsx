import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
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

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  // Đọc cartItems từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      console.log('Initial cartItems:', storedCartItems);
      setCartItems(storedCartItems);
    } catch (err) {
      console.error('Error parsing cartItems from localStorage:', err);
      setCartItems([]);
    }
  }, []);

  // Theo dõi thay đổi của localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedCartItems = JSON.parse(
          localStorage.getItem('cartItems') || '[]'
        );
        console.log('Storage changed, new cartItems:', storedCartItems);
        setCartItems(storedCartItems);
      } catch (err) {
        console.error('Error parsing cartItems on storage change:', err);
        setCartItems([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'cartItems') {
        console.log('localStorage.setItem called for cartItems:', value);
        const event = new Event('storage');
        window.dispatchEvent(event);
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Tính subtotal khi cartItems thay đổi
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
    console.log('Calculated subtotal:', newSubtotal);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Đồng bộ buyNowTempProduct và cartTempProduct vào cartItems
  useEffect(() => {
    const processTempItem = (key) => {
      const tempItem = localStorage.getItem(key);
      if (tempItem) {
        console.log(`Processing ${key}:`, tempItem);
        try {
          const parsedItem = JSON.parse(tempItem);
          const storedCartItems = JSON.parse(
            localStorage.getItem('cartItems') || '[]'
          );
          const exists = storedCartItems.some(
            (item) =>
              item.id === parsedItem.id &&
              item.color === parsedItem.color &&
              item.size === parsedItem.size
          );
          if (!exists) {
            storedCartItems.push(parsedItem);
            localStorage.setItem('cartItems', JSON.stringify(storedCartItems));
            setCartItems(storedCartItems);
          }
          localStorage.removeItem(key);
        } catch (err) {
          console.error(`Invalid ${key} in localStorage`, err);
        }
      }
    };

    processTempItem('buyNowTempProduct');
    processTempItem('cartTempProduct');
  }, []);

  const handleQuantityChange = (id, color, size, quantity, stock = 100) => {
    if (quantity < 1 || quantity > stock) {
      setAlert(
        quantity < 1
          ? 'Quantity cannot be less than 1'
          : 'Not enough stock available'
      );
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const updatedCartItems = cartItems.map((item) =>
      item.id === id && item.color === color && item.size === size
        ? { ...item, quantity }
        : item
    );

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const handleRemoveItem = (id, color, size) => {
    const updatedCartItems = cartItems.filter(
      (item) => !(item.id === id && item.color === color && item.size === size)
    );

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    setAlert('Item removed from cart');
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setAlert('Your cart is empty. Please add items before checking out.');
      return;
    }

    navigate('/checkout');
  };

  console.log('Rendering cartItems:', cartItems);

  return (
    <div>
      <Header />
      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center mb-8">
            <FaShoppingBag className="text-gray-800 text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              Shopping Cart
            </h1>
          </div>

          {alert && (
            <div className="mb-6">
              <Message
                severity="info"
                text={alert}
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white w-full p-3 rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {cartItems.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                  <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-xl text-gray-500">Your cart is empty.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full hover:shadow-lg transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                  >
                    <FaArrowLeft className="mr-2" /> Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-700">
                      Products ({cartItems.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item, index) => {
                      console.log('Rendering item:', item, 'Index:', index);
                      const key = `${item.id}-${item.color}-${item.size}`;
                      return (
                        <div
                          key={key}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="flex items-center w-full sm:w-1/2 mb-4 sm:mb-0">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                  src={
                                    item.image ||
                                    'https://via.placeholder.com/150'
                                  }
                                  alt={item.name || 'Product'}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                  {item.name || 'Unknown Product'}
                                </h3>
                                <div className="flex flex-wrap mt-1 gap-2">
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Color: {item.color || 'N/A'}
                                  </span>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Size: {item.size || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-1/2">
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2 text-sm">
                                  Quantity:
                                </span>
                                <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                                  <button
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </button>
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
                                        newQuantity
                                      );
                                    }}
                                    className="w-10 h-8 text-center border-x border-gray-200 focus:outline-none text-gray-700"
                                  />
                                  <button
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.color,
                                        item.size,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <button
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
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-sm">Price</p>
                                <p className="text-lg font-bold text-gray-800">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping & Handling</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Estimated Tax</span>
                      <span>-</span>
                    </div>
                    <div className="h-px bg-gray-100"></div>
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-800">Total</span>
                      <span className="text-red-500">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <button
                      className={`w-full py-3 bg-gradient-to-r from-gray-800 to-black text-white font-medium rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                        cartItems.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      <FaCreditCard /> Continue to Checkout
                    </button>

                    <button className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2">
                      <FaPaypal /> Pay with PayPal
                    </button>

                    <p className="text-sm text-gray-500 text-center mt-2">
                      Your payment information is secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
