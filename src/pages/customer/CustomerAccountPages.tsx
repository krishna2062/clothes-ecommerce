import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Package,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  Upload,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../data/mockData';
import { CustomerAddress } from '../../types';
import { ResilientImage } from '../../components/product/ProductCard';
import { WishlistPage } from '../public/WishlistAndCartPages';

export const AccountOverviewPage: React.FC = () => {
  const { currentCustomer, orders, notifications, wishlist } = useStore();
  const customerOrders = orders.filter((o) => o.customerId === currentCustomer.id);
  const pendingOrders = customerOrders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  );
  const recentNotifications = notifications
    .filter((n) => n.target === 'customer' || n.target === 'both')
    .slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Welcome Banner & Summary Metrics */}
      <div className="border border-[#E5E5E5] p-6 sm:p-8 bg-[#F3F3F3]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Private Client Welcome
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#080808] mt-1">
            Good Day, {currentCustomer.fullName}
          </h2>
          <p className="text-xs text-[#555555] mt-1">
            {currentCustomer.email} · {currentCustomer.phone}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/account/profile"
            className="border border-[#080808] px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#080808] hover:text-white transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/shop"
            className="bg-[#080808] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#222222]"
          >
            New Arrivals
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">Total Orders</p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {customerOrders.length}
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Active / Pending
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {pendingOrders.length}
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Saved Wishlist
          </p>
          <p className="font-mono text-2xl font-semibold tabular-nums mt-2">
            {wishlist.length}
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#777777]">
            Lifetime Acquisition
          </p>
          <p className="font-mono text-xl font-semibold tabular-nums mt-2">
            {formatCurrency(
              customerOrders.reduce((sum, o) => sum + o.totalAmount, 0)
            )}
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-[#080808]">Recent Atelier Orders</h3>
          <Link
            to="/account/orders"
            className="text-xs uppercase tracking-widest underline underline-offset-4"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto border border-[#E5E5E5]">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {customerOrders.slice(0, 4).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F3F3F3]/40">
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{ord.date}</td>
                  <td className="py-3.5 px-4">
                    {ord.items.length} {ord.items.length === 1 ? 'Piece' : 'Pieces'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    {formatCurrency(ord.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    {ord.paymentMethod} · {ord.paymentStatus}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{ord.orderStatus}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/account/orders/${ord.id}`}
                      className="underline underline-offset-4 font-medium"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Notifications & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#080808]">Recent Dispatches</h3>
            <Link
              to="/account/notifications"
              className="text-xs underline underline-offset-4"
            >
              All Alerts
            </Link>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {recentNotifications.map((n) => (
              <div key={n.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#080808]">{n.title}</span>
                  <span className="text-[11px] text-[#777777]">{n.date}</span>
                </div>
                <p className="text-xs text-[#555555]">{n.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#E5E5E5] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#080808]">Quick Dossier Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              to="/account/addresses"
              className="border border-[#E5E5E5] p-4 hover:border-[#080808] transition-colors"
            >
              <p className="text-xs uppercase tracking-widest font-semibold">
                Delivery Addresses
              </p>
              <p className="text-[11px] text-[#777777] mt-1">
                {currentCustomer.addresses.length} saved locations
              </p>
            </Link>
            <Link
              to="/account/payment-history"
              className="border border-[#E5E5E5] p-4 hover:border-[#080808] transition-colors"
            >
              <p className="text-xs uppercase tracking-widest font-semibold">
                Payment Ledger
              </p>
              <p className="text-[11px] text-[#777777] mt-1">
                eSewa, Khalti & Fonepay receipts
              </p>
            </Link>
            <Link
              to="/account/change-password"
              className="border border-[#E5E5E5] p-4 hover:border-[#080808] transition-colors"
            >
              <p className="text-xs uppercase tracking-widest font-semibold">
                Security Credentials
              </p>
              <p className="text-[11px] text-[#777777] mt-1">
                Update account password
              </p>
            </Link>
            <Link
              to="/size-guide"
              className="border border-[#E5E5E5] p-4 hover:border-[#080808] transition-colors"
            >
              <p className="text-xs uppercase tracking-widest font-semibold">
                Size & Fit Matrix
              </p>
              <p className="text-[11px] text-[#777777] mt-1">
                Unisex tailoring chart
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountProfilePage: React.FC = () => {
  const { currentCustomer, updateCustomerProfile } = useStore();
  const [fullName, setFullName] = useState(currentCustomer.fullName);
  const [email, setEmail] = useState(currentCustomer.email);
  const [phone, setPhone] = useState(currentCustomer.phone);
  const [avatar, setAvatar] = useState(currentCustomer.avatar);
  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({ fullName, email, phone, avatar });
    setIsEditing(false);
  };

  return (
    <div className="border border-[#E5E5E5] p-6 sm:p-10 space-y-8">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Personal Identity
          </p>
          <h2 className="font-serif text-2xl text-[#080808] mt-1">My Client Profile</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="border border-[#080808] px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#080808] hover:text-white transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 border border-[#E5E5E5] bg-[#F3F3F3] overflow-hidden shrink-0">
            <ResilientImage
              src={avatar}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>
          {isEditing && (
            <label className="cursor-pointer border border-[#080808] px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-[#F3F3F3]">
              <Upload className="h-3.5 w-3.5" />
              <span>Change Portrait</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] disabled:bg-[#F3F3F3] focus:outline-none focus:border-[#080808]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled={!isEditing}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] disabled:bg-[#F3F3F3] focus:outline-none focus:border-[#080808]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              disabled={!isEditing}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] disabled:bg-[#F3F3F3] focus:outline-none focus:border-[#080808]"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#080808] text-white px-7 py-3 text-xs uppercase tracking-widest font-semibold"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="border border-[#E5E5E5] px-6 py-3 text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export const AccountAddressesPage: React.FC = () => {
  const {
    currentCustomer,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerAddress,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('Primary Residence');
  const [fullName, setFullName] = useState(currentCustomer.fullName);
  const [phone, setPhone] = useState(currentCustomer.phone);
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('Kathmandu');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [ward, setWard] = useState('Ward 03');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setLabel('Residence');
    setFullName(currentCustomer.fullName);
    setPhone(currentCustomer.phone);
    setProvince('Bagmati Province');
    setDistrict('Kathmandu');
    setMunicipality('Kathmandu Metropolitan City');
    setWard('Ward 01');
    setStreet('');
    setLandmark('');
    setIsDefault(false);
    setModalOpen(true);
  };

  const openEditModal = (addr: CustomerAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setProvince(addr.province);
    setDistrict(addr.district);
    setMunicipality(addr.municipality);
    setWard(addr.ward);
    setStreet(addr.street);
    setLandmark(addr.landmark);
    setIsDefault(addr.isDefault);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustomerAddress({
        id: editingId,
        label,
        fullName,
        phone,
        province,
        district,
        municipality,
        ward,
        street,
        landmark,
        isDefault,
      });
    } else {
      addCustomerAddress({
        label,
        fullName,
        phone,
        province,
        district,
        municipality,
        ward,
        street,
        landmark,
        isDefault,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Courier Destinations
          </p>
          <h2 className="font-serif text-2xl text-[#080808] mt-1">My Delivery Addresses</h2>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#080808] text-white px-5 py-2.5 text-xs uppercase tracking-widest inline-flex items-center gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentCustomer.addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border p-6 flex flex-col justify-between space-y-4 ${
              addr.isDefault ? 'border-[#080808] bg-[#F3F3F3]/40' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest font-semibold text-[#080808]">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#080808] underline">
                    Default Destination
                  </span>
                )}
              </div>
              <p className="font-semibold text-[#080808]">{addr.fullName}</p>
              <p className="text-[#555555]">
                {addr.street}, {addr.ward}, {addr.municipality}
              </p>
              <p className="text-[#555555]">
                {addr.district}, {addr.province}
              </p>
              <p className="text-[#777777]">Landmark: {addr.landmark}</p>
              <p className="font-mono text-[#080808] pt-1">{addr.phone}</p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => openEditModal(addr)}
                  className="inline-flex items-center gap-1 text-[#080808] hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteCustomerAddress(addr.id)}
                  className="inline-flex items-center gap-1 text-[#777777] hover:text-[#080808]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultCustomerAddress(addr.id)}
                  className="underline text-[#080808]"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border border-[#080808] max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-serif text-xl">
                {editingId ? 'Edit Delivery Address' : 'Add Delivery Address'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Address Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Province *
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
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Municipality *
                  </label>
                  <input
                    type="text"
                    required
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Ward *
                  </label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Tole / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block uppercase tracking-wider text-[#777777] mb-1">
                    Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full border border-[#E5E5E5] px-3 py-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#080808]"
                />
                <span>Set as default shipping destination</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E5E5] uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#080808] text-white uppercase tracking-widest"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AccountOrdersPage: React.FC = () => {
  const { orders } = useStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Acquisition Archive
        </p>
        <h2 className="font-serif text-2xl text-[#080808] mt-1">My Orders ({orders.length})</h2>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-[#E5E5E5] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono font-semibold text-sm text-[#080808]">
                  Order #{order.orderNumber}
                </span>
                <span className="text-[#777777]">·</span>
                <span className="font-mono text-[#555555]">{order.date}</span>
                <span className="text-[#777777]">·</span>
                <span>
                  Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="uppercase tracking-widest font-semibold text-[#080808]">
                  Status: {order.orderStatus}
                </span>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="bg-[#080808] text-white px-4 py-2 text-xs uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-14 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#080808]">{item.name}</p>
                      <p className="text-[#777777]">
                        {item.size} · {item.color} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] uppercase tracking-widest text-[#777777]">
                  Total Amount
                </p>
                <p className="font-mono text-base font-semibold tabular-nums text-[#080808]">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AccountOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, requestOrderCancellation } = useStore();
  const order = orders.find((o) => o.id === id) || orders[0];

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed size preference');
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOrderCancellation(order.id, cancelReason);
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <Link
            to="/account/orders"
            className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808]"
          >
            ← Back to Orders
          </Link>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#080808] mt-1">
            Order #{order.orderNumber} Dossier
          </h2>
        </div>

        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
          <button
            type="button"
            onClick={() => setCancelModalOpen(true)}
            className="border border-red-800 text-red-800 px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-800 hover:text-white transition-colors"
          >
            Request Cancellation
          </button>
        )}
      </div>

      {/* Order Status Timeline */}
      <div className="border border-[#E5E5E5] p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#080808]">
          Order Status Timeline — Current: {order.orderStatus}
        </h3>
        <div className="space-y-3 border-l border-[#080808] pl-5 ml-2">
          {order.timeline.map((ev, i) => (
            <div key={i} className="relative text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold uppercase tracking-wider text-[#080808]">
                  {ev.status}
                </span>
                <span className="font-mono text-[#777777]">{ev.date}</span>
              </div>
              <p className="text-[#555555] mt-0.5">{ev.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Information + Screenshot Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#E5E5E5] p-6 space-y-2 text-xs">
          <h3 className="uppercase tracking-[0.18em] font-semibold text-[#080808] pb-2 border-b border-[#E5E5E5]">
            Shipping Destination
          </h3>
          <p className="font-semibold text-[#080808] pt-1">{order.customerName}</p>
          <p className="text-[#555555]">
            {order.shippingAddress.street}, {order.shippingAddress.ward}
          </p>
          <p className="text-[#555555]">
            {order.shippingAddress.municipality}, {order.shippingAddress.district}
          </p>
          <p className="text-[#555555]">{order.shippingAddress.province}</p>
          <p className="text-[#777777]">Landmark: {order.shippingAddress.landmark}</p>
          <p className="font-mono text-[#080808] pt-1">{order.customerPhone}</p>
        </div>

        <div className="border border-[#E5E5E5] p-6 space-y-3 text-xs">
          <h3 className="uppercase tracking-[0.18em] font-semibold text-[#080808] pb-2 border-b border-[#E5E5E5]">
            Payment Settlement & Proof
          </h3>
          <div className="flex justify-between">
            <span className="text-[#777777]">Method:</span>
            <span className="font-semibold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Verification Status:</span>
            <span className="font-semibold">{order.paymentStatus}</span>
          </div>
          {order.transactionRef && (
            <div className="flex justify-between">
              <span className="text-[#777777]">Transaction Ref:</span>
              <span className="font-mono">{order.transactionRef}</span>
            </div>
          )}
          {order.paymentScreenshot && (
            <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5]">
              <span className="text-[#777777]">Uploaded QR Screenshot:</span>
              <button
                type="button"
                onClick={() => setScreenshotModalOpen(true)}
                className="underline font-semibold text-[#080808]"
              >
                Preview Screenshot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product List & Financial Breakdown */}
      <div className="border border-[#E5E5E5] p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#080808]">
          Ordered Garments
        </h3>
        <div className="divide-y divide-[#E5E5E5]">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="py-4 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden shrink-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-serif text-base text-[#080808] hover:underline"
                  >
                    {item.name}
                  </Link>
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

        <div className="pt-4 border-t border-[#E5E5E5] space-y-2 text-xs tabular-nums max-w-xs ml-auto">
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
            <span>Total</span>
            <span className="font-mono">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {screenshotModalOpen && order.paymentScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white border border-[#080808] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h4 className="font-serif text-lg">
                Payment Proof — {order.paymentMethod} ({order.transactionRef})
              </h4>
              <button type="button" onClick={() => setScreenshotModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-[3/4] bg-[#F3F3F3] overflow-hidden border border-[#E5E5E5]">
              <ResilientImage
                src={order.paymentScreenshot}
                alt="Payment proof"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Request Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form
            onSubmit={handleCancelSubmit}
            className="bg-white border border-[#080808] max-w-md w-full p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-2 font-serif text-lg">
                <AlertTriangle className="h-4 w-4 text-red-700" />
                <span>Request Order Cancellation</span>
              </div>
              <button type="button" onClick={() => setCancelModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-[#555555]">
              Please state the reason for cancelling Order #{order.orderNumber}:
            </p>
            <textarea
              rows={3}
              required
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-[#E5E5E5] p-3"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-[#E5E5E5] uppercase tracking-widest"
              >
                Keep Order
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-800 text-white uppercase tracking-widest"
              >
                Confirm Cancellation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const AccountWishlistPage: React.FC = () => {
  return <WishlistPage isEmbedded />;
};

export const AccountPaymentHistoryPage: React.FC = () => {
  const { orders } = useStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E5] pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Financial Settlements
        </p>
        <h2 className="font-serif text-2xl text-[#080808] mt-1">Payment History</h2>
      </div>

      <div className="overflow-x-auto border border-[#E5E5E5]">
        <table className="w-full text-left border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Order Number</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F3F3F3]/40">
                <td className="py-3.5 px-4 font-mono">
                  {ord.transactionRef || `COD-${ord.orderNumber}`}
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold">
                  <Link to={`/account/orders/${ord.id}`} className="underline">
                    #{ord.orderNumber}
                  </Link>
                </td>
                <td className="py-3.5 px-4">{ord.paymentMethod}</td>
                <td className="py-3.5 px-4 font-mono font-semibold">
                  {formatCurrency(ord.totalAmount)}
                </td>
                <td className="py-3.5 px-4 font-mono">{ord.date}</td>
                <td className="py-3.5 px-4 font-semibold">{ord.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AccountChangePasswordPage: React.FC = () => {
  const { showToast } = useStore();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      showToast('Password Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }
    showToast('Security Credentials Updated', 'Your password has been rotated.', 'success');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div className="border border-[#E5E5E5] p-6 sm:p-10 space-y-6 max-w-xl">
      <div className="border-b border-[#E5E5E5] pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Account Security
        </p>
        <h2 className="font-serif text-2xl text-[#080808] mt-1">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            Current Password *
          </label>
          <input
            type="password"
            required
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 focus:outline-none focus:border-[#080808]"
          />
        </div>
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            New Password *
          </label>
          <input
            type="password"
            required
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 focus:outline-none focus:border-[#080808]"
          />
        </div>
        <div>
          <label className="block uppercase tracking-wider text-[#777777] mb-1.5">
            Confirm New Password *
          </label>
          <input
            type="password"
            required
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 focus:outline-none focus:border-[#080808]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#080808] text-white px-7 py-3.5 uppercase tracking-widest font-semibold"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export const AccountNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const list = notifications.filter(
    (n) => n.target === 'customer' || n.target === 'both'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            Client Dispatches
          </p>
          <h2 className="font-serif text-2xl text-[#080808] mt-1">Notifications</h2>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="border border-[#080808] px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#080808] hover:text-white transition-colors"
        >
          Mark All as Read
        </button>
      </div>

      <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5]">
        {list.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex items-start justify-between gap-4 ${
              n.read ? 'bg-white' : 'bg-[#F3F3F3]/60'
            }`}
          >
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest text-[10px] font-mono text-[#777777]">
                  [{n.category}]
                </span>
                <span className="font-semibold text-[#080808]">{n.title}</span>
              </div>
              <p className="text-[#555555]">{n.message}</p>
              <p className="text-[11px] text-[#777777] font-mono">{n.date}</p>
            </div>
            {!n.read && (
              <button
                type="button"
                onClick={() => markNotificationRead(n.id)}
                className="text-xs underline text-[#080808] shrink-0"
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
