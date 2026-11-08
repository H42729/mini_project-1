# Centralized Admin Dashboard Specification (Naam Uzhavar)
**Version:** 1.0.0  
**Target Route:** `/admin`  
**Author:** Elephant Architect (EGM Phase 1)  
**Date:** 2026-11-07  

---

## 1. System Overview & Core Objectives

The **Naam Uzhavar** agricultural marketplace currently has three distinct user modules:
1. **Farmer Module** (`/farmer-dashboard`): Land verification, harvest cataloging, order fulfillment, payout claims.
2. **Buyer Module** (`/buyer-dashboard`): Wholesale produce procurement, order placement, tracking, escrow payments.
3. **Delivery Logistics Module** (`/driver-dashboard`): EV cargo dispatches, crate verification, turn-by-turn tracking, delivery PIN confirmation.

The **Centralized Admin Dashboard** provides a single, unified operations control center at `/admin` to monitor, manage, and analyze all three modules without modifying their operational business logic or duplicating database schemas.

---

## 2. Architecture & Design Decisions

### 2.1 Backend Architecture
- **Route Namespace**: `/api/admin/*`
- **Controller/Router File**: `backend/routes/admin.js` registered in `backend/server.js`.
- **Authentication & Authorization**:
  - Dedicated Admin model or credentials: `backend/models/Admin.js` storing salted bcrypt hashes.
  - Pre-seeded default admin: `admin@naamuzhavar.com` / `Admin@2026` with automatic seed check.
  - JWT generation with `{ id, role: 'admin', email, name }` and 7-day expiration.
  - Security middleware: `adminAuthMiddleware` in `backend/middleware/auth.js` ensuring `req.user && req.user.role === 'admin'`.
- **Hybrid Storage Resilience**:
  - Full MongoDB aggregation pipelines when connected (`isDbConnected() === true`).
  - Strict fallback to in-memory datasets (`IN_MEMORY_ORDERS`, `IN_MEMORY_CROPS`, `inMemoryFarmers`, `inMemoryBuyers`, `DEFAULT_DRIVER`, etc.) when offline or in test mode, guaranteeing zero downtime.
- **Non-Destructive Operations**:
  - No database schemas rewritten or hard deleted.
  - Account status toggle changes `isVerified` / `status: 'active' | 'suspended'`.

### 2.2 Frontend Architecture
- **Route Hierarchy**:
  - `/admin`: Root entry point. If unauthenticated -> renders `<AdminLogin />`. If authenticated -> renders `<AdminDashboardLayout />` with default child `<AdminOverview />`.
  - `/admin/farmers`: Farmer Management with search, filter, detail drawer/modal, status toggle.
  - `/admin/buyers`: Buyer Management with search, buyer type filters, requests overview, linked orders.
  - `/admin/deliveries`: Delivery Management with live delivery status breakdown, driver telemetry, EV metrics.
  - `/admin/reports`: Comprehensive Analytics & Reporting engine with date filter, module tabs, printable view, and client/server CSV export.
  - `/admin/profile`: Admin account details, security settings, and session details.
- **Context & State Management**:
  - `src/context/AdminContext.jsx` coordinating authentication state, global statistics, active filters, loading states, and error handling.
- **Visual Design System**:
  - Reuses project design tokens from `src/styles/global.css`.
  - Primary accent: Deep Agricultural Green (`#1e4a29` / `#2f6b3a`).
  - Clean SaaS dashboard cards, SVG-based responsive metric charts (trend lines, distribution bars, donut rings) with zero heavy external dependencies.
  - Full mobile responsiveness, collapsible sidebar, table pagination, and accessible confirmation dialogs.

---

## 3. Database Models & Aggregation Mapping

The Admin Dashboard queries the exact existing schemas:

