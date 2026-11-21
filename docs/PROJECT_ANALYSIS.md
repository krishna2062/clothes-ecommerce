# MAISON VÉRA — Deep Frontend Architecture & System Analysis
**Luxury Minimal Fashion House — Full-Stack E-Commerce Transformation**
*Document Version: 1.0.0 | Date: 2026-11-21 | Target Backend: ASP.NET Core 8 Web API + Supabase PostgreSQL*

---

## 1. Executive Summary

This document presents a comprehensive, exhaustive architectural analysis of the **MAISON VÉRA** luxury minimal fashion e-commerce frontend codebase. The application currently functions as a highly sophisticated client-side Single Page Application (SPA) built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, operating with client-side state managed through React Context (`StoreContext.tsx`) and backed by 18 distinct `localStorage` keys with curated luxury mock datasets.

The application encompasses **62 unique client routes** divided across four distinct architectural realms:
1. **Public Customer Website (22 Routes):** Editorial home, luxury catalog with preset modes, rich product detail pages with variant selector, interactive bag (cart), wishlist, multi-step localized checkout, order confirmation, and legal/editorial policy pages.
2. **Customer Authentication System (5 Routes):** Unified authentication suite handling sign-in, account creation (customer or staff), password recovery, password reset, and email verification.
3. **Authenticated Customer Account Dossier (9 Routes):** Private client portal featuring profile management, Nepal multi-tier address book, real-time order history with visual timeline trackers, saved lookbook (wishlist), payment audit logs, security credentials management, and account notifications.
4. **Administrative Operations System (26 Routes):** Full-scale enterprise control center providing executive metrics, product catalog management, hierarchical categories, curated collections, multi-variant inventory control with stock movement logging, order fulfillment with state machines, manual payment verification with receipt proof inspection, customer dossier management, role-based staff provisioning, marketing coupon engine, editorial review moderation, hero campaign banners, delivery tariff zone matrices, visual analytics reports, brand identity settings, payment gateway configuration, and immutable system audit logging.

---

## 2. Frontend Technology Stack & Structure

### 2.1 Core Dependencies & Libraries
- **Runtime & UI Framework:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`)
- **Language & Compiler:** TypeScript (`typescript: ^7.0.2`, target: `ES2022`, module: `ESNext`, `bundler` resolution)
- **Bundler & Dev Server:** Vite 8 (`vite: ^8.3.0`, `@vitejs/plugin-react: ^6.1.1`)
- **Styling Architecture:** Tailwind CSS v4 (`@tailwindcss/vite: ^4.3.3`, `tailwindcss: ^4.3.3`, `autoprefixer: ^10.4.21`) with custom `@theme` tokens in `src/index.css` defining the luxury monochrome palette (`#080808`, `#FFFFFF`, `#F3F3F3`, `#E5E5E5`, `#777777`, and serif typography `Playfair Display`).
- **Icons & Visual Language:** Lucide React (`lucide-react: ^0.546.0`)
- **Animation Primitives:** Motion (`motion: ^12.23.24`)
- **Data Visualization & Analytics:** Recharts for admin operational and financial reporting
- **Routing:** React Router DOM v7 (`react-router-dom: ^7.13.0`) utilizing `HashRouter` for zero-configuration static hosting (GitHub Pages and Vercel compatibility).

### 2.2 Directory Structure
```
YOUR-BRAND-—-Luxury-Minimal-Fashion-House-2026-11-21-eb707/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Automated build verification
│       └── deploy-pages.yml           # GitHub Pages static deploy
├── docs/                              # Backend Architecture & System Specifications
│   ├── PROJECT_ANALYSIS.md            # This document
│   ├── DATABASE_DESIGN.md             # Supabase PostgreSQL relational schema
│   ├── API_SPECIFICATION.md           # REST API endpoint documentation
│   ├── AUTHENTICATION_SECURITY.md     # JWT, Refresh Tokens & RBAC engine
│   ├── IMPLEMENTATION_PLAN.md         # Phased engineering roadmap
│   ├── TESTING_PLAN.md                # Unit, integration & security test suites
│   └── QUESTIONS_FOR_OWNER.md         # Decisions required from store owner
├── public/                            # Static assets and favicons
├── src/
│   ├── assets/
│   │   └── images/                    # Local high-res editorial photography
│   ├── components/
│   │   ├── common/
│   │   │   └── ToastContainer.tsx     # Toast notification renderer
│   │   └── product/
│   │       └── ProductCard.tsx        # Reusable luxury product card with quick-actions
│   ├── context/
│   │   └── StoreContext.tsx           # Global state container & localStorage engine (1,111 LOC)
│   ├── data/
│   │   └── mockData.ts                # Initial luxury catalog & operational datasets (1,123 LOC)
│   ├── layouts/
│   │   ├── AdminLayout.tsx            # Admin sidebar, header, breadcrumbs & notifications
│   │   ├── AuthLayout.tsx             # Centered luxury minimalist auth card layout
│   │   ├── CustomerLayout.tsx         # Customer dossier navigation & account sidebar
│   │   └── PublicLayout.tsx           # Luxury header, announcement bar & footer
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminCatalogPages.tsx  # Overview, Products, Categories, Collections, Inventory
│   │   │   ├── AdminOperationsPages.tsx # Orders, Payments, Customers, Staff, Roles
│   │   │   └── AdminSystemPages.tsx   # Coupons, Reviews, Banners, Delivery, Reports, Logs
│   │   ├── auth/
│   │   │   └── AuthPages.tsx          # Login, Register, Forgot Password, Reset, Verify
│   │   ├── customer/
│   │   │   └── CustomerAccountPages.tsx # Dossier, Profile, Addresses, Orders, Wishlist
│   │   └── public/
│   │       ├── CatalogPage.tsx        # Dynamic filterable catalog
│   │       ├── CheckoutAndSuccessPages.tsx # Multi-step checkout & payment upload
│   │       ├── HomePage.tsx           # Editorial campaign homepage
│   │       ├── InfoAndPolicyPages.tsx # About, Contact, FAQ, Size Guide, Policies
│   │       ├── ProductDetailPage.tsx  # Rich PDP with gallery, variants & accordions
│   │       └── WishlistAndCartPages.tsx # Saved pieces & luxury shopping bag
│   ├── types/
│   │   └── index.ts                   # Comprehensive TypeScript domain interfaces (276 LOC)
│   ├── App.tsx                        # Router definitions (62 routes)
│   ├── index.css                      # Tailwind v4 configuration & font imports
│   └── main.tsx                       # React root entrypoint
├── package.json                       # Dependencies and build scripts
├── tsconfig.json                      # Strict TypeScript compiler options
├── vercel.json                        # Vercel deployment & legacy-peer-deps configuration
└── vite.config.ts                     # Vite build & bundle configuration
```

