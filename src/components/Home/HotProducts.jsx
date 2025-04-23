import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import { Navigation, Autoplay } from 'swiper/modules';
import CardProduct from '../Card/Card';
import { truncateDescription } from '../../utils/truncateDescription';
import { formatCurrency } from '../../utils/formatCurrency';
import useFetchApi from '../../hooks/useFetchApi';
import { ProgressSpinner } from 'primereact/progressspinner';

const HotProduct = () => {
  const navigate = useNavigate();

  const {
    data: products,
    loading,
    error,
  } = useFetchApi('https://18.139.41.39:444/api/products/filter');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>0</div>;
  }

  return (
    <div className="bg-white">
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
        {products.map((product, index) => {
          const mainVariant = product.productColors?.[0] || {};
          const mainImage =
            mainVariant.images?.[0] || 'https://placehold.co/300x300';

          const handleProductClick = () => {
            navigate(`/products/${product.product__Name}`, {
              state: { product },
            });
          };

          return (
            <SwiperSlide
              key={product.product__Id || index}
              className="flex justify-center items-center p-4"
            >
              <div className="w-[22rem] h-auto">
                <CardProduct
                  nameProduct={product.product__Name}
                  description={truncateDescription(
                    product.product__Description || '',
                    40
                  )}
                  price={formatCurrency(mainVariant.productColor__Price || 0)}
                  brand={product.brand || 'NIKE'}
                  nameTag={product.tag || []}
                  imageUrl={mainImage}
                  onClick={handleProductClick}
                  badgeText="HOT"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HotProduct;
