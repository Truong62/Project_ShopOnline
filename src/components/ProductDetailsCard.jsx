import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { formatCurrency } from '../utils/formatCurrency';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import useDeviceType from '../hooks/useDeviceType';
import { motion } from 'framer-motion';
import PrivacyForUser from './PrivacyForUser';

// Color name to CSS color mapping - Add more colors as needed
const colorNameToCSS = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  blue: '#0000FF',
  green: '#008000',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#FFC0CB',
  orange: '#FFA500',
  grey: '#808080',
  gray: '#808080',
  brown: '#A52A2A',
  navy: '#000080',
  beige: '#F5F5DC',
  teal: '#008080',
  lime: '#00FF00',
  maroon: '#800000',
  olive: '#808000',
  cyan: '#00FFFF',
  silver: '#C0C0C0',
  gold: '#FFD700',
  crimson: '#DC143C',
  indigo: '#4B0082',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  khaki: '#F0E68C',
  salmon: '#FA8072',
  cream: '#FFFDD0',
  lavender: '#E6E6FA',
  magenta: '#FF00FF',
  tan: '#D2B48C',
  coral: '#FF7F50',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  camel: '#C19A6B',
  charcoal: '#36454F',
  burgundy: '#800020',
  chocolate: '#D2691E',
  coffee: '#6F4E37',
  copper: '#B87333',
  emerald: '#50C878',
  forestgreen: '#228B22',
  mauve: '#E0B0FF',
  mint: '#98FB98',
  mustard: '#FFDB58',
  nude: '#E3BC9A',
  peach: '#FFE5B4',
  plum: '#8E4585',
  rust: '#B7410E',
  sapphire: '#0F52BA',
  taupe: '#483C32',
};

