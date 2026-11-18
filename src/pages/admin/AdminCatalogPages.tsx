import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Upload,
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  REVENUE_CHART_DATA,
  DAILY_SALES_DATA,
  IMG_COAT,
} from '../../data/mockData';
import { Product, Category, CollectionItem, GenderCollection } from '../../types';
import { ResilientImage } from '../../components/product/ProductCard';

export const AdminOverviewPage: React.FC = () => {
  const { products, orders, customers, auditLogs } = useStore();

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const todayRevenue = 133000;
  const monthlyRevenue = 1795000;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'Placed' || o.orderStatus === 'Processing'
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Executive Telemetry
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Atelier Operations Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/create"
            className="bg-[#080808] text-white px-4 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Garment</span>
          </Link>
          <Link
            to="/admin/payments"
            className="border border-[#080808] bg-white text-[#080808] px-4 py-2.5 text-xs uppercase tracking-widest"
          >
            Verify Payments
          </Link>
        </div>
      </div>

      {/* 9-Metric Grid requested by prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Total Lifetime Revenue
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {formatCurrency(totalRevenue + 6450000)}
          </p>
          <p className="text-xs text-[#777777] mt-1">+18.4% vs previous quarter</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Today&apos;s Revenue
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {formatCurrency(todayRevenue)}
          </p>
          <p className="text-xs text-[#777777] mt-1">2 high-value orders placed today</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Monthly Revenue (Nov)
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {formatCurrency(monthlyRevenue)}
          </p>
          <p className="text-xs text-[#777777] mt-1">52 completed acquisitions</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Total Orders
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {orders.length}
          </p>
          <p className="text-xs text-[#777777] mt-1">Active demo dossier records</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Pending Orders
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {pendingOrders}
          </p>
          <p className="text-xs text-[#777777] mt-1">Awaiting dispatch / QR audit</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Delivered Orders
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {deliveredOrders}
          </p>
          <p className="text-xs text-[#777777] mt-1">100% white-glove sign-off</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Total Registered Clients
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {customers.length}
          </p>
          <p className="text-xs text-[#777777] mt-1">Private client dossiers</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Total Catalog Garments
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {products.length}
          </p>
          <p className="text-xs text-[#777777] mt-1">Across 5 sartorial categories</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Low Stock Alerts (≤ 10 Units)
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {lowStockProducts.length}
          </p>
          <Link
            to="/admin/inventory"
            className="text-xs underline text-[#080808] mt-1 inline-block"
          >
            Inspect Stock Matrix
          </Link>
        </div>
      </div>

      {/* Analytics Charts: Monthly Revenue & Weekly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#777777]">
                6-Month Trajectory
              </p>
              <h2 className="font-serif text-xl text-[#080808]">
                Monthly Revenue Performance (NPR)
              </h2>
            </div>
            <TrendingUp className="h-4 w-4 text-[#080808]" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#777777' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#777777' }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#080808"
                  fill="#080808"
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E5E5E5] p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#777777]">
              7-Day Velocity
            </p>
            <h2 className="font-serif text-xl text-[#080808]">Daily Sales Analytics</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#777777' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#777777' }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Sales']}
                />
                <Bar dataKey="sales" fill="#080808" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders, Top-Selling Products, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#080808]">Recent Client Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs uppercase tracking-widest underline"
            >
              All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F3F3F3] uppercase tracking-wider">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#F3F3F3]/40">
                    <td className="py-3 px-3 font-mono font-semibold">
                      <Link to={`/admin/orders/${o.id}`} className="underline">
                        #{o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3">{o.customerName}</td>
                    <td className="py-3 px-3 font-mono">{formatCurrency(o.totalAmount)}</td>
                    <td className="py-3 px-3">
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td className="py-3 px-3 font-semibold">{o.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling Products & Recent Audit Activities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#080808]">Top-Selling Garments</h2>
            <div className="divide-y divide-[#E5E5E5]">
              {products
                .filter((p) => p.bestSeller)
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                        <ResilientImage
                          src={p.mainImage}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#080808] line-clamp-1">{p.name}</p>
                        <p className="text-[#777777] font-mono">{p.sku}</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold tabular-nums shrink-0">
                      {formatCurrency(p.sellingPrice)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#080808]">Recent Atelier Activity</h2>
              <Link to="/admin/audit-logs" className="text-xs underline">
                Audit Log
              </Link>
            </div>
            <div className="divide-y divide-[#E5E5E5] text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="py-2.5 space-y-0.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#080808]">{log.action}</span>
                    <span className="font-mono text-[11px] text-[#777777]">
                      {log.date.slice(11, 16)}
                    </span>
                  </div>
                  <p className="text-[#555555] line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Catalog Management
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Products ({filtered.length})
          </h1>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-[#080808] text-white px-5 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Product</span>
        </Link>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by garment title, SKU, or category..."
            className="w-full border border-[#E5E5E5] pl-9 pr-4 py-2 text-xs"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#E5E5E5] px-3 py-2 text-xs bg-white"
        >
          <option value="ALL">All Categories</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Shirting">Shirting</option>
          <option value="Tailoring & Trousers">Tailoring & Trousers</option>
          <option value="Knitwear">Knitwear</option>
          <option value="Leather Goods">Leather Goods</option>
        </select>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Garment</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                      <ResilientImage
                        src={product.mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#080808]">{product.name}</p>
                      <p className="text-[11px] text-[#777777]">{product.collection}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono">{product.sku}</td>
                <td className="py-3.5 px-4">{product.category}</td>
                <td className="py-3.5 px-4 font-mono font-semibold">
                  {formatCurrency(product.sellingPrice)}
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span className={product.stock <= 7 ? 'text-red-700 font-semibold' : ''}>
                    {product.stock} units
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold">{product.status}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-[#777777] hover:text-[#080808]"
                      title="View on Storefront"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-[#080808] hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="text-[#777777] hover:text-red-700"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, categories, saveProduct } = useStore();
  const navigate = useNavigate();

  const existing = id ? products.find((p) => p.id === id) : undefined;

  const [name, setName] = useState(existing?.name || '');
  const [sku, setSku] = useState(existing?.sku || `YB-AW26-00${products.length + 1}`);
  const [description, setDescription] = useState(
    existing?.description ||
      'Architectural garment tailored from traceable single-origin natural fibers.'
  );
  const [category, setCategory] = useState(existing?.category || 'Outerwear');
  const [collection, setCollection] = useState<GenderCollection>(
    existing?.collection || 'Unisex'
  );
  const [originalPrice, setOriginalPrice] = useState(existing?.originalPrice || 38000);
  const [sellingPrice, setSellingPrice] = useState(existing?.sellingPrice || 34000);
  const [sizesInput, setSizesInput] = useState(
    existing?.sizes.join(', ') || 'XS, S, M, L, XL'
  );
  const [colorsInput, setColorsInput] = useState(
    existing?.colors.map((c) => c.name).join(', ') || 'Obsidian Black, Chalk White'
  );
  const [stock, setStock] = useState(existing?.stock || 20);
  const [images, setImages] = useState<string[]>(existing?.images || [IMG_COAT]);
  const [mainImage, setMainImage] = useState(existing?.mainImage || IMG_COAT);
  const [featured, setFeatured] = useState(existing?.featured ?? true);
  const [newArrival, setNewArrival] = useState(existing?.newArrival ?? true);
  const [status, setStatus] = useState<Product['status']>(existing?.status || 'Published');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages((prev) => [...prev, reader.result as string]);
        setMainImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedColors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => ({
        name: c,
        hex: c.toLowerCase().includes('white') ? '#F9F9F8' : '#080808',
      }));

    const discountPercent =
      originalPrice > sellingPrice
        ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
        : 0;

    const matchedCat = categories.find((c) => c.name === category);
    const slug =
      existing?.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const saved: Product = {
      id: existing?.id || `PRD-00${products.length + 1}`,
      slug,
      name,
      sku,
      description,
      materialsAndCare: existing?.materialsAndCare || [
        '100% Traceable Natural Fiber Construction',
        'Single-needle French seams',
        'Specialist dry clean only',
      ],
      shippingInfo:
        existing?.shippingInfo || 'Complimentary white-glove delivery in archival garment bag.',
      category,
      categorySlug: matchedCat?.slug || 'outerwear',
      collection,
      originalPrice: Number(originalPrice),
      sellingPrice: Number(sellingPrice),
      discountPercent,
      images,
      mainImage,
      sizes: parsedSizes,
      colors: parsedColors,
      stock: Number(stock),
      variantStock: parsedSizes.map((sz) => ({
        size: sz,
        color: parsedColors[0]?.name || 'Obsidian Black',
        stock: Math.max(1, Math.floor(Number(stock) / parsedSizes.length)),
        sku: `${sku}-${sz}`,
      })),
      featured,
      newArrival,
      bestSeller: existing?.bestSeller ?? false,
      onSale: discountPercent > 0,
      status,
      createdAt: existing?.createdAt || new Date().toISOString().slice(0, 10),
    };

    saveProduct(saved);
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <Link
            to="/admin/products"
            className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            {existing ? `Edit Garment: ${existing.name}` : 'Create New Atelier Garment'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Double-Faced Cashmere Trench Coat"
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              SKU *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Publish Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Product['status'])}
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Collection Gender
            </label>
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value as GenderCollection)}
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5"
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Original Price (NPR) *
            </label>
            <input
              type="number"
              required
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Selling Price (NPR) *
            </label>
            <input
              type="number"
              required
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Sizes (Comma separated)
            </label>
            <input
              type="text"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Colors (Comma separated)
            </label>
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Total Initial Variant Stock *
            </label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
              Editorial Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
        </div>

        {/* Multiple Image Upload & Main Image Selection */}
        <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wider text-[#080808] font-semibold">
              Product Lookbook Gallery (Select Main Image)
            </span>
            <label className="cursor-pointer border border-[#080808] px-3.5 py-1.5 uppercase tracking-widest inline-flex items-center gap-1.5 hover:bg-[#F3F3F3]">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainImage(img)}
                className={`w-20 aspect-[3/4] border p-1 relative ${
                  mainImage === img ? 'border-[#080808] ring-1 ring-[#080808]' : 'border-[#E5E5E5]'
                }`}
              >
                <ResilientImage
                  src={img}
                  alt="Gallery thumb"
                  className="h-full w-full object-cover"
                />
                {mainImage === img && (
                  <span className="absolute bottom-1 inset-x-1 bg-[#080808] text-white text-[9px] uppercase py-0.5">
                    Main
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Merchandising Flags */}
        <div className="pt-4 border-t border-[#E5E5E5] flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#080808]"
            />
            <span>Featured Homepage Piece</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
              className="accent-[#080808]"
            />
            <span>Mark as New Arrival</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 border border-[#E5E5E5] uppercase tracking-widest"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-7 py-2.5 bg-[#080808] text-white uppercase tracking-widest font-semibold"
          >
            Save Garment
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminCategoriesPage: React.FC = () => {
  const { categories, saveCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Category['status']>('Active');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    saveCategory({
      id: editingId || `CAT-0${categories.length + 1}`,
      name,
      slug,
      description,
      image: IMG_COAT,
      productCount: 8,
      status,
    });
    setName('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Taxonomy Architecture
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Category Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSave}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Archival Footwear"
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Category['status'])}
              className="w-full border border-[#E5E5E5] bg-white px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#080808] text-white py-2.5 uppercase tracking-widest"
            >
              {editingId ? 'Update' : 'Create Category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setDescription('');
                }}
                className="px-4 py-2.5 border border-[#E5E5E5]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-8 bg-white border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Pieces</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="py-3.5 px-4 font-semibold">{cat.name}</td>
                  <td className="py-3.5 px-4 text-[#555555] max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{cat.productCount}</td>
                  <td className="py-3.5 px-4 font-semibold">{cat.status}</td>
                  <td className="py-3.5 px-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cat.id);
                        setName(cat.name);
                        setDescription(cat.description);
                        setStatus(cat.status);
                      }}
                      className="underline text-[#080808]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      className="text-[#777777] hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminCollectionsPage: React.FC = () => {
  const { collections, products, saveCollection, deleteCollection } = useStore();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCol: CollectionItem = {
      id: `COL-0${collections.length + 1}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle,
      description,
      bannerImage: IMG_COAT,
      featured,
      productIds: products.slice(0, 3).map((p) => p.id),
      status: 'Active',
    };
    saveCollection(newCol);
    setName('');
    setSubtitle('');
    setDescription('');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Seasonal Capsules
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Collection Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleCreate}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">Create Collection</h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Collection Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Resort 2027 Silk Capsule"
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Editorial Subtitle *
            </label>
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Narrative Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#080808]"
            />
            <span>Feature on Homepage</span>
          </label>
          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-2.5 uppercase tracking-widest"
          >
            Publish Collection
          </button>
        </form>

        <div className="lg:col-span-8 space-y-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-[#E5E5E5] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl text-[#080808]">{col.name}</span>
                  {col.featured && (
                    <span className="text-[10px] uppercase tracking-widest bg-[#F3F3F3] px-2 py-0.5 border border-[#E5E5E5]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-medium text-[#080808]">{col.subtitle}</p>
                <p className="text-[#555555]">{col.description}</p>
                <p className="text-[#777777] font-mono pt-1">
                  Assigned Garments: {col.productIds.length} pieces
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteCollection(col.id)}
                className="text-xs text-[#777777] hover:text-red-700 underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminInventoryPage: React.FC = () => {
  const { products, stockMovements, adjustInventoryStock } = useStore();
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || 'PRD-001');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Obsidian Black');
  const [delta, setDelta] = useState(5);
  const [reason, setReason] = useState('Atelier Restock Batch');

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    adjustInventoryStock(selectedProdId, size, color, Number(delta), reason);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Stock Ledger & Movements
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Inventory & Variant Control
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stock Adjustment Form */}
        <form
          onSubmit={handleAdjust}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">Stock Adjustment</h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Select Garment
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full border border-[#E5E5E5] bg-white px-3 py-2"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.stock} total)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Size
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Quantity Delta (+ to add, - to deduct)
            </label>
            <input
              type="number"
              required
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Adjustment Reason
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-2.5 uppercase tracking-widest"
          >
            Record Stock Adjustment
          </button>
        </form>

        {/* Variant Stock Table & Movement History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Garment</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Size Breakdown</th>
                  <th className="py-3.5 px-4">Total Stock</th>
                  <th className="py-3.5 px-4">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3.5 px-4 font-semibold">{p.name}</td>
                    <td className="py-3.5 px-4 font-mono">{p.sku}</td>
                    <td className="py-3.5 px-4 text-[#555555]">
                      {p.variantStock.map((v) => `${v.size}: ${v.stock}`).join(' · ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">{p.stock}</td>
                    <td className="py-3.5 px-4">
                      {p.stock <= 8 ? (
                        <span className="text-red-700 font-semibold inline-flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="text-[#080808]">Optimal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#080808]">
              Recent Stock Movement History
            </h3>
            <div className="divide-y divide-[#E5E5E5] text-xs">
              {stockMovements.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-semibold text-[#080808]">{m.productName}</span>{' '}
                    <span className="text-[#777777]">
                      ({m.size} · {m.color}) — {m.reason}
                    </span>
                  </div>
                  <div className="font-mono tabular-nums shrink-0">
                    <span
                      className={
                        m.change > 0 ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'
                      }
                    >
                      {m.change > 0 ? `+${m.change}` : m.change} units
                    </span>{' '}
                    <span className="text-[#777777] ml-2">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
