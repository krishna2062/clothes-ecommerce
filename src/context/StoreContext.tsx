import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CollectionItem,
  CartItem,
  Order,
  Customer,
  CustomerAddress,
  StaffMember,
  RolePermission,
  Coupon,
  ProductReview,
  CampaignBanner,
  DeliveryZone,
  AppNotification,
  AuditLogEntry,
  BrandSettings,
  PaymentGatewaySettings,
  StockMovement,
  OrderStatusType,
  PaymentStatusType,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_STAFF,
  INITIAL_ROLES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BRAND_SETTINGS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_STOCK_MOVEMENTS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'error';
}

export interface AuthenticatedSession {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: 'customer' | 'staff' | 'admin';
  roleTitle: string;
}

interface StoreContextType {
  // Entities
  products: Product[];
  categories: Category[];
  collections: CollectionItem[];
  cart: CartItem[];
  wishlist: string[]; // productIds
  orders: Order[];
  customers: Customer[];
  currentCustomer: Customer;
  authUser: AuthenticatedSession | null;
  staff: StaffMember[];
  roles: RolePermission[];
  coupons: Coupon[];
  reviews: ProductReview[];
  banners: CampaignBanner[];
  deliveryZones: DeliveryZone[];
  notifications: AppNotification[];
  auditLogs: AuditLogEntry[];
  brandSettings: BrandSettings;
  paymentSettings: PaymentGatewaySettings;
  stockMovements: StockMovement[];
  appliedCoupon: Coupon | null;
  lastCreatedOrder: Order | null;
  toasts: ToastMessage[];

  // Toast helper
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Unified Authentication (Customer, Staff, Admin)
  loginWithCredentials: (
    identifier: string,
    portalRole?: 'auto' | 'customer' | 'staff' | 'admin'
  ) => AuthenticatedSession;
  registerAccount: (data: {
    fullName: string;
    email: string;
    phone: string;
    accountType: 'customer' | 'staff' | 'admin';
    staffRole?: StaffMember['role'];
  }) => AuthenticatedSession;
  logoutUser: () => void;

  // Cart & Wishlist Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (product: Product) => void;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;

