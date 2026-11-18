/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ToastContainer } from './components/common/ToastContainer';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CatalogPage } from './pages/public/CatalogPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { WishlistPage, CartPage } from './pages/public/WishlistAndCartPages';
import { CheckoutPage, OrderConfirmationPage } from './pages/public/CheckoutAndSuccessPages';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  SizeGuidePage,
  PolicyPage,
} from './pages/public/InfoAndPolicyPages';

// Auth Pages
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from './pages/auth/AuthPages';

// Customer Account Pages
import {
  AccountOverviewPage,
  AccountProfilePage,
  AccountAddressesPage,
  AccountOrdersPage,
  AccountOrderDetailPage,
  AccountWishlistPage,
  AccountPaymentHistoryPage,
  AccountChangePasswordPage,
  AccountNotificationsPage,
} from './pages/customer/CustomerAccountPages';

// Admin Dashboard Pages
import {
  AdminOverviewPage,
  AdminProductsPage,
  AdminProductFormPage,
  AdminCategoriesPage,
  AdminCollectionsPage,
  AdminInventoryPage,
} from './pages/admin/AdminCatalogPages';
import {
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminPaymentsPage,
  AdminCustomersPage,
  AdminCustomerDetailPage,
  AdminStaffPage,
  AdminStaffFormPage,
  AdminRolesPage,
} from './pages/admin/AdminOperationsPages';
import {
  AdminCouponsPage,
  AdminReviewsPage,
  AdminBannersPage,
  AdminDeliveryPage,
  AdminReportsPage,
  AdminNotificationsPage,
  AdminContentPage,
  AdminBrandSettingsPage,
  AdminPaymentSettingsPage,
  AdminAuditLogsPage,
} from './pages/admin/AdminSystemPages';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ToastContainer />
        <Routes>
          {/* A. PUBLIC CUSTOMER WEBSITE (22 Routes) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CatalogPage presetMode="all" />} />
            <Route path="/collections/men" element={<CatalogPage presetMode="men" />} />
            <Route path="/collections/women" element={<CatalogPage presetMode="women" />} />
            <Route path="/collections/unisex" element={<CatalogPage presetMode="unisex" />} />
            <Route path="/new-arrivals" element={<CatalogPage presetMode="new-arrivals" />} />
            <Route path="/best-sellers" element={<CatalogPage presetMode="best-sellers" />} />
            <Route path="/sale" element={<CatalogPage presetMode="sale" />} />
            <Route path="/category/:slug" element={<CatalogPage presetMode="category" />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/shipping-policy" element={<PolicyPage type="shipping" />} />
            <Route path="/return-policy" element={<PolicyPage type="return" />} />
            <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
            <Route path="/terms" element={<PolicyPage type="terms" />} />
          </Route>

          {/* CUSTOMER AUTHENTICATION PAGES (5 Routes) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* B. AUTHENTICATED CUSTOMER ACCOUNT DASHBOARD (9 Routes) */}
          <Route path="/account" element={<CustomerLayout />}>
            <Route index element={<AccountOverviewPage />} />
            <Route path="profile" element={<AccountProfilePage />} />
            <Route path="addresses" element={<AccountAddressesPage />} />
            <Route path="orders" element={<AccountOrdersPage />} />
            <Route path="orders/:id" element={<AccountOrderDetailPage />} />
            <Route path="wishlist" element={<AccountWishlistPage />} />
            <Route path="payment-history" element={<AccountPaymentHistoryPage />} />
            <Route path="change-password" element={<AccountChangePasswordPage />} />
            <Route path="notifications" element={<AccountNotificationsPage />} />
          </Route>

          {/* C. ADMIN DASHBOARD — COMPLETE APPLICATION (26 Routes) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/create" element={<AdminProductFormPage />} />
            <Route path="products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="collections" element={<AdminCollectionsPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="staff/create" element={<AdminStaffFormPage />} />
            <Route path="staff/:id/edit" element={<AdminStaffFormPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="delivery" element={<AdminDeliveryPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="settings/brand" element={<AdminBrandSettingsPage />} />
            <Route path="settings/payments" element={<AdminPaymentSettingsPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
