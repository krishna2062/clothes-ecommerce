import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ZoomIn,
  ArrowLeft,
  Plus,
  Search,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../data/mockData';
import { Order, OrderStatusType, StaffMember } from '../../types';
import { ResilientImage } from '../../components/product/ProductCard';

export const AdminOrdersPage: React.FC = () => {
  const { orders } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Fulfillment Desk
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Order Management ({filtered.length})
        </h1>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, client name, or phone..."
            className="w-full border border-[#E5E5E5] pl-9 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Placed', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider border ${
                  statusFilter === st
                    ? 'bg-[#080808] text-white border-[#080808]'
                    : 'bg-white text-[#080808] border-[#E5E5E5]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4">Order Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4 font-mono font-semibold">
                  #{ord.orderNumber}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-[#080808]">{ord.customerName}</p>
                  <p className="text-[11px] text-[#777777]">{ord.customerPhone}</p>
                </td>
                <td className="py-3.5 px-4 font-mono">{ord.date}</td>
                <td className="py-3.5 px-4 font-mono font-semibold">
                  {formatCurrency(ord.totalAmount)}
                </td>
                <td className="py-3.5 px-4">{ord.paymentMethod}</td>
                <td className="py-3.5 px-4">{ord.paymentStatus}</td>
                <td className="py-3.5 px-4 font-semibold">{ord.orderStatus}</td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/admin/orders/${ord.id}`}
                    className="bg-[#080808] text-white px-3.5 py-1.5 text-xs uppercase tracking-widest"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus, verifyOrderPayment } = useStore();
  const order = orders.find((o) => o.id === id) || orders[0];

  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>(order.orderStatus);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [zoomOpen, setZoomOpen] = useState(false);

  const handleStatusSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(order.id, selectedStatus, adminNotes);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Orders</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Order #{order.orderNumber} — {order.customerName}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-white border border-[#E5E5E5] px-3.5 py-2 font-mono">
            Payment: <strong>{order.paymentStatus}</strong>
          </span>
          <span className="bg-[#080808] text-white px-3.5 py-2 uppercase tracking-widest">
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Ordered Garments, Timeline, Customer & Shipping */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#080808]">Ordered Garments</h2>
            <div className="divide-y divide-[#E5E5E5]">
              {order.items.map((item, i) => (
                <div key={i} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-14 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#080808]">{item.name}</p>
                      <p className="text-[#777777] mt-0.5">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E5E5E5] space-y-1.5 text-xs tabular-nums max-w-xs ml-auto">
              <div className="flex justify-between">
                <span className="text-[#777777]">Subtotal</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Discount</span>
                <span className="font-mono">- {formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Delivery ({order.deliveryMethod})</span>
                <span className="font-mono">{formatCurrency(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#080808] text-sm font-semibold">
                <span>Grand Total</span>
                <span className="font-mono">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-2 text-xs">
              <h3 className="font-serif text-lg text-[#080808] pb-2 border-b border-[#E5E5E5]">
                Customer Details
              </h3>
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-[#555555]">{order.customerEmail}</p>
              <p className="font-mono">{order.customerPhone}</p>
            </div>
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-2 text-xs">
              <h3 className="font-serif text-lg text-[#080808] pb-2 border-b border-[#E5E5E5]">
                Shipping Destination
              </h3>
              <p className="font-semibold">
                {order.shippingAddress.street}, {order.shippingAddress.ward}
              </p>
              <p className="text-[#555555]">
                {order.shippingAddress.municipality}, {order.shippingAddress.district}
              </p>
              <p className="text-[#555555]">{order.shippingAddress.province}</p>
              <p className="text-[#777777]">Landmark: {order.shippingAddress.landmark}</p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#080808]">Fulfillment Timeline</h3>
            <div className="space-y-3 border-l border-[#080808] pl-5 ml-2 text-xs">
              {order.timeline.map((ev, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold uppercase">{ev.status}</span>
                    <span className="font-mono text-[#777777]">{ev.date}</span>
                  </div>
                  <p className="text-[#555555] mt-0.5">{ev.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Status Update & Payment Proof Verification */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleStatusSave}
            className="bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs"
          >
            <h3 className="font-serif text-lg text-[#080808]">
              Update Order Status & Notes
            </h3>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatusType)}
                className="w-full border border-[#E5E5E5] bg-white px-3 py-2.5"
              >
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[#777777] mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full border border-[#E5E5E5] p-3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#080808] text-white py-3 uppercase tracking-widest font-semibold"
            >
              Update Order Status
            </button>
          </form>

          {/* Payment Proof Box */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg text-[#080808]">
              Payment Proof ({order.paymentMethod})
            </h3>
            <p className="font-mono">
              Ref: <strong>{order.transactionRef || 'Cash on Delivery'}</strong>
            </p>
            {order.paymentScreenshot && (
              <div className="space-y-3">
                <div
                  onClick={() => setZoomOpen(true)}
                  className="aspect-[4/3] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden cursor-pointer relative group"
                >
                  <ResilientImage
                    src={order.paymentScreenshot}
                    alt="Payment screenshot"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <ZoomIn className="h-6 w-6" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => verifyOrderPayment(order.id, 'Verified')}
                    className="bg-[#080808] text-white py-2.5 uppercase tracking-widest"
                  >
                    Approve Payment
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      verifyOrderPayment(order.id, 'Rejected', 'Reference ID mismatch')
                    }
                    className="border border-red-800 text-red-800 py-2.5 uppercase tracking-widest"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomOpen && order.paymentScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white p-4 max-w-lg w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs">Ref: {order.transactionRef}</span>
              <button type="button" onClick={() => setZoomOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <ResilientImage
              src={order.paymentScreenshot}
              alt="Zoomed proof"
              className="w-full max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPaymentsPage: React.FC = () => {
  const { orders, verifyOrderPayment } = useStore();
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'Pending Verification' | 'Verified' | 'Rejected' | 'COD'
  >('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'COD') return o.paymentMethod === 'COD';
    return o.paymentStatus === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Finance & QR Verification Desk
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Payment Verification & Ledger
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'Pending Verification', 'Verified', 'Rejected', 'COD'] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border ${
                activeTab === tab
                  ? 'bg-[#080808] text-white border-[#080808]'
                  : 'bg-white text-[#080808] border-[#E5E5E5]'
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Transactions Table */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] overflow-x-auto h-fit">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Method / Ref</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filtered.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`cursor-pointer transition-colors ${
                    selectedOrder?.id === ord.id ? 'bg-[#F3F3F3]' : 'hover:bg-[#F3F3F3]/40'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">{ord.customerName}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{ord.paymentMethod}</span>
                    {ord.transactionRef && (
                      <span className="block font-mono text-[11px] text-[#777777]">
                        {ord.transactionRef}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    {formatCurrency(ord.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{ord.paymentStatus}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="underline text-[#080808]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right 5 Cols: Payment Review Details Panel */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="bg-white border border-[#080808] p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#777777]">
                    Payment Review Dossier
                  </span>
                  <h2 className="font-serif text-xl text-[#080808]">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                </div>
                <span className="font-mono px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5]">
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Customer:</span>
                  <span className="font-semibold">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Phone:</span>
                  <span className="font-mono">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Payment Gateway:</span>
                  <span className="font-semibold">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Payable Amount:</span>
                  <span className="font-mono font-semibold text-sm">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Transaction Reference:</span>
                  <span className="font-mono font-semibold">
                    {selectedOrder.transactionRef || 'COD Settlement'}
                  </span>
                </div>
              </div>

              {selectedOrder.paymentScreenshot ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-[#777777]">
                      Uploaded Screenshot Proof
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomImage(selectedOrder.paymentScreenshot!)}
                      className="inline-flex items-center gap-1 underline text-[#080808]"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                      <span>Zoom Image</span>
                    </button>
                  </div>
                  <div
                    onClick={() => setZoomImage(selectedOrder.paymentScreenshot!)}
                    className="aspect-[16/10] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden cursor-pointer"
                  >
                    <ResilientImage
                      src={selectedOrder.paymentScreenshot}
                      alt="Uploaded payment proof"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F3F3F3] text-[#777777] text-center">
                  Cash on Delivery Order — No QR Screenshot Required
                </div>
              )}

              {/* Approve / Reject Controls */}
              <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Rejection Reason (Required if rejecting)
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Reference number not found in bank statement"
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      verifyOrderPayment(selectedOrder.id, 'Verified');
                      setSelectedOrder({ ...selectedOrder, paymentStatus: 'Verified' });
                    }}
                    className="bg-[#080808] text-white py-3 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      verifyOrderPayment(
                        selectedOrder.id,
                        'Rejected',
                        rejectionReason || 'Invalid screenshot proof'
                      );
                      setSelectedOrder({ ...selectedOrder, paymentStatus: 'Rejected' });
                    }}
                    className="border border-red-800 text-red-800 py-3 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 hover:bg-red-800 hover:text-white transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white p-4 max-w-xl w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest font-semibold">
                High-Resolution Payment Screenshot Inspection
              </span>
              <button type="button" onClick={() => setZoomImage(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <ResilientImage
              src={zoomImage}
              alt="Zoomed proof"
              className="w-full max-h-[75vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCustomersPage: React.FC = () => {
  const { customers, toggleCustomerAccountStatus } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Clientele Registry
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Customers ({filtered.length})
        </h1>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-4 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, email, or phone..."
          className="w-full border border-[#E5E5E5] px-3.5 py-2 text-xs"
        />
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Total Spending</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4 font-semibold">{c.fullName}</td>
                <td className="py-3.5 px-4">
                  <p>{c.email}</p>
                  <p className="font-mono text-[#777777]">{c.phone}</p>
                </td>
                <td className="py-3.5 px-4 font-mono">{c.joinedDate}</td>
                <td className="py-3.5 px-4 font-mono">{c.totalOrders}</td>
                <td className="py-3.5 px-4 font-mono font-semibold">
                  {formatCurrency(c.totalSpending)}
                </td>
                <td className="py-3.5 px-4 font-semibold">{c.status}</td>
                <td className="py-3.5 px-4 text-right space-x-3">
                  <Link
                    to={`/admin/customers/${c.id}`}
                    className="underline font-semibold text-[#080808]"
                  >
                    View Dossier
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleCustomerAccountStatus(c.id)}
                    className="text-[#777777] hover:text-[#080808]"
                  >
                    {c.status === 'Active' ? 'Suspend' : 'Activate'}
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

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { customers, orders, toggleCustomerAccountStatus } = useStore();
  const customer = customers.find((c) => c.id === id) || customers[0];
  const customerOrders = orders.filter((o) => o.customerId === customer.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <Link
            to="/admin/customers"
            className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808] inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Customers</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            {customer.fullName} — Client Dossier
          </h1>
        </div>
        <button
          type="button"
          onClick={() => toggleCustomerAccountStatus(customer.id)}
          className="border border-[#080808] px-4 py-2 text-xs uppercase tracking-widest"
        >
          Status: {customer.status} (Click to Toggle)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white border border-[#E5E5E5] p-6 space-y-2">
          <p className="uppercase tracking-widest text-[#777777]">Contact Details</p>
          <p className="font-semibold text-sm">{customer.fullName}</p>
          <p>{customer.email}</p>
          <p className="font-mono">{customer.phone}</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-6 space-y-2">
          <p className="uppercase tracking-widest text-[#777777]">Lifetime Valuation</p>
          <p className="font-mono text-2xl font-semibold">
            {formatCurrency(customer.totalSpending)}
          </p>
          <p className="text-[#777777]">Across {customer.totalOrders} orders</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] p-6 space-y-2">
          <p className="uppercase tracking-widest text-[#777777]">Primary Address</p>
          {customer.addresses[0] ? (
            <>
              <p className="font-semibold">{customer.addresses[0].street}</p>
              <p>
                {customer.addresses[0].municipality}, {customer.addresses[0].district}
              </p>
            </>
          ) : (
            <p className="text-[#777777]">No saved address</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#080808]">Client Order History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {customerOrders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 px-4 font-mono font-semibold">
                    <Link to={`/admin/orders/${o.id}`} className="underline">
                      #{o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono">{o.date}</td>
                  <td className="py-3 px-4 font-mono">{formatCurrency(o.totalAmount)}</td>
                  <td className="py-3 px-4">
                    {o.paymentMethod} ({o.paymentStatus})
                  </td>
                  <td className="py-3 px-4 font-semibold">{o.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminStaffPage: React.FC = () => {
  const { staff, toggleStaffStatus } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            House Personnel
          </p>
          <h1 className="font-serif text-3xl text-[#080808] mt-1">
            Staff Management ({staff.length})
          </h1>
        </div>
        <Link
          to="/admin/staff/create"
          className="bg-[#080808] text-white px-5 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Staff Member</span>
        </Link>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Full Name</th>
              <th className="py-3.5 px-4">Email & Phone</th>
              <th className="py-3.5 px-4">Assigned Role</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4 font-semibold">{member.fullName}</td>
                <td className="py-3.5 px-4">
                  <p>{member.email}</p>
                  <p className="font-mono text-[#777777]">{member.phone}</p>
                </td>
                <td className="py-3.5 px-4 font-semibold">{member.role}</td>
                <td className="py-3.5 px-4 font-mono">{member.lastActive}</td>
                <td className="py-3.5 px-4 font-semibold">{member.status}</td>
                <td className="py-3.5 px-4 text-right space-x-3">
                  <Link
                    to={`/admin/staff/${member.id}/edit`}
                    className="underline text-[#080808]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleStaffStatus(member.id)}
                    className="text-[#777777] hover:text-[#080808]"
                  >
                    {member.status === 'Active' ? 'Deactivate' : 'Activate'}
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

export const AdminStaffFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { staff, saveStaffMember } = useStore();
  const navigate = useNavigate();

  const existing = id ? staff.find((s) => s.id === id) : undefined;
  const [fullName, setFullName] = useState(existing?.fullName || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [phone, setPhone] = useState(existing?.phone || '+977 98010000');
  const [role, setRole] = useState<StaffMember['role']>(
    existing?.role || 'Order Manager'
  );
  const [status, setStatus] = useState<StaffMember['status']>(
    existing?.status || 'Active'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStaffMember({
      id: existing?.id || `STF-0${staff.length + 1}`,
      fullName,
      email,
      phone,
      role,
      status,
      joinedDate: existing?.joinedDate || new Date().toISOString().slice(0, 10),
      lastActive: 'Just now',
    });
    navigate('/admin/staff');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <Link
          to="/admin/staff"
          className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808]"
        >
          ← Back to Staff List
        </Link>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          {existing ? `Edit Staff: ${existing.fullName}` : 'Appoint New Staff Member'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-4 text-xs"
      >
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Official Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#E5E5E5] px-3.5 py-2.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffMember['role'])}
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Payment Manager">Payment Manager</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-[#777777] mb-1">
              Account Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StaffMember['status'])}
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <Link
            to="/admin/staff"
            className="px-5 py-2.5 border border-[#E5E5E5] uppercase tracking-widest"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-7 py-2.5 bg-[#080808] text-white uppercase tracking-widest font-semibold"
          >
            Save Staff Member
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminRolesPage: React.FC = () => {
  const { roles, updateRolePermissions } = useStore();
  const [selectedRoleName, setSelectedRoleName] = useState<StaffMember['role']>('Admin');

  const activeRole = roles.find((r) => r.role === selectedRoleName) || roles[0];

  const togglePerm = (
    moduleIdx: number,
    field: 'view' | 'create' | 'edit' | 'delete'
  ) => {
    const updatedModules = activeRole.modules.map((m, i) =>
      i === moduleIdx ? { ...m, [field]: !m[field] } : m
    );
    updateRolePermissions({
      ...activeRole,
      modules: updatedModules,
    });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Access Governance
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Roles & Module Permission Matrix
        </h1>
      </div>

      {/* Role Selector Bar */}
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <button
            key={r.role}
            type="button"
            onClick={() => setSelectedRoleName(r.role)}
            className={`px-4 py-2.5 text-xs uppercase tracking-widest border ${
              activeRole.role === r.role
                ? 'bg-[#080808] text-white border-[#080808]'
                : 'bg-white text-[#080808] border-[#E5E5E5]'
            }`}
          >
            {r.role}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#080808]">{activeRole.role}</h2>
          <p className="text-xs text-[#555555] mt-1">{activeRole.description}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">System Module</th>
                <th className="py-3.5 px-4 text-center">View Access</th>
                <th className="py-3.5 px-4 text-center">Create Records</th>
                <th className="py-3.5 px-4 text-center">Edit / Verify</th>
                <th className="py-3.5 px-4 text-center">Delete Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {activeRole.modules.map((mod, idx) => (
                <tr key={mod.module} className="hover:bg-[#F3F3F3]/40">
                  <td className="py-3.5 px-4 font-semibold">{mod.module}</td>
                  {(['view', 'create', 'edit', 'delete'] as const).map((perm) => (
                    <td key={perm} className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => togglePerm(idx, perm)}
                        className={`h-6 w-6 inline-flex items-center justify-center border ${
                          mod[perm]
                            ? 'bg-[#080808] text-white border-[#080808]'
                            : 'bg-white text-transparent border-[#CCCCCC]'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
