import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../data/mockData';
import { ResilientImage } from '../../components/product/ProductCard';

export const WishlistPage: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const { products, wishlist, toggleWishlist, moveWishlistToCart } = useStore();
  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className={isEmbedded ? '' : 'max-w-[1440px] mx-auto px-4 sm:px-8 py-12'}>
      <div className="pb-8 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Personal Curations
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Saved Wishlist ({savedProducts.length})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest underline underline-offset-4"
        >
          Explore Complete Catalog
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="my-12 border border-[#E5E5E5] bg-[#F3F3F3]/40 p-12 text-center space-y-4">
          <p className="font-serif text-2xl text-[#080808]">Your Wishlist is Currently Empty</p>
          <p className="text-xs text-[#777777] max-w-md mx-auto">
            Curate your seasonal wardrobe by saving garments and leather goods for private consideration.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#080808] text-white px-7 py-3.5 text-xs uppercase tracking-widest"
          >
            Discover New Arrivals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="border border-[#E5E5E5] bg-white flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/product/${product.slug}`}
                  className="aspect-[3/4] block bg-[#F3F3F3] overflow-hidden"
                >
                  <ResilientImage
                    src={product.mainImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#777777]">
                    <span>{product.category}</span>
                    <span>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-serif text-lg text-[#080808] block hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="font-mono text-sm font-semibold tabular-nums text-[#080808]">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveWishlistToCart(product)}
                  className="flex-1 bg-[#080808] text-white py-3 px-4 text-xs uppercase tracking-widest hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Move to Bag</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 border border-[#E5E5E5] text-[#777777] hover:text-[#080808] hover:border-[#080808] transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
  } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'Percentage'
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;
  const deliveryFee = subtotal >= 25000 || subtotal === 0 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCouponCode(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12">
      <div className="pb-8 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Order Preparation
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
            Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest underline underline-offset-4"
        >
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="my-12 border border-[#E5E5E5] bg-[#F3F3F3]/40 p-12 text-center space-y-4">
          <p className="font-serif text-2xl text-[#080808]">Your Shopping Bag is Empty</p>
          <p className="text-xs text-[#777777] max-w-md mx-auto">
            Explore our Autumn / Winter 2026 Monolith collection or transfer saved garments from your wishlist.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/shop"
              className="bg-[#080808] text-white px-7 py-3.5 text-xs uppercase tracking-widest"
            >
              Shop Collection
            </Link>
            <Link
              to="/wishlist"
              className="border border-[#080808] text-[#080808] px-7 py-3.5 text-xs uppercase tracking-widest"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Left: Itemized Garments Table */}
          <div className="lg:col-span-8 divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-24 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] shrink-0 overflow-hidden"
                  >
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="space-y-1.5">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif text-lg text-[#080808] hover:underline block"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#777777]">
                      <span>Size: {item.size}</span>
                      <span>·</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <p className="text-xs font-mono tabular-nums text-[#080808] pt-1">
                      Unit Price: {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#E5E5E5]">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="p-2.5 hover:bg-[#F3F3F3]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-4 text-xs font-mono tabular-nums font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="p-2.5 hover:bg-[#F3F3F3]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[110px]">
                    <p className="text-sm font-mono font-semibold tabular-nums text-[#080808]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="p-2 text-[#777777] hover:text-[#080808]"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary & Privilege Code */}
          <div className="lg:col-span-4">
            <div className="border border-[#E5E5E5] bg-[#F3F3F3]/40 p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-4">
                Order Summary
              </h2>

              {/* Privilege Coupon Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#777777] block">
                  Privilege / Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white border border-[#080808] px-3.5 py-2.5 text-xs">
                    <div className="flex items-center gap-2 font-mono font-semibold">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{appliedCoupon.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs underline text-[#777777] hover:text-[#080808]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Try ATELIER3000 or PRIVATE10"
                      className="flex-1 bg-white border border-[#E5E5E5] px-3 py-2.5 text-xs text-[#080808] placeholder-[#777777] focus:outline-none focus:border-[#080808]"
                    />
                    <button
                      type="submit"
                      className="bg-[#080808] text-white px-4 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#E5E5E5] text-xs tabular-nums">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Privilege Discount</span>
                  <span className="font-mono">
                    {discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : 'NPR 0'}
                  </span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>White-Glove Courier Delivery</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? 'Complimentary' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#080808] flex justify-between items-baseline text-sm font-semibold text-[#080808]">
                  <span className="uppercase tracking-widest">Grand Total</span>
                  <span className="font-mono text-lg">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-[#777777] leading-relaxed text-center">
                Complimentary archival garment bag and white-glove delivery on orders above NPR 25,000.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