---

## 3. Detailed State Management & LocalStorage Audit

The application's current data flow is centralized in `src/context/StoreContext.tsx`. Upon application boot, each slice of state is initialized from a browser `localStorage` key. If the key does not exist or fails JSON parsing, it falls back to the curated dataset in `src/data/mockData.ts`. Any state mutation automatically synchronizes back to `localStorage` via an overarching `useEffect` hook.

### Master LocalStorage Inventory
| # | LocalStorage Key | Entity Type | Initial Mock Source | Current Frontend Operations | Target Database Table |
|---|------------------|-------------|---------------------|----------------------------|-----------------------|
| 1 | `yb_products_v1` | `Product[]` | `INITIAL_PRODUCTS` | Read, Filter, Create, Edit, Delete, Stock Update | `products`, `product_variants`, `product_images` |
| 2 | `yb_categories_v1` | `Category[]` | `INITIAL_CATEGORIES` | Read, Create, Edit, Delete, Active Status | `categories` |
| 3 | `yb_collections_v1` | `CollectionItem[]` | `INITIAL_COLLECTIONS` | Read, Create, Edit, Delete, Product Mapping | `collections`, `collection_products` |
| 4 | `yb_cart_v1` | `CartItem[]` | Default Sample Item | Read, Add, Update Qty, Remove, Clear | `cart_items` (Server-synced for Auth) |
| 5 | `yb_wishlist_v1` | `string[]` (IDs) | Default Sample IDs | Read, Toggle Add/Remove, Move to Bag | `wishlist_items` (Server-synced) |
| 6 | `yb_orders_v1` | `Order[]` | `INITIAL_ORDERS` | Read, Filter, Create, Status Update, Payment Verify, Cancel Request | `orders`, `order_items`, `order_timeline_events` |
| 7 | `yb_customers_v2` | `Customer[]` | `INITIAL_CUSTOMERS` | Read, Profile Update, Address CRUD, Suspend/Reactivate | `users`, `customer_profiles`, `customer_addresses` |
| 8 | `yb_active_customer_id_v2` | `string` | First customer ID | Session active customer pointer | Resolved via JWT `sub` claim |
| 9 | `yb_auth_user_v2` | `AuthenticatedSession` | Demo Super Admin Session | Unified Login, Register, Logout, Role Switcher | Secure HttpOnly Cookie + JWT Access Token |
| 10 | `yb_staff_v2` | `StaffMember[]` | `INITIAL_STAFF` | Read, Create, Edit, Toggle Active Status | `users` (Staff roles), `staff_profiles` |
| 11 | `yb_roles_v1` | `RolePermission[]` | `INITIAL_ROLES` | Read, Permission Matrix Update | `roles`, `role_claims` |
| 12 | `yb_coupons_v1` | `Coupon[]` | `INITIAL_COUPONS` | Read, Validate, Apply, Create, Edit, Delete | `coupons` |
| 13 | `yb_reviews_v1` | `ProductReview[]` | `INITIAL_REVIEWS` | Read by Product, Moderation (Approve/Reject/Delete) | `product_reviews` |
| 14 | `yb_banners_v1` | `CampaignBanner[]` | `INITIAL_BANNERS` | Read Active, Admin Create, Edit, Reorder, Delete | `campaign_banners` |
| 15 | `yb_delivery_v1` | `DeliveryZone[]` | `INITIAL_DELIVERY_ZONES`| Read Zones, Calculate Shipping, Admin CRUD | `delivery_zones` |
| 16 | `yb_notifications_v1`| `AppNotification[]`| `INITIAL_NOTIFICATIONS`| Read, Filter by Role, Mark as Read, Mark All Read | `notifications` |
| 17 | `yb_audit_v1` | `AuditLogEntry[]` | `INITIAL_AUDIT_LOGS` | Read, Filter by Module/Role/Date, Auto-append on Actions | `audit_logs` |
| 18 | `yb_brand_v2` | `BrandSettings` | `INITIAL_BRAND_SETTINGS`| Read (Header/Footer), Admin Update Settings | `brand_settings` (Singleton) |
| 19 | `yb_payment_v2` | `PaymentGatewaySettings`| `INITIAL_PAYMENT_SETTINGS`| Read (Checkout QR/Info), Admin Update Settings | `payment_gateway_settings` (Singleton) |
| 20 | `yb_stock_v1` | `StockMovement[]` | `INITIAL_STOCK_MOVEMENTS`| Read, Log on Manual Inventory Adjustment | `stock_movements` |

