import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShoppingSvg from '../SvgIcon/Shopping';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20">
      <div className="absolute inset-0 bg-sand-light texture-overlay -z-10"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 min-h-[80vh] items-center py-12 md:py-20">
          <div
            className={`space-y-6 md:space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-balance">
              Elevate Your Style With Premium Footwear
            </h1>

            <p className="text-stone-600 text-lg md:text-xl leading-relaxed max-w-xl">
              Discover our hand-crafted collection of luxury shoes, designed for
              comfort and created for those who appreciate timeless elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="border border-stone-300 hover:border-stone-400 bg-transparent text-stone-900 rounded-lg px-6 py-6 font-medium transition-all duration-300 flex items-center space-x-2 text-base">
                <Link to="/products">
                  <div className="flex gap-3">
                    <ShoppingSvg />
                    <span>BUY NOW</span>
                  </div>
                </Link>
              </button>
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white overflow-hidden"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                      alt={`Customer ${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-xs font-medium text-stone-600">
                  +2K
                </div>
              </div>
              <div className="text-sm text-stone-600">
                Trusted by{' '}
                <span className="font-semibold text-stone-900">2,000+</span>{' '}
                customers
              </div>
            </div>
          </div>

          <div
            className={`relative h-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative aspect-square md:aspect-auto md:h-[36rem] animate-image-glow">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-stone-200 rounded-full mix-blend-multiply blur-xl opacity-70 animate-rotate-slow"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-sand bg-opacity-80 rounded-full mix-blend-multiply blur-xl opacity-70 animate-rotate-slow animation-delay-2000"></div>

              <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80"
                  alt="Premium leather shoes on display"
                  className="h-full w-full object-cover"
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            </div>

            <div className="absolute -top-5 -right-5 md:top-10 md:right-10 rounded-xl p-4 shadow-lg glassmorphism animate-fade-up delay-300">
              <div className="flex flex-col items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs font-medium mt-1">4.9 from 2K+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
