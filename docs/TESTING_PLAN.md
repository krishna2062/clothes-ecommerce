# MAISON VÉRA — Automated Testing & Quality Assurance Plan
**xUnit Unit Testing, WebApplicationFactory Integration Testing & Security Penetration Suite**
*Document Version: 1.0.0 | Date: 2026-11-21 | Target Framework: .NET 8 / xUnit / FluentAssertions*

---

## 1. Testing Philosophy & Test Trophy Architecture

The testing strategy follows the standard **Testing Trophy** model, emphasizing automated integration testing and mission-critical unit testing for financial, cryptographic, and inventory calculations.

```
       / \
      / E2E \       <-- Cypress / Playwright Smoke Tests (Phase 9)
     /-------\
    / Integration \  <-- Microsoft.AspNetCore.Mvc.Testing WebApplicationFactory
   /---------------\
  /   Unit Tests    \ <-- Domain Entities, Nepal Delivery Tariffs, Coupons, Validation
 /-------------------\
```

### Core Testing Toolchain
- **Testing Framework:** `xUnit: 2.6.*`
- **Assertion Library:** `FluentAssertions: 6.12.*` (Readable, expressive BDD-style assertions)
- **Mocking Framework:** `Moq: 4.20.*` / `NSubstitute: 5.1.*`
- **API Integration Testing:** `Microsoft.AspNetCore.Mvc.Testing: 8.0.*`
- **Database Resetting & Fixtures:** `Respawn: 6.2.*` or in-memory SQLite / test Supabase instance
- **Test Data Generation:** `Bogus: 35.5.*` for realistic mock luxury orders, addresses, and products

---

## 2. Unit Testing Specification (`ClothingStore.UnitTests`)

### 2.1 Domain Entities & Invariants
| Test Suite | Target Entity / Method | Scenarios Tested | Expected Outcome |
|---|---|---|---|
| `ProductTests` | `Product.Create(...)` | Negative selling price or original price less than selling price | Throws `DomainValidationException` |
| `ProductTests` | `Product.UpdateDiscount(...)` | Normal discount, 0% discount, 100% free | Recalculates `sellingPrice` and `discountPercent` accurately |
| `ProductVariantTests` | `ProductVariant.DeductStock(int qty)` | Deducting more than available stock | Throws `InsufficientStockException` |
| `OrderTests` | `Order.AdvanceStatus(OrderStatus next)` | Transition from `Placed` to `Confirmed` | Appends `OrderTimelineEvent`, updates status |
| `OrderTests` | `Order.AdvanceStatus(OrderStatus next)` | Invalid transition (e.g. `Delivered` to `Placed`) | Throws `InvalidStateTransitionException` |
| `OrderTests` | `Order.RequestCancellation()` | Cancellation requested when status is `Dispatched` | Throws `OrderCancellationProhibitedException` |

### 2.2 Calculation Services Unit Tests
| Test Suite | Target Service | Scenarios Tested | Expected Outcome |
|---|---|---|---|
| `NepalDeliveryTariffTests` | `CalculateTariff(province, district, method)` | Kathmandu Valley (Standard) | Returns `NPR 0.00` |
| `NepalDeliveryTariffTests` | `CalculateTariff(province, district, method)` | Kathmandu Valley (Express) | Returns `NPR 150.00` |
| `NepalDeliveryTariffTests` | `CalculateTariff(province, district, method)` | Pokhara / Kaski (Standard) | Returns `NPR 150.00` |
| `NepalDeliveryTariffTests` | `CalculateTariff(province, district, method)` | Pokhara / Kaski (Express) | Returns `NPR 300.00` |
| `NepalDeliveryTariffTests` | `CalculateTariff(province, district, method)` | Karnali Province (Remote Standard) | Returns `NPR 250.00` |
| `NepalDeliveryTariffTests` | `CalculateTariff(...)` with subtotal >= 10,000 | Free shipping threshold met | Returns `NPR 0.00` for standard delivery |
| `CouponServiceTests` | `ValidateAndCalculate(coupon, subtotal)` | Fixed discount (e.g. NPR 1,000 off) | Accurately deducts NPR 1,000; returns new total |
| `CouponServiceTests` | `ValidateAndCalculate(coupon, subtotal)` | Percentage discount (e.g. 15% off) | Accurately deducts 15%; respects `maxDiscountAmount` cap |
| `CouponServiceTests` | `ValidateAndCalculate(...)` | Subtotal below `minOrderAmount` | Returns invalid status with explanatory message |
| `CouponServiceTests` | `ValidateAndCalculate(...)` | Expired coupon date | Returns invalid status (`COUPON_EXPIRED`) |
| `CouponServiceTests` | `ValidateAndCalculate(...)` | `usedCount >= usageLimit` | Returns invalid status (`USAGE_LIMIT_EXCEEDED`) |

