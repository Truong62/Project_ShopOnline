import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardProduct from './Card/Card.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { truncateDescription } from '../utils/truncateDescription';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PropTypes from 'prop-types';

const SuggestProducts = () => {
  const { link } = useParams(); // lấy link từ URL
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => {
        // Lọc ra những sản phẩm không phải là sản phẩm hiện tại
        const suggestions = data.products.filter(
          (p) =>
            p.title.toLowerCase() !== link.toLowerCase() &&
            String(p.id) !== link
        );
        setSuggestedProducts(suggestions.slice(0, 8)); // lấy 8 sản phẩm gợi ý
      });
  }, [link]);

  const handleProductClick = (productName) => {
    navigate(`/products/${productName}`);
    window.scrollTo(0, 0);
    window.location.reload();
  };

  return (
    <div className="my-8 overflow-visible">
      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10 },
          425: { slidesPerView: 1, spaceBetween: 15 },
          683: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {suggestedProducts.map((item, index) => (
          <SwiperSlide
            key={index}
            className="flex items-stretch justify-center pb-4"
          >
            <div className="w-full h-auto flex flex-col justify-between">
              <CardProduct
                nameProduct={item.title}
                description={truncateDescription(item.description, 30)}
                price={formatCurrency(item.price)}
                brand={item.brand}
                nameTag={item.category}
                imageUrl={item.thumbnail}
                onClick={() => handleProductClick(item.title)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

SuggestProducts.propTypes = {
  products: PropTypes.array.isRequired,
};

export default SuggestProducts;
