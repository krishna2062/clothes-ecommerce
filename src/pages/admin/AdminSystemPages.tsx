import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Download,
  Upload,
  Trash2,
  Check,
  X,
  QrCode,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  formatCurrency,
  REVENUE_CHART_DATA,
  IMG_HERO,
  IMG_COAT,
} from '../../data/mockData';
import { Coupon, CampaignBanner, DeliveryZone } from '../../types';
import { ResilientImage } from '../../components/product/ProductCard';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, saveCoupon, deleteCoupon } = useStore();
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed'>('Fixed');
  const [discountValue, setDiscountValue] = useState(2500);
  const [minOrderAmount, setMinOrderAmount] = useState(25000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState(100);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const newCoupon: Coupon = {
      id: `CPN-0${coupons.length + 1}`,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      expiryDate,
      usageLimit: Number(usageLimit),
      usedCount: 0,
      status: 'Active',
    };
    saveCoupon(newCoupon);
    setCode('');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Client Privileges
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Coupons & Discounts
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleCreate}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">Issue Privilege Code</h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MONOLITH2500"
              className="w-full border border-[#E5E5E5] px-3 py-2 font-mono uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as 'Percentage' | 'Fixed')
                }
                className="w-full border border-[#E5E5E5] bg-white px-3 py-2"
              >
                <option value="Fixed">Fixed (NPR)</option>
                <option value="Percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Minimum Order (NPR)
              </label>
              <input
                type="number"
                required
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-2.5 uppercase tracking-widest"
          >
            Activate Coupon
          </button>
        </form>

        <div className="lg:col-span-8 bg-white border border-[#E5E5E5] overflow-x-auto h-fit">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Value</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Expiry</th>
                <th className="py-3.5 px-4">Usage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {coupons.map((cpn) => (
                <tr key={cpn.id}>
                  <td className="py-3.5 px-4 font-mono font-semibold">{cpn.code}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {cpn.discountType === 'Percentage'
                      ? `${cpn.discountValue}%`
                      : formatCurrency(cpn.discountValue)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {formatCurrency(cpn.minOrderAmount)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{cpn.expiryDate}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {cpn.usedCount} / {cpn.usageLimit}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{cpn.status}</td>
                  <td className="py-3.5 px-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        saveCoupon({
                          ...cpn,
                          status: cpn.status === 'Active' ? 'Inactive' : 'Active',
                        })
                      }
                      className="underline text-[#080808]"
                    >
                      Toggle
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(cpn.id)}
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

export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Client Testimonials
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Product Reviews ({reviews.length})
        </h1>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Garment</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Review Content</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {reviews.map((rev) => (
              <tr key={rev.id}>
                <td className="py-3.5 px-4 font-semibold">{rev.customerName}</td>
                <td className="py-3.5 px-4">{rev.productName}</td>
                <td className="py-3.5 px-4 font-mono">{rev.rating} / 5 ★</td>
                <td className="py-3.5 px-4 text-[#555555] max-w-md">{rev.comment}</td>
                <td className="py-3.5 px-4 font-semibold">{rev.status}</td>
                <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => updateReviewStatus(rev.id, 'Approved')}
                    className="underline text-[#080808] font-medium"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                    className="underline text-[#777777]"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReview(rev.id)}
                    className="text-red-700"
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
  );
};