### 2.3 FluentValidation Request Rules Tests
- `RegisterRequestValidatorTests`: Validates email format, Nepal phone prefix (`98` or `97`), password complexity (uppercase, lowercase, number, symbol), and password confirmation match.
- `CheckoutRequestValidatorTests`: Validates mandatory address fields (Province, District, Municipality, Ward, Street, Landmark), phone format, and non-empty cart items.
- `StockAdjustmentValidatorTests`: Validates non-empty audit reason string and non-zero integer delta.

---

## 3. Integration Testing Specification (`ClothingStore.IntegrationTests`)

Using ASP.NET Core's `WebApplicationFactory<Program>`, the integration test suite boots an in-memory HTTP server executing against an isolated test database.

### 3.1 Authentication & Security Integration Tests
| Test Class | Test Case | Target Endpoint | Assertion |
|---|---|---|---|
| `AuthEndpointsTests` | `Register_WithValidCustomerData_CreatesUserAndReturnsTokens` | `POST /api/v1/auth/register` | `201 Created`, user exists in DB, `__Host-refresh-token` cookie set |
| `AuthEndpointsTests` | `Register_WithDuplicateEmail_ReturnsConflict` | `POST /api/v1/auth/register` | `409 Conflict`, error code `EMAIL_ALREADY_EXISTS` |
| `AuthEndpointsTests` | `Login_WithValidCredentials_ReturnsJwtAndSetsCookie` | `POST /api/v1/auth/login` | `200 OK`, JWT contains claims `sub`, `email`, `role` |
| `AuthEndpointsTests` | `Login_WithInvalidPassword_ReturnsUnauthorized` | `POST /api/v1/auth/login` | `401 Unauthorized`, `access_failed_count` incremented |
| `AuthEndpointsTests` | `RefreshToken_WithValidCookie_RotatesTokens` | `POST /api/v1/auth/refresh-token` | `200 OK`, new JWT issued, old refresh token marked used |
| `AuthEndpointsTests` | `RefreshToken_WithReusedToken_RevokesAllSessions` | `POST /api/v1/auth/refresh-token` | `401 Unauthorized`, all user refresh tokens revoked |
| `AuthEndpointsTests` | `RateLimiter_MoreThanFiveLoginAttempts_ReturnsTooManyRequests` | `POST /api/v1/auth/login` | `429 Too Many Requests` on 6th attempt within 1 minute |

### 3.2 Product Catalog & Inventory Integration Tests
| Test Class | Test Case | Target Endpoint | Assertion |
|---|---|---|---|
| `ProductCatalogTests` | `GetProducts_WithCategoryFilter_ReturnsOnlyMatchingProducts` | `GET /api/v1/products?category=outerwear` | Returns only products with `categorySlug == 'outerwear'` |
| `ProductCatalogTests` | `GetProductBySlug_WithValidSlug_ReturnsFullDetailAndVariants` | `GET /api/v1/products/{slug}` | Returns product, images, sizes, colors, and live variant stock |
| `InventoryTests` | `AdjustStock_WithValidDelta_UpdatesStockAndCreatesAuditMovement` | `POST /api/v1/admin/inventory/adjust` | `200 OK`, `stock_quantity` updated, `stock_movements` record created |
| `InventoryTests` | `AdjustStock_AsCustomerRole_ReturnsForbidden` | `POST /api/v1/admin/inventory/adjust` | `403 Forbidden` |

