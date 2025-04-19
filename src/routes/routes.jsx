import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingRoute from '../components/LoadingRoute/LoadingRoute';

// Component bảo vệ route dựa trên role
const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || '';

  if (!role) {
    return <Navigate to="/Signin" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
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
const Calendar = React.lazy(() => import('../../dashboard/src/pages/Calendar'));
const BasicTables = React.lazy(
  () => import('../../dashboard/src/pages/Tables/BasicTables')
);
const FormElements = React.lazy(
  () => import('../../dashboard/src/pages/Forms/FormElements')
);
const OrderManagement = React.lazy(
  () => import('../../dashboard/src/pages/Forms/OrderManagement')
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
const YourOrder = lazy(() => import('../pages/YourOrder'));
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

        {/* Dashboard Routes */}
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<ProtectedRoute element={<DashboardHome />} allowedRoles={['admin', 'product_manager', 'sale_manager']} />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute
                element={<UserProfiles />}
                allowedRoles={['admin', 'product_manager', 'sale_manager']}
              />
            }
          />
          <Route
            path="calendar"
            element={
              <ProtectedRoute
                element={<Calendar />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="blank"
            element={
              <ProtectedRoute
                element={<Blank />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="form-elements"
            element={
              <ProtectedRoute
                element={<FormElements />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="order-management"
            element={
              <ProtectedRoute
                element={<OrderManagement />}
                allowedRoles={['admin', 'sale_manager']}
              />
            }
          />
          <Route
            path="product-features"
            element={
              <ProtectedRoute
                element={<ProductFeatures />}
                allowedRoles={['admin', 'product_manager']}
              />
            }
          />
          <Route
            path="user-management"
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="basic-tables"
            element={
              <ProtectedRoute
                element={<BasicTables />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="alerts"
            element={
              <ProtectedRoute
                element={<Alerts />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="avatars"
            element={
              <ProtectedRoute
                element={<Avatars />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="badge"
            element={
              <ProtectedRoute
                element={<Badges />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="buttons"
            element={
              <ProtectedRoute
                element={<Buttons />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="images"
            element={
              <ProtectedRoute
                element={<Images />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="videos"
            element={
              <ProtectedRoute
                element={<Videos />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="line-chart"
            element={
              <ProtectedRoute
                element={<LineChart />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="bar-chart"
            element={
              <ProtectedRoute
                element={<BarChart />}
                allowedRoles={['admin']}
              />
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

export default AppRoutes;