# 🛍️ DailyGrocer — Customer Web Store

> **Hyperlocal 15–20 Minute Grocery & Daily Essentials Delivery Platform for DailyGrocer (UP)**  
> Built with modern **React 19 + TypeScript + Vite + Lucide Icons + Responsive CSS**.

---

## 📌 Overview
**DailyGrocer** is a fast, responsive, and intuitive web application designed for customers in DailyGrocer to order fresh vegetables, dairy products, kirana staples, snacks, beverages, and personal care items directly from verified neighborhood merchants and mandis.

The application simulates real-time quick-commerce workflows (similar to Blinkit / Zepto / Instamart), tailored specifically with localized store names, bilingual Hindi/English item titles, locality selectors, coupon codes, and a full checkout with live delivery boy tracking simulation.

---

## ✨ Key Features & Capabilities

### 1. 📍 Hyperlocal Locality Selector
- Instant location switching across authentic DailyGrocer neighborhoods:
  - *Civil Lines*, *Veer Vinay Chowk*, *Station Road*, *Pahalwara*, *Purani Bazar*, *Bhagwati Ganj*, *Peepal Tiraha*.
- Dynamically updates delivery estimates and store availability.

### 2. 🏪 Partnered Local Merchant Hubs
- Browse verified local stores with ratings, distances, minimum orders, and delivery times:
  - **Gupta Ji Kirana & General Store** (Station Road)
  - **Awadh Fresh Sabzi & Fruit Mandi** (Veer Vinay Chowk)
  - **DailyGrocer Dairy & Paneer Hub** (Civil Lines)
  - **Shree Ram Superstore** (Pahalwara Market)
  - **Mishra Sweets & Namkeen Bhandar** (Purani Bazar)
- Filter catalog items by specific store or shop across all partners simultaneously.

### 3. 🔍 Smart Search & Category Filtering
- Multi-dimensional search supporting:
  - English item names (e.g., *Tomato*, *Paneer*, *Atta*)
  - Hindi transliterations/titles (e.g., *टमाटर*, *पनीर*, *दही*)
  - Category tags and shop names
- Horizontal category pill navigation with live product counters:
  - *Fruits & Vegetables*, *Dairy & Eggs*, *Staples & Grains*, *Snacks & Munchies*, *Beverages*, *Personal & Home Care*.

### 4. 🛒 Interactive Cart & Quick Counter
- Single-click **+ ADD** and intuitive quantity adjusters (`-` / `+`).
- Slide-out **Cart Drawer** with itemized bill breakdown:
  - Real-time subtotal calculation
  - **Free delivery threshold** (orders over ₹199 qualify for ₹0 delivery fee)
  - Packaging charges & applied savings
- **Mobile Sticky Bottom Bar**: Quick one-tap access to cart on small screens.

### 5. 🎟️ Coupon & Discount Engine
- Pre-configured working coupon codes:
  - `DailyGrocer50` or `FIRST50`: Flat ₹50 OFF
  - `WELCOME20`: ₹20 OFF
- Instant validation and visual badge feedback.

### 6. 💳 Seamless Checkout Modal
- Customer details form with local address fields and delivery instructions.
- Multiple payment method selections:
  - **Cash on Delivery (COD)**
  - **UPI on Delivery (Scanner on Arrival)**
  - **Instant Mock UPI / Online Payment**

### 7. 🚀 Order Confirmation & Live Tracking View
- Dedicated post-checkout order confirmation screen containing:
  - Unique order tracking ID (e.g., `#BLR-94821`)
  - Real-time animated delivery stepper (*Order Confirmed* ➔ *Packed at Store* ➔ *Rider On the Way* ➔ *Delivered*)
  - Delivery partner card with name, direct call button, and vehicle details
  - Complete order itemization, address receipt, and customer support shortcut

### 8. 🔍 Quick View Product Modal
- Inspect high-resolution product imagery, weight/quantity units, descriptions, stock availability, and verified ratings.

---

## 🏗️ Project Architecture & Directory Structure

```plaintext
customer-store/
├── index.html                   # HTML entry point with metadata and fonts
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript root configuration
├── vite.config.ts               # Vite bundler configuration
│
├── public/                      # Static assets and favicons
│
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Main application orchestrator & state manager
    ├── App.css                  # Custom styling, animations, responsive rules
    ├── index.css                # Base reset, CSS variables & typography tokens
    ├── types.ts                 # TypeScript type definitions & interfaces
    │
    ├── data/
    │   └── mockData.ts          # Curated DailyGrocer stores, products & localities
    │
    └── components/
        ├── Header.tsx           # Nav bar with search, locality picker & cart trigger
        ├── HeroBanner.tsx       # Promotional quick-commerce banner & CTA buttons
        ├── CategoryList.tsx     # Horizontal category selector with item counts
        ├── FeaturedShops.tsx    # Merchant partner cards with ratings & delivery times
        ├── ProductGrid.tsx      # Responsive product display grid with filters
        ├── ProductCard.tsx      # Individual product card with add-to-cart buttons
        ├── ProductDetailModal.tsx # Quick-view modal with detailed item information
        ├── CartDrawer.tsx       # Slide-out drawer with bill summary & coupon codes
        ├── CheckoutModal.tsx    # Address collection, payment choice & order review
        ├── OrderConfirmation.tsx# Live rider tracking, receipt & delivery status
        └── Footer.tsx           # Platform branding, quick links & trust badges
```

---

## 🛠️ Code Logic & State Management

The core state is handled cleanly using React hooks in [App.tsx](file:///d:/shlok%20web%20dev/DailyGrocer-prototype/customer-store/src/App.tsx):

| State Property | Type | Description |
| :--- | :--- | :--- |
| `cart` | `CartItem[]` | Maintains array of products and active quantities. |
| `selectedLocality` | `string` | Selected delivery zone in DailyGrocer. |
| `selectedCategory` | `string` | Current category filter (`'all'` or category ID). |
| `selectedShopId` | `string \| null` | Restricts products to an individual shop when active. |
| `searchQuery` | `string` | Search input value filtered against product names and Hindi names. |
| `couponCode` / `appliedDiscount` | `string` / `number` | Active promo coupon and discount deducted from subtotal. |
| `placedOrder` | `OrderDetails \| null` | Contains active order snapshot; toggles confirmation view when non-null. |

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphic effects, CSS animations)

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or newer) installed on your system.

### 2. Installation
Clone the repository or navigate to the project directory:
```bash
cd "customer-store"
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at the local URL displayed in the terminal (usually `http://localhost:5173/`).

### 4. Build for Production
```bash
npm run build
```
Generates production-ready optimized assets in the `dist/` directory.

### 5. Linting
```bash
npm run lint
```

---

## 📱 Responsive Design
The UI is fully responsive and optimized across all viewports:
- **Mobile (< 640px)**: Compact header, mobile search bar, horizontal scrolling categories, floating sticky cart footer.
- **Tablet (640px - 1024px)**: Adaptive 2-to-3 column grid.
- **Desktop (> 1024px)**: Full multi-column layout with 4-column product grid and slide-in drawer modals.