| Entity | Model | Source Fields Used by Admin |
| :--- | :--- | :--- |
| **Farmer** | `backend/models/Farmer.js` | `farmerId`, `name`, `email`, `phone`, `avatar`, `farmDetails` (district, taluk, village, landArea), `bankDetails`, `isVerified`, `rating`, `totalHarvests`, `createdAt` |
| **Buyer** | `backend/models/Buyer.js` | `businessName`, `contactPerson`, `buyerType`, `email`, `phone`, `gstin`, `address`, `avatar`, `createdAt` |
| **Crop** | `backend/models/Crop.js` | `name`, `nameTa`, `category`, `grade`, `variety`, `pricePerKg`, `quantityKg`, `farmerId`, `farmerName`, `hub`, `status`, `createdAt` |
| **Order** | `backend/models/Order.js` | `orderId`, `buyer`, `cropDetails`, `quantityKg`, `totalPrice`, `orderStatus` (`PENDING_FARMER_APPROVAL`, `CONFIRMED`, `REJECTED`, `CANCELLED`), `deliveryStatus` (`NOT_ASSIGNED`, `READY_FOR_PICKUP`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`), `driver`, `farmerId`, `paymentStatus`, `createdAt` |
| **Buyer Request** | `backend/models/BuyerRequest.js` | `requestId`, `cropDetails`, `buyerDetails`, `farmerId`, `farmerName`, `quantity`, `offeredPrice`, `totalEstimatedValue`, `status`, `orderId`, `createdAt` |
| **Driver** | `backend/models/Driver.js` | `driverId`, `name`, `phone`, `dutyStatus`, `vehicle` (model, vehicleNumber, batteryPct, rangeKm), `metrics` |
| **Trip** | `backend/models/Trip.js` | `tripId`, `orderId`, `driverId`, `status`, `cropName`, `quantityKg`, `pickup`, `dropoff`, `telemetry` (distanceKm, co2SavedKg) |

### Real Data Calculation vs No Invention Rule
- All overview cards calculate strict counts:
  - `totalFarmers`: `await Farmer.countDocuments()` (or in-memory length).
  - `totalBuyers`: `await Buyer.countDocuments()`.
  - `totalCrops`: `await Crop.countDocuments({ status: { $ne: 'removed' } })`.
  - `totalOrders`: `await Order.countDocuments()`.
  - `pendingOrders`: `await Order.countDocuments({ orderStatus: { $in: ['PENDING_FARMER_APPROVAL', 'PENDING'] } })`.
  - `activeDeliveries`: `await Order.countDocuments({ deliveryStatus: { $in: ['READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT'] } })`.
  - `completedDeliveries`: `await Order.countDocuments({ deliveryStatus: 'DELIVERED' })`.
  - `cancelledOrders`: `await Order.countDocuments({ orderStatus: { $in: ['CANCELLED', 'REJECTED'] } })`.
- Financial metrics: Displays produce gross settlement volume only if order values exist (`totalPrice`), labeled strictly as **Total Produce Value Managed**, never fictitious platform revenue or invented profits.

---

## 4. API Endpoints Specification (`backend/routes/admin.js`)

All endpoints except `POST /auth/login` require `Authorization: Bearer <token>` and `adminAuthMiddleware`.

### 4.1 Authentication
- `POST /api/admin/auth/login`
  - Input: `{ email, password }`
  - Output: `{ success: true, token, admin: { id, email, name, role: 'admin' } }`
- `GET /api/admin/auth/me`
  - Output: `{ success: true, admin: { id, email, name, role: 'admin' } }`
- `PUT /api/admin/profile`
  - Input: `{ name, phone, currentPassword, newPassword }`
  - Output: `{ success: true, message: 'Profile updated successfully', admin }`

### 4.2 Overview & Analytics
- `GET /api/admin/overview`
  - Output:
    ```json
    {
      "success": true,
      "metrics": {
        "totalFarmers": 12,
        "totalBuyers": 8,
        "totalCrops": 34,
        "totalOrders": 26,
        "pendingOrders": 5,
        "activeDeliveries": 4,
        "completedDeliveries": 15,
        "cancelledOrders": 2,
        "totalProduceKg": 12500,
        "totalProduceValue": 412000
      },
      "charts": {
        "farmerRegistrationTrends": [{ "month": "Jun", "count": 2 }, ...],
        "buyerActivity": [{ "buyerType": "Hotel", "ordersCount": 14 }, ...],
        "cropDistribution": [{ "category": "vegetables", "count": 18 }, ...],
        "orderStatusDistribution": [{ "status": "CONFIRMED", "count": 19 }, ...],
        "deliveryStatusDistribution": [{ "status": "DELIVERED", "count": 15 }, ...]
      }
    }
    ```

### 4.3 Farmer Management
- `GET /api/admin/farmers?search=&status=&district=&page=1&limit=10`
  - Returns paginated farmer records with attached crop listing counts and active order counts.
- `GET /api/admin/farmers/:id`
  - Returns complete farmer profile, verified land records, bank details, and all linked crop listings.
- `PATCH /api/admin/farmers/:id/status`
  - Input: `{ isVerified: Boolean, status: 'active' | 'suspended' }`
  - Toggles verification / account active status safely.

### 4.4 Buyer Management
- `GET /api/admin/buyers?search=&buyerType=&page=1&limit=10`
  - Returns paginated buyer business profiles, contact persons, order counts, and request statistics.
- `GET /api/admin/buyers/:id`
  - Returns complete buyer details, historical order history, active purchase enquiries, and linked farmer relationships.

### 4.5 Delivery Logistics Management
- `GET /api/admin/deliveries?status=&driverId=&page=1&limit=10`
  - Returns all orders with delivery telemetry, EV driver assignment, farmer pickup gate, buyer receiving bay, and trip status.
- `GET /api/admin/deliveries/:id`
  - Detailed consignment timeline, EV battery charge, route distance, and delivery PIN verification logs.

### 4.6 Reports & Export
- `GET /api/admin/reports?type=all|farmer|buyer|delivery&startDate=&endDate=`
  - Returns grouped aggregations, top requested crops, supply vs demand ratios, and weekly performance tables.
- `GET /api/admin/reports/export?type=...`
  - Generates RFC 4180 compliant CSV stream with sanitized headers.

---

## 5. Security & Isolation Guarantee

1. **Role Boundary Enforcement**:
   - `adminAuthMiddleware` rejects any non-admin token with `403 Forbidden` (`message: 'Access denied. Administrator privileges required.'`).
   - Normal farmer JWT tokens (`role: 'farmer'`) and buyer tokens (`role: 'buyer'`) cannot access any `/api/admin/*` endpoint.
2. **Frontend Route Protection**:
   - `ProtectedRoute role="admin"` checks `admin_current_profile` and `admin_token`.
   - If user visits `/admin` or sub-routes without an active admin session, the browser automatically displays the sleek Admin Login view without leaking dashboard metrics or layouts.
   - Ordinary farmers or buyers visiting `/admin` will see the Admin Login page, preventing unauthorized UI access.
3. **Password Security**:
   - Passwords salted with bcrypt (10 rounds).
   - Passwords never returned in GET responses.
4. **No Cross-Role Contamination**:
   - Admin token stored under dedicated key `naam_uzhavar_admin_token` and `admin_current_profile`.
   - Logging in as Admin does not overwrite Farmer or Buyer session storage keys.

---

## 6. Pre-Implementation Review Checklist for Goldfish
- Check for potential SQL/NoSQL injection in search queries.
- Check pagination edge cases (page < 1, skip beyond total).
- Validate that all chart components render natively without npm package conflicts (React 19 compatibility).
- Ensure CSV export handles special characters (commas, newlines, UTF-8 for Tamil names).
- Ensure direct deep-linking to `/admin/farmers` when logged out redirects to `/admin` login and redirects back upon successful auth.

