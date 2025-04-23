import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Layout from '../components/Layout';
import BreadCrumb from '../components/BreadCrumb';
import React, { useEffect, useRef, useState } from 'react';
import { blogPosts } from '../data/dataBlog';
import './style.scss';

const Blogs = () => {
  const featuredPosts = blogPosts.slice(0, 2);
  const column1Ref = useRef(null);
  const column2Ref = useRef(null);
  const [stickyColumn, setStickyColumn] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu người dùng đã chọn chế độ tối trước đó
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    function checkColumnHeights() {
      const column1 = column1Ref.current;
      const column2 = column2Ref.current;

      if (!column1 || !column2) return;

      const height1 = column1.getBoundingClientRect().height;
      const height2 = column2.getBoundingClientRect().height;

      if (height1 < height2) {
        setStickyColumn('column1');
      } else if (height2 < height1) {
        setStickyColumn('column2');
      } else {
        setStickyColumn(null);
      }
    }

    const timer = setTimeout(checkColumnHeights, 500);
    window.addEventListener('resize', checkColumnHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkColumnHeights);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div
      className={`transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      <Header />
      <Layout>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <BreadCrumb />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gradient-to-r from-primary-accent to-primary-text-color text-white hover:opacity-90 transition-all duration-300 shadow-md"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          <div className="relative mb-16">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white relative z-10 highlight">
              <span className="relative inline-block mb-2">
                Sneaker <span className="text-gradient">Blog</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary-accent to-primary-text-color rounded-full"></span>
              </span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            <div
              ref={column1Ref}
              id="column1"
              className={`w-full lg:w-2/3 ${stickyColumn === 'column1' ? 'lg:sticky lg:top-20' : ''}`}
            >
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-xl blog-post-container"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 hover-shine"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-accent to-primary-text-color text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="mr-4">{post.date}</span>
                      <span className="mr-4">•</span>
                      <span className="mr-4">By {post.author}</span>
                      <span className="mr-4">•</span>
                      <span>{post.readTime} min read</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white hover:text-gradient dark:hover:text-gradient transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-5">
                      {post.excerpt}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <span key={index} className="text-xs tag">
                              #{tag}
                            </span>
                          ))}
                      </div>

                      <a className="inline-flex items-center text-a8dce7-bold font-medium hover:text-opacity-80 transition-all group">
                        Read More
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={column2Ref}
              id="column2"
              className={`w-full lg:w-1/3 ${stickyColumn === 'column2' ? 'lg:sticky lg:top-20' : ''}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700 transform hover:translate-y-[-5px] transition-all duration-300 blog-post-container">
                <div className="text-center">
                  <div className="relative mx-auto w-32 h-32 mb-6">
                    <div className="absolute inset-0 rounded-full bg-a8dce7 opacity-30 animate-pulse"></div>
                    <img
                      src="https://cdn2.futurepedia.io/2024-11-26T18-51-51.356Z-MtXWJEI4O08DkXhcFo8z7VXOEe00XPWLb.webp?w=1920"
                      alt="Jay Dang"
                      className="rounded-full w-32 h-32 object-cover mx-auto relative z-10 border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Jay Dang
                  </h3>
                  <p className="text-gradient font-medium mb-3">
                    SNEAKER ENTHUSIAST & BLOGGER
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sharing my passion for sneakers and street fashion from the
                    vibrant streets of Ho Chi Minh City.
                  </p>

                  <div className="flex justify-center space-x-4 mb-6">
                    <a className="text-a8dce7-bold hover:text-opacity-80 transition-colors transform hover:scale-110 duration-300">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                    </a>
                    <a className="text-a8dce7-bold hover:text-opacity-80 transition-colors transform hover:scale-110 duration-300">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                      </svg>
                    </a>
                    <a className="text-a8dce7-bold hover:text-opacity-80 transition-colors transform hover:scale-110 duration-300">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                      </svg>
                    </a>
                  </div>

                  <a className="inline-block btn-gradient hover:bg-opacity-80 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105 hover-shine">
                    ABOUT ME
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700 transform hover:translate-y-[-5px] transition-all duration-300 blog-post-container">
                <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 relative">
                  <span className="text-gradient">✨</span> Featured Articles
                  <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-a8dce7 rounded-full"></span>
                </h4>

                <div className="space-y-6">
                  {featuredPosts.map((post) => (
                    <div key={post.id} className="flex items-center group">
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 hover-shine"
                        />
                      </div>
                      <div className="ml-4">
                        <h5 className="font-medium text-gray-800 dark:text-white line-clamp-2 hover:text-a8dce7-bold dark:hover:text-a8dce7-bold transition-colors">
                          {post.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {post.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transform hover:translate-y-[-5px] transition-all duration-300 blog-post-container">
                <h4 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 relative">
                  <span className="text-gradient">🏷️</span> Tags
                  <span className="absolute bottom-0 left-0 w-1/4 h-1 bg-a8dce7 rounded-full"></span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(blogPosts.flatMap((post) => post.tags || []))
                  ).map((tag, index) => (
                    <a key={index} className="tag">
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </div>
  );
};

export default Blogs;