---

## 4. Comprehensive Page-to-Database-to-API Master Audit

Below is the exhaustive, page-by-page mapping of all **62 routes** in the application, documenting the UI components, displayed datasets, required operations, validation rules, target database entities, REST API endpoints, and role authorizations.

### 4.1 Public Customer Website (22 Routes)

| # | Route & Page Name | Components Involved | Displayed Data | Operations | Validation Required | Target Database Tables | Target REST API Endpoints | Access Role |
|---|-------------------|---------------------|----------------|------------|---------------------|------------------------|---------------------------|-------------|
| 1 | `/` (Home) | `HomePage`, `ProductCard`, Hero Carousel, Editorial Banners, Newsletter, Category Grid | Banners, Featured Products, New Arrivals, Brand Values, Instagram feed, Categories | Read | Newsletter email format check | `campaign_banners`, `products`, `categories`, `brand_settings` | `GET /api/v1/banners/active`<br>`GET /api/v1/products?featured=true`<br>`GET /api/v1/categories` | Public (Anonymous) |
| 2 | `/shop` (All Products) | `CatalogPage`, `ProductCard`, Filter Drawer, Sort Dropdown, Pagination | Product list, category list, price range, size/color facets, counts | Read | Query param sanitization | `products`, `categories`, `product_variants` | `GET /api/v1/products` (with filters & pagination) | Public (Anonymous) |
| 3 | `/collections/men` | `CatalogPage`, `ProductCard`, Editorial Header | Filtered products for Men | Read | Valid gender enum check | `products`, `product_variants` | `GET /api/v1/products?gender=Men` | Public (Anonymous) |
| 4 | `/collections/women` | `CatalogPage`, `ProductCard`, Editorial Header | Filtered products for Women | Read | Valid gender enum check | `products`, `product_variants` | `GET /api/v1/products?gender=Women` | Public (Anonymous) |
| 5 | `/collections/unisex` | `CatalogPage`, `ProductCard`, Editorial Header | Filtered products for Unisex | Read | Valid gender enum check | `products`, `product_variants` | `GET /api/v1/products?gender=Unisex` | Public (Anonymous) |
| 6 | `/new-arrivals` | `CatalogPage`, `ProductCard`, Editorial Header | Filtered products marked as new arrival | Read | Filter bounds | `products`, `product_variants` | `GET /api/v1/products?newArrival=true` | Public (Anonymous) |
| 7 | `/best-sellers` | `CatalogPage`, `ProductCard`, Editorial Header | Filtered products marked as best seller | Read | Filter bounds | `products`, `product_variants` | `GET /api/v1/products?bestSeller=true` | Public (Anonymous) |
| 8 | `/sale` | `CatalogPage`, `ProductCard`, Sale Banner | Products on sale with discount badges | Read | Filter bounds | `products`, `product_variants` | `GET /api/v1/products?onSale=true` | Public (Anonymous) |
| 9 | `/category/:slug` | `CatalogPage`, `ProductCard`, Category Banner | Products belonging to specific category | Read | Slug format regex `^[a-z0-9-]+$` | `categories`, `products` | `GET /api/v1/categories/{slug}`<br>`GET /api/v1/products?categorySlug={slug}` | Public (Anonymous) |
| 10 | `/product/:slug` | `ProductDetailPage`, Image Gallery, Variant Selector, Stock Badge, Accordions, Reviews | Full product detail, high-res images, sizes, colors, live variant stock, reviews, related products | Read, Add to Bag, Toggle Wishlist, Submit Review | Variant selection required (size & color), positive quantity | `products`, `product_variants`, `product_reviews`, `categories` | `GET /api/v1/products/{slug}`<br>`GET /api/v1/products/{id}/reviews`<br>`POST /api/v1/cart/items` | Public (Anonymous) |
| 11 | `/wishlist` | `WishlistPage`, `ProductCard`, Empty State | Saved wishlist items, prices, stock availability | Read, Remove, Move to Bag | Product existence | `wishlist_items`, `products` | `GET /api/v1/wishlist`<br>`DELETE /api/v1/wishlist/{productId}`<br>`POST /api/v1/cart/items` | Public / Customer |
| 12 | `/cart` | `CartPage`, Line Item Table, Order Summary, Coupon Input Drawer, Shipping Estimator | Cart line items (size, color, unit price, quantity), subtotal, applied coupon, estimated total | Read, Update Qty, Remove Line, Apply Coupon, Remove Coupon | Qty >= 1, stock limit validation, coupon validity | `cart_items`, `products`, `product_variants`, `coupons` | `GET /api/v1/cart`<br>`PUT /api/v1/cart/items/{id}`<br>`DELETE /api/v1/cart/items/{id}`<br>`POST /api/v1/coupons/validate` | Public (Session) / Customer |
| 13 | `/checkout` | `CheckoutPage`, Multi-step Accordion: Customer Info, Nepal Address, Delivery Tier, Payment Gateway & QR | Cart snapshot, address form (Province, District, Municipality, Ward, Street, Landmark), Delivery tariff selector, Payment method selector (COD, eSewa, Khalti, Fonepay), QR code display, Transaction reference & proof upload | Read, Place Order, Calculate Shipping | Required address fields, valid Nepal phone (`^9[78]\d{8}$`), transaction ref required for digital wallets | `cart_items`, `delivery_zones`, `payment_gateway_settings`, `orders`, `order_items`, `order_timeline_events` | `GET /api/v1/delivery-zones`<br>`GET /api/v1/settings/payments/public`<br>`POST /api/v1/orders/checkout`<br>`POST /api/v1/payments/upload-receipt` | Public (Guest) / Customer |
| 14 | `/order-success` | `OrderConfirmationPage`, Receipt Card, Print Button, Delivery Timeline | Completed order summary, orderNumber, items, total, payment status, shipping address, instructions | Read | Valid order ID parameter | `orders`, `order_items` | `GET /api/v1/orders/{orderNumber}/confirmation` | Public / Customer |
| 15 | `/about` | `AboutPage`, Editorial Narrative, Craftsmanship Timeline, Sustainable Manifesto | Brand history, editorial text, atelier philosophy, designer portraits | Read | Static content | `brand_settings`, Static | `GET /api/v1/settings/brand/public` | Public (Anonymous) |
| 16 | `/contact` | `ContactPage`, Boutique Locations, Contact Form | Contact details, flagship atelier address, telephone, email, inquiry form | Read, Submit Inquiry | Email format, non-empty message, name | `inquiries` (or `notifications`) | `POST /api/v1/support/inquiries` | Public (Anonymous) |
| 17 | `/faq` | `FaqPage`, Accordion Categories: Ordering, Shipping, Returns, Care | Frequently asked questions organized by category | Read | Static content | Static CMS / Content | `GET /api/v1/content/faq` | Public (Anonymous) |
| 18 | `/size-guide` | `SizeGuidePage`, Unit Toggle (CM/IN), Measurement Matrix for Tops, Trousers & Footwear | Sizing conversion tables, measuring instructions | Read | Static content | Static CMS / Content | `GET /api/v1/content/size-guide` | Public (Anonymous) |
| 19 | `/shipping-policy` | `PolicyPage` (type="shipping"), Delivery Tables | Delivery tariffs, timeframes (Inside vs Outside Kathmandu Valley), customs, packaging | Read | Static content | `delivery_zones`, `brand_settings` | `GET /api/v1/content/policies/shipping` | Public (Anonymous) |
| 20 | `/return-policy` | `PolicyPage` (type="return"), Return Steps | 7-day return terms, condition criteria, refund process for eSewa/Khalti/COD | Read | Static content | `brand_settings`, Static | `GET /api/v1/content/policies/return` | Public (Anonymous) |
| 21 | `/privacy-policy` | `PolicyPage` (type="privacy"), GDPR & Data Rights | Data collection, cookie storage, payment security, encryption statement | Read | Static content | `brand_settings`, Static | `GET /api/v1/content/policies/privacy` | Public (Anonymous) |
| 22 | `/terms` | `PolicyPage` (type="terms"), Service Agreement | Terms of sale, intellectual property, pricing errors, jurisdiction | Read | Static content | `brand_settings`, Static | `GET /api/v1/content/policies/terms` | Public (Anonymous) |

