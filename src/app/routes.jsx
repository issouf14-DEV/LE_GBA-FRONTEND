import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/guards';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import AdminLayout from '@/components/layout/AdminLayout';
import MainLayout from '@/components/layout/MainLayout';

// Chargement à la demande : chaque page devient un fichier JS séparé
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const VehicleDetail = lazy(() => import('@/pages/VehicleDetail'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Contact = lazy(() => import('@/pages/Contact'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Profile = lazy(() => import('@/pages/Profile'));
const MyOrders = lazy(() => import('@/pages/MyOrders'));
const OrderHistory = lazy(() => import('@/pages/OrderHistory'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageVehicles = lazy(() => import('@/pages/admin/ManageVehicles'));
const ManageOrders = lazy(() => import('@/pages/admin/ManageOrders'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const publicOnly = (page) => <PublicOnlyRoute>{page}</PublicOnlyRoute>;

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen fullScreen />}>
      <Routes>
        <Route path="/login" element={publicOnly(<Login />)} />
        <Route path="/register" element={publicOnly(<Register />)} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<MyOrders />} />
          <Route path="/client/orders" element={<MyOrders />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Route>

        <Route
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/vehicles" element={<ManageVehicles />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
