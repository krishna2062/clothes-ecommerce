# MAISON VÉRA — RESTful API Specification
**ASP.NET Core 8 Web API Contract & OpenAPI Specification**
*Document Version: 1.0.0 | Date: 2026-11-21 | Base URL: `/api/v1`*

---

## 1. Global API Standards & Conventions

### 1.1 Base URL & Versioning
- **Base URL:** `https://api.maisonvera.com/api/v1` (Production) | `http://localhost:5000/api/v1` (Local Development)
- **Versioning Scheme:** URI-based major versioning (`/api/v1`). Minor or non-breaking field additions maintain backward compatibility.

### 1.2 Global Response Envelope
Every API response from the ASP.NET Core 8 backend conforms to the standardized generic envelope:

#### Successful Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "message": "Operation completed successfully.",
  "timestamp": "2026-11-21T12:00:00.000Z",
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 154,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```
*Note: `pagination` is present only on paginated collection responses; otherwise it is `null`.*

#### Error Response Envelope (RFC 7807 Extended)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more validation errors occurred.",
    "traceId": "00-4b2a8f89a9c2-b34e567f-00",
    "validationErrors": [
      {
        "field": "phoneNumber",
        "message": "Phone number must be a valid 10-digit Nepal mobile number starting with 98 or 97."
      }
    ]
  },
  "message": "Request could not be processed.",
  "timestamp": "2026-11-21T12:00:00.000Z",
  "pagination": null
}
```

### 1.3 Standard HTTP Status Codes
| Code | Constant | Meaning in System |
|---|---|---|
| `200` | `OK` | Request succeeded; response payload contains data. |
| `201` | `Created` | Entity created; returns new entity with `Location` header. |
| `204` | `NoContent` | Mutation succeeded (e.g., delete); no response body returned. |
| `400` | `BadRequest` | Malformed JSON or business logic constraint violation. |
| `401` | `Unauthorized` | Missing, expired, or invalid JWT access token. |
| `403` | `Forbidden` | Authenticated actor lacks necessary RBAC role/permission. |
| `404` | `NotFound` | Requested resource slug or ID does not exist. |
| `409` | `Conflict` | Unique constraint violation (e.g. duplicate email, SKU, slug). |
| `422` | `UnprocessableEntity` | FluentValidation failed on request body schema. |
| `429` | `TooManyRequests` | Rate limit exceeded (e.g. login brute-force prevention). |
| `500` | `InternalServerError` | Unhandled server exception (logged with Serilog). |

---

## 2. Authentication & Identity Endpoints