---

### 4.2 Customer Authentication System (5 Routes)

| # | Route & Page Name | Components Involved | Displayed Data | Operations | Validation Required | Target Database Tables | Target REST API Endpoints | Access Role |
|---|-------------------|---------------------|----------------|------------|---------------------|------------------------|---------------------------|-------------|
| 23 | `/login` | `LoginPage`, Portal Tab Switcher (Customer vs Staff/Admin), Remember Me, Forgot Password Link | Login form (Email/Phone, Password), Quick Demo credentials pill | Authenticate & Issue JWT + Refresh Token | Non-empty email, password min 6 chars, rate limit protection | `users`, `customer_profiles`, `roles`, `refresh_tokens`, `audit_logs` | `POST /api/v1/auth/login`<br>`POST /api/v1/auth/refresh-token` | Public (Anonymous) |
| 24 | `/register` | `RegisterPage`, Account Type Toggle (Client vs Staff Application) | Registration form (Full Name, Email, Phone, Password, Confirm Password, Staff Role selection) | Create Account & Profile | Email regex, valid phone, password strength (upper, lower, digit), matching passwords | `users`, `customer_profiles`, `customer_addresses`, `roles` | `POST /api/v1/auth/register` | Public (Anonymous) |
| 25 | `/forgot-password` | `ForgotPasswordPage`, Back to Login Link | Email input form, instruction banner | Request Password Reset Email/Link | Valid registered email format | `users`, `password_reset_tokens` | `POST /api/v1/auth/forgot-password` | Public (Anonymous) |
| 26 | `/reset-password` | `ResetPasswordPage`, Token Query Param Parser | New password & Confirm password inputs | Reset Password with Token | Token validity, expiration check, password complexity | `users`, `password_reset_tokens` | `POST /api/v1/auth/reset-password` | Public (Anonymous) |
| 27 | `/verify-email` | `VerifyEmailPage`, Status Spinner & Success Banner | Email verification token validation state | Verify Account Email | Token validity & expiry check | `users` | `POST /api/v1/auth/verify-email` | Public (Anonymous) |

---

### 4.3 Authenticated Customer Account Dossier (9 Routes)

