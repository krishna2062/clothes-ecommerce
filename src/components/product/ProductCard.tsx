import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../data/mockData';
import { useStore } from '../../context/StoreContext';

export const ResilientImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F3F3F3] text-[#777777] p-6 text-center ${className}`}
      >
        <span className="font-serif text-sm tracking-widest uppercase text-[#080808]">
          MAISON VÉRA
        </span>
        <span className="text-xs mt-1 text-[#777777] line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.mainImage,
      size: product.sizes[0] || 'M',
      color: product.colors[0]?.name || 'Obsidian Black',
      unitPrice: product.sellingPrice,
      originalPrice: product.originalPrice,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group flex flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F3F3] block"
      >
        <ResilientImage
          src={product.mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />

        {/* Subtle Top Left Status Text (Max 1 unboxed editorial tag) */}
        <div className="absolute top-3 left-3">
          {product.onSale ? (
            <span className="bg-[#080808] text-white text-[11px] tracking-widest uppercase px-2.5 py-1 font-medium">
              -{product.discountPercent}%
            </span>
          ) : product.newArrival ? (
            <span className="bg-white/90 text-[#080808] text-[11px] tracking-widest uppercase px-2.5 py-1 font-medium">
              New Release
            </span>
          ) : null}
        </div>

        {/* Wishlist Trigger */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center bg-white/90 text-[#080808] hover:bg-[#080808] hover:text-white transition-colors duration-150"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Bar on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-[#080808]/95 text-white text-xs uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#080808] transition-colors whitespace-nowrap"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Quick Add ({product.sizes[0]})</span>
          </button>
        </div>
      </Link>

      {/* Clean Unboxed Metadata below image */}
      <div className="pt-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#777777]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.collection}</span>
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="mt-1 block text-sm font-medium text-[#080808] hover:underline underline-offset-4 line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-1.5 flex items-baseline gap-2.5 tabular-nums text-sm">
          <span className="font-semibold text-[#080808]">
            {formatCurrency(product.sellingPrice)}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <span className="text-xs text-[#777777] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