### 2.1 `POST /api/v1/auth/register`
- **Description:** Registers a new client account or submits a staff application.
- **Authorization:** Anonymous
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "fullName": "Elena Rostova",
    "email": "elena.rostova@example.com",
    "phone": "+977 9841234567",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "accountType": "customer", // "customer" | "staff"
    "staffRole": null // Optional: e.g. "Order Manager" (if accountType == "staff")
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "c1f7b0a8-...",
        "fullName": "Elena Rostova",
        "email": "elena.rostova@example.com",
        "phone": "+977 9841234567",
        "accountType": "customer",
        "roleTitle": "Customer"
      },
      "accessToken": "eyJhbGciOi...",
      "expiresIn": 900
    },
    "message": "Account created successfully.",
    "timestamp": "2026-11-21T12:00:00Z"
  }
  ```
- **Set-Cookie Header:** `__Host-refresh-token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800`

### 2.2 `POST /api/v1/auth/login`
- **Description:** Authenticates credentials (email or phone) and returns access token + sets refresh token cookie.
- **Authorization:** Anonymous (Protected by Rate Limiter: max 5 attempts/min per IP)
- **Request Body:**
  ```json
  {
    "identifier": "admin@maisonvera.com",
    "password": "Password123!",
    "rememberMe": true
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "e9b23a10-...",
        "fullName": "Maison Véra Atelier",
        "email": "admin@maisonvera.com",
        "phone": "+977 1 4239800",
        "accountType": "admin",
        "roleTitle": "Super Admin"
      },
      "accessToken": "eyJhbGciOi...",
      "expiresIn": 900
    },
    "message": "Authentication successful.",
    "timestamp": "2026-11-21T12:00:00Z"
  }
  ```

### 2.3 `POST /api/v1/auth/refresh-token`
- **Description:** Rotates expired JWT access token using the HttpOnly refresh token cookie.
- **Authorization:** Anonymous (Requires valid `__Host-refresh-token` cookie)
- **Response `200 OK`:** Returns new `accessToken` and sets rotated cookie.

### 2.4 `POST /api/v1/auth/logout`
- **Description:** Revokes active refresh token and clears client auth cookies.
- **Authorization:** Authenticated
- **Response `200 OK`:** Token revoked.

### 2.5 `POST /api/v1/auth/forgot-password`
- **Request Body:** `{ "email": "client@example.com" }`
- **Response `200 OK`:** Instructions dispatched.

### 2.6 `POST /api/v1/auth/reset-password`
- **Request Body:** `{ "token": "rst_xyz...", "newPassword": "NewPassword123!", "confirmPassword": "NewPassword123!" }`
- **Response `200 OK`:** Password updated.

---

## 3. Product Catalog & Variant Endpoints

### 3.1 `GET /api/v1/products`
- **Description:** Retrieve paginated, filterable products for public catalog.
- **Authorization:** Anonymous
- **Query Parameters:**
  - `page` (int, default: 1)
  - `pageSize` (int, default: 12)
  - `search` (string)
  - `category` (string, slug)
  - `collection` (string: "Men" | "Women" | "Unisex")
  - `featured` (bool)
  - `newArrival` (bool)
  - `bestSeller` (bool)
  - `onSale` (bool)
  - `minPrice` (decimal)
  - `maxPrice` (decimal)
  - `sizes` (comma-separated, e.g. "S,M,L")
  - `colors` (comma-separated, e.g. "Noir,Ecru")
  - `sortBy` ("price-asc" | "price-desc" | "newest" | "name")
- **Response `200 OK`:** Returns product array with summary cards and pagination.

### 3.2 `GET /api/v1/products/{slug}`
- **Description:** Retrieve single full product detail by URL slug, including variant stock matrix, images, and reviews.
- **Authorization:** Anonymous
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "PRD-001",
      "slug": "architectural-virgin-wool-overcoat",
      "name": "Architectural Virgin Wool Overcoat",
      "sku": "MV-W26-COAT-01",
      "description": "Exquisitely tailored from heavy-gauge virgin wool...",
      "materialsAndCare": ["100% Virgin Wool Outer", "Bemberg Cupro Lining", "Dry Clean Only"],
      "shippingInfo": "Complimentary atelier white-glove delivery in Kathmandu Valley...",
      "category": "Outerwear",
      "categorySlug": "outerwear",
      "collection": "Unisex",
      "originalPrice": 48500.00,
      "sellingPrice": 48500.00,
      "discountPercent": 0,
      "mainImage": "https://images.unsplash.com/...",
      "images": ["https://images.unsplash.com/...", "..."],
      "sizes": ["46 / S", "48 / M", "50 / L", "52 / XL"],
      "colors": [{ "name": "Noir Charcoal", "hex": "#1a1a1a" }],
      "totalStock": 14,
      "variantStock": [
        { "sku": "MV-W26-COAT-01-S", "size": "46 / S", "color": "Noir Charcoal", "stock": 3 },
        { "sku": "MV-W26-COAT-01-M", "size": "48 / M", "color": "Noir Charcoal", "stock": 5 }
      ],
      "featured": true,
      "newArrival": true,
      "bestSeller": true,
      "onSale": false,
      "averageRating": 5.0,
      "reviewCount": 4
    }
  }
  ```

### 3.3 `POST /api/v1/admin/products`
- **Description:** Admin creation of a garment with full variant matrix generation.
- **Authorization:** Required Role: `Admin`, `Super Admin`, `Product Manager`
- **Request Body:** Full product payload including variants.
- **Response `201 Created`:** Created product entity.

### 3.4 `PUT /api/v1/admin/products/{id}`
- **Description:** Admin update of product details, pricing, and variants.
- **Authorization:** Required Role: `Admin`, `Super Admin`, `Product Manager`
- **Response `200 OK`:** Updated product entity.

### 3.5 `DELETE /api/v1/admin/products/{id}`
- **Description:** Soft-deletes a product from the catalog.
- **Authorization:** Required Role: `Admin`, `Super Admin`
- **Response `204 NoContent`**

---

## 4. Categories & Collections Endpoints

### 4.1 `GET /api/v1/categories`
- **Description:** Public category navigation listing with live product counts.
- **Authorization:** Anonymous
- **Response `200 OK`:** Array of active categories.

### 4.2 `POST /api/v1/admin/categories`
- **Description:** Create new category.
- **Authorization:** Required Role: `Admin`, `Product Manager`
- **Response `201 Created`**