| # | Route & Page Name | Components Involved | Displayed Data | Operations | Validation Required | Target Database Tables | Target REST API Endpoints | Access Role |
|---|-------------------|---------------------|----------------|------------|---------------------|------------------------|---------------------------|-------------|
| 28 | `/account` | `AccountOverviewPage`, Dossier Stat Cards, Recent Orders Table, Default Address Card | Client Tier, total spent, order count, 3 most recent orders, primary address | Read | Valid authenticated user token | `users`, `customer_profiles`, `orders`, `customer_addresses` | `GET /api/v1/account/overview` | Customer (`Authenticated`) |
| 29 | `/account/profile` | `AccountProfilePage`, Profile Form, Avatar Upload | Full Name, Email, Phone Number, Avatar URL, Account Created Date | Update Profile | Full name required, valid email, valid phone format | `users`, `customer_profiles` | `GET /api/v1/account/profile`<br>`PUT /api/v1/account/profile` | Customer (`Authenticated`) |
| 30 | `/account/addresses` | `AccountAddressesPage`, Address Card Grid, Address Modal Dialog | Address cards (Label, Recipient, Phone, Province, District, Municipality, Ward, Street, Landmark, IsDefault badge) | Read, Add Address, Edit Address, Delete Address, Set Default | All address fields required, phone format, single default | `customer_addresses` | `GET /api/v1/account/addresses`<br>`POST /api/v1/account/addresses`<br>`PUT /api/v1/account/addresses/{id}`<br>`DELETE /api/v1/account/addresses/{id}`<br>`PATCH /api/v1/account/addresses/{id}/default` | Customer (`Authenticated`) |
| 31 | `/account/orders` | `AccountOrdersPage`, Order Filter Tabs (All, Processing, Delivered, Cancelled) | List of orders with Order #, Date, Items summary, Total Amount, Payment Status, Order Status, Detail Link | Read, Filter | Pagination params | `orders`, `order_items` | `GET /api/v1/account/orders` | Customer (`Authenticated`) |
| 32 | `/account/orders/:id` | `AccountOrderDetailPage`, Step Progress Tracker, Items Table, Shipping & Payment Summary, Cancel Order Modal | Full order detail, timeline steps, payment method & status, transaction ref, shipping address, order cancellation form | Read, Request Cancellation | Cancellation only permitted if status is 'Placed' or 'Confirmed' | `orders`, `order_items`, `order_timeline_events` | `GET /api/v1/account/orders/{id}`<br>`POST /api/v1/account/orders/{id}/cancel` | Customer (`Authenticated`) |
| 33 | `/account/wishlist` | `AccountWishlistPage`, `ProductCard` Grid | Saved products in private client wishlist | Read, Remove, Move to Bag | Product existence | `wishlist_items`, `products` | `GET /api/v1/account/wishlist`<br>`DELETE /api/v1/account/wishlist/{productId}` | Customer (`Authenticated`) |
| 34 | `/account/payment-history`| `AccountPaymentHistoryPage`, Payment Table | Payment transactions: Order #, Date, Gateway (eSewa/Khalti/COD), Amount, Status (Verified, Pending, Rejected), Transaction Reference | Read | Valid authenticated token | `orders` (Payment slice) | `GET /api/v1/account/payments` | Customer (`Authenticated`) |
| 35 | `/account/change-password`| `AccountChangePasswordPage`, Password Form | Current password, new password, confirm new password | Update Password | Current password correct, new password complexity, match | `users` | `POST /api/v1/account/change-password` | Customer (`Authenticated`) |
| 36 | `/account/notifications` | `AccountNotificationsPage`, Notification List | Customer notifications (Order updates, payment approvals, marketing) | Read, Mark as Read, Clear | Notification ownership check | `notifications` | `GET /api/v1/account/notifications`<br>`PATCH /api/v1/notifications/{id}/read` | Customer (`Authenticated`) |

---

### 4.4 Administrative Management System (26 Routes)

