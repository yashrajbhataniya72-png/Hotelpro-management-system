# 🏨 HotelPro - Full-Stack Hotel Management Solution

**HotelPro** is a comprehensive, production-ready MERN (MongoDB, Express.js, React.js, Node.js) Hotel Management Platform built with role-based access control (RBAC), real-time reservation conflict prevention, dynamic room inventory, and operational analytics.

---

## 🌟 Key Features Across the 6 Epics

1. **Epic 1: Infrastructure & Core Engine**
   - Express REST API with centralized error handling & MongoDB connectivity via Mongoose.
   - Vite + React + Bootstrap 5 responsive architecture.
2. **Epic 2: Authentication & RBAC Security**
   - JWT 256-bit signed token authorization with `bcryptjs` password hashing.
   - Role-Based Access Control (`guest`, `staff`, `admin`) protecting APIs and frontend routes.
3. **Epic 3: Room Catalog & Dynamic Inventory**
   - Filter rooms by category (`Single`, `Double`, `Deluxe`, `Suite`), price range slider, and occupancy capacity.
   - Live room statuses (`available`, `occupied`, `maintenance`).
4. **Epic 4: Conflict-Free Booking Engine**
   - Double-booking prevention algorithm inspecting overlapping date ranges.
   - Automatic stay duration & pricing calculation.
5. **Epic 5: Payments & Check-in / Check-out Operations**
   - Booking transaction logging & checkout receipt views.
   - Front-desk workflows: Check-in guests (marks room occupied) and Check-out guests (frees room to available).
6. **Epic 6: Executive Operations Dashboard**
   - Live occupancy rates (`%`), total revenue calculations, active bookings counter, and user directory management.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16.0 or higher)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### Step 1: Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Seed database with initial rooms, admin, staff & guest accounts
npm run seed

# 3. Start development API server (runs on http://localhost:5000)
npm run dev
```

---

### Step 2: Frontend Setup

Open a second terminal window:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Launch Vite dev server (runs on http://localhost:3000)
npm run dev
```

Visit **`http://localhost:3000`** in your browser!

---

## 🔑 Pre-Configured Demo Credentials

The login screen features one-click demo login buttons:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@hotelpro.com` | `password123` | Full access: metrics, manage users, add/edit rooms, update bookings |
| **Staff** | `staff@hotelpro.com` | `password123` | Front-desk operations: check-in/out, room statuses, booking overview |
| **Guest** | `guest@hotelpro.com` | `password123` | Browse rooms, book stays, cancel bookings, view receipts |

---

## 📂 Project Architecture

```text
hotelpro/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── roomController.js      # Room catalog CRUD & filters
│   │   ├── bookingController.js   # Reservation lifecycle & overlap check
│   │   └── adminController.js     # Analytics KPI, operations & RBAC
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & role authorization
│   │   └── errorMiddleware.js     # 404 & Centralized error handler
│   ├── models/
│   │   ├── User.js                # Guest, Staff, Admin schema
│   │   ├── Room.js                # Room number, type, price, amenities
│   │   ├── Booking.js             # Stays, dates, status, payment
│   │   └── Payment.js             # Financial transaction records
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── seeder.js                  # Auto-population script
│   ├── server.js                  # Express application entrypoint
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Pre-configured client with JWT interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx         # Responsive navigation & role indicators
    │   │   ├── Footer.jsx         # Site footer
    │   │   ├── RoomCard.jsx       # Reusable room display card
    │   │   └── ProtectedRoute.jsx # Client-side route guards
    │   ├── context/
    │   │   └── AuthContext.jsx    # React Authentication state provider
    │   ├── pages/
    │   │   ├── HomePage.jsx       # Hero, feature highlights, quick search
    │   │   ├── RoomsPage.jsx      # Filterable room catalog
    │   │   ├── RoomDetailsPage.jsx# Room booking widget & date math
    │   │   ├── LoginPage.jsx      # Authentication with demo quick-fills
    │   │   ├── RegisterPage.jsx   # Guest registration
    │   │   ├── MyBookingsPage.jsx # Guest reservation tracking & payments
    │   │   └── AdminDashboardPage.jsx # Analytics & front-desk operations
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```
