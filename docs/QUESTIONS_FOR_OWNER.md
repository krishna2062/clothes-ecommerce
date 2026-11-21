# MAISON VÉRA — Decisions & Credentials Required from Store Owner
**Architectural Decisions, Supabase Configuration & Operational Policies**
*Document Version: 1.0.0 | Date: 2026-11-21 | Target Backend: ASP.NET Core 8 & Supabase*

---

Dear Store Owner / Atelier Director,

To ensure the backend implementation strictly reflects your business operations, security expectations, and infrastructure choices, please review the following 7 decision groups. For each question, a **(Recommended)** option has been formulated based on luxury e-commerce and international software architecture standards.

You may simply accept the recommended options or specify your customized preferences.

---

## Group 1: Supabase PostgreSQL Connection & Project Credentials

### Question 1.1: Supabase Database Connection Details
To apply EF Core 8 Code-First migrations and connect the backend to your Supabase PostgreSQL database, the connection string is required.

- **Option A (Recommended):** Use the Supabase Transaction Pooler connection string (Port 6543) with `Pooling=true;SSL Mode=Require;Trust Server Certificate=true;` for high-concurrency API performance, alongside direct connection (Port 5432) for running EF Core migrations.
- **Option B:** Direct connection string only (Port 5432).
- **Required Inputs from Owner:**
  - Supabase Database Connection String: `Host=db.xxxx.supabase.co;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;Port=5432;SSL Mode=Require;`
  - Supabase Project URL: `https://xxxx.supabase.co`
  - Supabase Service Role Key: `eyJhbGciOi...` (for backend administrative storage access)

---

## Group 2: Media & Storage Bucket Architecture

### Question 2.1: Supabase Storage Buckets for Images & Proofs
Luxury product photography and customer payment receipts require distinct privacy levels:
- **Option A (Recommended):**
  - **Bucket 1 (`product-images`):** Public bucket with CDN caching for lookbook imagery, product variants, and category banners.
  - **Bucket 2 (`payment-receipts`):** Strictly **Private** bucket. Receipts contain sensitive personal financial data (eSewa/Khalti account names, balances, phone numbers). Files can only be viewed by authenticated administrative staff through time-limited pre-signed URLs (5-minute expiration).
- **Option B:** Single public bucket with obfuscated GUID file paths for all media.

---

## Group 3: Email Notification & Communications Provider

### Question 3.1: Transactional Email Delivery Service
When customers place orders, verify emails, or receive payment approval/rejection updates, the backend dispatches transactional emails.
- **Option A (Recommended):** **Resend** or **SendGrid** API integration for reliable, white-labeled transactional email delivery with custom domain DKIM/SPF (`atelier@maisonvera.com`).
- **Option B:** Standard SMTP server credentials provided by your hosting domain.
- **Option C:** Supabase Auth built-in email service for auth tokens, with internal database-only notifications for orders during the MVP phase.

---

## Group 4: Authentication & User Session Policies

### Question 4.1: Mandatory Email Verification Before Login
- **Option A (Recommended for Luxury Atelier):** Soft email verification. Clients can browse, place orders, and access their accounts immediately upon registration, but a gentle reminder banner asks them to verify their email address.
- **Option B:** Strict email verification. Customers cannot log in or place orders until they click the verification link sent to their inbox.

### Question 4.2: Session Lifetimes & Remember Me
- **Option A (Recommended):** Short-lived Access Token (15 minutes in memory) paired with a 7-day Refresh Token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie with automatic rotation and reuse detection.
- **Option B:** 30-day extended persistent session for customer convenience.

---

## Group 5: Nepal Payment Gateway & Verification Workflow

### Question 5.1: Payment Proof Verification Protocol
- **Option A (Recommended):** **Dual-phase Manual Verification:**
  1. Order placed -> Status: `Placed`, Payment Status: `Pending Verification`. Inventory is temporarily held for 24 hours.
  2. Administrative staff inspects the receipt screenshot side-by-side with bank/wallet statements.
  3. Clicking "Verify Payment" transitions payment to `Verified`, order to `Confirmed`, and commits inventory.
  4. If payment is not verified within 24 hours or rejected, inventory is automatically restored.
- **Option B:** Instant order confirmation upon transaction reference submission, with retroactive cancellation if payment fails audit.

---

## Group 6: Order Cancellation & Returns Policy

### Question 6.1: Customer Self-Service Cancellation Window
- **Option A (Recommended):** Customers can self-cancel an order directly from their Account Dossier only while the order is in `Placed` or `Confirmed` status. Once the order status advances to `Processing` or `Dispatched`, the cancellation button is disabled, requiring customer support assistance.
- **Option B:** Customers cannot self-cancel online; all cancellations must be processed via telephone or concierge email.

---

## Group 7: ASP.NET Core 8 API Production Hosting

### Question 7.1: Cloud Hosting Target for Backend Web API
Where would you prefer the compiled ASP.NET Core 8 Web API container/service to be hosted?
- **Option A (Recommended for Simplicity & Value):** **Railway** or **Render** Docker container deployment directly connected to your GitHub repository with automatic CI/CD and HTTPS.
- **Option B:** **Microsoft Azure App Service** (Linux / .NET 8) with Azure Key Vault integration.
- **Option C:** **AWS ECS / App Runner** or VPS (DigitalOcean / Linode) with Docker Compose and Nginx reverse proxy.

---

### Summary of Recommended Defaults
| Area | Recommended Decision | Status |
|---|---|---|
| **Database** | Supabase PostgreSQL via EF Core 8 Code-First (Npgsql) | Awaiting Credentials |
| **Media Storage** | Public bucket for products; Private bucket with pre-signed URLs for payment receipts | Recommended |
| **Transactional Email** | Resend / SendGrid with fallback to Supabase SMTP | Recommended |
| **User Authentication** | Argon2id + 15m JWT + 7d HttpOnly Rotated Refresh Token | Recommended |
| **Payment Verification**| Manual QR receipt inspection with 24h inventory hold | Recommended |
| **Order Cancellation** | Customer self-cancellation permitted during `Placed`/`Confirmed` only | Recommended |
| **Hosting Target** | Railway / Render (or Azure App Service) | Recommended |

*Please provide your decisions or confirmation to proceed with the scaffolding of the .NET 8 solution and database setup.*
