# 🚜 Naam Uzhavar Backend API (நாம் உழவர்)

> **Unified RESTful API Backend for the Naam Uzhavar Agricultural Marketplace & EV Logistics Ecosystem**  
> Serving the **Farmer Portal**, **Commercial Buyer Portal**, **EV Logistics Fleet**, and **Centralized Operations Admin Dashboard**.  
> Stack: **Node.js • Express 4.x • MongoDB (Mongoose 8.x) • JWT • bcryptjs • CORS**

---

## 🚀 1. Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (Local instance running at `mongodb://localhost:27017` or a MongoDB Atlas URI — *automatic zero-downtime in-memory fallback engages if MongoDB is offline*)

### Quick Start
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file from template
cp .env.example .env

# 4. Seed initial produce, demo buyer, demo farmer, EV driver, and orders
npm run seed

# 5. Start development server with hot-reload
npm run dev

# 6. Run automated test suite verifying all Farmer APIs & multi-tenant security
npm run test:farmer

# 7. Run full 14-point full-stack integration audit
npm run test:audit
```

The server starts on `http://localhost:5000`.

---

## 🔑 2. Demo Credentials for All 4 Roles

| Module | URL Path | Login Identifier | Password | Persona & Role Details |
| :--- | :--- | :--- | :--- | :--- |
| **Commercial Buyer** | `/role-select?role=buyer` | `demo@naamuzhavar.com` | `demo1234` | **Grand Palace Luxury Dining**, Madurai (Bulk Procurement Manager) |
| **Farmer Portal** | `/farmer-login` | `+91 94432 78190` or `farmer@naamuzhavar.com` | `farmer1234` | **Ramesh Kumar**, Pollachi (Green Valley Natural Farm - 8.5 Acres) |
| **EV Logistics Driver**| `/role-select?role=driver`| `+91 94432 11098` or `DRV-TN-2026-08` | `1234` | **Kumar M.**, Dindigul Central Hub (Tata Ace EV Cargo `TN 57 AB 1234`) |
| **Operations Admin** | `/admin` | `admin@naamuzhavar.com` | `Admin@2026` | **Central Operations Control Center**, Chennai Dispatch Directorate |

---

## ⚙️ 3. Environment Variables (`.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port on which the Express server listens |
| `MONGO_URI` | `mongodb://localhost:27017/naam-uzhavar` | Connection string for MongoDB database |
| `JWT_SECRET` | `naam_uzhavar_secret_jwt_key_2026` | Secret key used to sign and verify JWT authentication tokens |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |

---

## 📡 4. REST API Endpoints Specification

### Public Endpoints
| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check to verify server uptime | ❌ No |
| `POST` | `/api/auth/register` | Register a new commercial buyer account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate commercial buyer and receive JWT | ❌ No |
| `POST` | `/api/auth/farmer/register` | Register a new agricultural farmer account | ❌ No |
| `POST` | `/api/auth/farmer/login` | Log in as farmer with phone/email and password | ❌ No |
| `POST` | `/api/driver/auth/login` | Log in as EV logistics driver with PIN / phone | ❌ No |
| `POST` | `/api/admin/auth/login` | Log in as system administrator | ❌ No |
| `GET` | `/api/crops` | Public fresh harvest catalog (`?search=&category=&grade=&hub=`) | ❌ No |

### Commercial Buyer Protected Routes (`Authorization: Bearer <buyer_token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Retrieve current buyer session profile |
| `POST` | `/api/orders` | Place a direct order (server calculates total & assigns EV driver) |
| `GET` | `/api/orders` | Get all orders belonging to authenticated buyer |
| `GET` | `/api/orders/:id` | Get single order details with live tracking milestones |
| `POST` | `/api/orders/:orderId/pay` | Settle pending invoice via simulated payment gateway |
| `PATCH` | `/api/orders/:id/status` | Advances delivery status to next stage |
| `GET` | `/api/invoices` | Retrieve commercial GST tax invoices for delivered orders |
| `GET` | `/api/messages` | Read dispatch communication thread |
| `POST` | `/api/messages` | Send a new message to hub dispatcher or driver |
| `GET` | `/api/profile` | Get current buyer business profile (no password) |
| `PUT` | `/api/profile` | Update buyer business details, GSTIN, and avatar |

