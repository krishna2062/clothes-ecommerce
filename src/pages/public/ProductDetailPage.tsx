import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Ruler,
  X,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../data/mockData';
import { ProductCard, ResilientImage } from '../../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, wishlist, toggleWishlist, reviews } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Obsidian Black'
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  useEffect(() => {
    setSelectedImage(product.mainImage);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Obsidian Black');
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === 'Published')
    .slice(0, 4);
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'Approved'
  );

  const handleAddToBag = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.mainImage,
      size: selectedSize,
      color: selectedColor,
      unitPrice: product.sellingPrice,
      originalPrice: product.originalPrice,
      quantity,
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] mb-8">
        <Link to="/" className="hover:text-[#080808]">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#080808]">
          Shop
        </Link>
        <span>/</span>
        <Link to={`/category/${product.categorySlug}`} className="hover:text-[#080808]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#080808] truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Split: Sticky Gallery Left + Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Product Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-24 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`aspect-[3/4] w-20 sm:w-full border overflow-hidden bg-[#F3F3F3] shrink-0 ${
                  selectedImage === img ? 'border-[#080808] ring-1 ring-[#080808]' : 'border-[#E5E5E5]'
                }`}
              >
                <ResilientImage
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Viewport */}
          <div className="flex-1 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden relative">
            <ResilientImage
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
            {product.onSale && (
              <span className="absolute top-4 left-4 bg-[#080808] text-white text-xs uppercase tracking-widest px-3 py-1.5">
                Archival Privilege -{product.discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777]">
                <span>{product.collection} Collection</span>
                <span>·</span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-2">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-semibold text-[#080808]">
                  {formatCurrency(product.sellingPrice)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <>
                    <span className="text-sm text-[#777777] line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#080808] font-medium">
                      Save {formatCurrency(product.originalPrice - product.sellingPrice)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-[#555555] leading-relaxed border-t border-b border-[#E5E5E5] py-5">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-[#777777]">Color</span>
                <span className="font-semibold text-[#080808]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 border text-xs transition-colors ${
                      selectedColor === col.name
                        ? 'border-[#080808] bg-[#080808] text-white'
                        : 'border-[#E5E5E5] bg-white text-[#080808] hover:border-[#080808]'
                    }`}
                  >
                    <span
                      className="h-3 w-3 border border-white/40 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-[#777777]">Size</span>
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[#080808] underline underline-offset-4 hover:text-[#777777]"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Size & Fit Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-medium border text-center transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#080808] text-white border-[#080808]'
                        : 'bg-white text-[#080808] border-[#E5E5E5] hover:border-[#080808]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Primary Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3.5 text-[#080808] hover:bg-[#F3F3F3]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-5 text-xs font-mono tabular-nums font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3.5 text-[#080808] hover:bg-[#F3F3F3]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-1 bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="w-full border border-[#080808] text-[#080808] py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F3F3F3] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            {/* Materials & Care + Shipping Details */}
            <div className="pt-6 border-t border-[#E5E5E5] space-y-5">
              <div>
                <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#080808] mb-2">
                  Materials & Sartorial Construction
                </h3>
                <ul className="space-y-1.5 text-xs text-[#555555]">
                  {product.materialsAndCare.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#080808] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F3F3F3] p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#080808]">
                  <Truck className="h-4 w-4" />
                  <span>White-Glove Delivery & Archival Packaging</span>
                </div>
                <p className="text-[#555555] leading-relaxed">{product.shippingInfo}</p>
                <div className="flex items-center gap-2 text-[#080808] pt-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Supports eSewa, Khalti, Fonepay QR & Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Client Reviews Section */}
      {productReviews.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#E5E5E5]">
          <h2 className="font-serif text-2xl text-[#080808] mb-6">
            Client Impressions ({productReviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev) => (
              <div key={rev.id} className="border border-[#E5E5E5] p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#080808]">{rev.customerName}</span>
                  <span className="font-mono text-[#777777]">{rev.date}</span>
                </div>
                <p className="text-xs uppercase tracking-widest text-[#080808]">
                  {'★'.repeat(rev.rating)} ({rev.rating}/5)
                </p>
                <p className="text-xs text-[#555555] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="mt-20 pt-12 border-t border-[#E5E5E5]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
              Complete the Silhouette
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#080808] mt-1">
              Related Atelier Pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest underline underline-offset-4"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* Size Guide Modal */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border border-[#080808] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#777777]">
                  Architectural Proportions
                </p>
                <h3 className="font-serif text-2xl text-[#080808]">
                  Size & Measurement Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeModalOpen(false)}
                className="p-1 text-[#080808]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Our garments are cut with an intentional architectural drape. For a closer sartorial fit on Unisex pieces, we recommend selecting one size down from your customary size.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-[#080808] bg-[#F3F3F3] uppercase tracking-wider">
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Chest (cm)</th>
                    <th className="py-3 px-4">Shoulder (cm)</th>
                    <th className="py-3 px-4">Waist (cm)</th>
                    <th className="py-3 px-4">Sleeve (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr>
                    <td className="py-3 px-4 font-semibold">XS</td>
                    <td className="py-3 px-4">86 – 90</td>
                    <td className="py-3 px-4">42.5</td>
                    <td className="py-3 px-4">70 – 74</td>
                    <td className="py-3 px-4">61.0</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">S</td>
                    <td className="py-3 px-4">91 – 96</td>
                    <td className="py-3 px-4">44.5</td>
                    <td className="py-3 px-4">75 – 80</td>
                    <td className="py-3 px-4">62.5</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">M</td>
                    <td className="py-3 px-4">97 – 102</td>
                    <td className="py-3 px-4">46.5</td>
                    <td className="py-3 px-4">81 – 86</td>
                    <td className="py-3 px-4">64.0</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">L</td>
                    <td className="py-3 px-4">103 – 108</td>
                    <td className="py-3 px-4">48.5</td>
                    <td className="py-3 px-4">87 – 92</td>
                    <td className="py-3 px-4">65.5</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">XL</td>
                    <td className="py-3 px-4">109 – 115</td>
                    <td className="py-3 px-4">50.5</td>
                    <td className="py-3 px-4">93 – 99</td>
                    <td className="py-3 px-4">67.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/size-guide"
                onClick={() => setSizeModalOpen(false)}
                className="text-xs uppercase tracking-widest underline underline-offset-4"
              >
                Open Full Size Guide Page
              </Link>
              <button
                type="button"
                onClick={() => setSizeModalOpen(false)}
                className="bg-[#080808] text-white px-6 py-2.5 text-xs uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
