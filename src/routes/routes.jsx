import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingRoute from '../components/LoadingRoute/LoadingRoute';

// Layouts
// import AppLayout from '../layout/AppLayout';

// Components
import NotFound from '../../dashboard/src/pages/OtherPage/NotFound';

// Dashboard pages
import SignIn from '../../dashboard/src/pages/AuthPages/SignIn';
import SignUp from '../../dashboard/src/pages/AuthPages/SignUp';
import UserProfiles from '../../dashboard/src/pages/UserProfiles';
import AppLayout from '../../dashboard/src/layout/AppLayout';
import Videos from '../../dashboard/src/pages/UiElements/Videos';
import Images from '../../dashboard/src/pages/UiElements/Images';
import Alerts from '../../dashboard/src/pages/UiElements/Alerts';
import Badges from '../../dashboard/src/pages/UiElements/Badges';
import Avatars from '../../dashboard/src/pages/UiElements/Avatars';
import Buttons from '../../dashboard/src/pages/UiElements/Buttons';
import LineChart from '../../dashboard/src/pages/Charts/LineChart';
import BarChart from '../../dashboard/src/pages/Charts/BarChart';
import Calendar from '../../dashboard/src/pages/Calendar';
import BasicTables from '../../dashboard/src/pages/Tables/BasicTables';
import FormElements from '../../dashboard/src/pages/Forms/FormElements';
import ProductFeatures from '../../dashboard/src/pages/ProductFeatures';
import Blank from '../../dashboard/src/pages/Blank';
import DashboardHome from '../../dashboard/src/pages/Dashboard/Home';

// Frontend pages (lazy load)
const HomePage = lazy(() => import('../pages/HomePage'));
const Blogs = lazy(() => import('../pages/Blogs'));
const Product = lazy(() => import('../pages/Product'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const Tracking = lazy(() => import('../pages/Tracking'));
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
// const PageNotFound = lazy(
//   () => import('../components/404NotFound/_404PageNotFound')
// );

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:link" element={<ProductDetail />} />
        <Route path="/productdetails" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/company" element={<Company />} />

        {/* Dashboard Routes */}
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<DashboardHome />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/product-features" element={<ProductFeatures />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Dashboard Auth */}
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
