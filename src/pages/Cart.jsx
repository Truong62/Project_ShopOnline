import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency } from '../utils/formatCurrency';
import { updateQuantity, removeItem, addToCart } from '../redux/cart/cartSlice'; // Đảm bảo bạn có action addItem trong cartSlice
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';

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

        // Kiểm tra xem sản phẩm đã có trong cart chưa
        const exists = cartItems.some(
          (item) =>
            item.id === parsedItem.id &&
            item.color === parsedItem.color &&
            item.size === parsedItem.size
        );

        if (!exists) {
          dispatch(addToCart(parsedItem));
        }

        // Xóa ngay sau khi xử lý để tránh bị thêm lại nếu refresh
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

    // ✅ Chỉ chuyển hướng, KHÔNG xóa localStorage ở đây
    navigate('/checkout');
  };

  return (
    <React.Fragment>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Bag</h1>
        {alert && (
          <Message
            severity=""
            text={alert}
            className="bg-orange-500 text-white w-full p-2 mb-4 rounded"
          />
        )}
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 pr-4">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const key = `${item.id}-${item.color}-${item.size}`;
                return (
                  <div
                    key={key}
                    className="flex flex-col lg:flex-row justify-between items-center mb-4 border-b pb-4"
                  >
                    <div className="flex items-center w-full lg:w-1/3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24"
                      />
                      <div className="ml-4">
                        <h2 className="text-lg font-bold">{item.name}</h2>
                        <p className="text-gray-500">Color: {item.color}</p>
                        <p className="text-gray-500">Size: {item.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center w-full lg:w-1/3 mt-4 lg:mt-0">
                      <span className="text-gray-500">Quantity:</span>
                      <button
                        className="px-2 text-gray-500"
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
                      </button>
                      <input
                        type="number"
                        value={item.quantity ?? ''}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 0;
                          handleQuantityChange(
                            item.id,
                            item.color,
                            item.size,
                            newQuantity,
                            item.stock
                          );
                        }}
                        className="w-12 text-center border mx-2"
                      />
                      <button
                        className="px-2"
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
                      </button>
                      <Button
                        icon="pi pi-trash"
                        className="p-button-danger ml-2"
                        onClick={() =>
                          handleRemoveItem(item.id, item.color, item.size)
                        }
                      />
                    </div>
                    <p className="text-lg font-bold text-black w-full lg:w-1/3 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <div className="w-full lg:w-1/3 pl-4 mt-6 lg:mt-0">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Estimated Shipping & Handling</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Estimated Tax</span>
              <span>-</span>
            </div>
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span className="text-red-500">{formatCurrency(subtotal)}</span>
            </div>
            <button
              className={`w-full py-2 bg-black text-white font-bold rounded mb-2 hover:bg-gray-800 ${
                cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Continue to Checkout
            </button>
            <button className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
              PayPal
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CartPage;