### 3.3 Checkout, Orders & Payment Integration Tests
| Test Class | Test Case | Target Endpoint | Assertion |
|---|---|---|---|
| `CheckoutTests` | `Checkout_WithSufficientStock_CreatesOrderAndDeductsInventory` | `POST /api/v1/orders/checkout` | `201 Created`, order created with `MV-2026-` number, variant stock reduced |
| `CheckoutTests` | `Checkout_WithInsufficientStock_RollsBackTransaction` | `POST /api/v1/orders/checkout` | `400 BadRequest`, zero database records mutated |
| `PaymentVerificationTests`| `VerifyPayment_WithValidOrderId_UpdatesStatusToVerified` | `POST /api/v1/admin/payments/{id}/verify` | `200 OK`, `payment_status` = `Verified`, `order_status` = `Confirmed` |
| `PaymentVerificationTests`| `RejectPayment_WithReason_UpdatesStatusAndReleasesStock` | `POST /api/v1/admin/payments/{id}/reject` | `200 OK`, `payment_status` = `Rejected`, inventory restored |

---

## 4. Security Penetration & Concurrency Tests

### 4.1 Role-Based Access Control (RBAC) Escalation Tests
- Verify that a JWT carrying the `Customer` role receives `403 Forbidden` on every `/api/v1/admin/*` route.
- Verify that a `Customer Support` staff JWT can view `/api/v1/admin/orders` but receives `403 Forbidden` when attempting to delete products (`DELETE /api/v1/admin/products/{id}`).
- Verify that only a `Super Admin` can access `/api/v1/admin/staff` and `/api/v1/admin/roles`.

### 4.2 Concurrency & Race Condition Stress Tests
- **High-Demand Capsule Drop Simulation:** 20 concurrent threads attempting to purchase the last 2 remaining garments of size `48 / M`.
- **Assertion:** Exactly 2 orders succeed; remaining 18 threads receive `400 BadRequest` (`INSUFFICIENT_STOCK`); database stock count terminates at exactly `0`.
- **Double Payment Verification Prevention:** 2 concurrent admin verification requests executed simultaneously for the same order ID.
- **Assertion:** Exactly one request commits state transition; second request detects concurrency mismatch or idempotency lock.

---

## 5. Frontend Verification & Smoke Testing Matrix

Once the API client in `src/services/api/` is wired to the frontend, the following verification runs validate complete end-to-end functionality across all 62 client pages:

1. **Public Storefront:**
   - Homepage banners render from `/api/v1/banners/active`.
   - Catalog filtering updates URL query parameters and fetches matching garments without full page reloads.
   - Variant selector dynamically displays real-time stock levels; out-of-stock sizes are disabled.
2. **Shopping Bag & Local/Remote Sync:**
   - Adding garments as an unauthenticated guest saves to local state.
   - Logging into a customer account merges the guest bag with the remote server-side bag.
3. **Multi-Step Localized Checkout:**
   - Selecting `Bagmati Province` -> `Kathmandu` dynamically zeroes the standard delivery fee.
   - Selecting `eSewa` displays the official QR code and prompts for receipt upload.
   - Submitting checkout successfully triggers the order confirmation page with order number.
4. **Customer Dossier:**
   - Order history lists placed order in real-time.
   - Visual timeline displays current fulfillment status (`Placed`).
5. **Admin Operations:**
   - New order appears in real-time on `/admin/orders` and `/admin/payments`.
   - Admin inspects payment proof screenshot and clicks "Verify Payment".
   - Customer dossier and public confirmation page reflect immediate update to `Verified` / `Confirmed`.
