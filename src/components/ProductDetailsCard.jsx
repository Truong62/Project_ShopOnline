import { useState, useEffect, memo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { formatCurrency } from '../utils/formatCurrency';
import { addToCart, updateQuantity, buyNow } from '../redux/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import useDeviceType from '../hooks/useDeviceType';
import { motion } from 'framer-motion';
import PrivacyForUser from './PrivacyForUser';

const ProductDetailsCard = () => {
  const { link } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { isMobile } = useDeviceType();
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => {
        const found = data.products.find(
          (p) => p.title === link || String(p.id) === link
        );
        if (!found) {
          window.location.href = '/page-not-found';
        } else {
          setProduct(found);
        }
      });
  }, [link]);

  const showToast = (type, title, message) => {
    const toastStyles = {
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      error: 'bg-red-50 text-red-800 border-red-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    const iconStyles = {
      success: 'pi pi-check-circle text-green-500 text-xl',
      warning: 'pi pi-exclamation-triangle text-yellow-500 text-xl',
      error: 'pi pi-times-circle text-red-500 text-xl',
      info: 'pi pi-info-circle text-blue-500 text-xl',
    };

    toast.current?.show({
      severity: type,
      summary: (
        <div className="flex flex-col items-center">
          <i className={iconStyles[type]}></i>
          <span className="text-sm font-semibold mt-1">{title}</span>
        </div>
      ),
      detail: <span className="text-xs text-center">{message}</span>,
      life: 3000,
      className: `border relative rounded-lg opacity-90 ${toastStyles[type]} p-4 flex flex-col items-center justify-center`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      showToast(
        'warning',
        'Incomplete Selection',
        'Please select both a color and a size before buying.'
      );
      return;
    }

    const productToCheckout = {
      id: product?.id,
      name: product?.productName,
      price: product?.price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: product?.thumbnail,
      stock: 10, // giả định
    };

    const isLoggedIn = !!localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      showToast(
        'info',
        'Please Log In',
        'You need to log in to proceed with buying.'
      );
      localStorage.setItem(
        'buyNowTempProduct',
        JSON.stringify(productToCheckout)
      );
      localStorage.setItem('redirectAfterLogin', 'checkout');
      navigate('/login');
      return;
    }

    localStorage.setItem(
      'buyNowTempProduct',
      JSON.stringify(productToCheckout)
    );
    navigate('/checkout');
  };

  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    const tempProduct = localStorage.getItem('buyNowTempProduct');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && redirectPath === 'checkout' && tempProduct && user) {
      const parsedProduct = JSON.parse(tempProduct);
      dispatch(buyNow(parsedProduct));
      localStorage.removeItem('buyNowTempProduct');
      localStorage.removeItem('redirectAfterLogin');
      navigate('/checkout');
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem('buyNowTempProduct');
      localStorage.removeItem('redirectAfterLogin');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dispatch, navigate]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      showToast(
        'warning',
        'Incomplete Selection',
        'Please select both a color and a size before adding to cart.'
      );
      return;
    }

    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      dispatch(
        updateQuantity({
          id: product.id,
          color: selectedColor,
          size: selectedSize,
          quantity: newQuantity,
        })
      );
      showToast('success', 'Cart Updated', 'Item quantity has been updated.');
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.productName,
          price: product.price,
          color: selectedColor,
          size: selectedSize,
          quantity: 1,
          image: product.thumbnail,
          stock: 10,
        })
      );
      showToast(
        'success',
        'Item Added',
        'The product has been added to your cart successfully.'
      );
    }
  };

  if (!product) return null;

  return (
    <div className="flex flex-col md:flex-row rounded-lg bg-white p-6 max-w-6xl mx-auto">
      <Toast ref={toast} />
      <div className="relative w-full md:w-2/3 mb-4 md:mb-0 md:mr-6">
        {isMobile ? (
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {[product.thumbnail, ...product.images].map((image, index) => (
              <SwiperSlide key={index}>
                <motion.img
                  src={image}
                  alt={`Product ${index}`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <>
            <motion.div
              className="w-full"
              key={mainImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.images[mainImageIndex]}
                alt="Product"
                className="w-full h-[500px] object-contain"
              />
            </motion.div>
            <div className="flex mb-4 gap-2 p-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`w-[92px] h-[92px] rounded-lg cursor-pointer border overflow-hidden ${
                    mainImageIndex === index
                      ? 'border-2 border-black scale-105'
                      : ''
                  }`}
                  onClick={() => setMainImageIndex(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`Product ${index}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {!isMobile && (
          <Panel
            header={
              <div className="flex items-center gap-2 text-lg font-semibold p-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                Description about the product: {product.productName}
              </div>
            }
            toggleable
            collapsed
            className="mt-4"
          >
            <p className="text-gray-700 p-4 leading-relaxed">
              {product.description}
            </p>
          </Panel>
        )}
      </div>

      <div className="w-full md:w-1/3">
        <div className="text-4xl font-bold mb-2">{product.productName}</div>
        <div className="text-red-500 text-xl font-bold">
          {formatCurrency(product.price)}
        </div>

        <div className="mb-2">
          <span className="font-bold text-2xl">Color:</span>
          <div className="flex gap-2 mt-1">
            {['Red', 'Blue', 'Green'].map((color) => (
              <motion.div
                key={color}
                className={`flex items-center justify-center w-24 h-10 rounded-full cursor-pointer border ${
                  selectedColor === color ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {color}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <span className="font-bold text-xl">Size:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {['S', 'M', 'L', 'XL'].map((size) => (
              <motion.div
                key={size}
                className={`px-3 py-1 border rounded-full text-xl ${
                  selectedSize === size ? 'bg-gray-300' : ''
                } cursor-pointer`}
                onClick={() => setSelectedSize(size)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {size}
              </motion.div>
            ))}
          </div>
          <span className="font-bold text-x text-grey-50">Stock:</span>
          <span className="text-gray-500 text-x">10</span>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <motion.button
            className="p-button-outlined p-button-rounded p-button-lg bg-[#A8DCE7] text-white rounded-lg p-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
          >
            Buy Now
          </motion.button>

          <motion.button
            className="p-button-rounded p-button-lg bg-[#272B3B] text-white rounded-lg p-3"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add To Cart
          </motion.button>
        </div>

        <PrivacyForUser />

        {isMobile && (
          <Panel
            header={
              <div className="flex items-center gap-2 text-lg font-semibold p-2">
                <i className="pi pi-info-circle text-blue-500"></i>
                Description about the product: {product.title}
              </div>
            }
            toggleable
            collapsed
            className="mt-4"
          >
            <p className="text-gray-700 p-4 leading-relaxed">
              {product.description}
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
};

export default memo(ProductDetailsCard);
