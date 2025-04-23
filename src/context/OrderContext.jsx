import React, { createContext, useState, useContext, useEffect } from 'react';

// Create OrderContext
export const OrderContext = createContext();

// Hook to use OrderContext
export const useOrder = () => useContext(OrderContext);

// OrderProvider component
export const OrderProvider = ({ children }) => {
  // State for cart items
  const [cartItems, setCartItems] = useState(() => {
    // Get cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State for orders
  const [orders, setOrders] = useState([]);

  // Total price calculation
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Total items count
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity || 1;
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === itemId && item.size === size && item.color === color)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, size, color, quantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId && item.size === size && item.color === color) {
          return { ...item, quantity: quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Place order
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now(),
      items: [...cartItems],
      totalAmount: totalPrice,
      ...orderDetails,
      date: new Date().toISOString(),
      status: 'pending',
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    clearCart();

    return newOrder;
  };

  // Context value
  const value = {
    cartItems,
    orders,
    totalPrice,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderContext;