### 4.3 `GET /api/v1/collections`
- **Description:** Public curated editorial capsules with banner images.
- **Authorization:** Anonymous

### 4.4 `GET /api/v1/collections/{slug}`
- **Description:** Public collection details and associated garment IDs.
- **Authorization:** Anonymous

---

## 5. Inventory & Stock Control Endpoints

### 5.1 `GET /api/v1/admin/inventory`
- **Description:** Multi-variant inventory overview with low stock indicators.
- **Authorization:** Required Role: `Admin`, `Product Manager`
- **Query Params:** `lowStockOnly` (bool), `search` (string)

### 5.2 `POST /api/v1/admin/inventory/adjust`
- **Description:** Adjust physical variant stock count with audit reason logging.
- **Authorization:** Required Role: `Admin`, `Product Manager`
- **Request Body:**
  ```json
  {
    "variantId": "d3b07384-...",
    "delta": 5, // Positive for addition, negative for deduction
    "reason": "Atelier Physical Recount — Fall Batch"
  }
  ```
- **Response `200 OK`:** Returns updated variant and generated `stock_movement` entry.

### 5.3 `GET /api/v1/admin/inventory/movements`
- **Description:** Chronological stock audit movement history.
- **Authorization:** Required Role: `Admin`, `Product Manager`

---

## 6. Bag (Cart) & Wishlist Endpoints

### 6.1 `GET /api/v1/cart`
- **Description:** Retrieve authenticated client's shopping bag or validate guest bag items against current stock and prices.
- **Authorization:** Anonymous / Authenticated

### 6.2 `POST /api/v1/cart/items`
- **Description:** Add garment variant to bag with stock check.
- **Request Body:** `{ "productId": "PRD-001", "variantSku": "MV-W26-COAT-01-M", "quantity": 1 }`

### 6.3 `PUT /api/v1/cart/items/{id}`
- **Description:** Update bag item quantity.
- **Request Body:** `{ "quantity": 2 }`

### 6.4 `DELETE /api/v1/cart/items/{id}`
- **Description:** Remove line item from bag.

### 6.5 `GET /api/v1/wishlist` & `POST /api/v1/wishlist/{productId}`
- **Description:** Retrieve or toggle saved wishlist garments.

---

## 7. Checkout, Orders & Nepal Delivery Endpoints

### 7.1 `GET /api/v1/delivery-zones`
- **Description:** Public delivery tariff rules for shipping calculation.
- **Authorization:** Anonymous
- **Response `200 OK`:** Array of zones with standard and express tariffs.

