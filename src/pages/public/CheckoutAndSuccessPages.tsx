import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Upload,
  X,
  QrCode,
  ShieldCheck,
  Truck,
  Banknote,
  Smartphone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../data/mockData';
import { PaymentMethodType } from '../../types';
import { ResilientImage } from '../../components/product/ProductCard';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    currentCustomer,
    appliedCoupon,
    brandSettings,
    paymentSettings,
    deliveryZones,
    placeOrder,
    showToast,
  } = useStore();
  const navigate = useNavigate();

  const defaultAddr = currentCustomer.addresses.find((a) => a.isDefault) || currentCustomer.addresses[0];

  // Section 1: Customer Info
  const [fullName, setFullName] = useState(currentCustomer.fullName);
  const [phone, setPhone] = useState(currentCustomer.phone);
  const [email, setEmail] = useState(currentCustomer.email);

  // Section 2: Delivery Address
  const [province, setProvince] = useState(defaultAddr?.province || 'Bagmati Province');
  const [district, setDistrict] = useState(defaultAddr?.district || 'Kathmandu');
  const [municipality, setMunicipality] = useState(
    defaultAddr?.municipality || 'Kathmandu Metropolitan City'
  );
  const [ward, setWard] = useState(defaultAddr?.ward || 'Ward 03');
  const [street, setStreet] = useState(
    defaultAddr?.street || 'Maharajgunj Embassies Enclave'
  );
  const [landmark, setLandmark] = useState(
    defaultAddr?.landmark || 'Opposite Swiss Residence Gate'
  );
  const [instructions, setInstructions] = useState('');

  // Section 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Standard');

  // Section 4: Payment Method & Manual QR Upload
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('eSewa');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState<string>('');

  const matchedZone =
    deliveryZones.find((z) => z.district.toLowerCase().includes(district.toLowerCase())) ||
    deliveryZones[0];

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'Percentage'
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;
  const deliveryCharge =
    deliveryMethod === 'Express'
      ? matchedZone?.expressCharge || 300
      : matchedZone?.standardCharge || 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharge);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotPreview(reader.result);
        showToast('Payment Screenshot Attached', file.name, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError('Please complete all required customer information fields.');
      return;
    }

    if (!province.trim() || !district.trim() || !municipality.trim() || !ward.trim() || !street.trim()) {
      setFormError('Please provide your complete delivery address including Ward and Tole/Street.');
      return;
    }

    if (paymentMethod !== 'COD' && !transactionRef.trim()) {
      setFormError(
        `Please enter your ${paymentMethod} Transaction Reference ID for manual QR verification.`
      );
      return;
    }

    if (!termsAccepted) {
      setFormError('Please accept the Terms & Conditions and Return Policy to place your order.');
      return;
    }

    placeOrder({
      customerId: currentCustomer.id,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      items: cart,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      deliveryMethod,
      deliveryCharge,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'COD Pending' : 'Pending Verification',
      transactionRef: paymentMethod === 'COD' ? undefined : transactionRef,
      paymentScreenshot:
        paymentMethod === 'COD'
          ? undefined
          : screenshotPreview || cart[0]?.image,
      orderStatus: 'Placed',
      shippingAddress: {
        province,
        district,
        municipality,
        ward,
        street,
        landmark,
        instructions,
      },
    });

    navigate('/order-success');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#080808]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#777777]">
          Add garments to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-[#080808] text-white px-7 py-3.5 text-xs uppercase tracking-widest"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10">
      <div className="pb-8 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Atelier Client Acquisition
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
          Checkout & Payment Verification
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Left 7 Columns: Sections 1 to 4 */}
        <div className="lg:col-span-7 space-y-10">
          {formError && (
            <div className="border border-red-700 bg-red-50 p-4 text-xs text-red-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* SECTION 1: CUSTOMER INFORMATION */}
          <section className="border border-[#E5E5E5] p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-3">
              01. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: DELIVERY ADDRESS */}
          <section className="border border-[#E5E5E5] p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-3">
              02. Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Province *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                >
                  <option value="Bagmati Province">Bagmati Province</option>
                  <option value="Gandaki Province">Gandaki Province</option>
                  <option value="Koshi Province">Koshi Province</option>
                  <option value="Lumbini Province">Lumbini Province</option>
                  <option value="Madhesh Province">Madhesh Province</option>
                  <option value="Karnali Province">Karnali Province</option>
                  <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Kathmandu, Lalitpur, Kaski"
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Municipality / Metropolitan City *
                </label>
                <input
                  type="text"
                  required
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Ward Number *
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward 03"
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Tole / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Nearest Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Additional Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Gate security notes, preferred delivery hour..."
                  className="w-full border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: DELIVERY METHOD */}
          <section className="border border-[#E5E5E5] p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-3">
              03. Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod('Standard')}
                className={`p-4 border text-left transition-colors ${
                  deliveryMethod === 'Standard'
                    ? 'border-[#080808] bg-[#080808] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#080808] hover:border-[#080808]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    Standard Courier
                  </span>
                  <Truck className="h-4 w-4" />
                </div>
                <p
                  className={`text-xs mt-2 ${
                    deliveryMethod === 'Standard' ? 'text-[#CCCCCC]' : 'text-[#777777]'
                  }`}
                >
                  {matchedZone?.estimatedTime || '2–4 Business Days'} ·{' '}
                  {matchedZone?.standardCharge === 0
                    ? 'Complimentary'
                    : formatCurrency(matchedZone?.standardCharge || 150)}
                </p>
              </button>

              {brandSettings.expressDeliveryEnabled && (
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Express')}
                  className={`p-4 border text-left transition-colors ${
                    deliveryMethod === 'Express'
                      ? 'border-[#080808] bg-[#080808] text-white'
                      : 'border-[#E5E5E5] bg-white text-[#080808] hover:border-[#080808]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-semibold">
                      White-Glove Express
                    </span>
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      deliveryMethod === 'Express' ? 'text-[#CCCCCC]' : 'text-[#777777]'
                    }`}
                  >
                    Priority Direct Dispatch ·{' '}
                    {matchedZone?.expressCharge === 0
                      ? 'Complimentary'
                      : formatCurrency(matchedZone?.expressCharge || 300)}
                  </p>
                </button>
              )}
            </div>
          </section>

          {/* SECTION 4: PAYMENT METHODS & MANUAL QR INTERFACE */}
          <section className="border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-3">
              04. Select Payment Method
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { id: 'eSewa', label: 'eSewa Wallet', sub: 'Instant QR Transfer' },
                  { id: 'Khalti', label: 'Khalti Wallet', sub: 'Digital QR Payment' },
                  { id: 'Fonepay', label: 'Fonepay QR', sub: 'All Mobile Banking' },
                  { id: 'COD', label: 'Cash on Delivery', sub: 'Pay at Doorstep' },
                ] as { id: PaymentMethodType; label: string; sub: string }[]
              ).map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                      isSelected
                        ? 'border-[#080808] bg-[#080808] text-white'
                        : 'border-[#E5E5E5] bg-white text-[#080808] hover:border-[#080808]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {method.id === 'COD' ? (
                        <Banknote className="h-4 w-4" />
                      ) : (
                        <Smartphone className="h-4 w-4" />
                      )}
                      <span className="text-[10px] font-mono uppercase tracking-widest">
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider">
                        {method.label}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isSelected ? 'text-[#CCCCCC]' : 'text-[#777777]'
                        }`}
                      >
                        {method.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Payment Body */}
            {paymentMethod === 'COD' ? (
              <div className="bg-[#F3F3F3] p-5 border border-[#E5E5E5] space-y-2 text-xs">
                <p className="font-semibold uppercase tracking-wider text-[#080808]">
                  Cash on Delivery Terms
                </p>
                <p className="text-[#555555] leading-relaxed">
                  {paymentSettings.codInstructions}
                </p>
                <p className="font-mono text-[#080808] pt-1">
                  Exact Payable on Delivery: <strong>{formatCurrency(grandTotal)}</strong>
                </p>
              </div>
            ) : (
              <div className="border border-[#080808] bg-[#F3F3F3]/40 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#777777]">
                      Official Merchant Verification
                    </span>
                    <h3 className="font-serif text-lg text-[#080808]">
                      {paymentMethod} Manual QR Settlement
                    </h3>
                    <p className="text-xs text-[#555555] mt-0.5">
                      Merchant:{' '}
                      {paymentMethod === 'eSewa'
                        ? paymentSettings.esewaMerchantId
                        : paymentMethod === 'Khalti'
                        ? paymentSettings.khaltiMerchantId
                        : paymentSettings.fonepayMerchantName}
                    </p>
                  </div>
                  <div className="bg-[#080808] text-white px-4 py-2.5 text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-widest text-[#CCCCCC] block">
                      Payable Amount
                    </span>
                    <span className="font-mono text-base font-semibold tabular-nums">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Configurable QR Code Placeholder Box */}
                  <div className="md:col-span-5 bg-white border border-[#E5E5E5] p-5 flex flex-col items-center justify-center text-center">
                    <div className="w-40 h-40 border-2 border-[#080808] p-3 flex flex-col items-center justify-center bg-[#F3F3F3]">
                      <QrCode className="h-24 w-24 text-[#080808]" />
                      <span className="font-mono text-[10px] uppercase tracking-widest mt-1">
                        {paymentMethod} QR
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777777] mt-3">
                      Scan with {paymentMethod} or Mobile Banking App
                    </p>
                  </div>

                  {/* Screenshot Upload & Transaction Reference Input */}
                  <div className="md:col-span-7 space-y-4">
                    <p className="text-xs text-[#555555] leading-relaxed">
                      {paymentSettings.paymentInstructions}
                    </p>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#080808] font-medium mb-1.5">
                        {paymentMethod} Transaction Reference ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder={`e.g. ${paymentMethod.toUpperCase()}-99482716`}
                        className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2.5 text-xs font-mono text-[#080808] focus:outline-none focus:border-[#080808]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#080808] font-medium mb-1.5">
                        Upload Payment Confirmation Screenshot
                      </label>
                      {screenshotPreview ? (
                        <div className="relative border border-[#080808] bg-white p-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={screenshotPreview}
                              alt="Uploaded payment proof"
                              className="h-16 w-16 object-cover border border-[#E5E5E5]"
                            />
                            <div className="text-xs">
                              <p className="font-semibold text-[#080808]">
                                Payment Proof Attached
                              </p>
                              <p className="text-[#777777]">Ready for finance verification</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScreenshotPreview('')}
                            className="p-1.5 text-[#777777] hover:text-[#080808]"
                            title="Remove uploaded image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border border-dashed border-[#080808] bg-white p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F3F3F3] transition-colors">
                          <Upload className="h-5 w-5 text-[#080808] mb-2" />
                          <span className="text-xs font-medium text-[#080808]">
                            Click to Upload Screenshot (PNG / JPG)
                          </span>
                          <span className="text-[11px] text-[#777777] mt-0.5">
                            Or submit reference ID directly for demonstration
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right 5 Columns: SECTION 5 ORDER SUMMARY & SECTION 6 PLACE ORDER */}
        <div className="lg:col-span-5">
          <div className="border border-[#E5E5E5] bg-[#F3F3F3]/40 p-6 sm:p-8 space-y-6 sticky top-24">
            <h2 className="font-serif text-xl text-[#080808] border-b border-[#E5E5E5] pb-4">
              05. Order Summary ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
            </h2>

            <div className="divide-y divide-[#E5E5E5] max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] shrink-0 overflow-hidden">
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#080808] line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#777777] mt-0.5">
                        Size: {item.size} · {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-semibold shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#E5E5E5] text-xs tabular-nums">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#555555]">
                <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                <span className="font-mono">
                  {discount > 0 ? `- ${formatCurrency(discount)}` : 'NPR 0'}
                </span>
              </div>
              <div className="flex justify-between text-[#555555]">
                <span>Delivery ({deliveryMethod})</span>
                <span className="font-mono">
                  {deliveryCharge === 0 ? 'Complimentary' : formatCurrency(deliveryCharge)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#080808] flex justify-between items-baseline text-sm font-semibold text-[#080808]">
                <span className="uppercase tracking-widest">Grand Total</span>
                <span className="font-mono text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* SECTION 6: TERMS & PLACE ORDER */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-4">
              <label className="flex items-start gap-2.5 text-xs text-[#555555] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#080808] mt-0.5 h-4 w-4 shrink-0"
                />
                <span>
                  I have reviewed my garment measurements and agree to the{' '}
                  <Link to="/terms" className="underline text-[#080808]">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/return-policy" className="underline text-[#080808]">
                    Archival Return Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Complete Order ({formatCurrency(grandTotal)})</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-[#777777] text-center">
                Frontend Demonstration Notice: Orders are recorded in local client state for inspection in Customer & Admin portals.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const OrderConfirmationPage: React.FC = () => {
  const { lastCreatedOrder, orders } = useStore();
  const order = lastCreatedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-2xl">No Recent Order Found</p>
        <Link to="/shop" className="mt-4 inline-block underline text-xs uppercase tracking-widest">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14">
      <div className="border border-[#080808] bg-white p-8 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#080808] font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Atelier Order Dossier Recorded</span>
            </div>
            <h1 className="font-serif text-3xl text-[#080808]">
              Order #{order.orderNumber} Confirmed
            </h1>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest bg-[#F3F3F3] px-3 py-1.5 border border-[#E5E5E5]">
            {order.paymentStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <p className="uppercase tracking-widest text-[#777777]">Client</p>
            <p className="font-semibold text-[#080808] mt-1">{order.customerName}</p>
            <p className="text-[#555555]">{order.customerPhone}</p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-[#777777]">Delivery Destination</p>
            <p className="font-semibold text-[#080808] mt-1">
              {order.shippingAddress.street}, {order.shippingAddress.ward}
            </p>
            <p className="text-[#555555]">
              {order.shippingAddress.district}, {order.shippingAddress.province}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-[#777777]">Settlement Method</p>
            <p className="font-semibold text-[#080808] mt-1">{order.paymentMethod}</p>
            {order.transactionRef && (
              <p className="font-mono text-[#555555]">Ref: {order.transactionRef}</p>
            )}
          </div>
        </div>

        <div className="border-t border-b border-[#E5E5E5] py-6 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#080808]">
            Reserved Garments
          </p>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1.5">
              <span>
                {item.name} ({item.size} · {item.color}) × {item.quantity}
              </span>
              <span className="font-mono tabular-nums font-semibold">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className="pt-3 border-t border-[#E5E5E5] flex justify-between text-sm font-semibold">
            <span>Total Settlement</span>
            <span className="font-mono tabular-nums">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/account/orders/${order.id}`}
            className="bg-[#080808] text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#222222]"
          >
            Inspect Order Timeline
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/payments"
              className="text-xs uppercase tracking-widest underline underline-offset-4 text-[#080808]"
            >
              Verify in Admin Finance Desk
            </Link>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#080808]"
            >
              Return to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
