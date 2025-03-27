import { Route, Routes } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import LoadingRoute from '../components/LoadingRoute/LoadingRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const Blogs = lazy(() => import('../pages/Blogs'));
const Product = lazy(() => import('../pages/Product'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const PageNotFound = lazy(
  () => import('../components/404NotFound/_404PageNotFound')
);
const CartPage = lazy(() => import('../pages/Cart'));
const CheckoutPage = lazy(() => import('../pages/Checkout'));
const LoginForm = lazy(() => import('../pages/Login'));
const SignUpForm = lazy(() => import('../pages/Signup'));
const ForgotPassword = lazy(
  () => import('../pages/ResetPassword/Forgot-password')
);
const EnterOtp = lazy(() => import('../pages/ResetPassword/resetOTP'));
const CreateNewPassword = lazy(
  () => import('../pages/ResetPassword/CreateNewPassword')
);
const ResetSuccess = lazy(() => import('../pages/ResetPassword/Reset-Success'));
const EmailVerification = lazy(() => import('../pages/EmailVerif'));
const Congratulations = lazy(() => import('../pages/Congratulations'));
const Company = lazy(() => import('../pages/Company'));
const AdminDashboard = lazy(
  () => import('../components/Dashboard/Admin/AdminDashboard')
);
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:link" element={<ProductDetail />} />
        <Route path="/productdetails" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/company" element={<Company />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