| # | Route & Page Name | Components Involved | Displayed Data | Operations | Validation Required | Target Database Tables | Target REST API Endpoints | Access Role |
|---|-------------------|---------------------|----------------|------------|---------------------|------------------------|---------------------------|-------------|
| 37 | `/admin` (Overview) | `AdminOverviewPage`, Stat KPI Cards, Recharts Revenue & Orders AreaChart, Quick Actions, Recent Orders Table | Total Revenue, Total Orders, Active Customers, Low Stock Alerts, 7-day revenue chart, recent orders | Read | Aggregation bounds, date range filters | `orders`, `users`, `products`, `product_variants` | `GET /api/v1/admin/dashboard/stats`<br>`GET /api/v1/admin/dashboard/revenue-chart` | Admin, Super Admin, Order Manager |
| 38 | `/admin/products` | `AdminProductsPage`, Product DataTable, Search & Filter Bar, Status Badges, Action Dropdowns | Products list: SKU, Name, Category, Gender, Selling Price, Total Stock, Status, Created Date | Read, Filter, Sort, Delete, Archive | Permission check (`module: Catalog, delete`) | `products`, `categories`, `product_variants` | `GET /api/v1/admin/products`<br>`DELETE /api/v1/admin/products/{id}` | Admin, Super Admin, Product Manager |
| 39 | `/admin/products/create` | `AdminProductFormPage`, Multi-tab Form (Details, Pricing, Variants, Images, Editorial), Variant Generator | Create product inputs: Name, Slug, SKU, Category, Collection, Description, Materials, Prices, Images, Variant Matrix (Size, Color, Stock, SKU) | Create Product & Variants | Unique SKU & Slug, positive prices, at least 1 image, valid variant stock | `products`, `product_variants`, `product_images`, `stock_movements`, `audit_logs` | `POST /api/v1/admin/products`<br>`POST /api/v1/admin/media/upload` | Admin, Super Admin, Product Manager |
| 40 | `/admin/products/:id/edit`| `AdminProductFormPage`, Prepopulated Multi-tab Form | Existing product fields, variant stock matrix, image reordering | Update Product & Variants | Positive prices, valid variant schema, audit log creation | `products`, `product_variants`, `product_images`, `audit_logs` | `GET /api/v1/admin/products/{id}`<br>`PUT /api/v1/admin/products/{id}` | Admin, Super Admin, Product Manager |
| 41 | `/admin/categories` | `AdminCategoriesPage`, Category Grid & Modal Dialog | Category cards: Name, Slug, Description, Image, Product Count, Status | Read, Create, Edit, Delete, Toggle Status | Unique slug, name required | `categories`, `products` | `GET /api/v1/admin/categories`<br>`POST /api/v1/admin/categories`<br>`PUT /api/v1/admin/categories/{id}`<br>`DELETE /api/v1/admin/categories/{id}` | Admin, Super Admin, Product Manager |
| 42 | `/admin/collections` | `AdminCollectionsPage`, Collection Cards, Product Selector Dialog | Collections: Name, Slug, Subtitle, Banner, Featured toggle, Assigned Product IDs | Read, Create, Edit, Delete, Reorder Products | Unique slug, valid product IDs | `collections`, `collection_products` | `GET /api/v1/admin/collections`<br>`POST /api/v1/admin/collections`<br>`PUT /api/v1/admin/collections/{id}`<br>`DELETE /api/v1/admin/collections/{id}` | Admin, Super Admin, Product Manager |
| 43 | `/admin/inventory` | `AdminInventoryPage`, Variant Stock Table, Stock Adjustment Modal, Reason Logger | Inventory rows: Product, SKU, Size, Color, Available Stock, Status (In Stock, Low Stock, Out of Stock), Stock Movement Log | Read, Adjust Stock Delta (+/-), Record Reason | Reason string required, integer delta, non-negative resulting stock | `product_variants`, `products`, `stock_movements`, `audit_logs` | `GET /api/v1/admin/inventory`<br>`POST /api/v1/admin/inventory/adjust`<br>`GET /api/v1/admin/inventory/movements` | Admin, Super Admin, Product Manager |
| 44 | `/admin/orders` | `AdminOrdersPage`, Order DataTable, Status Filter Tabs, Search Bar, Bulk Export | Orders list: Order #, Customer, Date, Items count, Total, Payment Method, Payment Status, Order Status | Read, Filter, Sort, Export | Filter validity | `orders`, `order_items` | `GET /api/v1/admin/orders`<br>`GET /api/v1/admin/orders/export` | Admin, Super Admin, Order Manager, Customer Support |
| 45 | `/admin/orders/:id` | `AdminOrderDetailPage`, Status Transition Dropdown, Payment Action Bar, Customer Info Card, Timeline Feed | Full order detail, items, address, timeline events, admin internal notes, payment proof modal, status update dialog | Read, Advance Status (Confirmed, Processing, Dispatched, Delivered, Cancelled), Add Admin Note | State machine transition validation | `orders`, `order_items`, `order_timeline_events`, `audit_logs` | `GET /api/v1/admin/orders/{id}`<br>`PATCH /api/v1/admin/orders/{id}/status`<br>`POST /api/v1/admin/orders/{id}/notes` | Admin, Super Admin, Order Manager |
| 46 | `/admin/payments` | `AdminPaymentsPage`, Payment DataTable, Receipt Inspection Modal, Action Buttons | Payments list: Order #, Customer, Gateway, Amount, Trans Ref, Status, Screenshot thumbnail | Read, Filter, Verify Payment, Reject Payment (with mandatory reason) | Rejection reason required on rejection | `orders`, `audit_logs` | `GET /api/v1/admin/payments`<br>`POST /api/v1/admin/payments/{orderId}/verify`<br>`POST /api/v1/admin/payments/{orderId}/reject` | Admin, Super Admin, Payment Manager |
| 47 | `/admin/customers` | `AdminCustomersPage`, Customer DataTable, Search, Spend Filter, Status Filter | Customer list: Avatar, Name, Email, Phone, Orders Count, Total Spending, Status (Active, Suspended), Joined Date | Read, Filter, Search, Suspend/Reactivate Account | Target user must be Customer role | `users`, `customer_profiles`, `orders` | `GET /api/v1/admin/customers`<br>`PATCH /api/v1/admin/customers/{id}/status` | Admin, Super Admin, Customer Support |
| 48 | `/admin/customers/:id` | `AdminCustomerDetailPage`, Customer Dossier Header, Order History Tab, Saved Addresses Tab, Notes | Customer profile, lifetime metrics, full order history, address cards, internal customer service notes | Read, Add Internal Note | Note text non-empty | `users`, `customer_profiles`, `orders`, `customer_addresses`, `audit_logs` | `GET /api/v1/admin/customers/{id}`<br>`POST /api/v1/admin/customers/{id}/notes` | Admin, Super Admin, Customer Support |
| 49 | `/admin/staff` | `AdminStaffPage`, Staff DataTable, Status Toggles, Create Staff Button | Staff list: Name, Email, Phone, Role badge, Status (Active, Inactive), Last Active, Joined Date | Read, Toggle Active Status, Delete Staff | Cannot deactivate own account or primary Super Admin | `users`, `roles`, `audit_logs` | `GET /api/v1/admin/staff`<br>`PATCH /api/v1/admin/staff/{id}/status`<br>`DELETE /api/v1/admin/staff/{id}` | Super Admin |
| 50 | `/admin/staff/create` | `AdminStaffFormPage`, Staff Invitation & Creation Form | Staff inputs: Full Name, Email, Phone, Role Dropdown, Temporary Password | Create Staff User & Assign Role | Unique email, phone format, valid role ID | `users`, `roles`, `audit_logs` | `POST /api/v1/admin/staff` | Super Admin |
| 51 | `/admin/staff/:id/edit` | `AdminStaffFormPage`, Prepopulated Staff Form | Edit staff profile, reassign role, reset password trigger | Update Staff Details | Valid role, email format | `users`, `roles`, `audit_logs` | `GET /api/v1/admin/staff/{id}`<br>`PUT /api/v1/admin/staff/{id}` | Super Admin |
| 52 | `/admin/roles` | `AdminRolesPage`, Role Permission Accordion / Matrix | Roles: Super Admin, Admin, Order Manager, Product Manager, Payment Manager, Customer Support with View/Create/Edit/Delete checkboxes per module | Read, Update Role Permission Matrix | Super Admin permissions immutable | `roles`, `role_claims`, `audit_logs` | `GET /api/v1/admin/roles`<br>`PUT /api/v1/admin/roles/{roleId}/permissions` | Super Admin |
| 53 | `/admin/coupons` | `AdminCouponsPage`, Coupon DataTable, Coupon Modal Dialog | Coupons list: Code, Discount Type (Percentage/Fixed), Discount Value, Min Order, Expiry Date, Usage Limit, Used Count, Status | Read, Create, Edit, Delete, Toggle Status | Unique code (uppercase), value > 0, expiry > now | `coupons`, `audit_logs` | `GET /api/v1/admin/coupons`<br>`POST /api/v1/admin/coupons`<br>`PUT /api/v1/admin/coupons/{id}`<br>`DELETE /api/v1/admin/coupons/{id}` | Admin, Super Admin |
| 54 | `/admin/reviews` | `AdminReviewsPage`, Review DataTable, Rating Stars, Status Filter | Reviews list: Product, Customer, Rating (1-5), Comment, Date, Status (Pending, Approved, Rejected) | Read, Approve, Reject, Delete Review | Status enum check | `product_reviews`, `products`, `audit_logs` | `GET /api/v1/admin/reviews`<br>`PATCH /api/v1/admin/reviews/{id}/status`<br>`DELETE /api/v1/admin/reviews/{id}` | Admin, Super Admin, Customer Support |
| 55 | `/admin/banners` | `AdminBannersPage`, Banner Card Grid, Reorder Buttons, Banner Modal Dialog | Banners: Title, Subtitle, CTA Text, CTA Link, Desktop Image, Mobile Image, Display Order, Active switch | Read, Create, Edit, Delete, Toggle Active, Reorder | Valid URLs, title required, image required | `campaign_banners`, `audit_logs` | `GET /api/v1/admin/banners`<br>`POST /api/v1/admin/banners`<br>`PUT /api/v1/admin/banners/{id}`<br>`DELETE /api/v1/admin/banners/{id}`<br>`PUT /api/v1/admin/banners/reorder` | Admin, Super Admin |
| 56 | `/admin/delivery` | `AdminDeliveryPage`, Zone Table, Zone Modal Dialog | Delivery zones: Province, District, Standard Tariff, Express Tariff, Estimated Days, Active toggle | Read, Create, Edit, Delete, Toggle Active | Non-negative charges, province & district required | `delivery_zones`, `audit_logs` | `GET /api/v1/admin/delivery-zones`<br>`POST /api/v1/admin/delivery-zones`<br>`PUT /api/v1/admin/delivery-zones/{id}`<br>`DELETE /api/v1/admin/delivery-zones/{id}` | Admin, Super Admin |
| 57 | `/admin/reports` | `AdminReportsPage`, Metric Summary, Revenue Chart, Category Breakdown PieChart, Top Selling Table, Export Button | Gross sales, net revenue, average order value, conversion rate, top selling products, sales by region | Read, Filter by Date Range, Export to CSV | Valid start & end date | `orders`, `order_items`, `products` | `GET /api/v1/admin/reports/sales`<br>`GET /api/v1/admin/reports/export` | Admin, Super Admin |
| 58 | `/admin/notifications`| `AdminNotificationsPage`, Notification Inbox, Filter Tabs (Order, Payment, Stock, Account) | System notifications with title, message, date, read status, direct link | Read, Mark as Read, Mark All Read | Ownership validation | `notifications` | `GET /api/v1/admin/notifications`<br>`PATCH /api/v1/admin/notifications/{id}/read`<br>`POST /api/v1/admin/notifications/read-all` | Admin, Super Admin, All Staff |
| 59 | `/admin/content` | `AdminContentPage`, Tabbed Rich Text Editors: FAQ, Size Guide, Policies | Static page contents (Shipping, Returns, Privacy, Terms, FAQ questions, Size charts) | Read, Update Content Blocks | Sanitized HTML/Markdown | `content_blocks`, `audit_logs` | `GET /api/v1/admin/content`<br>`PUT /api/v1/admin/content/{slug}` | Admin, Super Admin |
| 60 | `/admin/settings/brand`| `AdminBrandSettingsPage`, Brand Configuration Form | Brand Name, Tagline, Description, Support Email, Phone, Flagship Address, Announcement Bar text & toggle, Social links, Express delivery toggle | Read, Update Brand Settings | Valid email format, non-empty brand name | `brand_settings`, `audit_logs` | `GET /api/v1/admin/settings/brand`<br>`PUT /api/v1/admin/settings/brand` | Admin, Super Admin |
| 61 | `/admin/settings/payments`| `AdminPaymentSettingsPage`, Gateway Toggles, QR Upload, Merchant ID Inputs | Payment gateways configuration: COD enable/disable, eSewa toggle/merchant ID/QR image, Khalti toggle/merchant ID/QR image, Fonepay toggle/merchant name/QR image, checkout instructions | Read, Update Payment Gateways & Upload QR images | QR image valid image type, at least one gateway active | `payment_gateway_settings`, `audit_logs` | `GET /api/v1/admin/settings/payments`<br>`PUT /api/v1/admin/settings/payments`<br>`POST /api/v1/admin/media/upload-qr` | Admin, Super Admin, Payment Manager |
| 62 | `/admin/audit-logs` | `AdminAuditLogsPage`, Audit Log DataTable, Module Filter, Role Filter, Search Bar, JSON Detail Modal | Audit trails: Timestamp, User Email, Role, Action (CREATE, UPDATE, DELETE, VERIFY), Module, Details JSON | Read, Filter, Search | Read-only; audit logs are strictly append-only | `audit_logs` | `GET /api/v1/admin/audit-logs` (with filter params) | Super Admin |