### Agricultural Farmer Protected Routes (`Authorization: Bearer <farmer_token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/farmer/me` | Retrieve current farmer authenticated session |
| `GET` | `/api/farmer/profile` | Get authenticated farmer's profile, land details, and masked bank info |
| `PUT` | `/api/farmer/profile` | Update farmer land details, residential address, and bank accounts |
| `GET` | `/api/farmer/dashboard` | Computed telemetry metrics (active yield, orders, enquiries) & activity stream |
| `GET` | `/api/farmer/crops` | List farmer's active produce inventory (`?category=&status=&search=&sortBy=`) |
| `POST` | `/api/farmer/crops` | List a new crop harvest lot in the buyer marketplace |
| `PUT` | `/api/farmer/crops/:id` | Update produce pricing, variety, or details (strict ownership check) |
| `PATCH` | `/api/farmer/crops/:id/status` | Pause / resume produce listing status (`active`, `paused`, `sold_out`) |
| `POST` | `/api/farmer/crops/:id/remove` | Soft-remove produce listing (blocks if active order is in progress) |
| `DELETE` | `/api/farmer/crops/:id` | Returns `405 Method Not Allowed` to enforce audit integrity |
| `GET` | `/api/farmer/requests` | List incoming buyer purchase requests & commercial enquiries |
| `POST` | `/api/farmer/requests/:id/accept` | Accept buyer request, converts to confirmed commercial order, updates stock |
| `POST` | `/api/farmer/requests/:id/reject` | Reject buyer request with reason note |
| `GET` | `/api/farmer/orders` | Retrieve farmer's order history ledger with pagination & status filters |
| `GET` | `/api/farmer/orders/:id` | View single order details with EV driver telemetry and buyer details |
| `PATCH` | `/api/farmer/orders/:id/status` | Update consignment milestone (`READY_FOR_PICKUP`, `PICKED_UP`, etc.) |
| `POST` | `/api/farmer/orders/:id/claim-payout` | Settle completed order via simulated bank/UPI escrow payout |

### EV Logistics Driver Protected Routes (`Authorization: Bearer <driver_token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/driver/profile` | Retrieve driver telemetry, EV battery specs, and license details |
| `PUT` | `/api/driver/profile` | Update driver profile, phone number, and emergency contacts |
| `PATCH` | `/api/driver/duty` | Toggle duty status (`ON_DUTY` / `OFF_DUTY`) |
| `GET` | `/api/driver/trips` | Retrieve assigned haulage dispatches and waypoint milestones |
| `GET` | `/api/driver/trips/:tripId` | Get individual trip cargo breakdown and crate count |
| `PATCH` | `/api/driver/trips/:tripId/advance` | Advance waypoint status (`PICKED_UP`, `IN_TRANSIT`) |
| `POST` | `/api/driver/trips/:tripId/verify-pin` | Verify buyer 4-digit PIN, mark delivered, credit driver wallet |
| `GET` | `/api/driver/wallet` | Check wallet balance, today's haulage earnings, and payout history |
| `POST` | `/api/driver/wallet/withdraw` | Request instant simulated UPI transfer to driver's bank account |

### Centralized Admin Operations Protected Routes (`Authorization: Bearer <admin_token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/auth/me` | Retrieve current administrator session |
| `PUT` | `/api/admin/profile` | Update administrator account credentials |
| `GET` | `/api/admin/overview` | Platform-wide KPI telemetry (GMV, active transit, registered users) |
| `GET` | `/api/admin/farmers` | List and search all registered agricultural producers |
| `GET` | `/api/admin/farmers/:id` | Detailed farmer profile, land audit, and crop listings |
| `PATCH` | `/api/admin/farmers/:id/status` | Moderate producer status (`active` / `suspended` / verified) |
| `GET` | `/api/admin/buyers` | List and search all commercial bulk procurement accounts |
| `GET` | `/api/admin/buyers/:id` | Detailed buyer profile, GSTIN records, and linked orders |
| `PATCH` | `/api/admin/buyers/:id/status` | Moderate buyer status (`active` / `suspended`) |
| `GET` | `/api/admin/deliveries` | Real-time delivery fleet monitoring and milestone statuses |
| `GET` | `/api/admin/deliveries/:id` | Single delivery order telemetry with driver battery levels |
| `PATCH` | `/api/admin/deliveries/:id/status` | Administrative milestone override |
| `GET` | `/api/admin/drivers` | Manage EV logistics fleet drivers, vehicles, and status |
| `GET` | `/api/admin/drivers/:id` | View driver vehicle telemetry, battery health, and trips |
| `PATCH` | `/api/admin/drivers/:id/status` | Toggle driver duty and verification status |
| `GET` | `/api/admin/reports` | Comprehensive multi-module analytics and financial ledger |
| `GET` | `/api/admin/reports/export` | Stream automated CSV export of operational data |

---

## 🔒 5. Key Architecture & Security Safeguards

1. **Strict Multi-Tenant Role Isolation:**
   Role-specific middleware (`farmerAuthMiddleware`, `driverAuthMiddleware`, `adminAuthMiddleware`) ensures users cannot execute actions outside their authorized role boundary.
2. **Password Encryption via BcryptJS:**
   All passwords are encrypted with bcrypt (10 rounds) before being saved. Plaintext credentials are never stored or leaked.
3. **Sensitive Financial Masking:**
   Farmer bank account details are masked (e.g., `••••••••1034`) when transmitting profile data to prevent data leakage.
4. **Resilient Hybrid Persistence Layer:**
   When connected to MongoDB, all operations use Mongoose schemas with atomic updates. If MongoDB is offline, controllers automatically fall back to complete in-memory synthetic state structures, preventing process crashes during presentations and testing.
5. **Immutable Historical Snapshots:**
   Orders capture an immutable snapshot of crop pricing, name, and quality grade at checkout time, preventing retroactive alterations by sellers.
