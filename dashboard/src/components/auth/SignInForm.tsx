import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import { motion } from 'framer-motion';
import GoogleSignInButton from './GoogleSignInButton';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_manager' | 'sale_manager' | 'user';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', global: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let newErrors = { email: '', password: '', global: '' };
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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', global: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        'https://18.139.41.39:443/api/accounts/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: 'admin',
          }),
        }
      );

      // Log the raw response text for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Attempt to parse as JSON
      let userData;
      try {
        userData = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error('Response is not valid JSON: ' + responseText);
      }

      if (!response.ok) {
        throw new Error(userData.message || 'Invalid email or password');
      }

      // Map response to User interface
      const user: User = {
        id: userData.id || 0,
        name: userData.name || '',
        email: userData.email || formData.email,
        role: userData.role || 'user',
        status: userData.status || 'Active',
        createdAt: userData.createdAt || new Date().toISOString(),
      };

      if (user.status !== 'Active') {
        throw new Error('Account is inactive');
      }

      localStorage.setItem('user', JSON.stringify(user));
      console.log('Logged in user:', user);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrors((prev) => ({ ...prev, global: err.message || 'Login failed' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#e6f7fa]">
      <div className="w-full max-w-md pt-10 mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2c7d90] hover:text-[#1a4e5a] font-medium"
        >
          <i className="pi pi-arrow-left" />
          Back to home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-lg border border-[#d4f0f5]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="mb-6 text-center">
            <i className="pi pi-user text-4xl text-[#2c7d90]" />
            <h2 className="mt-2 text-2xl font-semibold text-[#1a4e5a]">
              Sign in to your account
            </h2>
            <p className="text-sm text-[#5f9ea0]">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label htmlFor="email" className="">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="pl-10"
                    error={!!errors.email}
                    hint=""
                    autoComplete="username"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="pi pi-envelope text-[#79c2d2]" />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10"
                    error={!!errors.password}
                    hint=""
                    autoComplete="current-password"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="pi pi-lock text-[#79c2d2]" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#79c2d2]"
                  >
                    <i
                      className={`pi ${showPassword ? 'pi-eye' : 'pi-eye-slash'}`}
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {errors.global && (
                <p className="text-red-500 text-sm text-center">
                  {errors.global}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Checkbox
                  id="keep-logged-in"
                  label="Keep me logged in"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <Link
                  to="/reset-password"
                  className="text-sm text-[#2c7d90] hover:text-[#1a4e5a]"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-[#A8DCE7] hover:bg-[#79c2d2] text-white font-medium rounded-lg transition-all duration-300 shadow-md"
                >
                  Sign in
                </motion.button>
              </div>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#e6f7fa]">
            <p className="text-sm text-center mb-4">
              Don’t have an account?{' '}
              <Link
                to="/Signup"
                className="text-[#2c7d90] hover:text-[#1a4e5a] font-medium"
              >
                Register
              </Link>
            </p>
            <GoogleSignInButton />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="text-center py-4 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        © {new Date().getFullYear()} All Rights Reserved
      </motion.div>
    </div>
  );
}