### 7.2 `POST /api/v1/coupons/validate`
- **Description:** Validate a promotional code against current cart subtotal.
- **Request Body:** `{ "code": "VERA10", "subtotal": 48500.00 }`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "valid": true,
      "code": "VERA10",
      "discountType": "Percentage",
      "discountValue": 10.00,
      "calculatedDiscount": 4850.00,
      "message": "10% VIP Privilege Discount Applied"
    }
  }
  ```

### 7.3 `POST /api/v1/orders/checkout`
- **Description:** Finalizes checkout, commits inventory, creates order and order items, and registers timeline event.
- **Authorization:** Anonymous (Guest) or Authenticated (Customer)
- **Request Body:**
  ```json
  {
    "customerName": "Siddhartha Thapa",
    "customerEmail": "siddhartha.thapa@example.com",
    "customerPhone": "+977 9801234567",
    "deliveryMethod": "Express", // "Standard" | "Express"
    "shippingAddress": {
      "province": "Bagmati Province",
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan City",
      "ward": "01",
      "street": "Durbar Marg, Heritage Boulevard",
      "landmark": "Opposite Annapurna Luxury Arcade",
      "instructions": "Deliver to front reception"
    },
    "paymentMethod": "eSewa", // "COD" | "eSewa" | "Khalti" | "Fonepay"
    "transactionRef": "ESEWA-89234190",
    "paymentScreenshotUrl": "https://storage.maisonvera.com/receipts/proof-8921.jpg",
    "couponCode": "VERA10",
    "items": [
      {
        "productId": "PRD-001",
        "variantSku": "MV-W26-COAT-01-M",
        "size": "48 / M",
        "color": "Noir Charcoal",
        "quantity": 1
      }
    ]
  }
  ```
- **Response `201 Created`:** Returns created `Order` object with unique `orderNumber` (`MV-2026-8921`).

### 7.4 `GET /api/v1/orders/{orderNumber}/confirmation`
- **Description:** Public confirmation receipt for successful order placement.
- **Authorization:** Anonymous

### 7.5 `GET /api/v1/account/orders`
- **Description:** Orders placed by currently authenticated customer.
- **Authorization:** Customer

### 7.6 `GET /api/v1/account/orders/{id}`
- **Description:** Detailed order dossier with fulfillment progress timeline.
- **Authorization:** Customer (Ownership verified)

### 7.7 `POST /api/v1/account/orders/{id}/cancel`
- **Description:** Request order cancellation before fulfillment.
- **Authorization:** Customer (Allowed only if status is 'Placed' or 'Confirmed')
- **Request Body:** `{ "reason": "Accidental duplicate order" }`

---

## 8. Payment Verification & Media Upload Endpoints

### 8.1 `POST /api/v1/payments/upload-receipt`
- **Description:** Upload payment transaction proof screenshot (JPEG, PNG, WebP; max 5MB).
- **Authorization:** Anonymous / Customer
- **Request:** `multipart/form-data` with `file`
- **Response `200 OK`:** `{ "url": "https://storage.maisonvera.com/receipts/proof-8921.jpg" }`

### 8.2 `GET /api/v1/admin/payments`
- **Description:** Payment operations queue for reviewing digital wallet transactions.
- **Authorization:** Required Role: `Admin`, `Super Admin`, `Payment Manager`
- **Query Params:** `status` ("Pending Verification" | "Verified" | "Rejected")

### 8.3 `POST /api/v1/admin/payments/{orderId}/verify`
- **Description:** Approves digital wallet payment proof. Advances order status to `Confirmed`.
- **Authorization:** Required Role: `Admin`, `Super Admin`, `Payment Manager`
- **Response `200 OK`:** Payment verified, notification triggered.

### 8.4 `POST /api/v1/admin/payments/{orderId}/reject`
- **Description:** Rejects fraudulent or mismatched payment receipt.
- **Authorization:** Required Role: `Admin`, `Super Admin`, `Payment Manager`
- **Request Body:** `{ "reason": "Transaction reference not found in merchant statement." }`
- **Response `200 OK`:** Payment rejected, customer notified.

---

## 9. Customer Dossier & Address Book Endpoints

### 9.1 `GET /api/v1/account/overview` & `/profile`
- **Description:** Customer lifetime spending, VIP tier, and profile fields.
- **Authorization:** Customer

### 9.2 `GET /api/v1/account/addresses` & `POST /api/v1/account/addresses`
- **Description:** Manage Nepal multi-tier address entries.
- **Authorization:** Customer

### 9.3 `PUT /api/v1/account/addresses/{id}` & `DELETE /api/v1/account/addresses/{id}`
- **Description:** Edit or remove saved addresses.

---

## 10. Admin Operations, Staff & Audit Endpoints

### 10.1 `GET /api/v1/admin/dashboard/stats`
- **Description:** Executive KPI metrics (Gross Revenue, Active Orders, Low Stock Alerts, Customers).
- **Authorization:** Admin, Super Admin, Order Manager

### 10.2 `PATCH /api/v1/admin/orders/{id}/status`
- **Description:** Advance order fulfillment state machine (`Processing`, `Dispatched`, `Delivered`, `Cancelled`).
- **Authorization:** Admin, Super Admin, Order Manager
- **Request Body:** `{ "status": "Dispatched", "note": "Handed to Kathmandu Valley White-Glove Dispatch" }`

### 10.3 `GET /api/v1/admin/staff` & `POST /api/v1/admin/staff`
- **Description:** Provision new operational staff members with specific RBAC roles.
- **Authorization:** Super Admin

### 10.4 `GET /api/v1/admin/roles` & `PUT /api/v1/admin/roles/{roleId}/permissions`
- **Description:** Manage module permission matrix (View, Create, Edit, Delete).
- **Authorization:** Super Admin

### 10.5 `GET /api/v1/admin/audit-logs`
- **Description:** Filterable, read-only system audit log.
- **Authorization:** Super Admin
- **Query Params:** `module`, `userEmail`, `startDate`, `endDate`, `action`

### 10.6 `GET /api/v1/settings/brand/public` & `PUT /api/v1/admin/settings/brand`
- **Description:** Retrieve public or update administrative brand settings and announcement bar.

### 10.7 `GET /api/v1/settings/payments/public` & `PUT /api/v1/admin/settings/payments`
- **Description:** Retrieve public QR codes or update administrative payment gateway settings.
