import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard, ResilientImage } from '../../components/product/ProductCard';
import { IMG_HERO, IMG_ATELIER } from '../../data/mockData';

export const HomePage: React.FC = () => {
  const { products, categories, brandSettings, showToast } = useStore();
  const [activeFeedTab, setActiveFeedTab] = useState<'new' | 'featured' | 'bestsellers'>('new');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const displayedProducts = products
    .filter((p) => {
      if (p.status !== 'Published') return false;
      if (activeFeedTab === 'new') return p.newArrival;
      if (activeFeedTab === 'featured') return p.featured;
      return p.bestSeller;
    })
    .slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(
      'Private Invitation Registered',
      `${newsletterEmail} added to our Autumn / Winter 2026 lookbook registry.`,
      'success'
    );
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-24 pb-12">
      {/* SECTION 1: Editorial Hero Campaign */}
      <section className="relative bg-[#080808] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[640px] lg:min-h-[740px]">
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10 bg-[#080808]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-[#999999]">
                Collection 04 · Autumn / Winter 2026
              </p>
              <div className="w-10 h-px bg-white/30" />
            </div>

            <div className="my-10 space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-white">
                Architectural Forms in Double-Faced Wool.
              </h1>
              <p className="text-sm text-[#CCCCCC] leading-relaxed max-w-md">
                {brandSettings.tagline} Precision unisex outerwear, concealed-placket mulberry silk poplins, and 5-gauge Inner Mongolian cashmere.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="bg-white text-[#080808] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E5E5E5] transition-colors inline-flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/collections/unisex"
                  className="border border-white/40 text-white px-6 py-3.5 text-xs uppercase tracking-[0.2em] hover:border-white transition-colors whitespace-nowrap"
                >
                  Unisex Monolith
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-xs">
              <div>
                <p className="font-mono tabular-nums text-white font-semibold">580 GSM</p>
                <p className="text-[11px] text-[#999999] mt-0.5">RWS Italian Wool</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-white font-semibold">15.2 Micron</p>
                <p className="text-[11px] text-[#999999] mt-0.5">Grade-A Cashmere</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-white font-semibold">100% Traceable</p>
                <p className="text-[11px] text-[#999999] mt-0.5">Atelier Numbered</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-full">
            <ResilientImage
              src={IMG_HERO}
              alt="Autumn Winter 2026 Editorial Campaign"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#080808] lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-6 right-6 bg-[#080808]/90 border border-white/20 px-4 py-3 text-xs text-white max-w-xs">
              <p className="uppercase tracking-widest text-[10px] text-[#999999]">Look 01 & 02</p>
              <p className="font-serif text-sm mt-0.5">
                Architectural Virgin Wool Overcoat & Concealed Silk Poplin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Curated Collection Showcase (Interactive Segmented Filter for New Arrivals / Featured / Best Sellers) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E5E5]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
              Seasonal Wardrobe
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
              Curated Atelier Releases
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFeedTab('new')}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeFeedTab === 'new'
                  ? 'bg-[#080808] text-white'
                  : 'bg-[#F3F3F3] text-[#777777] hover:text-[#080808]'
              }`}
            >
              New Arrivals
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('featured')}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeFeedTab === 'featured'
                  ? 'bg-[#080808] text-white'
                  : 'bg-[#F3F3F3] text-[#777777] hover:text-[#080808]'
              }`}
            >
              Featured Pieces
            </button>
            <button
              type="button"
              onClick={() => setActiveFeedTab('bestsellers')}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeFeedTab === 'bestsellers'
                  ? 'bg-[#080808] text-white'
                  : 'bg-[#F3F3F3] text-[#777777] hover:text-[#080808]'
              }`}
            >
              Best Sellers
            </button>
            <Link
              to="/shop"
              className="ml-2 text-xs uppercase tracking-widest text-[#080808] underline underline-offset-4 hover:text-[#777777] whitespace-nowrap"
            >
              View All ({products.length})
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pt-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Shop By Category & Gender Architecture */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E5E5E5]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
              Sartorial Taxonomy
            </p>
            <h2 className="font-serif text-3xl text-[#080808] mt-1">
              Explore by Category
            </h2>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
            <Link to="/collections/men" className="hover:underline underline-offset-4">
              Men&apos;s Edit
            </Link>
            <Link to="/collections/women" className="hover:underline underline-offset-4">
              Women&apos;s Edit
            </Link>
            <Link to="/collections/unisex" className="hover:underline underline-offset-4">
              Unisex Edit
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group block border border-[#E5E5E5] bg-white overflow-hidden"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#F3F3F3] relative">
                <ResilientImage
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg">{cat.name}</h3>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-[11px] text-[#CCCCCC] mt-1 font-mono tabular-nums">
                    {cat.productCount} Pieces
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: Fashion Campaign & Atelier Brand Story + Newsletter */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="border border-[#E5E5E5] bg-[#F3F3F3] grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 min-h-[380px]">
            <ResilientImage
              src={IMG_ATELIER}
              alt="The Atelier Craftsmanship"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
                01. The House Philosophy
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#080808] leading-snug">
                Restraint as the Highest Form of Craft.
              </h2>
              <p className="text-sm text-[#777777] leading-relaxed">
                Every garment begins in our flagship atelier with single-origin natural fibers—RWS-certified Italian virgin wool, grade-A Inner Mongolian cashmere, and long-staple organic mulberry silk. We reject seasonal obsolescence in favor of numbered, repairable permanence.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#080808] border-b border-[#080808] pb-1"
                >
                  <span>Read Our Manifesto</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/size-guide"
                  className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808]"
                >
                  Bespoke Size Guide
                </Link>
              </div>
            </div>

            {/* Embedded Newsletter Subscription */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#080808]">
                Private Lookbook & Trunk Show Registry
              </p>
              <p className="text-xs text-[#777777] mt-1">
                Subscribe for early entry to archival releases and private showroom appointments.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] placeholder-[#777777] focus:outline-none focus:border-[#080808]"
                />
                <button
                  type="submit"
                  className="bg-[#080808] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#222222] transition-colors whitespace-nowrap"
                >
                  Join Registry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
