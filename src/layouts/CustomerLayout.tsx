import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  Heart,
  CreditCard,
  Lock,
  Bell,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerLayout: React.FC = () => {
  const { currentCustomer, brandSettings, notifications } = useStore();
  const unreadCount = notifications.filter(
    (n) => !n.read && (n.target === 'customer' || n.target === 'both')
  ).length;

  const accountLinks = [
    { label: 'Overview', path: '/account', icon: LayoutDashboard, end: true },
    { label: 'My Profile', path: '/account/profile', icon: User },
    { label: 'My Addresses', path: '/account/addresses', icon: MapPin },
    { label: 'My Orders', path: '/account/orders', icon: Package },
    { label: 'Saved Wishlist', path: '/account/wishlist', icon: Heart },
    { label: 'Payment History', path: '/account/payment-history', icon: CreditCard },
    { label: 'Change Password', path: '/account/change-password', icon: Lock },
    {
      label: 'Notifications',
      path: '/account/notifications',
      icon: Bell,
      badge: unreadCount,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#080808] flex flex-col">
      {/* Top Client Bar */}
      <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="font-serif text-xl tracking-[0.22em] uppercase font-semibold text-[#080808] whitespace-nowrap shrink-0"
          >
            {brandSettings.brandName}
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-[#777777]">
            <Link to="/shop" className="hover:text-[#080808] transition-colors whitespace-nowrap">
              Return to Storefront
            </Link>
            <Link to="/cart" className="hover:text-[#080808] transition-colors whitespace-nowrap">
              Shopping Bag
            </Link>
            <Link to="/admin" className="hover:text-[#080808] transition-colors whitespace-nowrap">
              Admin Console
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#777777] hidden sm:inline">
              {currentCustomer.fullName}
            </span>
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest border border-[#E5E5E5] px-3 py-1.5 hover:border-[#080808] transition-colors whitespace-nowrap"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Client Workspace */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-10 flex-1">
        <div className="mb-8 pb-6 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808] mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#080808]">
              Private Client Dossier
            </h1>
          </div>
          <p className="text-xs text-[#777777] tabular-nums">
            Client ID: {currentCustomer.id} · Member since {currentCustomer.joinedDate}
          </p>
        </div>

        {/* Horizontal Responsive Navigation for Mobile/Tablet */}
        <div className="lg:hidden mb-8 overflow-x-auto border-b border-[#E5E5E5] pb-2">
          <nav className="flex items-center gap-2">
            {accountLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-xs uppercase tracking-widest whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#080808] text-white'
                      : 'bg-[#F3F3F3] text-[#080808] hover:bg-[#E5E5E5]'
                  }`
                }
              >
                {item.label}
                {item.badge ? ` (${item.badge})` : ''}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Desktop Account Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="border border-[#E5E5E5] p-5 bg-[#F3F3F3]/50 mb-6">
              <p className="text-[11px] uppercase tracking-widest text-[#777777]">
                Authenticated Client
              </p>
              <p className="font-serif text-lg text-[#080808] mt-1">
                {currentCustomer.fullName}
              </p>
              <p className="text-xs text-[#777777] mt-0.5">{currentCustomer.email}</p>
            </div>

            <nav className="flex flex-col border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
              {accountLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3.5 text-xs uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-[#080808] text-white font-semibold'
                          : 'bg-white text-[#080808] hover:bg-[#F3F3F3]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="font-mono text-[11px] tabular-nums">({item.badge})</span>
                    ) : null}
                  </NavLink>
                );
              })}
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3.5 text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808] hover:bg-[#F3F3F3] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </nav>
          </aside>

          {/* Customer Account Content Outlet */}
          <section className="lg:col-span-9">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};
