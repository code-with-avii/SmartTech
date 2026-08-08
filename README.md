# SmartTech Premium E-Commerce Platform

A secure, production-grade e-commerce application built with React, Redux Toolkit, Node.js, Express, MongoDB, and integrated with Razorpay payments. The application utilizes a highly secure architecture featuring server-side price validation, correct stock deduction matching, strict route-specific rate limiting, and HttpOnly cookie-based authorization.

---

## 🔒 Security & Architecture Upgrades

### 1. Secure Server-Side Price & Tax Calculation
To prevent client-side manipulation of order totals, all pricing calculations are executed exclusively on the backend:
- The backend retrieves the authoritative prices for each product directly from MongoDB based on product IDs and quantities.
- Applies active discount percentages dynamically.
- Enforces an 18% GST tax rate.
- Uses the calculated secure sum to generate the Razorpay payment order.

### 2. Precise Variant & Stock Management
- **Variant Matching**: Fixed variant-matching logic to compare variant sizes/storages accurately (mapping frontend properties like `storage` or `size` to backend `size`/`storage`).
- **Safe Stock Deduction**: Decrements stock during order verification only for the matching variant inside the product's variants array (instead of defaulting to index `0`).

### 3. Secure Session Authentication Flow
We migrated from vulnerable client-side storage of JWT tokens in `localStorage` to a robust, cookie-centric auth model:
- **HttpOnly Cookies**: Access tokens and Refresh tokens are stored in secure, `httpOnly: true` cookies. This mitigates Cross-Site Scripting (XSS) risks by completely hiding tokens from frontend JavaScript.
- **Verification Flow**: 
  1. Signup registers a new user but issues no session/tokens.
  2. A verification email containing a secure token is dispatched.
  3. The user verifies their email via a validation link, which flags their account as verified and generates the initial session cookies.
  4. Subsequent authentication relies on automated refresh loops via the `/api/auth/refresh` endpoint and credentials-configured Axios requests.

### 4. Granular Route Rate Limiting
Replaced vulnerable global rate limiting with granular, route-specific limiters using `express-rate-limit` to guard resources:
- **Password Reset**: Extremely strict limits to prevent enumeration attacks.
- **Authentication**: Strict limits on login/signup endpoints.
- **Payments**: Controlled limits to secure payment processing.
- **Products**: Higher limits to ensure pages load quickly.
- **General API**: Moderate limits for standard actions.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for lightning-fast HMR.
- **Redux Toolkit** for centralized, predictable state management.
- **Tailwind CSS** & Font Awesome for layout styling and iconography.
- **Axios** (configured with `withCredentials: true` to handle secure cookies).

### Backend
- **Node.js** & **Express** server framework.
- **MongoDB** with **Mongoose** schemas for database persistence.
- **JSON Web Tokens (JWT)** for secure, stateless session tracking.
- **Nodemailer** for automated account verification and reset mail delivery.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB Database (Local or MongoDB Atlas)

### 2. Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
CLIENT_URL=http://localhost:5173
```

### 3. Installation & Run

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client/app
npm install
npm run dev
```