# 🚜 Naam Uzhavar Backend API (நாம் உழவர்)

> **RESTful API Backend for the Naam Uzhavar Direct Agricultural Marketplace**  
> Stack: **Node.js + Express + MongoDB (Mongoose) + JWT + bcryptjs + CORS**

---

## 🚀 1. Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (Local instance running at `mongodb://localhost:27017` or a MongoDB Atlas URI)

### Quick Start
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file from template
cp .env.example .env

# 4. Seed initial produce, demo buyer, and EV delivery orders
npm run seed

# 5. Start development server with hot-reload
npm run dev
```

The server starts on `http://localhost:5000`.

---

## 🔑 2. Demo Credentials

Use these credentials to test authentication or sign in from the React frontend:
* **Email:** `demo@naamuzhavar.com`
* **Password:** `demo1234`
* **Role:** Commercial Buyer (Grand Palace Luxury Dining, Madurai)

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

### Public Routes
| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check to verify server status | ❌ No |
| `POST` | `/api/auth/register` | Register a new commercial buyer account | ❌ No |
| `POST` | `/api/auth/login` | Log in and receive a 7-day JWT token | ❌ No |
| `GET` | `/api/crops` | List fresh harvest listings (`?search=&category=&grade=`) | ❌ No |

### Protected Routes (Requires Header: `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Place a direct order (server calculates total & assigns EV driver) |
| `GET` | `/api/orders` | Get all orders belonging to authenticated buyer |
| `GET` | `/api/orders/:id` | Get single order details by `orderId` or `_id` |
| `PATCH` | `/api/orders/:id/status` | Demo route: advances delivery status to next stage |
| `GET` | `/api/invoices` | Retrieve commercial accounting invoices for delivered orders |
| `GET` | `/api/messages` | Read dispatch communication thread |
| `POST` | `/api/messages` | Send a new message to hub dispatcher or driver |
| `GET` | `/api/profile` | Get current buyer business profile (no password) |
| `PUT` | `/api/profile` | Update buyer business details, GSTIN, and avatar |

---

## 🎓 5. Key Architecture Points (For Viva)

1. **Password Hashing (bcryptjs):** Passwords are never saved in plain text. A salt is added and hashed with 10 rounds of bcrypt before being stored in MongoDB.
2. **Stateless Authentication (JWT):** The server issues a signed JSON Web Token upon login. The frontend passes this token in the `Authorization: Bearer <token>` header for protected endpoints.
3. **Server-Side Price Calculation:** The frontend sends `cropId` and `quantityKg`. The server looks up the official wholesale price in the database and calculates `totalPrice`, preventing client-side price tampering.
4. **Order ID & EV Driver Assignment:** Unique order IDs (`NU-YYYY-XXXXX`) and EV vehicle dispatches are generated and assigned exclusively by the server.