---

## 5. Critical Domain Logic & Localization Requirements

### 5.1 Nepal-Specific Address Structure
The frontend form in `CheckoutPage` and `AccountAddressesPage` strictly enforces Nepal's administrative geography:
1. **Province:** Selected from the 7 federal provinces of Nepal:
   - Koshi Province (Province 1)
   - Madhesh Province (Province 2)
   - Bagmati Province (Province 3)
   - Gandaki Province (Province 4)
   - Lumbini Province (Province 5)
   - Karnali Province (Province 6)
   - Sudurpashchim Province (Province 7)
2. **District:** e.g., Kathmandu, Lalitpur, Bhaktapur, Kaski (Pokhara), Chitwan, Morang (Biratnagar), etc.
3. **Municipality / Metropolitan / Rural Municipality:** e.g., Kathmandu Metropolitan City, Lalitpur Metropolitan City, Pokhara Metropolitan City.
4. **Ward Number:** Integer/string representing municipal division (e.g., Ward 01 to Ward 35).
5. **Street / Tole / Chowk:** Local neighborhood designation (e.g., Durbarmarg, Jhamsikhel, New Road).
6. **Landmark:** Nearest recognized physical point of orientation (e.g., "Opposite Annapurna Hotel", "Near Labim Mall").
7. **Special Delivery Instructions:** Optional instructions for couriers (e.g., "Ring bell twice", "Leave with reception").

