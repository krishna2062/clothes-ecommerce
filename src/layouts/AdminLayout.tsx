import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  Boxes,
  ShoppingCart,
  CreditCard,
  Users,
  UserCog,
  ShieldCheck,
  TicketPercent,
  MessageSquareMore,
  Image,
  Truck,
  BarChart3,
  Bell,
  FileText,
  Building2,
  Wallet,
  History,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLayout: React.FC = () => {
  const { brandSettings, notifications, orders } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const unreadAlerts = notifications.filter(
    (n) => !n.read && (n.target === 'admin' || n.target === 'both')
  ).length;
  const pendingPayments = orders.filter(
    (o) => o.paymentStatus === 'Pending Verification'
  ).length;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Collections', path: '/admin/collections', icon: Layers },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    {
      label: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
      badge: pendingPayments,
    },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Staff', path: '/admin/staff', icon: UserCog },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
    { label: 'Coupons & Discounts', path: '/admin/coupons', icon: TicketPercent },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquareMore },
    { label: 'Banners', path: '/admin/banners', icon: Image },
    { label: 'Delivery Management', path: '/admin/delivery', icon: Truck },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    {
      label: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
      badge: unreadAlerts,
    },
    { label: 'Website Content', path: '/admin/content', icon: FileText },
    { label: 'Brand Settings', path: '/admin/settings/brand', icon: Building2 },
    { label: 'Payment Settings', path: '/admin/settings/payments', icon: Wallet },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  // Breadcrumb generator
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F3F3F3] text-[#080808] flex">
      {/* Desktop Sidebar (260px width) */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 bg-[#080808] text-white border-r border-[#222222] z-30">
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#222222]">
          <div>
            <Link
              to="/admin"
              className="font-serif text-base tracking-[0.2em] uppercase font-semibold text-white block"
            >
              {brandSettings.brandName}
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-[#777777] block">
              Atelier Administration
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 text-xs tracking-wide transition-colors ${
                    isActive
                      ? 'bg-white text-[#080808] font-semibold'
                      : 'text-[#CCCCCC] hover:bg-[#181818] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="font-mono text-[11px] tabular-nums px-1.5 py-0.5 bg-[#262626] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222222] text-xs text-[#999999] flex items-center justify-between">
          <div className="truncate">
            <p className="text-white font-medium truncate">Siddhartha Bhandari</p>
            <p className="text-[11px] text-[#777777]">Super Admin</p>
          </div>
          <Link
            to="/"
            className="text-xs text-white hover:underline flex items-center gap-1 shrink-0"
            title="View Live Storefront"
          >
            <span>Store</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Admin Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#080808] text-white h-full flex flex-col z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#222222]">
              <span className="font-serif text-base tracking-[0.2em] uppercase">
                {brandSettings.brandName} ADMIN
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 text-xs ${
                        isActive
                          ? 'bg-white text-[#080808] font-semibold'
                          : 'text-[#CCCCCC] hover:bg-[#181818]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="font-mono text-[11px] tabular-nums">{item.badge}</span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb Trail Left, 2 Primary Action Controls Right */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E5E5E5] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#080808]"
              aria-label="Toggle admin sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] truncate">
              {segments.map((seg, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span>/</span>}
                  <span
                    className={
                      i === segments.length - 1 ? 'text-[#080808] font-semibold truncate' : ''
                    }
                  >
                    {seg.replace(/-/g, ' ')}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/notifications"
              className="px-3 py-1.5 border border-[#E5E5E5] text-xs text-[#080808] hover:border-[#080808] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Alerts</span>
              <span className="font-mono tabular-nums">({unreadAlerts})</span>
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-[#080808] text-white text-xs uppercase tracking-widest hover:bg-[#222222] transition-colors whitespace-nowrap"
            >
              Live Storefront
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