const ProductDetailsCard = () => {
  const { link } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  const toast = useRef(null);

  const product = location.state?.product;

  const [selectedColor, setSelectedColor] = useState(
    product?.productColors[0]?.productColor__Name || ''
  );
  const [selectedSize, setSelectedSize] = useState(null);

  const currentVariant = product?.productColors.find(
    (variant) => variant.productColor__Name === selectedColor
  );
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [sizes, setSizes] = useState([]);
  const [quantity] = useState(1);
  const [sizesLoading, setSizesLoading] = useState(false);
  const [sizesError, setSizesError] = useState(null);

  const images =
    currentVariant?.images?.length > 0
      ? currentVariant.images
      : ['https://via.placeholder.com/400'];

  useEffect(() => {
    const fetchSizes = async () => {
      if (!currentVariant?.productColor__Id) return;

      setSizesLoading(true);
      try {
        const response = await fetch(
          `https://18.139.41.39:444/api/sizes/product-color/${currentVariant.productColor__Id}`
        );
        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Body: ${text}`
          );
        }

        const text = await response.text();
        if (!text) {
          throw new Error('Empty response body');
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error('Invalid JSON response');
        }

        setSizes(
          data.map((item) => ({
            sizeValue: item.size__Value,
            sizeId: item.size__Id,
          }))
        );
      } catch (err) {
        setSizesError(err);
        showToast(
          'error',
          'Fetch Error',
          `Unable to load sizes: ${err.message}`
        );
      } finally {
        setSizesLoading(false);
      }
    };

    fetchSizes();
  }, [currentVariant]);

  useEffect(() => {
    if (!product) {
      navigate('/page-not-found');
    }
    if (product && !currentVariant && product.productColors.length > 0) {
      setSelectedColor(product.productColors[0].productColor__Name);
    }
  }, [product, currentVariant, link, navigate]);

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

    if (toast.current) {
      toast.current.show({
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
    }
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      showToast('error', 'Lỗi', 'Vui lòng chọn đầy đủ màu sắc, kích cỡ.');
      return;
    }

    // Tìm thông tin màu sắc và kích thước đã chọn
    const currentColorVariant = product.productColors.find(
      (variant) => variant.productColor__Name === selectedColor
    );

    const sizeInfo = sizes.find((size) => size.sizeValue === selectedSize);

    if (!currentColorVariant || !sizeInfo) {
      showToast('error', 'Lỗi', 'Không thể xác định thông tin sản phẩm.');
      return;
    }

    // Lấy thông tin người dùng đã đăng nhập
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    if (!loggedInUserStr) {
      showToast('error', 'Lỗi', 'Bạn cần đăng nhập để thêm vào giỏ hàng.');
      navigate('/login');
      return;
    }

    try {
      const loggedInUser = JSON.parse(loggedInUserStr);
      const accessToken = loggedInUser?.accessToken;

      if (!accessToken) {
        showToast(
          'error',
          'Lỗi',
          'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
        );
        navigate('/login');
        return;
      }

      const addRes = await fetch(
        'https://18.139.41.39:444/api/cart-items/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            cartItem__Quantity: quantity,
            ProductColor__Id: currentColorVariant.productColor__Id,
            Size__Id: sizeInfo.sizeId,
          }),
        }
      );

      if (!addRes.ok) {
        const text = await addRes.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData?.message || 'Không thể thêm vào giỏ hàng.';
        } catch (e) {
          errorMessage = 'Không thể thêm vào giỏ hàng.';
        }
        showToast('error', 'Lỗi', errorMessage);
        return;
      }

      showToast('success', 'Thành công', 'Sản phẩm đã được thêm vào giỏ hàng.');
    } catch (error) {
      showToast('error', 'Lỗi', 'Đã xảy ra lỗi khi thêm vào giỏ hàng.');
      console.error(error);
    }
  };

  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    const tempProduct = localStorage.getItem('buyNowTempProduct');
    const cartTempProduct = localStorage.getItem('cartTempProduct');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && (tempProduct || cartTempProduct)) {
      let currentCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );

      if (redirectPath === 'checkout' && tempProduct) {
        const parsedProduct = JSON.parse(tempProduct);
        const existingItemIndex = currentCartItems.findIndex(
          (item) =>
            item.id === parsedProduct.id &&
            item.color === parsedProduct.color &&
            item.size === parsedProduct.size
        );

        if (existingItemIndex >= 0) {
          currentCartItems[existingItemIndex].quantity +=
            parsedProduct.quantity;
        } else {
          currentCartItems.push(parsedProduct);
        }

        localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
        localStorage.removeItem('buyNowTempProduct');
        localStorage.removeItem('redirectAfterLogin');
        navigate('/checkout', { replace: true });
      } else if (redirectPath === 'cart' && cartTempProduct) {
        const parsedProduct = JSON.parse(cartTempProduct);
        const existingItemIndex = currentCartItems.findIndex(
          (item) =>
            item.id === parsedProduct.id &&
            item.color === parsedProduct.color &&
            item.size === parsedProduct.size
        );

        if (existingItemIndex >= 0) {
          currentCartItems[existingItemIndex].quantity +=
            parsedProduct.quantity;
        } else {
          currentCartItems.push(parsedProduct);
        }

        localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
        localStorage.removeItem('cartTempProduct');
        localStorage.removeItem('redirectAfterLogin');

        showToast(
          'success',
          'Đã thêm vào giỏ hàng',
          'Sản phẩm đã được thêm vào giỏ hàng thành công.'
        );
      }
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem('buyNowTempProduct');
      localStorage.removeItem('cartTempProduct');
      localStorage.removeItem('redirectAfterLogin');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  const handleBuyNow = async () => {
    if (!selectedColor || !selectedSize) {
      showToast(
        'warning',
        'Thiếu thông tin',
        'Vui lòng chọn màu sắc và kích thước trước khi mua.'
      );
      return;
    }

    const sizeInfo = sizes.find((size) => size.sizeValue === selectedSize);
    if (!sizeInfo) {
      showToast(
        'warning',
        'Kích thước không khả dụng',
        'Kích thước đã chọn không tồn tại cho màu này.'
      );
      return;
    }

    const currentColorVariant = product.productColors.find(
      (variant) => variant.productColor__Name === selectedColor
    );
    if (!currentColorVariant) {
      showToast(
        'warning',
        'Màu sắc không khả dụng',
        'Màu sắc đã chọn không tồn tại.'
      );
      return;
    }

    const productToCheckout = {
      id: product?.product__Id,
      name: product?.product__Name,
      price: currentVariant?.productColor__Price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      image: images[0],
      productColorId: currentColorVariant.productColor__Id,
      sizeId: sizeInfo.sizeId,
    };

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      showToast(
        'info',
        'Vui lòng đăng nhập',
        'Bạn cần đăng nhập để tiếp tục mua hàng.'
      );

      localStorage.setItem(
        'buyNowTempProduct',
        JSON.stringify(productToCheckout)
      );
      localStorage.setItem('redirectAfterLogin', 'checkout');
      navigate('/login', { replace: true });
      return;
    }

    let currentCartItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
    const existingItemIndex = currentCartItems.findIndex(
      (item) =>
        item.id === productToCheckout.id &&
        item.color === productToCheckout.color &&
        item.size === productToCheckout.size
    );

    if (existingItemIndex >= 0) {
      currentCartItems[existingItemIndex].quantity +=
        productToCheckout.quantity;
    } else {
      currentCartItems.push(productToCheckout);
    }

    localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
    navigate('/checkout', { replace: true });
  };

  const getColorDisplay = (colorName) => {
    if (!colorName) return '#cccccc';

    // Chuyển tên màu thành chữ thường để so sánh dễ dàng hơn
    const lowerColorName = colorName.toLowerCase();

    // Kiểm tra nếu tên màu khớp chính xác với một màu trong danh sách
    if (colorNameToCSS[lowerColorName]) {
      return colorNameToCSS[lowerColorName];
    }

    // Chia tên màu thành các từ riêng lẻ
    const colorWords = lowerColorName.split(/[\s-_/]+/);

    // Kiểm tra từng từ trong tên màu
    for (const word of colorWords) {
      if (colorNameToCSS[word]) {
        // Nếu màu có tiền tố "light" hoặc "pale", làm sáng màu
        if (colorWords.includes('light') || colorWords.includes('pale')) {
          return lightenColor(colorNameToCSS[word], 30);
        }

        // Nếu màu có tiền tố "dark" hoặc "deep", làm tối màu
        if (colorWords.includes('dark') || colorWords.includes('deep')) {
          return darkenColor(colorNameToCSS[word], 30);
        }

        return colorNameToCSS[word];
      }
    }

    // Xử lý một số trường hợp đặc biệt
    if (lowerColorName.includes('multi')) {
      return 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
    }

    // Nếu không tìm thấy, trả về màu xám mặc định
    console.log(`Màu không nhận diện được: ${colorName}`);
    return '#cccccc';
  };

  // Helper function to lighten a color
  const lightenColor = (color, percent) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const lightenComponent = (c) => {
      const val = Math.round(c + (255 - c) * (percent / 100));
      return Math.min(255, val).toString(16).padStart(2, '0');
    };

    return `#${lightenComponent(r)}${lightenComponent(g)}${lightenComponent(b)}`;
  };

  // Helper function to darken a color
  const darkenColor = (color, percent) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const darkenComponent = (c) => {
      const val = Math.round(c * (1 - percent / 100));
      return Math.max(0, val).toString(16).padStart(2, '0');
    };

    return `#${darkenComponent(r)}${darkenComponent(g)}${darkenComponent(b)}`;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row rounded-xl p-6 max-w-6xl mx-auto my-8">
      <Toast ref={toast} />
      <div className="relative w-full md:w-2/3 mb-4 md:mb-0 md:mr-6">
        {isMobile ? (
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <motion.img
                  src={image}
                  alt={`Product ${index}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <>
            <motion.div
              className="w-full bg-white p-4 rounded-lg overflow-hidden shadow-sm"
              key={mainImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={images[mainImageIndex]}
                alt="Product"
                className="w-full h-[500px] object-contain"
              />
            </motion.div>
            <div className="flex mb-4 gap-2 p-4 overflow-x-auto">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`w-[92px] h-[92px] rounded-lg cursor-pointer border-2 overflow-hidden ${
                    mainImageIndex === index
                      ? 'border-[rgb(65,179,199)] shadow-md scale-105'
                      : 'border-transparent hover:border-[rgba(65,179,199,0.5)]'
                  }`}
                  onClick={() => setMainImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
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
              <div className="flex items-center gap-2 text-lg font-semibold p-2 text-[rgb(65,179,199)]">
                <i className="pi pi-info-circle"></i>
                Product Description
              </div>
            }
            toggleable
            collapsed
            className="mt-4 shadow-sm rounded-lg overflow-hidden"
          >
            <p className="text-gray-700 p-4 leading-relaxed">
              {product?.product__Description || 'No description available'}
            </p>
          </Panel>
        )}
      </div>

      <div className="w-full md:w-1/3 p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            {product?.product__Name}
          </h1>
          <div className="text-2xl font-semibold text-[rgb(65,179,199)]">
            {formatCurrency(currentVariant?.productColor__Price)}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
            <span className="w-1 h-5 bg-[rgb(65,179,199)] rounded mr-2"></span>
            Color
          </h2>
          <div className="flex flex-wrap gap-3 mt-2">
            {product?.productColors?.map((variant) => {
              const colorCSS = getColorDisplay(variant.productColor__Name);
              return (
                <motion.div
                  key={variant.productColor__Id}
                  className={`relative cursor-pointer group`}
                  onClick={() => {
                    setSelectedColor(variant.productColor__Name);
                    setSelectedSize(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${
                      selectedColor === variant.productColor__Name
                        ? 'ring-2 ring-[rgb(65,179,199)] ring-offset-2'
                        : 'ring-1 ring-gray-300'
                    }`}
                    style={{
                      background: colorCSS,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {variant.productColor__Name.toLowerCase() === 'white' && (
                      <div className="absolute inset-0 rounded-full border border-gray-200"></div>
                    )}
                  </div>
                  <div className="absolute bottom-[-22px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {variant.productColor__Name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center">
            <span className="w-1 h-5 bg-[rgb(65,179,199)] rounded mr-2"></span>
            Size
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizesLoading ? (
              <p className="text-gray-500">Loading sizes...</p>
            ) : sizesError || sizes.length === 0 ? (
              <p className="text-gray-500">No sizes available</p>
            ) : (
              sizes.map((size) => (
                <motion.div
                  key={size.sizeValue}
                  className={`w-10 h-10 flex items-center justify-center border rounded-md cursor-pointer transition-all duration-200 ${
                    selectedSize === size.sizeValue
                      ? 'bg-[rgb(65,179,199)] text-white font-medium border-[rgb(65,179,199)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-[rgba(65,179,199,0.1)] hover:border-[rgb(65,179,199)]'
                  }`}
                  onClick={() => setSelectedSize(size.sizeValue)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size.sizeValue}
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Stock:</span>
            <span className="ml-2">N/A</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <motion.button
            className="flex items-center justify-center bg-[rgb(65,179,199)] text-white rounded-lg p-3 font-medium text-lg transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02, backgroundColor: 'rgb(55, 169, 189)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Buy Now
          </motion.button>

          <motion.button
            className="flex items-center justify-center bg-gray-800 text-white rounded-lg p-3 font-medium text-lg transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02, backgroundColor: 'rgb(45, 45, 45)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add To Cart
          </motion.button>
        </div>

        <div className="mt-6">
          <PrivacyForUser />
        </div>

        {isMobile && (
          <Panel
            header={
              <div className="flex items-center gap-2 text-lg font-semibold p-2 text-[rgb(65,179,199)]">
                <i className="pi pi-info-circle"></i>
                Product Description
              </div>
            }
            toggleable
            collapsed
            className="mt-4 shadow-sm rounded-lg overflow-hidden"
          >
            <p className="text-gray-700 p-4 leading-relaxed">
              {product?.product__Description || 'No description available'}
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsCard;
