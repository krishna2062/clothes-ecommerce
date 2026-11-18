# YOUR BRAND — Luxury Minimal Fashion E-Commerce Frontend

A complete, multi-page luxury minimal fashion e-commerce frontend built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **React Router v7**, **React Hook Form**, **Zod**, **Lucide React**, and **Recharts**.

---

## Architecture Overview

1. **Public Storefront (22 Routes)**
   - Editorial Homepage (`/`), Complete Catalog (`/shop`), Gender & Capsule Collections (`/collections/men`, `/collections/women`, `/collections/unisex`, `/new-arrivals`, `/best-sellers`, `/sale`, `/category/:slug`), Product Detail with Size Guide Modal (`/product/:slug`), Wishlist (`/wishlist`), Shopping Bag (`/cart`), Multi-Section Checkout with Manual QR Screenshot Upload for **eSewa**, **Khalti**, **Fonepay**, & **COD** (`/checkout`), Order Confirmation (`/order-success`), and Brand & Policy Pages (`/about`, `/contact`, `/faq`, `/size-guide`, `/shipping-policy`, `/return-policy`, `/privacy-policy`, `/terms`).

2. **Customer Authentication & Private Client Dossier (`/login`, `/register`, `/account/*`)**
   - Split-screen authentication pages (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`).
   - 9-page Customer Account Dashboard (`/account`, `/account/profile`, `/account/addresses`, `/account/orders`, `/account/orders/:id`, `/account/wishlist`, `/account/payment-history`, `/account/change-password`, `/account/notifications`).

3. **Admin Dashboard (`/admin/*` — All 20 Modules)**
   - Executive Overview (`/admin`), Products CRUD (`/admin/products`, `/admin/products/create`, `/admin/products/:id/edit`), Categories (`/admin/categories`), Collections (`/admin/collections`), Inventory & Variant Stock Adjustments (`/admin/inventory`), Orders (`/admin/orders`, `/admin/orders/:id`), Payment Verification & QR Screenshot Zoom (`/admin/payments`), Customers (`/admin/customers`, `/admin/customers/:id`), Staff (`/admin/staff`, `/admin/staff/create`, `/admin/staff/:id/edit`), Roles & Permissions Matrix (`/admin/roles`), Coupons (`/admin/coupons`), Reviews (`/admin/reviews`), Banners (`/admin/banners`), Delivery Tariffs (`/admin/delivery`), Reports & CSV Export (`/admin/reports`), Notifications (`/admin/notifications`), Website Content (`/admin/content`), Brand Settings (`/admin/settings/brand`), Payment Settings (`/admin/settings/payments`), and Audit Logs (`/admin/audit-logs`).

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server on port 3000
npm run dev

# 3. Typecheck and build for production
npm run lint
npm run build
```

---

## Pushing to GitHub & Deploying on Vercel

### Step 1: Push to GitHub

Run these commands in your project folder after downloading or cloning:

```bash
git init
git add .
git commit -m "feat: complete luxury minimal fashion e-commerce frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Deploy to Vercel

This repository includes a pre-configured `vercel.json` file that automatically sets up:
- **Framework Preset**: `vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Rewrite Rules**: Routes all deep links (`/shop`, `/checkout`, `/account/*`, `/admin/*`) to `/index.html` so refreshing any page works seamlessly without 404 errors.

#### Option A: Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Select your newly pushed GitHub repository and click **Import**.
3. Vercel will automatically detect the settings from `vercel.json`.
4. Click **Deploy**.

#### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```
