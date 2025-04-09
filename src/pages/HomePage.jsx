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
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    name: '',
    description: '',
    brand: '',
    image: '',
    tags: [],
    price: 0,
  });
  const [formattedProducts, setFormattedProducts] = useState([]);
  const swiperRef = useRef(null);
  const {
    data: products,
    loading,
    error,
  } = useFetchApi('http://localhost:5000/api/product', {
    limit: 10,
    page: 1,
    order: 'desc',
  });

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
      const newFormattedProducts = products.map((product) => ({
        id: product.productId,
        name: product.productName,
        description: product.productDescription,
        brand: product.brandName,
        image: product.imagePath || 'https://placehold.co/300x300',
        tags: product.tag,
        price: product.price,
      }));
      setFormattedProducts(newFormattedProducts);
      setCurrentProduct(newFormattedProducts[0]);
    }
  }, [products]);

  const handleNavigation = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      const currentIndex = formattedProducts.findIndex(
        (p) => p.id === currentProduct.id
      );
      if (direction === 'next') {
        if (currentIndex < formattedProducts.length - 1) {
          setCurrentProduct(formattedProducts[currentIndex + 1]);
          swiper.slideNext();
        }
      } else if (direction === 'prev') {
        if (currentIndex > 0) {
          setCurrentProduct(formattedProducts[currentIndex - 1]);
          swiper.slidePrev();
        }
      }
    }
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-6">
            <div className="col-span-1 md:col-span-6">
              <div className="aspect-square overflow-hidden group">
                <video
                  className="aspect-square object-cover w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={introVideo2} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4">
                {currentProduct.description.length > 150 && (
                  <div className="flex items-center">
                    <Button
                      icon={
                        expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'
                      }
                      onClick={() => setExpanded(!expanded)}
                      className="p-button-text text-[#5AA1E3] hover:text-[#4890d2]"
                      label={expanded ? 'Show Less' : 'See More'}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-6">
              <p className="text-sm mb-6 text-center md:text-left">
                WE BELIEVE THAT FASHION IS NOT JUST ABOUT WHAT YOU WEAR, ITS A
                POWERFUL MEANS OF SELF-EXPRESSION AND TRANSFORMATION.
              </p>

              <div className="flex gap-2 md:gap-4 mb-10">
                <button
                  onClick={() => handleNavigation('prev')}
                  className="slider-prev border border-gray-300 w-full md:w-[300px] px-4 md:px-8 py-2 hover:border-black"
                >
                  ←
                </button>
                <button
                  onClick={() => handleNavigation('next')}
                  className="slider-next bg-[#5AA1E3] w-full md:w-[300px] text-white px-4 md:px-8 py-2"
                >
                  →
                </button>
              </div>

              <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                spaceBetween={10}
                slidesPerView="auto"
                loop={false}
                navigation={false}
                freeMode={true}
              >
                {loading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <SwiperSlide
                        key={`skeleton-${index}`}
                        className="!w-[300px] md:!w-[350px]"
                      >
                        <div className="bg-gray-50 p-4 h-full">
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
                            {Array.from({ length: 3 }).map((_, tagIndex) => (
                              <SkeletonProduct
                                key={`tag-skeleton-${tagIndex}`}
                                width="4rem"
                                height="0.8rem"
                              />
                            ))}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : formattedProducts.map((product) => (
                      <SwiperSlide
                        key={product.id}
                        className="!w-[300px] md:!w-[350px]"
                        onClick={() =>
                          setCurrentProduct({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            brand: product.brand,
                            image: product.image,
                            tags: product.tags,
                            price: product.price,
                          })
                        }
                      >
                        <div
                          className={`bg-gray-50 cursor-pointer group relative h-full ${
                            currentProduct.id === product.id
                              ? 'bg-gray-200'
                              : ''
                          }`}
                        >
                          <div className="relative w-full h-[350px]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover object-center"
                              onError={(e) =>
                                (e.currentTarget.src =
                                  'https://placehold.co/300x300')
                              }
                            />
                            <p className="absolute bottom-0 left-0 bg-white/80 px-2 py-1 text-xs md:text-base font-bold">
                              {formatCurrency(product.price)}
                            </p>
                            <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                className="bg-[#5AA1E3] text-white px-4 py-1 text-xs md:text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                onClick={() =>
                                  navigate(`/productDetail/${product.id}`)
                                }
                              >
                                View Detail
                              </button>
                            </div>
                          </div>
                          <div className="p-2 md:p-4">
                            <span className="uppercase text-xs md:text-sm line-clamp-1">
                              {product.name}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.tags.map((tag) => (
                                <span
                                  key={tag.tagId}
                                  className="text-[10px] md:text-xs text-gray-500"
                                >
                                  #{tag.tagName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
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
                    className="mt-3 p-button-danger p-button-outlined p-2 rounded border border-red-300 bg-red-300  rounded-lg opacity-90 hover:opacity-100 transition duration-300"
                  />
                </div>
              )}

              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full md:w-auto bg-[#5AA1E3] text-white px-8 md:px-16 py-2"
                >
                  SEE MORE PRODUCTS
                </button>
              </div>
            </div>
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