### 5.2 Dynamic Delivery Zone Tariff Calculation
The backend calculation engine must evaluate the selected `province` and `district` against the `delivery_zones` table:
- **Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur):**
  - Standard Delivery: **NPR 0 (Free Delivery)** — 1 to 2 business days.
  - Express Same-Day Delivery: **NPR 150** — Delivery within 6 hours.
- **Major Urban Hubs Outside Valley (Pokhara, Biratnagar, Chitwan, Butwal, Birgunj, Dharan):**
  - Standard Delivery: **NPR 150** — 2 to 3 business days.
  - Express Delivery: **NPR 300** — 24 to 48 hours.
- **Remote / Hill / Mountain Districts (Karnali, Sudurpashchim outer zones):**
  - Standard Delivery: **NPR 250** — 4 to 6 business days.
  - Express Delivery: **NPR 500** — 3 to 4 business days.
- **Free Shipping Threshold:** Brand settings may define a global subtotal threshold (e.g., orders above NPR 10,000 qualify for free standard shipping anywhere in Nepal).

### 5.3 Manual Digital Wallet Payment & Verification Workflow
Unlike western credit card flows, digital wallet payments in Nepal (eSewa, Khalti, Fonepay) for high-end luxury boutiques operate predominantly via dynamic or static QR merchant codes:
1. Customer selects eSewa, Khalti, or Fonepay at checkout.
2. System displays the boutique's official Merchant QR code and instruction guide.
3. Customer scans QR using their banking/wallet app, pays the exact `totalAmount`, and captures a transaction receipt screenshot.
4. Customer enters their alphanumeric **Transaction Reference ID** (e.g., `ESEWA-89234190` or `KHL-998812`) and uploads the screenshot image (`paymentScreenshot`).
5. Order is created with `paymentStatus = "Pending Verification"` and `orderStatus = "Placed"`.
6. Payment Manager inspects the uploaded receipt image side-by-side with the wallet statement in the Admin Payment Management Portal (`/admin/payments`).
7. Upon confirmation:
   - Admin clicks **"Verify Payment"**: status changes to `Verified`, order status advances to `Confirmed`, inventory is committed, and an order confirmation email/notification is dispatched.
   - If fraudulent or mismatched: Admin clicks **"Reject Payment"**, provides a mandatory `rejectionReason`, status changes to `Rejected`, customer is notified, and inventory is released.

---

## 6. Frontend to Backend Migration Strategy

To ensure zero downtime, zero layout breakages, and seamless user transition, the frontend integration will proceed in well-defined phases:
1. **API Client Scaffolding:** Create `src/services/api/` containing typed Axios or Fetch clients configured with interceptors for automatic JWT attachment, HttpOnly refresh token rotation, and standardized error unwrapping.
2. **Parallel State Hydration:** Update `StoreContext.tsx` actions from synchronous `localStorage.setItem` calls to asynchronous API dispatches, while keeping fallback local caching during offline or testing phases.
3. **Form Error Mappings:** Bind RFC 7807 validation error payloads directly to frontend field error states.
4. **Media Upload Integration:** Connect product image uploads and checkout payment proof uploads to the backend multipart file upload endpoint backing Supabase Storage.
