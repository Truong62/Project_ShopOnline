import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../dashboard/src/components/form/Label';
import Input from '../../dashboard/src/components/form/input/InputField';
import Checkbox from '../../dashboard/src/components/form/input/Checkbox';
import GoogleSinUpButton from '../../dashboard/src/components/auth/GoogleSignUpButton';
import { motion } from 'framer-motion';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordUppercase: '', // Thêm lỗi riêng cho chữ cái in hoa
    passwordSpecialChar: '', // Thêm lỗi riêng cho ký tự đặc biệt
    passwordConfirm: '',
    terms: '',
    general: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validateForm = () => {
    let newErrors = {
      email: '',
      password: '',
      passwordUppercase: '',
      passwordSpecialChar: '',
      passwordConfirm: '',
      terms: '',
      general: '',
    };
    let isValid = true;

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required!';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format!';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required!';
      isValid = false;
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters!';
        isValid = false;
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.passwordUppercase =
          'Password must contain at least one uppercase letter!';
        isValid = false;
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number!';
        isValid = false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.passwordSpecialChar =
          'Password must contain at least one special character (e.g., !@#$%^&*)!';
        isValid = false;
      }
    }

    // Validate password confirmation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm your password!';
      isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match!';
      isValid = false;
    }

    // Validate terms checkbox
    if (!isChecked) {
      newErrors.terms = 'You must agree to the terms and conditions!';
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
      passwordUppercase: '',
      passwordSpecialChar: '',
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
        'https://18.139.41.39:444/api/accounts/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            PasswordComfirm: formData.passwordConfirm,
          }),
        }
      );

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('Error response:', errorData);

          if (response.status === 400 && errorData.errors) {
            const errorMessages = Object.values(errorData.errors)
              .flat()
              .join(' ');
            throw new Error(errorMessages || 'Validation error occurred.');
          } else if (response.status === 409) {
            throw new Error(
              'Email already exists. Please use a different email.'
            );
          } else {
            throw new Error(
              errorData.message || `HTTP error! Status: ${response.status}`
            );
          }
        } else {
          const errorText = await response.text();
          console.log('Error text:', errorText);
          throw new Error(
            `HTTP error! Status: ${response.status}, Response: ${errorText || 'No content'}`
          );
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
      console.log('Register API response:', data);

      navigate('/email-confirm', {
        state: { email: formData.email },
      });
    } catch (error) {
      console.error('Register error:', error);
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Failed to register. Please try again.',
      }));
    } finally {
      setIsLoading(false);
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
                      errors.password ||
                      errors.passwordUppercase ||
                      errors.passwordSpecialChar
                        ? 'border-red-500'
                        : 'border-[#A8DCE7]'
                    }`}
                    error={
                      !!errors.password ||
                      !!errors.passwordUppercase ||
                      !!errors.passwordSpecialChar
                    }
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="pi pi-lock text-[#79c2d2]"></i>
                  </div>
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
                {errors.passwordUppercase && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.passwordUppercase}
                  </motion.p>
                )}
                {errors.passwordSpecialChar && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.passwordSpecialChar}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="passwordConfirm"
                  className="text-[#2c7d90] font-medium"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    placeholder="Confirm your password"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={`w-full py-3 pl-10 pr-10 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-[#79c2d2] outline-none ${
                      errors.passwordConfirm
                        ? 'border-red-500'
                        : 'border-[#A8DCE7]'
                    }`}
                    error={!!errors.passwordConfirm}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="pi pi-lock text-[#79c2d2]"></i>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#79c2d2] hover:text-[#2c7d90] transition-colors"
                    disabled={isLoading}
                  >
                    {showPasswordConfirm ? (
                      <i className="pi pi-eye" />
                    ) : (
                      <i className="pi pi-eye-slash" />
                    )}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.passwordConfirm}
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

              <motion.div variants={itemVariants} className="mt-4">
                <div className="flex items-start gap-3 bg-[#f0f9fb] p-3 rounded-lg border border-[#d4f0f5]">
                  <div className="mt-0.5">
                    <Checkbox
                      id="terms-checkbox"
                      checked={isChecked}
                      onChange={setIsChecked}
                      disabled={isLoading}
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
                  className="w-full py-3 px-4 bg-[#A8DCE7] hover:bg-[#79c2d2] text-white font-medium rounded-lg transition-all duration-300 shadow-md disabled:bg-gray-400"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
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
            <GoogleSinUpButton disabled={isLoading} />
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
