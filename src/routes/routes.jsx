import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingRoute from '../components/LoadingRoute/LoadingRoute';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles, element }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || '';

  if (!role) {
    return <Navigate to="/Signin" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/Admin" replace />;
  }

  return element;
};

// Lazy import
const NotFound = React.lazy(
  () => import('../../dashboard/src/pages/OtherPage/NotFound')
);

const ProductFeatures = React.lazy(
  () => import('../../dashboard/src/pages/ProductFeatures')
);
const UserManagement = React.lazy(
  () => import('../../dashboard/src/pages/UserManagement')
);
const YourProfile = React.lazy(() => import('../pages/Profile/YourProfile'));
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

const BasicTables = React.lazy(
  () => import('../../dashboard/src/pages/Tables/BasicTables')
);

const OrderManagement = React.lazy(
  () => import('../../dashboard/src/pages/Forms/OrderManagement')
);
const BrandManagement = React.lazy(
  () => import('../../dashboard/src/pages/BrandManagement')
);

const DashboardHome = React.lazy(
  () => import('../../dashboard/src/pages/Dashboard/Home')
);

// Frontend pages (lazy load)
const HomePage = lazy(() => import('../pages/HomePage'));
const Blogs = lazy(() => import('../pages/Blogs'));
const Product = lazy(() => import('../pages/Product'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const YourOrder = lazy(() => import('../pages/YourOrder'));
const CartPage = lazy(() => import('../pages/Cart'));
const CheckoutPage = lazy(() => import('../pages/Checkout'));
const LoginForm = lazy(() => import('../pages/Login'));
const EmailConfirmForm = lazy(() => import('../pages/Otp-input'));
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
        <Route path="/orders" element={<YourOrder />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/company" element={<Company />} />
        <Route path="/account" element={<YourProfile />} />
        <Route path="/register" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/email-confirm" element={<EmailConfirmForm />} />

        {/* Dashboard Routes */}
        <Route path="/ad" element={<AppLayout />} />

        <Route path="/admin" element={<AppLayout />}>
          <Route
            index
            element={
              <ProtectedRoute
                element={<DashboardHome />}
                allowedRoles={[
                  'Admin',
                  'ProductManager',
                  'SaleManager',
                  'Staff',
                ]}
              />
            }
          />
          <Route path="your-profile" element={<YourProfile />} />
          {/* <Route
            path="profile"
            element={
              <ProtectedRoute
                element={<UserProfiles />}
                allowedRoles={['Admin', 'ProductManager', 'SaleManager']}
              />
            }
          /> */}
          {/* <Route
              path="calendar"
              element={
                <ProtectedRoute element={<Calendar />} allowedRoles={['Admin']} />
              }
            />
            <Route
              path="blank"
              element={
                <ProtectedRoute element={<Blank />} allowedRoles={['Admin']} />
              }
            />
            <Route
              path="form-elements"
              element={
                <ProtectedRoute
                  element={<FormElements />}
                  allowedRoles={['Admin']}
                />
              }
            /> */}
          <Route
            path="order-management"
            element={
              <ProtectedRoute
                element={<OrderManagement />}
                allowedRoles={['Admin', 'SaleManager']}
              />
            }
          />
          <Route
            path="product-features"
            element={
              <ProtectedRoute
                element={<ProductFeatures />}
                allowedRoles={['Admin', 'ProductManager']}
              />
            }
          />
          <Route
            path="brand-management"
            element={
              <ProtectedRoute
                element={<BrandManagement />}
                allowedRoles={['Admin', 'ProductManager']}
              />
            }
          />
          <Route
            path="user-management"
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowedRoles={['Admin']}
              />
            }
          />
          <Route
            path="basic-tables"
            element={
              <ProtectedRoute
                element={<BasicTables />}
                allowedRoles={['Admin']}
              />
            }
          />
          <Route
            path="alerts"
            element={
              <ProtectedRoute element={<Alerts />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="avatars"
            element={
              <ProtectedRoute element={<Avatars />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="badge"
            element={
              <ProtectedRoute element={<Badges />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="buttons"
            element={
              <ProtectedRoute element={<Buttons />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="images"
            element={
              <ProtectedRoute element={<Images />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="videos"
            element={
              <ProtectedRoute element={<Videos />} allowedRoles={['Admin']} />
            }
          />
          <Route
            path="line-chart"
            element={
              <ProtectedRoute
                element={<LineChart />}
                allowedRoles={['Admin']}
              />
            }
          />
          <Route
            path="bar-chart"
            element={
              <ProtectedRoute element={<BarChart />} allowedRoles={['Admin']} />
            }
          />
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
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  element: PropTypes.element.isRequired,
};

export default AppRoutes;
