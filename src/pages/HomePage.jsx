import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import useFetchApi from '../hooks/useFetchApi';
import 'swiper/css';
import 'swiper/css/navigation';
import { formatCurrency } from '../utils/formatCurrency';
import introVideo from '../assets/intro.mp4';
import introVideo2 from '../assets/intro2.mp4';
import SkeletonProduct from '../components/Skeleton/SkeletonProducts';
import HotProducts from '../components/Home/HotProducts';
import Footer from '../components/Footer/Footer';
import Newest from '../components/Home/Newest';
import BrandHome from '../components/Home/BrandHome';
import FeatureList from '../components/Home/FeatureList';
import Layout from '../components/Layout';
import HeroSection from '../components/UI/HeroSection';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'cat1',
    name: "Men's Collection",
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/men',
  },
  {
    id: 'cat2',
    name: "Women's Collection",
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/women',
  },
  {
    id: 'cat3',
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/accessories',
  },
];

/**
 *
 * @returns {Element}
 * @constructor
 */
const Home = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const swiperRef = useRef(null);
  const {
    data: products,
    loading,
    error,
  } = useFetchApi('https://18.139.41.39:444/api/products/filter');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(`Error: ${error.message}`);
    } else {
      setErrorMessage('');
    }
  }, [error]);

  useEffect(() => {
    if (products && products.length > 0) {
      setCurrentProduct(products[0]);
    }
  }, [products]);

  const handleNavigation = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      const currentIndex = products.findIndex(
        (p) => p.product__Id === currentProduct?.product__Id
      );
      if (direction === 'next') {
        if (currentIndex < products.length - 1) {
          setCurrentProduct(products[currentIndex + 1]);
          swiper.slideNext();
        }
      } else if (direction === 'prev') {
        if (currentIndex > 0) {
          setCurrentProduct(products[currentIndex - 1]);
          swiper.slidePrev();
        }
      }
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.product__Name}`, { state: { product } });
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // let isScrolling = false;

  // document.addEventListener(
  //   'wheel',
  //   (event) => {
  //     if (isScrolling) return;
  //     isScrolling = true;
  //
  //     const divs = Array.from(document.querySelectorAll("div[id='scrollPro']"));
  //     if (divs.length === 0) return;
  //
  //     let currentIndex = divs.findIndex(
  //       (div) => div.getBoundingClientRect().top >= 0
  //     );
  //
  //     if (event.deltaY > 0 && currentIndex < divs.length - 1) {
  //       event.preventDefault();
  //       divs[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
  //     } else if (event.deltaY < 0 && currentIndex > 0) {
  //       event.preventDefault();
  //       divs[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
  //     }
  //
  //     setTimeout(() => {
  //       isScrolling = false;
  //     }, 500);
  //   },
  //   { passive: false }
  // );

  return (
    <React.Fragment>
      <Header />
      <div id="scrollPro">
        <HeroSection />
      </div>
      <Layout w="1440px">
        <div className="min-h-screen" id="scrollPro">
          <div className="relative w-full h-[200px] md:h-[400px] my-4 md:my-8">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                document.getElementById('fallback-image').style.display =
                  'block';
              }}
            >
              <source src={introVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <img
              id="fallback-image"
              src="https://placehold.co/300x300"
              alt="Fallback"
              style={{ display: 'none' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-8xl font-light text-center drop-shadow-lg">
                SHIFTED COUNTER
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-4 my-8 md:my-12 px-4">
            <div className="h-px bg-gray-300 w-16 md:w-32"></div>
            <span className="text-lg md:text-xl">NEWEST</span>
            <div className="h-px bg-gray-300 w-16 md:w-32"></div>
          </div>
          <Newest />
        </div>
        <div className="min-h-screen" id="scrollPro">
          <div className="my-12">
            <FeatureList />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8 mb-16">
            <motion.div
              className="col-span-1 md:col-span-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <div className="h-full flex flex-col">
                <div className="aspect-square overflow-hidden group rounded-2xl shadow-lg relative mb-4">
                  <video
                    className="aspect-square object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={introVideo2} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(65,179,199,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="mt-auto">
                  {currentProduct?.description?.length > 150 && (
                    <div className="flex items-center">
                      <Button
                        icon={
                          expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'
                        }
                        onClick={() => setExpanded(!expanded)}
                        className="p-button-text text-[rgb(65,179,199)] hover:text-[rgba(65,179,199,0.8)]"
                        label={expanded ? 'Show Less' : 'See More'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-1 md:col-span-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-2xl h-full flex flex-col">
                <motion.p
                  className="text-base mb-6 text-center md:text-left leading-relaxed text-gray-700 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  WE BELIEVE THAT FASHION IS NOT JUST ABOUT WHAT YOU WEAR, IT'S
                  A POWERFUL MEANS OF SELF-EXPRESSION AND TRANSFORMATION.
                </motion.p>

                <div className="flex gap-3 md:gap-5 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavigation('prev')}
                    className="slider-prev border-2 border-[rgb(65,179,199)] w-full md:w-[300px] px-4 md:px-8 py-3 hover:bg-[rgba(65,179,199,0.1)] rounded-lg text-[rgb(65,179,199)] font-medium transition-all duration-300"
                  >
                    ← Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavigation('next')}
                    className="slider-next bg-[rgb(65,179,199)] w-full md:w-[300px] text-white px-4 md:px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[rgba(65,179,199,0.9)]"
                  >
                    Next →
                  </motion.button>
                </div>

                <div className="flex-grow mb-6 overflow-hidden">
                  <div className="relative">
                    <Swiper
                      ref={swiperRef}
                      modules={[Navigation, Autoplay]}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      spaceBetween={15}
                      slidesPerView={1}
                      breakpoints={{
                        640: {
                          slidesPerView: 1.5,
                          spaceBetween: 15,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                      }}
                      loop={false}
                      navigation={false}
                      className="product-swiper !overflow-hidden "
                      style={{ padding: '5px 0' }}
                    >
                      {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                          <SwiperSlide key={`skeleton-${index}`}>
                            <div className="bg-gray-50 p-4 h-full rounded-xl">
                              <div className="mb-4">
                                <SkeletonProduct shape="square" size="10rem" />
                              </div>

                              <div className="mb-2">
                                <SkeletonProduct width="80%" height="1rem" />
                              </div>

                              <div className="mb-2">
                                <SkeletonProduct width="50%" height="1rem" />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 3 }).map(
                                  (_, tagIndex) => (
                                    <SkeletonProduct
                                      key={`tag-skeleton-${tagIndex}`}
                                      width="4rem"
                                      height="0.8rem"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </SwiperSlide>
                        ))
                      ) : products && products.length > 0 ? (
                        products.map((product, index) => {
                          const mainVariant = product.productColors?.[0] || {};
                          const mainImage =
                            mainVariant.images?.[0] ||
                            'https://placehold.co/300x300';

                          return (
                            <SwiperSlide
                              key={product.product__Id || index}
                              onClick={() => setCurrentProduct(product)}
                            >
                              <div
                                className={`cursor-pointer group relative h-full rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                                  currentProduct?.product__Id ===
                                  product.product__Id
                                    ? 'ring-2 ring-[rgb(65,179,199)] shadow-lg'
                                    : 'hover:shadow-lg'
                                }`}
                              >
                                <div className="relative w-full h-[220px]">
                                  <img
                                    src={mainImage}
                                    alt={product.product__Name}
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) =>
                                      (e.currentTarget.src =
                                        'https://placehold.co/300x300')
                                    }
                                  />
                                  <div className="absolute bottom-0 left-0 bg-gradient-to-r from-[rgb(65,179,199)] to-[rgba(65,179,199,0.8)] px-3 py-2 text-white font-medium rounded-tr-lg">
                                    {formatCurrency(
                                      mainVariant.productColor__Price || 0
                                    )}
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="bg-[rgb(65,179,199)] text-white px-6 py-2 rounded-full text-sm mb-4 shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(product);
                                      }}
                                    >
                                      View Details
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="p-3 md:p-4 bg-white">
                                  <span className="font-medium text-sm md:text-base line-clamp-1 text-gray-800">
                                    {product.product__Name}
                                  </span>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No products available
                        </div>
                      )}
                    </Swiper>
                  </div>
                </div>

                {!loading && errorMessage && (
                  <div className="flex flex-col items-center justify-center mb-6 max-w-4xl mx-auto p-4 border border-red-300 rounded-lg bg-red-50">
                    <Message
                      severity=""
                      text={errorMessage}
                      className="w-full text-center"
                    />
                    <Button
                      label="Reload"
                      onClick={() => window.location.reload()}
                      className="mt-3 p-button-danger p-button-outlined p-2 rounded border border-red-300 bg-red-300 rounded-lg opacity-90 hover:opacity-100 transition duration-300"
                    />
                  </div>
                )}

                <div className="text-center mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center justify-center w-full md:w-auto bg-[rgb(65,179,199)] text-white px-8 md:px-16 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[rgba(65,179,199,0.9)]"
                  >
                    <span>SEE MORE PRODUCTS</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          id="scrollPro"
          className="flex items-center justify-center gap-2 md:gap-4 my-8 md:my-12 px-4"
        >
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
          <span className="text-lg md:text-xl">HOT PRODUCTS</span>
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
        </div>
        <div id="scrollPro">
          <HotProducts />
        </div>
        <div id="scrollPro">
          <section className="py-16 md:py-24 ">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-sm uppercase tracking-wider text-stone-500 font-medium mb-2">
                  Browse by Category
                </h2>
                <h3 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                  Find Your Perfect Pair
                </h3>
                <p className="text-stone-600 mt-3 max-w-2xl mx-auto">
                  Explore our carefully curated collections for every occasion
                  and style preference.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={'/'}
                    className={`group relative rounded-xl overflow-hidden aspect-[3/4] transition-all duration-700 delay-${index * 200} ${
                      isLoaded
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                      <h4 className="text-white font-display text-2xl font-medium mb-2">
                        {category.name}
                      </h4>
                      <div className="flex items-center text-white/90 text-sm">
                        <span>Explore Collection</span>
                        {/*<ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />*/}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div
          id="scrollPro"
          className="flex items-center justify-center gap-2 md:gap-4 my-8 md:my-12 px-4"
        >
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
          <span className="text-lg md:text-xl">BRANDS COLLARS</span>
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
        </div>
        <BrandHome />
      </Layout>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
