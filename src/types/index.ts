export type GenderCollection = 'Men' | 'Women' | 'Unisex';

export interface ProductVariantStock {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description: string;
  materialsAndCare: string[];
  shippingInfo: string;
  category: string;
  categorySlug: string;
  collection: GenderCollection;
  collectionTag?: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercent: number;
  images: string[];
  mainImage: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  variantStock: ProductVariantStock[];
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  onSale: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: 'Active' | 'Inactive';
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  featured: boolean;
  productIds: string[];
  status: 'Active' | 'Draft';
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
}

export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  street: string;
  landmark: string;
  isDefault: boolean;
}

export type PaymentMethodType = 'COD' | 'eSewa' | 'Khalti' | 'Fonepay';
export type PaymentStatusType = 'Pending Verification' | 'Verified' | 'Rejected' | 'COD Pending' | 'Paid';
export type OrderStatusType = 'Placed' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatusType;
  date: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryMethod: 'Standard' | 'Express';
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  transactionRef?: string;
  paymentScreenshot?: string;
  rejectionReason?: string;
  orderStatus: OrderStatusType;
  shippingAddress: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    street: string;
    landmark: string;
    instructions?: string;
  };
  timeline: OrderTimelineEvent[];
  adminNotes?: string;
  cancellationRequested?: boolean;
  cancellationReason?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpending: number;
  status: 'Active' | 'Suspended';
  addresses: CustomerAddress[];
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Admin' | 'Order Manager' | 'Product Manager' | 'Payment Manager' | 'Customer Support';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastActive: string;
}

export interface RolePermission {
  role: StaffMember['role'];
  description: string;
  modules: {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'Active' | 'Inactive';
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface CampaignBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopImage: string;
  mobileImage: string;
  displayOrder: number;
  active: boolean;
}

export interface DeliveryZone {
  id: string;
  province: string;
  district: string;
  standardCharge: number;
  expressCharge: number;
  estimatedTime: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'Order' | 'Payment' | 'Stock' | 'Account';
  date: string;
  read: boolean;
  target: 'customer' | 'admin' | 'both';
}

export interface AuditLogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  date: string;
  details: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  flagshipAddress: string;
  announcementBarText: string;
  announcementBarActive: boolean;
  instagramUrl: string;
  pinterestUrl: string;
  weiboUrl: string;
  expressDeliveryEnabled: boolean;
}

export interface PaymentGatewaySettings {
  codEnabled: boolean;
  codInstructions: string;
  esewaEnabled: boolean;
  esewaMerchantId: string;
  esewaQrImage: string;
  khaltiEnabled: boolean;
  khaltiMerchantId: string;
  khaltiQrImage: string;
  fonepayEnabled: boolean;
  fonepayMerchantName: string;
  fonepayQrImage: string;
  paymentInstructions: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  change: number;
  reason: string;
  date: string;
  performedBy: string;
}
