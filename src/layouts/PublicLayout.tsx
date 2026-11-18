import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PublicLayout: React.FC = () => {
  const { cart, wishlist, brandSettings, showToast } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const navigate = useNavigate();

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(
      'Subscribed to Private Dispatch',
      `Confirmation sent to ${newsletterEmail}.`,
      'success'
    );
    setNewsletterEmail('');
  };

  const navItems = [
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Men', path: '/collections/men' },
    { label: 'Women', path: '/collections/women' },
    { label: 'Unisex', path: '/collections/unisex' },
    { label: 'Shop All', path: '/shop' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#080808]">
      {/* Announcement Bar (<= 36px height) */}
      {brandSettings.announcementBarActive && (
        <div className="bg-[#080808] text-white text-[11px] tracking-[0.18em] uppercase py-2 px-4 text-center">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <span className="hidden md:inline text-[#777777]">ATELIER EDITION 2026</span>
            <span className="mx-auto truncate">{brandSettings.announcementBarText}</span>
            <Link
              to="/admin"
              className="hidden md:inline text-[#CCCCCC] hover:text-white underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Admin Console
            </Link>
          </div>
        </div>
      )}

      {/* Main Header — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element Brand Wordmark */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#080808]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/"
              className="font-serif text-xl sm:text-2xl tracking-[0.22em] uppercase font-semibold text-[#080808] whitespace-nowrap shrink-0"
            >
              {brandSettings.brandName}
            </Link>
          </div>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.16em] font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#080808] border-b border-[#080808]'
                      : 'text-[#777777] hover:text-[#080808]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Storefront Utility Actions */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-1.5 text-[#080808] hover:text-[#777777] transition-colors"
              aria-label="Search catalog"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/account"
              className="p-1.5 text-[#080808] hover:text-[#777777] transition-colors"
              aria-label="Customer account"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              to="/wishlist"
              className="p-1.5 text-[#080808] hover:text-[#777777] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && (
                <span className="ml-1 text-[11px] font-mono tabular-nums text-[#777777]">
                  ({wishlist.length})
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1.5 bg-[#080808] text-white px-3.5 py-2 text-xs uppercase tracking-widest hover:bg-[#222222] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono tabular-nums">({totalBagCount})</span>
            </Link>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E5E5E5] bg-[#F3F3F3] px-4 sm:px-8 py-4">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto flex items-center gap-3"
            >
              <Search className="h-4 w-4 text-[#777777] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garments by title, fabric (e.g. cashmere, virgin wool, silk), or SKU..."
                className="w-full bg-transparent text-sm text-[#080808] placeholder-[#777777] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#080808] text-white text-xs uppercase tracking-widest px-4 py-2 whitespace-nowrap"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 text-[#777777] hover:text-[#080808]"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5]">
                <span className="font-serif text-lg tracking-[0.2em] uppercase font-semibold">
                  {brandSettings.brandName}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#080808]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-[0.15em] font-medium text-[#080808] py-1.5 border-b border-[#F3F3F3]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/best-sellers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] font-medium text-[#080808] py-1.5 border-b border-[#F3F3F3]"
                >
                  Best Sellers
                </Link>
                <Link
                  to="/sale"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] font-medium text-[#080808] py-1.5 border-b border-[#F3F3F3]"
                >
                  Archival Sale
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] font-medium text-[#777777] py-1.5"
                >
                  The House / About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] font-medium text-[#777777] py-1.5"
                >
                  Client Concierge
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E5E5] flex flex-col gap-3">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full border border-[#080808] text-[#080808] text-xs uppercase tracking-widest py-3 px-4 text-center"
              >
                Client Account
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#F3F3F3] text-[#080808] text-xs uppercase tracking-widest py-3 px-4 text-center"
              >
                Sign In / Register
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#080808] text-white text-xs uppercase tracking-widest py-3 px-4 text-center flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Luxury Editorial Footer */}
      <footer className="bg-[#080808] text-white border-t border-[#222222] mt-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#222222]">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <Link
                to="/"
                className="font-serif text-2xl tracking-[0.22em] uppercase font-semibold block"
              >
                {brandSettings.brandName}
              </Link>
              <p className="text-xs text-[#999999] leading-relaxed max-w-sm">
                {brandSettings.description}
              </p>
              <div className="pt-2 text-xs text-[#999999] space-y-1">
                <p>{brandSettings.flagshipAddress}</p>
                <p className="tabular-nums">
                  {brandSettings.contactPhone} · {brandSettings.contactEmail}
                </p>
              </div>
            </div>

            {/* Collections Column */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold">
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-[#999999]">
                <li>
                  <Link to="/new-arrivals" className="hover:text-white transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/collections/men" className="hover:text-white transition-colors">
                    Men&apos;s Collection
                  </Link>
                </li>
                <li>
                  <Link to="/collections/women" className="hover:text-white transition-colors">
                    Women&apos;s Collection
                  </Link>
                </li>
                <li>
                  <Link to="/collections/unisex" className="hover:text-white transition-colors">
                    Unisex Monolith
                  </Link>
                </li>
                <li>
                  <Link to="/best-sellers" className="hover:text-white transition-colors">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link to="/sale" className="hover:text-white transition-colors">
                    Archival Sale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Client Services Column */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold">
                Client Services
              </h4>
              <ul className="space-y-2.5 text-xs text-[#999999]">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About The House
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Concierge
                  </Link>
                </li>
                <li>
                  <Link to="/size-guide" className="hover:text-white transition-colors">
                    Size & Fit Guide
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-white transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-white transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold">
                Private Atelier Dispatch
              </h4>
              <p className="text-xs text-[#999999] leading-relaxed">
                Receive priority access to numbered seasonal releases, private showroom trunk shows, and archival editions.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex border-b border-white pb-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-xs text-white placeholder-[#777777] focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-xs uppercase tracking-widest text-white flex items-center gap-1.5 hover:text-[#CCCCCC] whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="pt-3 flex flex-wrap items-center gap-4 text-[11px] text-[#777777] uppercase tracking-wider">
                <span>eSewa</span>
                <span>·</span>
                <span>Khalti</span>
                <span>·</span>
                <span>Fonepay QR</span>
                <span>·</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
            <p>© {new Date().getFullYear()} {brandSettings.brandName}. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Client Login
              </Link>
              <Link to="/admin" className="hover:text-white transition-colors text-white underline underline-offset-4">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
