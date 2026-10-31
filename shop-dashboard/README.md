# 🛍️ DailyGrocer — Shop-Owner Partner Dashboard

> A high-performance, responsive React + TypeScript shopkeeper dashboard built for hyperlocal grocery stores in **India**.

![Dashboard Status](https://img.shields.io/badge/Status-Clickable%20Prototype-15803d?style=flat-square)
![Stack](https://img.shields.io/badge/Built%20With-React%2019%20%7C%20TypeScript%20%7C%20Vite-black?style=flat-square)
![Styling](https://img.shields.io/badge/Aesthetics-Clean%20SaaS%20%2B%20Deep%20Green%20Accent-15803d?style=flat-square)

---

## 📌 Product Overview

**DailyGrocer Merchant Portal** is an intuitive, frontend-first SaaS dashboard engineered specifically for local kirana and grocery shopkeepers (*e.g., Gupta Ji Kirana & General Store*). It bridges the gap between neighborhood retail stores and fast 15–20 minute doorstep deliveries across DailyGrocer's key commercial and residential areas.

The application serves as an interactive demonstration prototype to present to local business owners, showing them how they can manage digital storefronts, monitor live customer orders, update product catalogs, and configure delivery parameters without technical complexity.

---

## 🎨 Visual Style & Design Philosophy

- **Strict Minimalist Palette**: Built on an uncluttered canvas of whites, soft light-grays (`#f8fafc`), crisp slate borders (`#e2e8f0`), and dark text (`#0f172a`).
- **Single Depth Accent**: Deep Forest Green (`#15803d` / `#166534`) is utilized as the solitary contrast color to highlight active states, primary actions, and inventory availability without visual distraction.
- **Micro-interactions & Responsiveness**: Smooth transitions, accessible hover effects, responsive data tables, and an off-canvas mobile drawer menu designed for mobile and tablet devices.
- **Demonstration Transparency**: Clear visual cues and badges inform shopkeepers that order counts, sales metrics, and customer orders are simulated demo records.

---

## 🖥️ Layout & Core Screens

### 1. Top Navigation Bar
- **Store Identity**: Displays the active store name (*Gupta Ji Kirana & General Store*) alongside location details (*Station Road • 3.5 km Delivery Radius*).
- **Merchant Mode Badge**: Highlights the demo environment to local shopkeepers.
- **Notification Center**: Interactive bell icon showing unread order notifications with drop-down previews.
- **Store Owner Profile**: Displays the owner avatar and credentials (*Ramesh Chandra Gupta, Shopkeeper*).

### 2. Overview Dashboard (`/overview`)
- **Key Metrics Grid**:
  - **Total Catalog Products**: Live count of listed inventory with active/low-stock counts.
  - **Pending / Actionable Orders**: Real-time counter of unconfirmed orders and items in packing.
  - **Completed Orders Today**: Delivery fulfillment count and average fulfillment speed.
  - **Illustrative Daily Sales**: Demonstrative revenue figure with order totals.
- **Hourly Sales Pace**: Visual bar chart illustrating simulated customer demand across DailyGrocer business hours (08:00 AM – 08:00 PM peak rush).
- **Shop Quick Actions**: Fast shortcuts to add inventory items, jump directly to the pending orders queue, or update store operating hours.
- **Recent Orders Stream**: Mini-table with inline status dropdowns for fast processing.
- **Low-Stock Alert Box**: Proactive warnings for items with low or zero remaining stock.

### 3. My Products & Inventory (`/products`)
- **Dual-Language Product Listing**: Items feature both English and Hindi names (e.g., *Fresh Red Hybrid Tomatoes / देसी हाइब्रिड लाल टमाटर*) tailored to DailyGrocer markets.
- **Real-Time Search**: Instant search filtering by product name, Hindi name, SKU, or category.
- **Category Filter Pills**: Quick category switches (*Fruits & Vegetables*, *Dairy & Milk*, *Staples & Grains*, *Snacks & Munchies*, *Beverages*, *Personal & Home Care*).
- **Stock Availability Filter**: Toggle between *All*, *In Stock Only*, or *Out of Stock*.
- **Instant Availability Toggle**: Single-click switch to pause or resume online ordering for any specific product.
- **Full CRUD Management**:
  - **Add Product Form**: Clean modal with fields for name, Hindi title, category, price, MRP, initial stock, unit (kg, g, L, pack), description, and image URL. Includes preset local image shortcuts and live thumbnail previews.
  - **Edit Product Form**: Modal prefilled with product data to update prices, stock, or details.
  - **Delete Confirmation Modal**: Safety dialog requiring explicit confirmation before removing an item.
  - **Validation**: Enforces required fields and valid numeric price/quantity inputs.

### 4. Customer Orders Queue (`/orders`)
- **Status Filter Tabs**: Categorized by delivery stages with dynamic count pills (*All*, *Pending*, *Preparing*, *Out for Delivery*, *Completed*, *Cancelled*).
- **Searchable Queue**: Search orders by Order ID (`#BLR-2049`), customer name, contact number, or DailyGrocer locality.
- **Detailed Order Cards & Tables**:
  - Customer name, phone number, and delivery address.
  - Customer delivery instructions (*e.g., "Please pick red ripe tomatoes, no soft ones"*).
  - Itemized breakdowns with unit quantities and line-item prices.
  - Payment method badges (*Cash on Delivery*, *UPI QR on Delivery*, *Prepaid UPI*).
  - Bill summary and item total.
  - Interactive status select dropdowns and one-click progression buttons (*Accept & Prepare*, *Dispatch Order*, *Mark Delivered*).

### 5. Packing Slip & Order Receipt Modal
- **Printable Customer Voucher**:
  - Clean slip layout formatted for store counter billing.
  - Store header with address, FSSAI license (`#22724589000142`), and phone.
  - Itemized items list with quantities and units.
  - Subtotal, delivery charges, and total bill calculation.
  - One-click **Print Packing Slip** button triggering browser print dialog.

### 6. Store Profile & Local Logistics (`/profile`)
- **Store Configuration**: Editable fields for business name, Hindi board name, owner name, primary/alternate phone numbers, email, physical street address, and landmark.
- **Operating Hours & Delivery Radius**: Configurable delivery radius (*3.5 km*) and shop operating hours (*07:00 AM – 10:00 PM*).
- **Government & Banking IDs**: Store UPI ID (`ramesh.gupta@okaxis`) and FSSAI License Number.
- **Delivery Coverage Card**: Displays covered DailyGrocer neighborhoods:
  - *Station Road & Railway Colony*
  - *Veer Vinay Chowk / Chauraha*
  - *Civil Lines (DM & Judge Residence)*
  - *Pahalwara Ward & Market*
  - *Purani Bazar & Clock Tower*
  - *Bhagwati Ganj (Ward 7 & 8)*
  - *Hospital Road & District Hospital*
  - *Peepal Tiraha & Bus Station*
- **Counter UPI QR Display**: Simulated in-store QR code ready for customer payments at checkout.

### 7. Global Actions & Real-Time Feedback
- **Store Active Switch**: Instant toggle in the sidebar footer and top bar allowing merchants to pause incoming orders or open the store online.
- **Toast Notifications**: Non-intrusive notification banners confirming additions, edits, deletions, status transitions, and saved profiles.

---

## 🏗️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Functional UI components with hooks (`useState`, `useMemo`, `useCallback`) |
| **TypeScript** | Strict type safety for products, orders, categories, and store configurations |
| **Vite 8** | Ultra-fast local dev server and optimized production bundling |
| **Vanilla CSS** | Custom design system with CSS custom properties (`--bg-surface`, `--accent-primary`) |
| **Lucide React** | Clean, accessible iconography |

---

## 📁 Project Structure

```
shop-dashboard/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Modular UI components
│   │   ├── DeleteConfirmModal.tsx  # Product deletion modal
│   │   ├── OrderReceiptModal.tsx   # Printable packing slip modal
│   │   ├── Orders.tsx              # Orders management table & filtering
│   │   ├── Overview.tsx            # Dashboard metrics, chart & summary
│   │   ├── ProductModal.tsx        # Add & Edit product modal with validation
│   │   ├── Products.tsx            # Inventory catalog table with search
│   │   ├── Sidebar.tsx             # Desktop sidebar & mobile drawer
│   │   ├── StoreProfile.tsx        # Store settings, UPI QR & coverage
│   │   ├── Toast.tsx               # Toast notification container
│   │   └── TopBar.tsx              # Header with store details & alerts
│   ├── data/
│   │   └── mockData.ts             # Separated sample DailyGrocer products & orders
│   ├── types.ts                    # TypeScript interfaces & domain types
│   ├── App.css                     # Component layout, tables, modals & cards
│   ├── index.css                   # Global reset, typography & design tokens
│   ├── App.tsx                     # Main application state & screen routing
│   └── main.tsx                    # React DOM entrypoint
├── index.html              # HTML shell with Inter Google Font & metadata
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
cd shop-dashboard
npm install
```

### 3. Run Locally in Development
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the port displayed in your terminal).

### 4. Build for Production
Create an optimized production build:
```bash
npm run build
```
Verify the build output locally with:
```bash
npm run preview
```

---

## 💡 Prototype Notes & Scope

1. **Frontend-Only**: All modifications (adding products, toggling availability, updating order status, saving store profiles) mutate local React state. Changes reset on full browser refresh.
2. **Zero Backend Required**: No live Firebase, database, or external auth needed for demonstration.
3. **Hyperlocal Context**: Seed data reflects authentic groceries, pricing, and locations specific to Your City, India.
