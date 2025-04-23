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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items from API
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const token = loggedInUser ? JSON.parse(loggedInUser).accessToken : null;

      console.log(token);
      if (!token) {
        setAlert('Please login to view your cart');
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/cart-items/user-cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        setAlert('Your session has expired, please login again');
        localStorage.removeItem('loggedInUser'); // Remove invalid token
        setTimeout(() => {
          navigate('/login', { state: { from: '/cart' } });
        }, 2000);
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) {
        throw new Error(`Error fetching cart data: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart items from API:', data);

      // Transform API response to match the expected structure in the Cart component
      const transformedData = data.map((item) => ({
        id: item.product?.product__Id || item.productId,
        name: item.product?.product__Name || item.name,
        price: item.productColor?.productColor__Price || item.price,
        color: item.productColor?.productColor__Name || item.color,
        size: item.size?.size__Value || item.size,
        quantity: item.cartItem__Quantity || item.quantity,
        image:
          item.productColor?.images?.[0] ||
          item.image ||
          'https://via.placeholder.com/150',
        productColorId: item.productColor?.productColor__Id,
        sizeId: item.size?.size__Id,
      }));

      setCartItems(transformedData);

      // Save to localStorage for backward compatibility
      localStorage.setItem('cartItems', JSON.stringify(transformedData));
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError(err.message);
      if (
        !err.message.includes('Invalid or expired token') &&
        !err.message.includes('Authentication token not found')
      ) {
        setAlert(err.message);
      }

      // Fallback to localStorage if API fails
      try {
        const storedCartItems = JSON.parse(
          localStorage.getItem('cartItems') || '[]'
        );
        setCartItems(storedCartItems);
      } catch (storageErr) {
        console.error('Error parsing cartItems from localStorage:', storageErr);
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update cart item via API
  const updateCartItemApi = async (updatedItem) => {
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const token = loggedInUser ? JSON.parse(loggedInUser).accessToken : null;

      console.log(
        'Update item - Token being used:',
        token?.substring(0, 10) + '...'
      );

      if (!token) {
        setAlert('Please login to update your cart');
        throw new Error('Authentication token not found');
      }

      // Prepare the data for the API according to its expected structure
      const apiPayload = {
        cartItem__Quantity: updatedItem.quantity,
        ProductColor__Id: updatedItem.productColorId,
        Size__Id: updatedItem.sizeId,
      };

      const response = await fetch(`/api/cart-items/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      console.log('Update API Response status:', response.status);

      if (response.status === 401) {
        // Token expired or invalid
        setAlert('Your session has expired, please login again');
        localStorage.removeItem('loggedInUser'); // Remove invalid token
        setTimeout(() => {
          navigate('/login', { state: { from: '/cart' } });
        }, 2000);
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) {
        throw new Error(`Error updating cart: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error updating cart item:', err);
      if (
        !err.message.includes('Invalid or expired token') &&
        !err.message.includes('Authentication token not found')
      ) {
        setAlert(err.message);
      }
      throw err;
    }
  };

  // Remove cart item from API
  const removeCartItemApi = async (itemId) => {
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const token = loggedInUser ? JSON.parse(loggedInUser).accessToken : null;

      console.log(
        'Remove item - Token being used:',
        token?.substring(0, 10) + '...'
      );

      if (!token) {
        setAlert('Please login to remove items from your cart');
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`/api/cart-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete API Response status:', response.status);

      if (response.status === 401) {
        // Token expired or invalid
        setAlert('Your session has expired, please login again');
        localStorage.removeItem('loggedInUser'); // Remove invalid token
        setTimeout(() => {
          navigate('/login', { state: { from: '/cart' } });
        }, 2000);
        throw new Error('Invalid or expired token');
      }

      if (!response.ok) {
        throw new Error(`Error removing item from cart: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error removing cart item:', err);
      if (
        !err.message.includes('Invalid or expired token') &&
        !err.message.includes('Authentication token not found')
      ) {
        setAlert(err.message);
      }
      throw err;
    }
  };

  // Fetch cart data when component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Read cartItems from localStorage when component mounts - keep old code as backup
  useEffect(() => {
    // If already loaded from API, no need to load from localStorage
    if (!loading && cartItems.length > 0) return;

    try {
      const storedCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      // Only set if no data from API yet
      if (cartItems.length === 0) {
      setCartItems(storedCartItems);
      }
    } catch (err) {
      console.error('Error parsing cartItems from localStorage:', err);
      if (cartItems.length === 0) {
      setCartItems([]);
      }
    }
  }, [loading, cartItems.length]);

  // Monitor localStorage changes
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

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate subtotal when cartItems change
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Sync buyNowTempProduct and cartTempProduct to cartItems
  useEffect(() => {
    const processTempItem = async (key) => {
      const tempItem = localStorage.getItem(key);
      if (tempItem) {
        console.log(`Processing ${key}:`, tempItem);
        try {
          const parsedItem = JSON.parse(tempItem);

          // Add to cart via API
          try {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const token = loggedInUser
              ? JSON.parse(loggedInUser).accessToken
              : null;

            console.log(
              'Add temp item - Token being used:',
              token?.substring(0, 10) + '...'
            );

            if (token) {
              // Prepare payload according to the API structure
              const apiPayload = {
                cartItem__Quantity: parsedItem.quantity,
                ProductColor__Id: parsedItem.productColorId,
                Size__Id: parsedItem.sizeId,
              };

              const response = await fetch('/api/cart-items/add', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiPayload),
              });

              console.log(
                'Add temp item API Response status:',
                response.status
              );

              if (response.status === 401) {
                console.warn('Invalid token when adding temporary item');
                // Don't show warning to user, just log
                // Will be handled by fetchCartItems
              }

              if (response.ok) {
                // Refresh cart after adding item
                fetchCartItems();
              }
            }
          } catch (apiErr) {
            console.error('Error adding temp item to cart via API:', apiErr);

            // Fallback to localStorage
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
              localStorage.setItem(
                'cartItems',
                JSON.stringify(storedCartItems)
              );
            setCartItems(storedCartItems);
            }
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

  const handleQuantityChange = async (
    id,
    color,
    size,
    quantity,
    stock = 100
  ) => {
    if (quantity < 1 || quantity > stock) {
      setAlert(
        quantity < 1
          ? 'Quantity cannot be less than 1'
          : 'Not enough stock available'
      );
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    // Handle case when size is an object or other non-primitive value
    const compareSize = (itemSize) => {
      if (typeof size === 'object' && typeof itemSize === 'object') {
        return JSON.stringify(size) === JSON.stringify(itemSize);
      }
      return itemSize === size;
    };

    const updatedCartItems = cartItems.map((item) =>
      item.id === id && item.color === color && compareSize(item.size)
        ? { ...item, quantity }
        : item
    );

    // Save changes to localStorage (backup)
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);

    // Update via API
    try {
      const itemToUpdate = updatedCartItems.find(
        (item) =>
          item.id === id && item.color === color && compareSize(item.size)
      );

      if (itemToUpdate) {
        await updateCartItemApi(itemToUpdate);
      }
    } catch (err) {
      console.error('Failed to update cart item quantity:', err);
      // UI already updated with optimistic data
    }
  };

  const handleRemoveItem = async (id, color, size) => {
    // Handle case when size is an object or other non-primitive value
    const compareSize = (itemSize) => {
      if (typeof size === 'object' && typeof itemSize === 'object') {
        return JSON.stringify(size) === JSON.stringify(itemSize);
      }
      return itemSize === size;
    };

    // Save item before deletion to retrieve ID
    const itemToDelete = cartItems.find(
      (item) => item.id === id && item.color === color && compareSize(item.size)
    );

    const updatedCartItems = cartItems.filter(
      (item) =>
        !(item.id === id && item.color === color && compareSize(item.size))
    );

    // Save changes to localStorage (backup)
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    setAlert('Item removed from cart');

    // Delete from API
    try {
      if (itemToDelete) {
        await removeCartItemApi(itemToDelete.id);
      }
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      // UI already updated with optimistic data
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setAlert('Your cart is empty. Please add items before checking out.');
      return;
    }

    navigate('/checkout');
  };

  // Display loading state
  if (loading) {
    return (
      <div>
        <Header />
        <div className="bg-gray-50 min-h-screen pb-16">
          <div
            className="max-w-6xl mx-auto p-6 flex justify-center items-center"
            style={{ minHeight: '60vh' }}
          >
            <div className="bg-white p-10 rounded-xl shadow-sm text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      console.log('Rendering item:', item);
                      // Create a safer key using index as fallback if any property is undefined
                      const key =
                        item.id && item.color && item.size
                          ? `${item.id}-${item.color}-${typeof item.size === 'object' ? JSON.stringify(item.size) : item.size}`
                          : `item-${index}`;

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
                                    Size:{' '}
                                    {typeof item.size === 'object'
                                      ? JSON.stringify(item.size)
                                      : item.size || 'N/A'}
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
