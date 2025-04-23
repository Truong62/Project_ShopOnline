import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../dashboard/src/components/form/Label';
import Input from '../../dashboard/src/components/form/input/InputField';
import Checkbox from '../../dashboard/src/components/form/input/Checkbox';
import { addToCart } from '../redux/cart/cartSlice';
import GoogleSignInButton from '../../dashboard/src/components/auth/GoogleSignInButton';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else if (formData.password.length > 30) {
      newErrors.password = 'Password must be less than 30 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      general: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://18.139.41.39:444/api/accounts/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // Kiểm tra Content-Type trước khi parse JSON
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        // Check if error is about unverified account or verification code needed
        if (response.status === 400) {
          let errorText = '';

          // Try to get the error message
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorText = errorData.message || '';

            // Check if error mentions verification code or email verification
            if (
              errorText.toLowerCase().includes('verification code') ||
              errorText.toLowerCase().includes('check your email') ||
              errorText.toLowerCase().includes('verify your email')
            ) {
              // Redirect to email confirmation page
              navigate('/email-confirm', { state: { email: formData.email } });
              return;
            }

            throw new Error(errorData.message || `${response.status}`);
          } else {
            // Try to get the error text
            errorText = await response.text();

            // Check if error mentions verification code or email verification
            if (
              errorText.toLowerCase().includes('verification code') ||
              errorText.toLowerCase().includes('check your email') ||
              errorText.toLowerCase().includes('verify your email')
            ) {
              // Redirect to email confirmation page
              navigate('/email-confirm', { state: { email: formData.email } });
              return;
            }

            throw new Error(`${errorText || 'No content'}`);
          }
        } else {
          // Handle other error status codes
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || `${response.status}`);
          } else {
            // Nếu không phải JSON, lấy text
            const errorText = await response.text();
            throw new Error(`${errorText || 'No content'}`);
          }
        }
      }

      if (response.status === 204) {
        throw new Error('No content returned from server');
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          `Expected JSON, but received: ${text || 'empty response'}`
        );
      }

      const data = await response.json();
      console.log('Login API response:', data); // Debug dữ liệu

      // Xử lý dữ liệu user
      const account = data.user || data.account || data;

      // Lưu thông tin đăng nhập, bao gồm cả email
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(account));
      localStorage.setItem('userEmail', formData.email); // Lưu email vào localStorage

      // Xử lý redirect
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      const tempProduct = localStorage.getItem('buyNowTempProduct');

      if (redirectPath === 'checkout' && tempProduct) {
        const parsedProduct = JSON.parse(tempProduct);
        dispatch(addToCart(parsedProduct));
        localStorage.removeItem('buyNowTempProduct');
        localStorage.removeItem('redirectAfterLogin');
        navigate('/checkout');
      } else if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Failed to sign in. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#e6f7fa]">
      <div className="w-full max-w-md pt-10 mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[#2c7d90] transition-colors hover:text-[#1a4e5a] gap-1"
          >
            <i className="pi pi-chevron-left" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#d4f0f5]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#A8DCE7] rounded-full flex items-center justify-center">
                <i className="pi pi-user-plus text-white text-3xl"></i>
              </div>
            </div>
            <h1 className="mb-2 font-bold text-center text-gray-800 text-2xl">
              Sign In
            </h1>
            <p className="text-sm text-center text-gray-500 mb-6">
              Enter your email and password to sign in!
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div className="space-y-5" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="text-[#2c7d90] font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#79c2d2] outline-none ${
                      errors.email ? 'border-red-500' : 'border-[#A8DCE7]'
                    }`}
                    error={!!errors.email}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="password"
                  className="text-[#2c7d90] font-medium"
                >
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full py-3 pl-10 pr-10 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#79c2d2] outline-none ${
                      errors.password ? 'border-red-500' : 'border-[#A8DCE7]'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#79c2d2] hover:text-[#2c7d90] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <i className="pi pi-eye" />
                    ) : (
                      <i className="pi pi-eye-slash" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {errors.general && (
                <motion.p
                  className="text-red-500 text-sm mt-1 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.general}
                </motion.p>
              )}

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <Checkbox
                  id="keep-logged-in"
                  label="Keep me logged in"
                  checked={isChecked}
                  onChange={setIsChecked}
                  disabled={isLoading}
                />
                <Link
                  to="/reset-password"
                  className="text-[#2c7d90] font-medium text-sm"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full py-3 mt-5 text-white font-medium bg-[#79c2d2] rounded-lg hover:bg-[#2c7d90] transition-colors disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </motion.div>

              <motion.div className="text-center mt-5" variants={itemVariants}>
                <p className="text-sm text-center mb-4">
                  Dont have account ?{' '}
                  <Link
                    to="/register"
                    className="text-[#2c7d90] hover:text-[#1a4e5a] font-medium transition-colors"
                  >
                    Register
                  </Link>
                </p>
                <p className="text-sm text-center text-gray-500 mb-4">or</p>
                <GoogleSignInButton disabled={isLoading} />
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
