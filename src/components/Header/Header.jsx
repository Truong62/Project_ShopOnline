import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SidebarContainer from './Sidebar';
import useDeviceType from '../../hooks/useDeviceType';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PrimeIcons } from 'primereact/api';
import { truncateDescription } from '../../utils/truncateDescription.js';
import axios from 'axios';

// ✅ JWT decode function without using libraries
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

const Header = () => {
  const [visibleRight, setVisibleRight] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const uniqueItemsCount = cartItems.length;
  const { isMobile } = useDeviceType();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('/');
  const [accountEmail, setAccountEmail] = useState('User');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const isLoggedIn = !!localStorage.getItem('loggedInUser');

  // Get email from token
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const token = storedUser?.accessToken;
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.email) {
        setAccountEmail(decoded.email);
      }
    }
  }, []);

  // Read cartItems from localStorage when component mounts
  useEffect(() => {
    const storedCartItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
    setCartItems(storedCartItems);
  }, []);

  // Track localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      setCartItems(storedCartItems);
      console.log(localStorage.getItem('loggedInUser'));
    };

    window.addEventListener('storage', handleStorageChange);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key) {
      originalSetItem.apply(this, arguments);
      if (key === 'cartItems') {
        const event = new Event('storage');
        window.dispatchEvent(event);
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Update activeLink based on URL
  useEffect(() => {
    const path = window.location.pathname.split('/');
    setActiveLink(path.length > 1 ? `/${path[1]}` : '/');
  }, []);

  // API URL - ideally this would be in an environment variable
  const API_URL = 'https://api.example.com/api'; // Replace with your actual API URL

  // Fetch products from API based on search term
  const fetchProducts = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // You can modify the endpoint and parameters based on your API structure
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { query: term },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the API returns an array of products
      setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
      // Fallback to empty results
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchProducts(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Product search function
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Handle product selection from search results
  const handleSelectProduct = (productName) => {
    setShowResults(false);
    setSearchTerm('');
    navigate(`/products/${productName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('cartItems');
    setIsAccountOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-2">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo & Search */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              className="w-12 h-12 rounded-lg"
              src="https://cdn2.futurepedia.io/2024-11-26T18-51-51.356Z-MtXWJEI4O08DkXhcFo8z7VXOEe00XPWLb.webp?w=1920"
              alt="Logo"
            />
          </Link>
          <div className="relative hidden md:flex items-center border border-gray-300 rounded-full px-3 py-2">
            <i className="pi pi-search text-gray-500"></i>
            <InputText
              className="ml-2 outline-none border-none w-64"
              placeholder="Search ..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                if (searchResults.length > 0) setShowResults(true);
              }}
            />
            {isSearching && (
              <i className="pi pi-spin pi-spinner ml-2 text-gray-500"></i>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((product, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProduct(product.productName);
                    }}
                  >
                    <img
                      src={product.variants[0].images[0]}
                      alt={product.productName}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-gray-500">
                        {product.brandName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {isMobile && (
            <div className="relative flex items-center border border-gray-300 rounded-full px-2 py-1 w-60">
              <i className="pi pi-search text-gray-500"></i>
              <InputText
                className="ml-2 outline-none border-none w-full text-xl"
                placeholder="Search ..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchResults.length > 0) setShowResults(true);
                }}
              />
              {isSearching && (
                <i className="pi pi-spin pi-spinner ml-2 text-gray-500"></i>
              )}
              {showResults && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((product, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProduct(product.productName);
                      }}
                    >
                      <img
                        src={product.variants[0].images[0]}
                        alt={product.productName}
                        className="w-10 h-10 object-cover rounded-md mr-3"
                      />
                      <div>
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-sm text-gray-500">
                          {product.brandName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6">
          {['Products', 'Orders', 'Blogs', 'Company'].map((text) => (
            <Link
              key={text}
              to={`/${text.toLowerCase()}`}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition duration-300 ${
                activeLink === `/${text.toLowerCase()}`
                  ? 'bg-[#A8DCE7] text-black'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {text}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <span className="cursor-pointer">
              <i className="pi pi-shopping-cart text-xl"></i>
            </span>
            {uniqueItemsCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                {uniqueItemsCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <Button
                icon="pi pi-user"
                className="p-button-text text-gray-700"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              />
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 w-[250px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
                  <Link
                    to="/account"
                    className="text-sm text-gray-700 w-[250px] dark:text-gray-200 mb-4 truncate w-48 block overflow-hidden whitespace-nowrap"
                  >
                    Your Account: {truncateDescription(accountEmail, 250)}
                  </Link>
                  <Button
                    label="Logout"
                    className="w-full p-button-outlined p-button-sm"
                    onClick={handleLogout}
                  />
                </div>
              )}
            </div>
          ) : (
            !isMobile && (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button className="p-button-text text-gray-700 font-semibold">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="p-button-rounded p-button-primary font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )
          )}

          {isMobile && (
            <Button
              icon={PrimeIcons.BARS}
              className="p-button-text"
              onClick={() => setVisibleRight(true)}
            />
          )}
        </div>
      </div>

      {isMobile && (
        <SidebarContainer {...{ visibleRight, setVisibleRight, activeLink }} />
      )}
    </header>
  );
};

export default Header;
