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
  const productColorSizes = product?.product__ProductColorSizes || [];

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
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Parse JSON
    const accessToken = loggedInUser?.accessToken;

    if (!accessToken) {
      showToast('error', 'Lỗi', 'Bạn cần đăng nhập để thêm vào giỏ hàng.');
      navigate('/login');
      return;
    }
    try {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const accessToken = loggedInUser?.accessToken;
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
            ProductColor__Id:
              selectedProductColorSize?.productColorSize__ProductColorId,
            Size__Id: selectedProductColorSize?.productColorSize__SizeId,
          }),
        }
      );

      const resData = await addRes.json();

      if (addRes.ok) {
        showToast(
          'success',
          'Thành công',
          'Sản phẩm đã được thêm vào giỏ hàng.'
        );
      } else {
        const message = resData?.message || 'Không thể thêm vào giỏ hàng.';
        showToast('error', 'Lỗi', message);
      }
    } catch (error) {
      showToast('error', 'Lỗi', 'Đã xảy ra lỗi khi thêm vào giỏ hàng.');
      console.error(error);
    }

    productColorSizes.forEach((item) => {
      console.log(
        'color:',
        item.productColorSize__Color,
        'size:',
        item.productColorSize__Size
      );
    });
    console.log('selectedColor:', selectedColor, 'selectedSize:', selectedSize);

    const selectedProductColorSize = productColorSizes.find(
      (option) =>
        option.productColorSize__Color === selectedColor &&
        option.productColorSize__Size === selectedSize
    );
    console.log(
      'selectedProductColorSize',
      selectedProductColorSize,
      'productColorSizes',
      productColorSizes
    );
    if (!selectedProductColorSize) {
      showToast('error', 'Lỗi', 'Kết hợp màu sắc và kích cỡ không khả dụng.');
      return;
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

  if (!product) {
    return <div>Loading...</div>;
  }

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
            {images.map((image, index) => (
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
                Description about the product: {product?.product__Name}
              </div>
            }
            toggleable
            collapsed
            className="mt-4"
          >
            <p className="text-gray-700 p-4 leading-relaxed">
              {product?.product__Description || 'No description available'}
            </p>
          </Panel>
        )}
      </div>

      <div className="w-full md:w-1/3">
        <div className="text-4xl font-bold mb-2">{product?.product__Name}</div>
        <div className="text-red-500 text-xl font-bold">
          {formatCurrency(currentVariant?.productColor__Price)}
        </div>

        <div className="mb-2">
          <span className="font-bold text-2xl">Color:</span>
          <div className="flex gap-2 mt-1">
            {product?.productColors?.map((variant) => (
              <motion.div
                key={variant.productColor__Name}
                className={`flex items-center justify-center w-24 h-10 rounded-full cursor-pointer border ${
                  selectedColor === variant.productColor__Name
                    ? 'ring-2 ring-black'
                    : ''
                }`}
                onClick={() => {
                  setSelectedColor(variant.productColor__Name);
                  setSelectedSize(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {variant.productColor__Name}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <span className="font-bold text-xl">Size:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {sizesLoading ? (
              <p className="text-gray-500">Loading sizes...</p>
            ) : sizesError || sizes.length === 0 ? (
              <p className="text-gray-500">No sizes available</p>
            ) : (
              sizes.map((size) => (
                <motion.div
                  key={size.sizeValue}
                  className={`px-3 py-1 border rounded-full text-xl cursor-pointer ${
                    selectedSize === size.sizeValue ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setSelectedSize(size.sizeValue)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size.sizeValue}
                </motion.div>
              ))
            )}
          </div>
          <span className="font-bold text-x text-grey-50">Stock:</span>
          <span className="text-gray-500 text-x">N/A</span>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
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
                Description about the product: {product?.product__Name}
              </div>
            }
            toggleable
            collapsed
            className="mt-4"
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
