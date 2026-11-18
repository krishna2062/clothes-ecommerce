import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { IMG_HERO } from '../data/mockData';
import { ResilientImage } from '../components/product/ProductCard';

export const AuthLayout: React.FC = () => {
  const { brandSettings } = useStore();

  return (
    <div className="min-h-screen bg-white text-[#080808] grid grid-cols-1 lg:grid-cols-12 items-stretch">
      {/* Left Column: High-Contrast Monochrome Fashion Campaign */}
      <div className="hidden lg:block lg:col-span-6 relative bg-[#080808] overflow-hidden">
        <ResilientImage
          src={IMG_HERO}
          alt="Luxury Atelier Campaign"
          className="h-full w-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-12 text-white">
          <Link
            to="/"
            className="font-serif text-2xl tracking-[0.22em] uppercase font-semibold"
          >
            {brandSettings.brandName}
          </Link>
          <div className="max-w-md space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#CCCCCC]">
              Private Client Membership
            </p>
            <h2 className="font-serif text-3xl leading-snug">
              Architectural tailoring, archival curation, and bespoke order tracking.
            </h2>
            <p className="text-xs text-[#CCCCCC] leading-relaxed">
              Access your personal measurements, saved lookbook pieces, and verified eSewa, Khalti, and Fonepay transaction receipts.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form Viewport */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <Link
            to="/"
            className="lg:hidden font-serif text-lg tracking-[0.2em] uppercase font-semibold"
          >
            {brandSettings.brandName}
          </Link>
        </div>

        <div className="my-auto py-12 max-w-md w-full mx-auto">
          <Outlet />
        </div>

        <div className="text-xs text-[#777777] flex items-center justify-between border-t border-[#E5E5E5] pt-6">
          <span>© {new Date().getFullYear()} {brandSettings.brandName}</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#080808]">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#080808]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
