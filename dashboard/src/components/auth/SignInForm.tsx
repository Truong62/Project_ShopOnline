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
  role: 'admin' | 'product_manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'Active',
    createdAt: new Date('2025-04-01').toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'jane123',
    role: 'product_manager',
    status: 'Active',
    createdAt: new Date('2025-04-02').toISOString(),
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    password: 'bob123',
    role: 'sale_manager',
    status: 'Active',
    createdAt: new Date('2025-04-03').toISOString(),
  },
];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

      if (!users.length) {
        users = initialUsers;
        localStorage.setItem('users', JSON.stringify(users));
      }

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.password === formData.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.status !== 'Active') {
        throw new Error('Account is inactive');
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/admin');
    } catch (err: any) {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#e6f7fa]">
      {/* Header */}
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

      {/* Form */}
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
              {/* Email */}
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
                    min={0}
                    max={100}
                    step={1}
                    hint={''}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="pi pi-envelope text-[#79c2d2]" />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
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
                    min={0}
                    max={100}
                    step={1}
                    hint={''}
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

              {/* Global error */}
              {errors.global && (
                <p className="text-red-500 text-sm text-center">
                  {errors.global}
                </p>
              )}

              {/* Remember & Forgot */}
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

              {/* Submit */}
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

          {/* Footer */}
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

      {/* Copyright */}
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