  // Checkout / Orders
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatusType, note?: string) => void;
  verifyOrderPayment: (orderId: string, status: PaymentStatusType, rejectionReason?: string) => void;
  requestOrderCancellation: (orderId: string, reason: string) => void;

  // Customer Account Actions
  updateCustomerProfile: (data: Partial<Customer>) => void;
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  updateCustomerAddress: (address: CustomerAddress) => void;
  deleteCustomerAddress: (id: string) => void;
  setDefaultCustomerAddress: (id: string) => void;
  toggleCustomerAccountStatus: (customerId: string) => void;

  // Admin Product / Category / Collection / Inventory CRUD
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  saveCollection: (collection: CollectionItem) => void;
  deleteCollection: (id: string) => void;
  adjustInventoryStock: (productId: string, size: string, color: string, delta: number, reason: string) => void;

  // Admin Staff, Roles, Coupons, Reviews, Banners, Delivery, Settings
  saveStaffMember: (member: StaffMember) => void;
  toggleStaffStatus: (id: string) => void;
  updateRolePermissions: (updatedRole: RolePermission) => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  updateReviewStatus: (id: string, status: ProductReview['status']) => void;
  deleteReview: (id: string) => void;
  saveBanner: (banner: CampaignBanner) => void;
  deleteBanner: (id: string) => void;
  saveDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateBrandSettings: (settings: BrandSettings) => void;
  updatePaymentSettings: (settings: PaymentGatewaySettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('yb_products_v1', INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage('yb_categories_v1', INITIAL_CATEGORIES)
  );
  const [collections, setCollections] = useState<CollectionItem[]>(() =>
    loadFromStorage('yb_collections_v1', INITIAL_COLLECTIONS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('yb_cart_v1', [
      {
        productId: 'PRD-001',
        slug: 'architectural-virgin-wool-overcoat',
        name: 'Architectural Virgin Wool Overcoat',
        image: INITIAL_PRODUCTS[0].mainImage,
        size: 'M',
        color: 'Obsidian Black',
        unitPrice: 42000,
        originalPrice: 48500,
        quantity: 1,
      },
    ])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadFromStorage('yb_wishlist_v1', ['PRD-002', 'PRD-004', 'PRD-005'])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage('yb_orders_v1', INITIAL_ORDERS)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadFromStorage('yb_customers_v2', INITIAL_CUSTOMERS)
  );
  const [activeCustomerId, setActiveCustomerId] = useState<string>(() =>
    loadFromStorage('yb_active_customer_id_v2', INITIAL_CUSTOMERS[0].id)
  );
  const [authUser, setAuthUser] = useState<AuthenticatedSession | null>(() =>
    loadFromStorage<AuthenticatedSession | null>('yb_auth_user_v2', {
      id: INITIAL_CUSTOMERS[0].id,
      fullName: INITIAL_CUSTOMERS[0].fullName,
      email: INITIAL_CUSTOMERS[0].email,
      phone: INITIAL_CUSTOMERS[0].phone,
      accountType: 'customer',
      roleTitle: 'Private Client',
    })
  );
  const [staff, setStaff] = useState<StaffMember[]>(() =>
    loadFromStorage('yb_staff_v2', INITIAL_STAFF)
  );
  const [roles, setRoles] = useState<RolePermission[]>(() =>
    loadFromStorage('yb_roles_v1', INITIAL_ROLES)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadFromStorage('yb_coupons_v1', INITIAL_COUPONS)
  );
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    loadFromStorage('yb_reviews_v1', INITIAL_REVIEWS)
  );
  const [banners, setBanners] = useState<CampaignBanner[]>(() =>
    loadFromStorage('yb_banners_v1', INITIAL_BANNERS)
  );
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() =>
    loadFromStorage('yb_delivery_v1', INITIAL_DELIVERY_ZONES)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadFromStorage('yb_notifications_v1', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadFromStorage('yb_audit_v1', INITIAL_AUDIT_LOGS)
  );
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() =>
    loadFromStorage('yb_brand_v2', INITIAL_BRAND_SETTINGS)
  );
  const [paymentSettings, setPaymentSettings] = useState<PaymentGatewaySettings>(() =>
    loadFromStorage('yb_payment_v2', INITIAL_PAYMENT_SETTINGS)
  );
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    loadFromStorage('yb_stock_v1', INITIAL_STOCK_MOVEMENTS)
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(() =>
    INITIAL_ORDERS[0] || null
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('yb_products_v1', JSON.stringify(products));
      localStorage.setItem('yb_categories_v1', JSON.stringify(categories));
      localStorage.setItem('yb_collections_v1', JSON.stringify(collections));
      localStorage.setItem('yb_cart_v1', JSON.stringify(cart));
      localStorage.setItem('yb_wishlist_v1', JSON.stringify(wishlist));
      localStorage.setItem('yb_orders_v1', JSON.stringify(orders));
      localStorage.setItem('yb_customers_v2', JSON.stringify(customers));
      localStorage.setItem('yb_active_customer_id_v2', JSON.stringify(activeCustomerId));
      localStorage.setItem('yb_auth_user_v2', JSON.stringify(authUser));
      localStorage.setItem('yb_staff_v2', JSON.stringify(staff));
      localStorage.setItem('yb_roles_v1', JSON.stringify(roles));
      localStorage.setItem('yb_coupons_v1', JSON.stringify(coupons));
      localStorage.setItem('yb_reviews_v1', JSON.stringify(reviews));
      localStorage.setItem('yb_banners_v1', JSON.stringify(banners));
      localStorage.setItem('yb_delivery_v1', JSON.stringify(deliveryZones));
      localStorage.setItem('yb_notifications_v1', JSON.stringify(notifications));
      localStorage.setItem('yb_audit_v1', JSON.stringify(auditLogs));
      localStorage.setItem('yb_brand_v2', JSON.stringify(brandSettings));
      localStorage.setItem('yb_payment_v2', JSON.stringify(paymentSettings));
      localStorage.setItem('yb_stock_v1', JSON.stringify(stockMovements));
    } catch {
      // ignore storage quota errors
    }
  }, [
    products,
    categories,
    collections,
    cart,
    wishlist,
    orders,
    customers,
    activeCustomerId,
    authUser,
    staff,
    roles,
    coupons,
    reviews,
    banners,
    deliveryZones,
    notifications,
    auditLogs,
    brandSettings,
    paymentSettings,
    stockMovements,
  ]);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'default') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, module: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      user: authUser?.fullName || 'Siddhartha Bhandari',
      role: authUser?.roleTitle || 'Super Admin',
      action,
      module,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const currentCustomer =
    customers.find((c) => c.id === activeCustomerId) || customers[0];

  const loginWithCredentials = (
    identifier: string,
    portalRole: 'auto' | 'customer' | 'staff' | 'admin' = 'auto'
  ): AuthenticatedSession => {
    const clean = identifier.trim().toLowerCase();

    // Check if matches any staff or admin member
    const matchedStaff = staff.find(
      (s) =>
        s.email.toLowerCase() === clean ||
        s.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
        s.fullName.toLowerCase() === clean
    );

    if (
      matchedStaff ||
      portalRole === 'admin' ||
      portalRole === 'staff' ||
      clean.includes('admin') ||
      clean.includes('staff')
    ) {
      const targetStaff =
        matchedStaff ||
        (portalRole === 'staff' ? staff[1] || staff[0] : staff[0]);
      const isSuperOrAdmin =
        targetStaff.role === 'Super Admin' ||
        targetStaff.role === 'Admin' ||
        portalRole === 'admin';
      const session: AuthenticatedSession = {
        id: targetStaff.id,
        fullName: targetStaff.fullName,
        email: targetStaff.email,
        phone: targetStaff.phone,
        accountType: isSuperOrAdmin ? 'admin' : 'staff',
        roleTitle: targetStaff.role,
      };
      setAuthUser(session);
      showToast(
        `Signed In as ${session.fullName}`,
        `${session.roleTitle} Portal Activated`,
        'success'
      );
      return session;
    }

    // Check if matches an existing customer
    const matchedCustomer = customers.find(
      (c) =>
        c.email.toLowerCase() === clean ||
        c.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
        c.fullName.toLowerCase() === clean
    );

    if (matchedCustomer) {
      setActiveCustomerId(matchedCustomer.id);
      const session: AuthenticatedSession = {
        id: matchedCustomer.id,
        fullName: matchedCustomer.fullName,
        email: matchedCustomer.email,
        phone: matchedCustomer.phone,
        accountType: 'customer',
        roleTitle: 'Private Client',
      };
      setAuthUser(session);
      showToast(
        `Welcome Back, ${matchedCustomer.fullName}`,
        'Private Client Dossier Loaded',
        'success'
      );
      return session;
    }

    // Otherwise dynamically create a new customer profile from the entered identifier
    const derivedName = clean.includes('@')
      ? clean
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())
      : identifier.trim();
    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      fullName: derivedName || 'Private Client',
      email: clean.includes('@') ? clean : `${derivedName.toLowerCase().replace(/\s+/g, '.')}@client.np`,
      phone: clean.includes('@') ? '+977 9801122334' : identifier.trim(),
      avatar: INITIAL_CUSTOMERS[0].avatar,
      joinedDate: new Date().toISOString().slice(0, 10),
      totalOrders: 0,
      totalSpending: 0,
      status: 'Active',
      addresses: [],
    };
    setCustomers((prev) => [newCust, ...prev]);
    setActiveCustomerId(newCust.id);
    const session: AuthenticatedSession = {
      id: newCust.id,
      fullName: newCust.fullName,
      email: newCust.email,
      phone: newCust.phone,
      accountType: 'customer',
      roleTitle: 'Private Client',
    };
    setAuthUser(session);
    showToast(
      `Welcome, ${newCust.fullName}`,
      'Your personal dashboard has been initialized.',
      'success'
    );
    return session;
  };

  const registerAccount = (data: {
    fullName: string;
    email: string;
    phone: string;
    accountType: 'customer' | 'staff' | 'admin';
    staffRole?: StaffMember['role'];
  }): AuthenticatedSession => {
    if (data.accountType === 'admin' || data.accountType === 'staff') {
      const assignedRole: StaffMember['role'] =
        data.staffRole ||
        (data.accountType === 'admin' ? 'Admin' : 'Order Manager');
      const newStaff: StaffMember = {
        id: `STF-0${staff.length + 1}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: assignedRole,
        status: 'Active',
        joinedDate: new Date().toISOString().slice(0, 10),
        lastActive: 'Just now',
      };
      setStaff((prev) => [newStaff, ...prev]);
      const session: AuthenticatedSession = {
        id: newStaff.id,
        fullName: newStaff.fullName,
        email: newStaff.email,
        phone: newStaff.phone,
        accountType: data.accountType,
        roleTitle: assignedRole,
      };
      setAuthUser(session);
      showToast(
        `${data.fullName} Registered`,
        `Signed in as ${assignedRole} in MAISON VÉRA Console.`,
        'success'
      );
      return session;
    }

    const newCustomer: Customer = {
      id: `CUST-00${customers.length + 1}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      avatar: INITIAL_CUSTOMERS[0].avatar,
      joinedDate: new Date().toISOString().slice(0, 10),
      totalOrders: 0,
      totalSpending: 0,
      status: 'Active',
      addresses: [
        {
          id: `ADDR-${Date.now().toString().slice(-4)}`,
          label: 'Primary Residence',
          fullName: data.fullName,
          phone: data.phone,
          province: 'Bagmati Province',
          district: 'Kathmandu',
          municipality: 'Kathmandu Metropolitan City',
          ward: 'Ward 03',
          street: 'Durbar Marg Enclave',
          landmark: 'Near Heritage Wing',
          isDefault: true,
        },
      ],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setActiveCustomerId(newCustomer.id);
    const session: AuthenticatedSession = {
      id: newCustomer.id,
      fullName: newCustomer.fullName,
      email: newCustomer.email,
      phone: newCustomer.phone,
      accountType: 'customer',
      roleTitle: 'Private Client',
    };
    setAuthUser(session);
    showToast(
      `Welcome to MAISON VÉRA, ${newCustomer.fullName}`,
      'Your personal Client Dashboard has been created.',
      'success'
    );
    return session;
  };

  const logoutUser = () => {
    setAuthUser(null);
    showToast('Signed Out', 'Your session has been closed.');
  };

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.size === newItem.size &&
          i.color === newItem.color
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    showToast('Added to Shopping Bag', `${newItem.name} (${newItem.size} · ${newItem.color})`, 'success');
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color))
    );
    showToast('Removed from Shopping Bag');
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', prod?.name);
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', prod?.name, 'success');
        return [...prev, productId];
      }
    });
  };

  const moveWishlistToCart = (product: Product) => {
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
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  const applyCouponCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === normalized && c.status === 'Active');
    if (!found) {
      showToast('Invalid Coupon Code', 'Please check the code and eligibility criteria.', 'error');
      return false;
    }
    const subtotal = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    if (subtotal < found.minOrderAmount) {
      showToast(
        'Minimum Order Not Met',
        `Coupon ${found.code} requires NPR ${found.minOrderAmount.toLocaleString()} minimum subtotal.`,
        'error'
      );
      return false;
    }
    setAppliedCoupon(found);
    showToast('Privilege Code Applied', `Code ${found.code} activated on your bag.`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed');
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline'>): Order => {
    const num = 1085 + orders.length;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${num}`,
      orderNumber: `YB-${num}`,
      date: new Date().toISOString().slice(0, 10),
      timeline: [
        {
          status: 'Placed',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note:
            orderData.paymentMethod === 'COD'
              ? 'Order placed with Cash on Delivery.'
              : `Order submitted with ${orderData.paymentMethod} transfer reference ${orderData.transactionRef || 'N/A'}.`,
        },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title: `New Order #${newOrder.orderNumber} Placed`,
        message: `${newOrder.customerName} placed an order for NPR ${newOrder.totalAmount.toLocaleString()} via ${newOrder.paymentMethod}.`,
        category: 'Order',
        date: 'Just now',
        read: false,
        target: 'both',
      },
      ...prev,
    ]);
    showToast(
      `Order #${newOrder.orderNumber} Confirmed`,
      'Demonstration checkout completed. Review your order receipt.',
      'success'
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatusType, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          orderStatus: status,
          adminNotes: note !== undefined ? note : o.adminNotes,
          timeline: [
            ...o.timeline,
            {
              status,
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note: note || `Order status updated to ${status}.`,
            },
          ],
        };
      })
    );
    logAudit('Updated Order Status', 'Orders', `Order ${orderId} changed to ${status}`);
    showToast('Order Status Updated', `Marked as ${status}`, 'success');
  };

  const verifyOrderPayment = (
    orderId: string,
    status: PaymentStatusType,
    rejectionReason?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextOrderStatus: OrderStatusType =
          status === 'Verified' && o.orderStatus === 'Placed' ? 'Confirmed' : o.orderStatus;
        return {
          ...o,
          paymentStatus: status,
          orderStatus: nextOrderStatus,
          rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
          timeline: [
            ...o.timeline,
            {
              status: nextOrderStatus,
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note:
                status === 'Verified'
                  ? 'Payment screenshot verified and approved by finance desk.'
                  : `Payment verification rejected: ${rejectionReason || 'Invalid reference'}`,
            },
          ],
        };
      })
    );
    logAudit('Payment Verification', 'Payments', `Order ${orderId} payment marked ${status}`);
    showToast(
      `Payment ${status}`,
      status === 'Verified'
        ? 'Transaction proof approved and order confirmed.'
        : 'Payment proof flagged as rejected.',
      status === 'Verified' ? 'success' : 'error'
    );
  };

  const requestOrderCancellation = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              cancellationRequested: true,
              cancellationReason: reason,
              orderStatus: 'Cancelled',
              timeline: [
                ...o.timeline,
                {
                  status: 'Cancelled',
                  date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  note: `Customer requested cancellation: ${reason}`,
                },
              ],
            }
          : o
      )
    );
    showToast('Cancellation Recorded', 'Your order status has been updated.', 'success');
  };

  const updateCustomerProfile = (data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? { ...c, ...data } : c))
    );
    if (authUser && authUser.accountType === 'customer') {
      setAuthUser({
        ...authUser,
        fullName: data.fullName || authUser.fullName,
        email: data.email || authUser.email,
        phone: data.phone || authUser.phone,
      });
    }
    showToast('Profile Saved', 'Your client dossier has been updated.', 'success');
  };

  const addCustomerAddress = (address: Omit<CustomerAddress, 'id'>) => {
    const newAddr: CustomerAddress = {
      ...address,
      id: `ADDR-${Date.now().toString().slice(-4)}`,
    };
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== currentCustomer.id) return c;
        const list = address.isDefault
          ? c.addresses.map((a) => ({ ...a, isDefault: false }))
          : c.addresses;
        return { ...c, addresses: [...list, newAddr] };
      })
    );
    showToast('Address Added', `${address.label} saved to your address book.`, 'success');
  };

  const updateCustomerAddress = (address: CustomerAddress) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== currentCustomer.id) return c;
        const list = c.addresses.map((a) => {
          if (a.id === address.id) return address;
          return address.isDefault ? { ...a, isDefault: false } : a;
        });
        return { ...c, addresses: list };
      })
    );
    showToast('Address Updated', `${address.label} updated.`, 'success');
  };

  const deleteCustomerAddress = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? { ...c, addresses: c.addresses.filter((a) => a.id !== id) }
          : c
      )
    );
    showToast('Address Deleted');
  };

  const setDefaultCustomerAddress = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === currentCustomer.id
          ? {
              ...c,
              addresses: c.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
            }
          : c
      )
    );
    showToast('Default Delivery Address Updated', undefined, 'success');
  };

  const toggleCustomerAccountStatus = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' }
          : c
      )
    );
    logAudit('Toggled Customer Status', 'Customers', `Customer ID ${customerId}`);
    showToast('Customer Status Updated');
  };

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    logAudit('Saved Product', 'Products', `${product.name} (${product.sku})`);
    showToast('Product Saved', `${product.name} has been updated in catalog.`, 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAudit('Deleted Product', 'Products', target?.name || id);
    showToast('Product Removed', target?.name);
  };

  const saveCategory = (category: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
    logAudit('Saved Category', 'Categories', category.name);
    showToast('Category Saved', category.name, 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    logAudit('Deleted Category', 'Categories', id);
    showToast('Category Deleted');
  };

  const saveCollection = (collection: CollectionItem) => {
    setCollections((prev) => {
      const exists = prev.some((c) => c.id === collection.id);
      return exists
        ? prev.map((c) => (c.id === collection.id ? collection : c))
        : [...prev, collection];
    });
    logAudit('Saved Collection', 'Collections', collection.name);
    showToast('Collection Saved', collection.name, 'success');
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    logAudit('Deleted Collection', 'Collections', id);
    showToast('Collection Deleted');
  };

  const adjustInventoryStock = (
    productId: string,
    size: string,
    color: string,
    delta: number,
    reason: string
  ) => {
    const targetProd = products.find((p) => p.id === productId);
    if (!targetProd) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedVariants = p.variantStock.map((v) =>
          v.size === size && v.color === color
            ? { ...v, stock: Math.max(0, v.stock + delta) }
            : v
        );
        const total = updatedVariants.reduce((acc, v) => acc + v.stock, 0);
        return {
          ...p,
          variantStock: updatedVariants,
          stock: total > 0 ? total : Math.max(0, p.stock + delta),
        };
      })
    );

    const movement: StockMovement = {
      id: `STK-${Date.now().toString().slice(-4)}`,
      productId,
      productName: targetProd.name,
      sku: `${targetProd.sku}-${size}`,
      size,
      color,
      change: delta,
      reason,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      performedBy: 'Siddhartha Bhandari',
    };
    setStockMovements((prev) => [movement, ...prev]);
    logAudit('Stock Adjustment', 'Inventory', `${targetProd.name} (${size}/${color}) ${delta > 0 ? `+${delta}` : delta}`);
    showToast('Inventory Updated', `${targetProd.name} (${size}) adjusted by ${delta > 0 ? `+${delta}` : delta}`, 'success');
  };

  const saveStaffMember = (member: StaffMember) => {
    setStaff((prev) => {
      const exists = prev.some((s) => s.id === member.id);
      return exists ? prev.map((s) => (s.id === member.id ? member : s)) : [...prev, member];
    });
    logAudit('Saved Staff Member', 'Staff', `${member.fullName} (${member.role})`);
    showToast('Staff Record Saved', member.fullName, 'success');
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
      )
    );
    showToast('Staff Status Toggled');
  };

  const updateRolePermissions = (updatedRole: RolePermission) => {
    setRoles((prev) => prev.map((r) => (r.role === updatedRole.role ? updatedRole : r)));
    logAudit('Updated Role Matrix', 'Roles & Permissions', updatedRole.role);
    showToast('Permissions Matrix Saved', `Updated access controls for ${updatedRole.role}.`, 'success');
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === coupon.id);
      return exists ? prev.map((c) => (c.id === coupon.id ? coupon : c)) : [coupon, ...prev];
    });
    logAudit('Saved Coupon', 'Coupons', coupon.code);
    showToast('Coupon Saved', coupon.code, 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon Deleted');
  };

  const updateReviewStatus = (id: string, status: ProductReview['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    logAudit('Moderated Review', 'Reviews', `Review ${id} set to ${status}`);
    showToast(`Review ${status}`, undefined, 'success');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review Deleted');
  };

  const saveBanner = (banner: CampaignBanner) => {
    setBanners((prev) => {
      const exists = prev.some((b) => b.id === banner.id);
      return exists ? prev.map((b) => (b.id === banner.id ? banner : b)) : [...prev, banner];
    });
    logAudit('Updated Campaign Banner', 'Banners', banner.title);
    showToast('Campaign Banner Saved', banner.title, 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner Removed');
  };

  const saveDeliveryZone = (zone: DeliveryZone) => {
    setDeliveryZones((prev) => {
      const exists = prev.some((z) => z.id === zone.id);
      return exists ? prev.map((z) => (z.id === zone.id ? zone : z)) : [...prev, zone];
    });
    logAudit('Updated Delivery Zone', 'Delivery Management', `${zone.district}, ${zone.province}`);
    showToast('Delivery Tariff Saved', `${zone.district} delivery rules updated.`, 'success');
  };

  const deleteDeliveryZone = (id: string) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== id));
    showToast('Delivery Zone Removed');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All Notifications Marked Read');
  };

  const updateBrandSettings = (settings: BrandSettings) => {
    setBrandSettings(settings);
    logAudit('Updated Brand Settings', 'Brand Settings', settings.brandName);
    showToast('Brand Identity Saved', 'Storefront configuration updated.', 'success');
  };

  const updatePaymentSettings = (settings: PaymentGatewaySettings) => {
    setPaymentSettings(settings);
    logAudit('Updated Payment Gateways', 'Payment Settings', 'Modified eSewa/Khalti/Fonepay/COD config');
    showToast('Payment Configuration Saved', undefined, 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        cart,
        wishlist,
        orders,
        customers,
        currentCustomer,
        authUser,
        staff,
        roles,
        coupons,
        reviews,
        banners,
        deliveryZones,
        notifications,
        auditLogs,
        brandSettings,
        paymentSettings,
        stockMovements,
        appliedCoupon,
        lastCreatedOrder,
        toasts,
        showToast,
        dismissToast,
        loginWithCredentials,
        registerAccount,
        logoutUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        moveWishlistToCart,
        applyCouponCode,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        verifyOrderPayment,
        requestOrderCancellation,
        updateCustomerProfile,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        setDefaultCustomerAddress,
        toggleCustomerAccountStatus,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveCollection,
        deleteCollection,
        adjustInventoryStock,
        saveStaffMember,
        toggleStaffStatus,
        updateRolePermissions,
        saveCoupon,
        deleteCoupon,
        updateReviewStatus,
        deleteReview,
        saveBanner,
        deleteBanner,
        saveDeliveryZone,
        deleteDeliveryZone,
        markNotificationRead,
        markAllNotificationsRead,
        updateBrandSettings,
        updatePaymentSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
