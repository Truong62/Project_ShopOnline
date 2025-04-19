import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../dashboard/src/components/form/Label';
import Input from '../../dashboard/src/components/form/input/InputField';
import Checkbox from '../../dashboard/src/components/form/input/Checkbox';
import { buyNow } from '../redux/cart/cartSlice';
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
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const account = {
    email: 'test1@gmail.com',
    password: '123456',
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let newErrors = { email: '', password: '' };
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
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (
        formData.email === account.email &&
        formData.password === account.password
      ) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(account));

        const redirectPath = localStorage.getItem('redirectAfterLogin');
        const tempProduct = localStorage.getItem('buyNowTempProduct');

        // Trường hợp từ "Buy Now"
        if (redirectPath === 'checkout' && tempProduct) {
          const parsedProduct = JSON.parse(tempProduct);
          dispatch(buyNow(parsedProduct));
          localStorage.removeItem('buyNowTempProduct');
          localStorage.removeItem('redirectAfterLogin');
          navigate('/checkout');
        }
        // Trường hợp quay lại trang trước
        else if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        }
        // Trường hợp không có gì
        else {
          navigate('/');
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          password: 'Invalid email or password',
        }));
      }
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
                <i className="pi pi-user text-white text-3xl"></i>
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
                    min={0}
                    max={100}
                    step={1}
                    hint=""
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="pi pi-envelope text-[#79c2d2]"></i>
                  </div>
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
                    min={0}
                    max={100}
                    step={1}
                    hint=""
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="pi pi-lock text-[#79c2d2]"></i>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#79c2d2] hover:text-[#2c7d90] transition-colors"
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

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <Checkbox
                  id="keep-logged-in"
                  label="Keep me logged in"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <Link
                  to="/reset-password"
                  className="text-sm text-[#2c7d90] hover:text-[#1a4e5a] transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#A8DCE7] hover:bg-[#79c2d2] text-white font-medium rounded-lg transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in
                </motion.button>
              </motion.div>
            </motion.div>
          </form>

          <motion.div
            className="mt-6 pt-6 border-t border-[#e6f7fa]"
            variants={itemVariants}
          >
            <p className="text-sm text-center mb-4">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-[#2c7d90] hover:text-[#1a4e5a] font-medium transition-colors"
              >
                Register
              </Link>
            </p>
            <GoogleSignInButton />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="text-center py-4 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © {new Date().getFullYear()} All Rights Reserved
      </motion.div>
    </div>
  );
}