export const AdminBannersPage: React.FC = () => {
  const { banners, saveBanner, deleteBanner } = useStore();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [displayOrder, setDisplayOrder] = useState(banners.length + 1);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newBnr: CampaignBanner = {
      id: `BNR-0${banners.length + 1}`,
      title,
      subtitle,
      ctaText,
      ctaLink,
      desktopImage: IMG_HERO,
      mobileImage: IMG_COAT,
      displayOrder: Number(displayOrder),
      active: true,
    };
    saveBanner(newBnr);
    setTitle('');
    setSubtitle('');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Visual Merchandising
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Campaign Banners
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleCreate}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">Upload Campaign Banner</h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Headline Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Subtitle *
            </label>
            <textarea
              rows={2}
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                CTA Link
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-2.5 uppercase tracking-widest"
          >
            Publish Banner
          </button>
        </form>

        <div className="lg:col-span-8 space-y-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-[#E5E5E5] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-28 aspect-[16/9] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                  <ResilientImage
                    src={b.desktopImage}
                    alt={b.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-serif text-lg text-[#080808]">{b.title}</p>
                  <p className="text-[#555555]">{b.subtitle}</p>
                  <p className="font-mono text-[#777777]">
                    Order #{b.displayOrder} · CTA: {b.ctaText} ({b.ctaLink}) ·{' '}
                    {b.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => saveBanner({ ...b, active: !b.active })}
                  className="underline text-[#080808]"
                >
                  {b.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteBanner(b.id)}
                  className="text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminDeliveryPage: React.FC = () => {
  const { deliveryZones, saveDeliveryZone, deleteDeliveryZone } = useStore();
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('');
  const [standardCharge, setStandardCharge] = useState(150);
  const [expressCharge, setExpressCharge] = useState(300);
  const [estimatedTime, setEstimatedTime] = useState('1–2 Business Days');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!district.trim()) return;
    const zone: DeliveryZone = {
      id: `DLV-0${deliveryZones.length + 1}`,
      province,
      district,
      standardCharge: Number(standardCharge),
      expressCharge: Number(expressCharge),
      estimatedTime,
      active: true,
    };
    saveDeliveryZone(zone);
    setDistrict('');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Courier Logistics
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Delivery Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSave}
          className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs h-fit"
        >
          <h2 className="font-serif text-xl text-[#080808]">Add Regional Tariff</h2>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Province
            </label>
            <input
              type="text"
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              District *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Chitwan (Bharatpur)"
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Standard Charge (NPR)
              </label>
              <input
                type="number"
                value={standardCharge}
                onChange={(e) => setStandardCharge(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Express Charge (NPR)
              </label>
              <input
                type="number"
                value={expressCharge}
                onChange={(e) => setExpressCharge(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] px-3 py-2 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Estimated Transit Time
            </label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#080808] text-white py-2.5 uppercase tracking-widest"
          >
            Save Delivery Zone
          </button>
        </form>

        <div className="lg:col-span-8 bg-white border border-[#E5E5E5] overflow-x-auto h-fit">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">Province</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Standard</th>
                <th className="py-3.5 px-4">Express</th>
                <th className="py-3.5 px-4">Estimated Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {deliveryZones.map((z) => (
                <tr key={z.id}>
                  <td className="py-3.5 px-4">{z.province}</td>
                  <td className="py-3.5 px-4 font-semibold">{z.district}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {z.standardCharge === 0 ? 'Free' : formatCurrency(z.standardCharge)}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {z.expressCharge === 0 ? 'Free' : formatCurrency(z.expressCharge)}
                  </td>
                  <td className="py-3.5 px-4">{z.estimatedTime}</td>
                  <td className="py-3.5 px-4 font-semibold">
                    {z.active ? 'Active' : 'Inactive'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteDeliveryZone(z.id)}
                      className="text-red-700"
                    >
                      Remove
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

export const AdminReportsPage: React.FC = () => {
  const { orders, products, customers, showToast } = useStore();
  const [reportType, setReportType] = useState<
    'sales' | 'revenue' | 'products' | 'customers' | 'orders' | 'payments'
  >('sales');
  const [dateRange, setDateRange] = useState('Last 6 Months (Jun – Nov 2026)');

  const handleExportCSV = () => {
    const csvContent =
      'Month,Revenue_NPR,Orders\n' +
      REVENUE_CHART_DATA.map((r) => `${r.month},${r.revenue},${r.orders}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yourbrand_${reportType}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report Exported', `Downloaded ${reportType.toUpperCase()} CSV dossier.`, 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Intelligence & Auditing
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Executive Reports & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs"
          >
            <option value="Last 6 Months (Jun – Nov 2026)">
              Last 6 Months (Jun – Nov 2026)
            </option>
            <option value="Autumn / Winter 2026 Quarter">
              Autumn / Winter 2026 Quarter
            </option>
            <option value="Fiscal Year 2026">Fiscal Year 2026</option>
          </select>
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-[#080808] text-white px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Category Switcher */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'sales', label: 'Sales Report' },
            { id: 'revenue', label: 'Revenue Report' },
            { id: 'products', label: 'Product Performance' },
            { id: 'customers', label: 'Customer Report' },
            { id: 'orders', label: 'Order Report' },
            { id: 'payments', label: 'Payment Report' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border ${
              reportType === tab.id
                ? 'bg-[#080808] text-white border-[#080808]'
                : 'bg-white text-[#080808] border-[#E5E5E5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#080808] capitalize">
            {reportType} Trajectory — {dateRange}
          </h2>
          <span className="font-mono text-xs text-[#777777]">
            Total Sampled: {orders.length} Orders · {products.length} Garments · {customers.length} Clients
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REVENUE_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#777777' }} />
              <YAxis tick={{ fontSize: 11, fill: '#777777' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={reportType === 'orders' ? 'orders' : 'revenue'}
                stroke="#080808"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            System Dispatches
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Admin Notifications ({notifications.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="bg-[#080808] text-white px-4 py-2 text-xs uppercase tracking-widest"
        >
          Mark All Read
        </button>
      </div>

      <div className="bg-white border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex items-start justify-between gap-4 text-xs ${
              n.read ? 'bg-white' : 'bg-[#F3F3F3]/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono uppercase text-[10px] text-[#777777]">
                  [{n.category}]
                </span>
                <span className="font-semibold text-[#080808]">{n.title}</span>
              </div>
              <p className="text-[#555555]">{n.message}</p>
              <p className="font-mono text-[11px] text-[#777777]">{n.date}</p>
            </div>
            {!n.read && (
              <button
                type="button"
                onClick={() => markNotificationRead(n.id)}
                className="underline text-[#080808] shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminContentPage: React.FC = () => {
  const { brandSettings, updateBrandSettings } = useStore();
  const [tagline, setTagline] = useState(brandSettings.tagline);
  const [description, setDescription] = useState(brandSettings.description);
  const [announcement, setAnnouncement] = useState(brandSettings.announcementBarText);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandSettings({
      ...brandSettings,
      tagline,
      description,
      announcementBarText: announcement,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Editorial Copywriting
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Website Content Management
        </h1>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-5 text-xs"
      >
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            Top Announcement Bar Message
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            Homepage Hero Editorial Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            Brand Story & Footer Manifesto
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>
        <button
          type="submit"
          className="bg-[#080808] text-white px-7 py-3 uppercase tracking-widest font-semibold"
        >
          Publish Website Content
        </button>
      </form>
    </div>
  );
};

export const AdminBrandSettingsPage: React.FC = () => {
  const { brandSettings, updateBrandSettings } = useStore();
  const [formState, setFormState] = useState(brandSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandSettings(formState);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          House Identity
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Brand Settings</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-5 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={formState.brandName}
              onChange={(e) =>
                setFormState({ ...formState, brandName: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Concierge Email *
            </label>
            <input
              type="email"
              required
              value={formState.contactEmail}
              onChange={(e) =>
                setFormState({ ...formState, contactEmail: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Concierge Phone *
            </label>
            <input
              type="text"
              required
              value={formState.contactPhone}
              onChange={(e) =>
                setFormState({ ...formState, contactPhone: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Instagram URL
            </label>
            <input
              type="text"
              value={formState.instagramUrl}
              onChange={(e) =>
                setFormState({ ...formState, instagramUrl: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Flagship Salon Address
            </label>
            <input
              type="text"
              value={formState.flagshipAddress}
              onChange={(e) =>
                setFormState({ ...formState, flagshipAddress: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formState.announcementBarActive}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  announcementBarActive: e.target.checked,
                })
              }
              className="accent-[#080808]"
            />
            <span>Enable Top Announcement Bar</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formState.expressDeliveryEnabled}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  expressDeliveryEnabled: e.target.checked,
                })
              }
              className="accent-[#080808]"
            />
            <span>Enable White-Glove Express Delivery Option at Checkout</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#080808] text-white px-7 py-3 uppercase tracking-widest font-semibold"
        >
          Save Brand Configuration
        </button>
      </form>
    </div>
  );
};

export const AdminPaymentSettingsPage: React.FC = () => {
  const { paymentSettings, updatePaymentSettings } = useStore();
  const [state, setState] = useState(paymentSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(state);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Settlement Gateways
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Payment Settings (eSewa, Khalti, Fonepay & COD)
        </h1>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              eSewa Merchant ID / Name
            </label>
            <input
              type="text"
              value={state.esewaMerchantId}
              onChange={(e) =>
                setState({ ...state, esewaMerchantId: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Khalti Merchant ID / Name
            </label>
            <input
              type="text"
              value={state.khaltiMerchantId}
              onChange={(e) =>
                setState({ ...state, khaltiMerchantId: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Fonepay Bank & Merchant Title
            </label>
            <input
              type="text"
              value={state.fonepayMerchantName}
              onChange={(e) =>
                setState({ ...state, fonepayMerchantName: e.target.value })
              }
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1">
            Manual QR Checkout Instructions
          </label>
          <textarea
            rows={3}
            value={state.paymentInstructions}
            onChange={(e) =>
              setState({ ...state, paymentInstructions: e.target.value })
            }
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1">
            Cash on Delivery (COD) Terms
          </label>
          <textarea
            rows={2}
            value={state.codInstructions}
            onChange={(e) =>
              setState({ ...state, codInstructions: e.target.value })
            }
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.codEnabled}
              onChange={(e) =>
                setState({ ...state, codEnabled: e.target.checked })
              }
              className="accent-[#080808]"
            />
            <span>Enable Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.esewaEnabled}
              onChange={(e) =>
                setState({ ...state, esewaEnabled: e.target.checked })
              }
              className="accent-[#080808]"
            />
            <span>Enable eSewa QR</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.khaltiEnabled}
              onChange={(e) =>
                setState({ ...state, khaltiEnabled: e.target.checked })
              }
              className="accent-[#080808]"
            />
            <span>Enable Khalti QR</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.fonepayEnabled}
              onChange={(e) =>
                setState({ ...state, fonepayEnabled: e.target.checked })
              }
              className="accent-[#080808]"
            />
            <span>Enable Fonepay QR</span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#080808] text-white px-7 py-3 uppercase tracking-widest font-semibold"
        >
          Save Payment Gateway Settings
        </button>
      </form>
    </div>
  );
};

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Security & Compliance Ledger
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          System Audit Logs ({auditLogs.length})
        </h1>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor & Role</th>
              <th className="py-3.5 px-4">Module</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Activity Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4 font-mono text-[#777777] whitespace-nowrap">
                  {log.date}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-[#080808]">{log.user}</span>{' '}
                  <span className="text-[#777777]">({log.role})</span>
                </td>
                <td className="py-3.5 px-4 font-semibold">{log.module}</td>
                <td className="py-3.5 px-4">{log.action}</td>
                <td className="py-3.5 px-4 text-[#555555]">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
