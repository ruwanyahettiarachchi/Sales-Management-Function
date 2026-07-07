# Sales Management Function

A full-stack **MERN** application for managing product inventory, sales, and promotional discounts, with user authentication (including Google Sign-In via Firebase) and a manager-facing dashboard.

## ✨ Features

- **User authentication** — sign up, sign in, sign out, plus Google Sign-In via Firebase OAuth
- **JWT-based sessions** — auth token stored in an HTTP-only cookie
- **Item management** — add, update, view, and delete inventory items (product name, category, unit price, quantity, images)
- **Discount management** — add, update, view, and delete promotional discounts (linked to items, with promo codes)
- **Manager dashboard views** — "All Details" and "All Discounts" views for browsing everything at a glance
- **Private routes** on the frontend — item/discount management and profile pages are only accessible to signed-in users
- **Redux** for client-side auth state, with `redux-persist` for persistence across reloads

## 🛠 Tech Stack

**Backend (`api`)**
- Node.js + Express (ESM modules)
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- bcryptjs for password hashing
- cookie-parser

**Frontend (`client`)**
- React 18 + Vite
- React Router DOM
- Redux Toolkit + Redux Persist
- Firebase (Google OAuth sign-in)
- Tailwind CSS, Flowbite / Flowbite React (UI components)
- Axios

## 📂 Project Structure

```
Sales Management/
├── api/
│   ├── index.js                      # Express app entry point, MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js        # signup, signin, Google auth, item/discount add & list
│   │   └── user.controller.js        # user update/delete, item/discount update/delete/get
│   ├── models/
│   │   ├── user.model.js             # User schema
│   │   ├── item.model.js             # Item schema (product details, images)
│   │   └── discount.model.js         # Discount schema (linked to item, promo code)
│   ├── routes/
│   │   ├── auth.routes.js            # /api/auth/* routes
│   │   └── user.routes.js            # /api/user/* routes
│   └── utils/
│       ├── error.js                  # Centralized error helper
│       └── verifyUser.js             # JWT verification middleware
└── client/
    └── src/
        ├── Pages/
        │   ├── Signin.jsx / SignUp.jsx
        │   ├── Profile.jsx
        │   ├── AddItem.jsx / UpdateItem.jsx / ItemProfile.jsx / SingleItemView.jsx
        │   ├── AllDetails.jsx            # Manager dashboard — all items
        │   └── About.jsx
        ├── discount Component/
        │   ├── AddDiscount.jsx
        │   ├── AllDiscounts.jsx          # Manager dashboard — all discounts
        │   └── UpdateDiscount.jsx
        ├── components/
        │   ├── header.jsx
        │   ├── OAuth.jsx                 # Google sign-in button
        │   └── PrivateRoutes.jsx         # Route guard for authenticated pages
        ├── redux/
        │   ├── store.js
        │   └── User/userSlice.js         # Auth state slice
        └── firebase.js                   # Firebase app initialization
```

## 🗄 Data Model

**User**

| Field | Type | Notes |
|---|---|---|
| `username` | `String` | Unique |
| `email` | `String` | Unique |
| `password` | `String` | Hashed with bcrypt |
| `profilePicture` | `String` | Defaults to a placeholder avatar |

**Item**

| Field | Type | Notes |
|---|---|---|
| `petId` | `String` | Unique item identifier |
| `userId` | `String` | Owning manager |
| `productName`, `category`, `unitPrice`, `quantity` | `String` | Item details |
| `itemPicture`, `alternateItemPicture` | `String` | Image URLs |

**Discount**

| Field | Type | Notes |
|---|---|---|
| `petId` | `String` | Linked item identifier |
| `userId` | `String` | Owning manager |
| `discountId` | `String` | Unique discount identifier |
| `itemCategory`, `discount`, `promoCode` | `String` | Discount details |

## 🔌 API Overview

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/signup`, `POST /api/auth/signin`, `POST /api/auth/google`, `GET /api/auth/signout` |
| Items | `POST /api/auth/itemadd`, `GET /api/auth/allitems`, `GET /api/user/getitem/:id`, `PUT /api/user/updateitem`, `DELETE /api/user/deleteitem/:id` |
| Discounts | `POST /api/auth/discountadd`, `GET /api/auth/discounts`, `GET /api/user/getdiscount/:id`, `PUT /api/user/updatediscount`, `DELETE /api/user/deletediscount/:id` |
| Users | `POST /api/user/update/:id`, `DELETE /api/user/delete/:id` |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A MongoDB database (local or Atlas)
- A Firebase project (for Google Sign-In)

### 1. Backend

```bash
cd "Sales Management"
npm install
```

Create a `.env` file in the `Sales Management` root with:
```
MONGO=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

Run the API:
```bash
npm run dev
```

### 2. Frontend

```bash
cd "Sales Management/client"
npm install
```

Create your own `client/.env` with your Firebase web config, e.g.:
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
```

Run the dev server:
```bash
npm run dev
```

## 🔒 Security Notes — Please Read Before Sharing This Repo Publicly

A couple of things in this repository should be cleaned up before making it public or sharing it further:

1. **A plaintext credentials file** (`password for sales manager login.txt`) is committed at the repo root and contains a real login email and password. This should be **deleted from the repository and from git history**, and that account's password should be **changed**, since anyone with the repo can currently read it.
2. **`client/.env` is committed** with a live Firebase Web API key. Firebase web API keys aren't secret in the same way a server secret is (they're safe to expose in a shipped web app, and access is meant to be controlled by Firebase Security Rules), but as a matter of good hygiene, `.env` files generally shouldn't be committed — add `client/.env` to `.gitignore` and instead provide a `.env.example` with placeholder values. Also double check your Firebase Security Rules restrict access appropriately.
3. The backend also expects a `MONGO` connection string and `JWT_SECRET` via environment variables — make sure these are never hard-coded or committed either.

## 🧠 Key Concepts to Learn From This Project

- Implementing **JWT authentication with HTTP-only cookies** in an Express + React app
- Adding **Google OAuth login** via Firebase alongside traditional email/password auth
- Protecting frontend routes with a **PrivateRoutes** wrapper component
- Managing global auth state with **Redux Toolkit** and persisting it across reloads with **redux-persist**
- Structuring a MERN app's backend into **models / controllers / routes / utils**
- Working with **linked collections** in MongoDB (discounts referencing items via an identifier field)
- Practicing environment-based configuration and identifying **secrets that shouldn't be committed to source control**

## 📄 License

This project is available for personal and educational use. Feel free to fork and adapt it for your own learning purposes.
