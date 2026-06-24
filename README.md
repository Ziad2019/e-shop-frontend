# E-Shop

A modern, full-featured e-commerce storefront built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. Fully bilingual (Arabic/English) with native RTL support, dark mode, and a complete admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=reactquery&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Internationalization](#internationalization)
- [State Management](#state-management)
- [Admin Dashboard](#admin-dashboard)
- [Scripts](#scripts)

---

## Features

- 🌍 **Bilingual (AR/EN)** — full RTL/LTR support via `next-intl`, cookie-based locale switching with no URL prefixes
- 🌗 **Dark Mode** — system-aware theme toggle via `next-themes`, fully integrated into the design system
- 🔐 **Authentication** — email/password login & signup, Google OAuth, persisted session via Zustand
- 🛍️ **Product Catalog** — filterable/sortable product grid, price range, category filters, search, pagination
- 🛒 **Shopping Cart** — slide-out cart drawer with optimistic updates, quantity controls, coupon support
- ❤️ **Wishlist** — add/remove favorites synced with the backend
- 👤 **User Profile** — editable profile, avatar upload, password change, account deactivation
- 🧾 **Checkout & Orders** — order placement and order history
- 🛠️ **Admin Dashboard** — sales analytics (charts), products/orders/users/categories management with full CRUD, image upload, and confirmation dialogs
- 🎨 **Design System** — shadcn/ui (Radix primitives) themed with custom Tailwind tokens, consistent light/dark color scales
- ⚡ **Optimistic UI & Caching** — React Query for all server state with smart invalidation
- 📱 **Fully Responsive** — dedicated mobile navigation, drawers, and adaptive layouts throughout

---

## Tech Stack

| Layer                 | Technology                                          |
| ----------------------- | ----------------------------------------------------- |
| Framework                 | [Next.js 15](https://nextjs.org/) (App Router)         |
| Language                   | TypeScript                                              |
| Styling                      | Tailwind CSS v4 + shadcn/ui                              |
| Server State                  | [TanStack Query](https://tanstack.com/query)              |
| Client State                    | Zustand (persisted)                                          |
| Forms & Validation                 | React Hook Form + Zod                                          |
| Internationalization                 | next-intl                                                        |
| Theming                                | next-themes                                                        |
| Animations                                | Framer Motion                                                        |
| Charts                                      | Recharts                                                                |
| HTTP Client                                   | Axios                                                                     |
| Icons                                            | Lucide React                                                                |

---

## Project Structure

```
src/
├── app/
│   ├── (store)/              # Public storefront routes
│   │   ├── products/           # Product listing & detail pages
│   │   ├── cart/                 # Full cart page
│   │   ├── checkout/               # Checkout flow
│   │   ├── wishlist/                 # Wishlist page
│   │   ├── profile/                    # User account
│   │   ├── login/ register/              # Auth pages
│   │   └── layout.tsx                      # Storefront layout (Header/Footer)
│   ├── admin/                                # Admin dashboard (guarded)
│   │   ├── products/ orders/ users/ categories/
│   │   └── layout.tsx                          # Admin sidebar + topbar layout
│   └── layout.tsx                                 # Root layout (providers, fonts, locale)
├── components/
│   ├── layout/                  # Header, Footer
│   ├── products/                  # ProductCard, filters, grid
│   ├── cart/                        # Cart drawer + context
│   ├── admin/                         # Dashboard widgets, tables, forms
│   ├── auth/                            # Login/Register forms
│   ├── profile/                           # Profile forms
│   └── ui/                                  # shadcn/ui primitives
├── hooks/                                       # React Query hooks per domain
├── lib/
│   ├── api/                                       # Axios API functions
│   ├── validations/                                 # Zod schemas
│   └── axios.ts                                       # Configured Axios instance
├── store/                                               # Zustand stores (auth, etc.)
├── types/                                                 # Shared TypeScript types
└── i18n/                                                    # next-intl config
messages/
├── ar.json                                                    # Arabic translations
└── en.json                                                    # English translations
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- A running instance of the [E-Shop API](#) backend

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/e-shop-frontend.git
cd e-shop-frontend

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env.local

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> ⚠️ Never commit your real `.env.local` file. It is already excluded via `.gitignore`.

---

## Internationalization

The app supports Arabic (default) and English using `next-intl`:

- Locale is stored in a cookie (no `/ar` or `/en` URL prefixes)
- Direction (`rtl`/`ltr`) is set dynamically on the `<html>` tag
- All UI strings live in `messages/ar.json` and `messages/en.json`
- Logical CSS properties (`start`/`end`, `ps`/`pe`) are used throughout instead of `left`/`right` for automatic RTL support

Switch language using the language toggle in the header — it updates the cookie and refreshes the locale without a full page reload.

---

## State Management

| Type                | Tool             | Used For                                              |
| --------------------- | ----------------- | ------------------------------------------------------ |
| Server state             | TanStack Query     | Products, cart, wishlist, orders, dashboard stats      |
| Client/auth state           | Zustand (persisted) | Current user, access token                              |
| Form state                     | React Hook Form        | All forms, paired with Zod schemas for validation         |
| UI state                          | React Context / useState | Cart drawer open/close, mobile menus                       |

API requests are centralized through a single configured Axios instance (`lib/axios.ts`) with request/response interceptors for attaching the auth token and handling `401` responses.

---

## Admin Dashboard

Accessible at `/admin` (requires an authenticated user with the `admin` role):

- **Overview** — revenue, orders, users, products stats with trend indicators and a sales chart
- **Products** — searchable/filterable table, create/edit dialog with image upload, delete confirmation
- **Orders** — order list with status badges
- **Categories** — category CRUD with image upload
- **Users** — registered users overview

Non-admin users attempting to access `/admin` routes are redirected automatically.

---

## Scripts

| Command               | Description                          |
| ----------------------- | ------------------------------------- |
| `npm run dev`              | Run the development server              |
| `npm run build`              | Create a production build                |
| `npm run start`                | Run the production build                  |
| `npm run lint`                    | Run ESLint                                  |

---

## License

This project is for educational and portfolio purposes.
