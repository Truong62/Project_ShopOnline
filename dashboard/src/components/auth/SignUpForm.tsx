import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import { motion } from 'framer-motion';
import GoogleSignUpButton from './GoogleSignInButton';
export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    terms: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    let newErrors = {
      fname: '',
      lname: '',
      email: '',
      password: '',
      terms: '',
    };
    let isValid = true;

    if (!formData.fname) {
      newErrors.fname = 'First name is required!';
      isValid = false;
    }

    if (!formData.lname) {
      newErrors.lname = 'Last name is required!';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required!';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format!';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required!';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
      isValid = false;
    }

    if (!isChecked) {
      newErrors.terms = 'You must agree to the terms and conditions!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Submitting', formData);
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
            Back to dashboard
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
              Sign Up
            </h1>
            <p className="text-sm text-center text-gray-500 mb-6">
              Enter your details to create an account!
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div className="space-y-5" variants={containerVariants}>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <div>
                  <Label htmlFor="fname" className="text-[#2c7d90] font-medium">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={formData.fname}
                      onChange={handleChange}
                      className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#79c2d2] outline-none ${
                        errors.fname ? 'border-red-500' : 'border-[#A8DCE7]'
                      }`}
                      error={!!errors.fname}
                      min="0"
                      max="100"
                      step="1"
                      hint=""
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <i className="pi pi-user text-[#79c2d2]"></i>
                    </div>
                  </div>
                  {errors.fname && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.fname}
                    </motion.p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lname" className="text-[#2c7d90] font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={formData.lname}
                      onChange={handleChange}
                      className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#79c2d2] outline-none ${
                        errors.lname ? 'border-red-500' : 'border-[#A8DCE7]'
                      }`}
                      error={!!errors.lname}
                      min="0"
                      max="100"
                      step="1"
                      hint=""
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <i className="pi pi-user text-[#79c2d2]"></i>
                    </div>
                  </div>
                  {errors.lname && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.lname}
                    </motion.p>
                  )}
                </div>
              </motion.div>

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
                    min="0"
                    max="100"
                    step="1"
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
                    error={!!errors.password}
                    min="0"
                    max="100"
                    step="1"
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

              <motion.div variants={itemVariants} className="mt-4">
                <div className="flex items-start gap-3 bg-[#f0f9fb] p-3 rounded-lg border border-[#d4f0f5]">
                  <div className="mt-0.5">
                    <Checkbox
                      id="terms-checkbox"
                      checked={isChecked}
                      onChange={setIsChecked}
                      label={undefined}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    By creating an account means you agree to the{' '}
                    <span className="text-[#2c7d90] font-medium hover:text-[#1a4e5a] cursor-pointer transition-colors">
                      Terms and Conditions
                    </span>{' '}
                    and our{' '}
                    <span className="text-[#2c7d90] font-medium hover:text-[#1a4e5a] cursor-pointer transition-colors">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {errors.terms && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#A8DCE7] hover:bg-[#79c2d2] text-white font-medium rounded-lg transition-all duration-300 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </motion.div>
            </motion.div>
          </form>

          <motion.div
            className="mt-6 pt-6 border-t border-[#e6f7fa]"
            variants={itemVariants}
          >
            <p className="text-sm text-center mb-4">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#2c7d90] hover:text-[#1a4e5a] font-medium transition-colors"
              >
                Login
              </Link>
            </p>
            <p className="text-sm text-center text-gray-500 mb-4">or</p>
            <GoogleSignUpButton />
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
