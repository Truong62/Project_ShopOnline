import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Label from '../../dashboard/src/components/form/Label';
import Input from '../../dashboard/src/components/form/input/InputField';
import Checkbox from '../../dashboard/src/components/form/input/Checkbox';
import Button from '../../dashboard/src/components/ui/button/Button';
import { buyNow } from '../redux/cart/cartSlice';
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
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    const tempProduct = localStorage.getItem('buyNowTempProduct');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && redirectPath === 'checkout' && tempProduct && user) {
      const parsedProduct = JSON.parse(tempProduct);
      console.log(`✅ Logged with account: ${user.email || user.username}`);
      console.log('🛒 Product to buy:', parsedProduct);

      // Giả sử bạn dispatch action để lưu sản phẩm vào giỏ hàng của người dùng
      dispatch(buyNow(parsedProduct));

      // Xóa dữ liệu tạm thời
      localStorage.removeItem('buyNowTempProduct');
      localStorage.removeItem('redirectAfterLogin');

      // Điều hướng đến trang Checkout
      navigate('/checkout');
    }
  }, []);

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
    const tempProduct = localStorage.getItem('buyNowTempProduct');
    const parsedProduct = JSON.parse(tempProduct);

    e.preventDefault();
    if (validateForm()) {
      // Kiểm tra thông tin đăng nhập có khớp với account mock không
      if (
        formData.email === account.email &&
        formData.password === account.password
      ) {
        console.log('Đăng nhập thành công!');
        console.log(
          `✅ Logged with account: ${account.email || account.username}`
        );
        console.log('🛒 Product to buy:', parsedProduct);
        localStorage.setItem('isLoggedIn', 'true'); // ✅ lưu trạng thái
        localStorage.setItem('accountId', 'user1'); // hoặc id nào đó
        localStorage.setItem('email', formData.email); // lưu email
        navigate('/checkout');
      } else {
        console.log('Sai email hoặc mật khẩu');
        setErrors((prev) => ({
          ...prev,
          password: 'Sai email hoặc mật khẩu',
        }));
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <i className="pi pi-chevron-left size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
          Sign In
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email and password to sign in!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="">
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className=""
                error={!!errors.email}
                min={0}
                max={100}
                step={1}
                hint=""
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="">
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  min={0}
                  max={100}
                  step={1}
                  hint=""
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/5 cursor-pointer"
                >
                  {showPassword ? (
                    <i className="pi pi-eye" />
                  ) : (
                    <i className="pi pi-eye-slash" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="keep-logged-in"
                label="Keep me logged in"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              startIcon={null}
              endIcon={null}
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className="text-sm text-center mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/Signup" className="text-brand-500 hover:text-brand-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
