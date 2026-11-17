import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProductListPage from '../pages/products/ProductListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import ProductFormPage from '../pages/products/ProductFormPage';
import CategoryPage from '../pages/categories/CategoryPage';
import CartPage from '../pages/orders/CartPage';
import OrderListPage from '../pages/orders/OrderListPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import StockPage from '../pages/stock/StockPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']} />}>
              <Route index element={<ProductFormPage />} />
            </Route>
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']} />}>
              <Route index element={<ProductFormPage />} />
            </Route>
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/stock" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']} />}>
              <Route index element={<StockPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}