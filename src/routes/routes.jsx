import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingRoute from '../components/LoadingRoute/LoadingRoute';

// Layouts
// import AppLayout from '../layout/AppLayout';

// Lazy import
const NotFound = React.lazy(
  () => import('../../dashboard/src/pages/OtherPage/NotFound')
);

// Dashboard pages
const SignIn = React.lazy(
  () => import('../../dashboard/src/pages/AuthPages/SignIn')
);
const SignUp = React.lazy(
  () => import('../../dashboard/src/pages/AuthPages/SignUp')
);
const ResetPassword = React.lazy(
  () => import('../../dashboard/src/pages/AuthPages/ForgetPassword')
);
const UserProfiles = React.lazy(
  () => import('../../dashboard/src/pages/UserProfiles')
);
const AppLayout = React.lazy(
  () => import('../../dashboard/src/layout/AppLayout')
);
const Videos = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Videos')
);
const Images = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Images')
);
const Alerts = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Alerts')
);
const Badges = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Badges')
);
const Avatars = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Avatars')
);
const Buttons = React.lazy(
  () => import('../../dashboard/src/pages/UiElements/Buttons')
);
const LineChart = React.lazy(
  () => import('../../dashboard/src/pages/Charts/LineChart')
);
const BarChart = React.lazy(
  () => import('../../dashboard/src/pages/Charts/BarChart')
);
const Calendar = React.lazy(() => import('../../dashboard/src/pages/Calendar'));
const BasicTables = React.lazy(
  () => import('../../dashboard/src/pages/Tables/BasicTables')
);
const FormElements = React.lazy(
  () => import('../../dashboard/src/pages/Forms/FormElements')
);
const Blank = React.lazy(() => import('../../dashboard/src/pages/Blank'));
const DashboardHome = React.lazy(
  () => import('../../dashboard/src/pages/Dashboard/Home')
);

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
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* Dashboard Auth */}
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
