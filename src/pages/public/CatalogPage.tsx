import React, { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/product/ProductCard';
import { GenderCollection } from '../../types';

interface CatalogPageProps {
  presetMode?:
    | 'all'
    | 'men'
    | 'women'
    | 'unisex'
    | 'new-arrivals'
    | 'best-sellers'
    | 'sale'
    | 'category';
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ presetMode = 'all' }) => {
  const { products, categories } = useStore();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const activeCategoryObj = useMemo(() => {
    if (presetMode === 'category' && slug) {
      return categories.find((c) => c.slug === slug);
    }
    return undefined;
  }, [presetMode, slug, categories]);

  const pageMeta = useMemo(() => {
    switch (presetMode) {
      case 'men':
        return {
          title: "Men's Collection",
          subtitle: 'Structured worsted wool tailoring, overcoats, and fine merino knitwear.',
          breadcrumb: 'Men',
        };
      case 'women':
        return {
          title: "Women's Collection",
          subtitle: 'Fluid silk poplin shirting, heavy-gauge cashmere, and architectural coats.',
          breadcrumb: 'Women',
        };
      case 'unisex':
        return {
          title: 'Unisex Monolith Collection',
          subtitle: 'Gender-neutral proportions crafted from Italian virgin wool and Box calfskin.',
          breadcrumb: 'Unisex',
        };
      case 'new-arrivals':
        return {
          title: 'New Arrivals — Autumn / Winter 2026',
          subtitle: 'The latest numbered releases from our Milan and Kathmandu ateliers.',
          breadcrumb: 'New Arrivals',
        };
      case 'best-sellers':
        return {
          title: 'House Best Sellers',
          subtitle: 'Our most sought-after foundational tailoring and leather goods.',
          breadcrumb: 'Best Sellers',
        };
      case 'sale':
        return {
          title: 'Archival Sale Collection',
          subtitle: 'Selected past-season editions and studio pieces at privileged archival pricing.',
          breadcrumb: 'Sale',
        };
      case 'category':
        return {
          title: activeCategoryObj?.name || 'Category Collection',
          subtitle:
            activeCategoryObj?.description ||
            'Curated garments crafted from traceable natural fibers.',
          breadcrumb: activeCategoryObj?.name || slug || 'Category',
        };
      default:
        return {
          title: 'Complete Atelier Catalog',
          subtitle:
            'Explore every garment and leather object across our Permanent and Monolith lines.',
          breadcrumb: 'Shop All',
        };
    }
  }, [presetMode, activeCategoryObj, slug]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE'];
  const allColors = [
    'Obsidian Black',
    'Chalk White',
    'Anthracite Grey',
    'Slate Charcoal',
    'Bone Ivory',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'Published') return false;

        // Preset route constraint
        if (presetMode === 'men' && p.collection !== 'Men' && p.collection !== 'Unisex')
          return false;
        if (presetMode === 'women' && p.collection !== 'Women' && p.collection !== 'Unisex')
          return false;
        if (presetMode === 'unisex' && p.collection !== 'Unisex') return false;
        if (presetMode === 'new-arrivals' && !p.newArrival) return false;
        if (presetMode === 'best-sellers' && !p.bestSeller) return false;
        if (presetMode === 'sale' && !p.onSale) return false;
        if (presetMode === 'category' && slug && p.categorySlug !== slug) return false;

        // User Filters
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (selectedCategory !== 'ALL' && p.categorySlug !== selectedCategory) return false;
        if (
          selectedGender !== 'ALL' &&
          p.collection !== (selectedGender as GenderCollection)
        )
          return false;
        if (selectedSize !== 'ALL' && !p.sizes.includes(selectedSize)) return false;
        if (
          selectedColor !== 'ALL' &&
          !p.colors.some((c) => c.name === selectedColor)
        )
          return false;
        if (p.sellingPrice > maxPrice) return false;
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
        return Number(b.featured) - Number(a.featured);
      });
  }, [
    products,
    presetMode,
    slug,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedSize,
    selectedColor,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedGender('ALL');
    setSelectedSize('ALL');
    setSelectedColor('ALL');
    setMaxPrice(60000);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const FilterPanelContent = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <span className="text-xs uppercase tracking-[0.18em] font-semibold">
          Filter Catalog
        </span>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs text-[#777777] hover:text-[#080808] inline-flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      {presetMode !== 'category' && (
        <div className="space-y-2.5">
          <p className="text-xs uppercase tracking-widest font-medium text-[#080808]">
            Category
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className={`block text-xs w-full text-left py-1 ${
                selectedCategory === 'ALL'
                  ? 'text-[#080808] font-semibold underline underline-offset-4'
                  : 'text-[#777777] hover:text-[#080808]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setCurrentPage(1);
                }}
                className={`block text-xs w-full text-left py-1 ${
                  selectedCategory === cat.slug
                    ? 'text-[#080808] font-semibold underline underline-offset-4'
                    : 'text-[#777777] hover:text-[#080808]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collection / Gender Filter */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-widest font-medium text-[#080808]">
          Collection
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Men', 'Women', 'Unisex'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setSelectedGender(g);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                selectedGender === g
                  ? 'bg-[#080808] text-white border-[#080808]'
                  : 'bg-white text-[#080808] border-[#E5E5E5] hover:border-[#080808]'
              }`}
            >
              {g === 'ALL' ? 'All' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-widest font-medium text-[#080808]">
            Max Price
          </span>
          <span className="font-mono tabular-nums text-[#080808]">
            NPR {maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={15000}
          max={60000}
          step={2500}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full accent-[#080808] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#777777] font-mono tabular-nums">
          <span>NPR 15,000</span>
          <span>NPR 60,000</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-widest font-medium text-[#080808]">
          Size
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedSize('ALL');
              setCurrentPage(1);
            }}
            className={`py-1.5 text-xs border text-center ${
              selectedSize === 'ALL'
                ? 'bg-[#080808] text-white border-[#080808]'
                : 'border-[#E5E5E5] text-[#080808] hover:border-[#080808]'
            }`}
          >
            All
          </button>
          {allSizes.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                setSelectedSize(sz);
                setCurrentPage(1);
              }}
              className={`py-1.5 text-xs border text-center ${
                selectedSize === sz
                  ? 'bg-[#080808] text-white border-[#080808]'
                  : 'border-[#E5E5E5] text-[#080808] hover:border-[#080808]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-widest font-medium text-[#080808]">
          Color Palette
        </p>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedColor('ALL');
              setCurrentPage(1);
            }}
            className={`block text-xs w-full text-left py-1 ${
              selectedColor === 'ALL'
                ? 'text-[#080808] font-semibold underline underline-offset-4'
                : 'text-[#777777] hover:text-[#080808]'
            }`}
          >
            All Tones
          </button>
          {allColors.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => {
                setSelectedColor(col);
                setCurrentPage(1);
              }}
              className={`block text-xs w-full text-left py-1 ${
                selectedColor === col
                  ? 'text-[#080808] font-semibold underline underline-offset-4'
                  : 'text-[#777777] hover:text-[#080808]'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <label className="flex items-center gap-2.5 text-xs text-[#080808] cursor-pointer pt-2 border-t border-[#E5E5E5]">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => {
            setInStockOnly(e.target.checked);
            setCurrentPage(1);
          }}
          className="accent-[#080808] h-4 w-4"
        />
        <span>In-Stock Ready to Ship Only</span>
      </label>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10">
      {/* Breadcrumbs & Header */}
      <div className="pb-8 border-b border-[#E5E5E5]">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] mb-3">
          <Link to="/" className="hover:text-[#080808]">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#080808]">
            Catalog
          </Link>
          {presetMode !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#080808]">{pageMeta.breadcrumb}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#080808]">
              {pageMeta.title}
            </h1>
            <p className="text-sm text-[#777777] mt-2 max-w-2xl">{pageMeta.subtitle}</p>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#777777] font-mono tabular-nums shrink-0">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
          </p>
        </div>
      </div>

      {/* Toolbar: Search, Mobile Filter Trigger, Sort Dropdown */}
      <div className="py-5 border-b border-[#E5E5E5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by garment name, wool, silk, SKU..."
              className="w-full border border-[#E5E5E5] pl-10 pr-4 py-2.5 text-xs text-[#080808] placeholder-[#777777] focus:outline-none focus:border-[#080808]"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden border border-[#080808] px-4 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-xs uppercase tracking-widest text-[#777777] whitespace-nowrap">
            Sort By:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          >
            <option value="featured">Editorial Featured</option>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Layout Grid: Desktop Filter Sidebar + 3-Col Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
        <aside className="hidden lg:block lg:col-span-3">
          <FilterPanelContent />
        </aside>

        <div className="lg:col-span-9">
          {paginatedProducts.length === 0 ? (
            <div className="border border-[#E5E5E5] bg-[#F3F3F3]/40 p-12 text-center space-y-4">
              <p className="font-serif text-xl text-[#080808]">
                No Garments Match Your Current Selection
              </p>
              <p className="text-xs text-[#777777] max-w-md mx-auto">
                Adjust your price threshold, size, or category filters to view available pieces from our collection.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-[#080808] text-white px-6 py-3 text-xs uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-[#E5E5E5] flex items-center justify-between">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-[#E5E5E5] text-xs uppercase tracking-widest disabled:opacity-40 hover:border-[#080808]"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 flex items-center justify-center border ${
                          currentPage === page
                            ? 'bg-[#080808] text-white border-[#080808]'
                            : 'border-[#E5E5E5] text-[#080808] hover:border-[#080808]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 border border-[#E5E5E5] text-xs uppercase tracking-widest disabled:opacity-40 hover:border-[#080808]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E5]">
                <span className="font-serif text-lg">Refine Selection</span>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanelContent />
            </div>
            <div className="pt-6 mt-6 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#080808] text-white py-3 text-xs uppercase tracking-widest"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
