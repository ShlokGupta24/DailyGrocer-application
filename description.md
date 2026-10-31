# 🏗️ DailyGrocer — Backend Description Document
## Java Spring Boot Backend Specification

> **Project**: DailyGrocer — Hyperlocal 15–20 Minute Grocery & Daily Essentials Delivery Platform  
> **Location**: Your City, India, India (PIN: 271201)  
> **Document Purpose**: Complete backend specification for Java + Spring Boot implementation, covering all database schemas, API endpoints, business logic, and integration details derived from both frontend screens.

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Application Screens Summary](#2-application-screens-summary)
3. [Technology Stack — Backend](#3-technology-stack--backend)
4. [Database Configuration](#4-database-configuration)
5. [Database Schemas (All Tables)](#5-database-schemas-all-tables)
6. [Entity Relationships (ERD Overview)](#6-entity-relationships-erd-overview)
7. [REST API Endpoints — Customer Store](#7-rest-api-endpoints--customer-store)
8. [REST API Endpoints — Shop Dashboard](#8-rest-api-endpoints--shop-dashboard)
9. [Business Logic & Rules](#9-business-logic--rules)
10. [Coupon & Discount Engine](#10-coupon--discount-engine)
11. [Order Lifecycle & Status Machine](#11-order-lifecycle--status-machine)
12. [Delivery Boy Assignment Logic](#12-delivery-boy-assignment-logic)
13. [Spring Boot Project Structure](#13-spring-boot-project-structure)
14. [Security & Authentication](#14-security--authentication)
15. [Application Configuration (application.properties)](#15-application-configuration-applicationproperties)
16. [Seed Data Reference](#16-seed-data-reference)

---

## 1. Project Overview

**DailyGrocer** is a hyperlocal grocery delivery platform serving the your city of Uttar Pradesh. The system consists of **two frontend screens** backed by a single unified Java Spring Boot REST API:

| Screen | User Type | Purpose |
|--------|-----------|---------|
| **Customer Store** (`customer-store/`) | End Customer / Buyer | Browse shops, search products, manage cart, apply coupons, checkout, track orders |
| **Shop Dashboard** (`shop-dashboard/`) | Merchant / Shop Owner | Manage product catalog, process orders, update store profile, view sales metrics |

The backend must support:
- Multi-shop product catalog with category filtering
- Real-time order management with status transitions
- Customer address & checkout flow
- Coupon/promo discount engine
- Delivery partner assignment
- Store profile management
- Hourly sales analytics

---

## 2. Application Screens Summary

### 2.1 Customer Store Screen (`customer-store/`)

**URL**: Customer-facing web portal

**Key UI Sections & Their Data Requirements:**

| UI Component | Data Needed from Backend |
|---|---|
| **Header** | Selected locality, cart item count |
| **Hero Banner** | Static/CMS content (promotional banners) |
| **Category List** | All 6 product categories with item counts |
| **Featured Shops** | List of all shops with rating, distance, delivery time, isOpen status |
| **Product Grid** | Products filtered by category, shop, and search query |
| **Product Detail Modal** | Single product with full details (name, hindi name, price, MRP, weight, description, rating, inStock) |
| **Cart Drawer** | Cart items with quantity, subtotal, delivery charge computation, coupon validation |
| **Checkout Modal** | Address form submission, payment method selection, order placement |
| **Order Confirmation** | Placed order details, assigned delivery boy info, ETA |

**Customer Localities Supported:**
```
Civil Lines
Veer Vinay Chowk
Station Road
Pahalwara
Purani Bazar
Bhagwati Ganj
Peepal Tiraha
```

**Payment Methods Supported:**
- `COD` — Cash on Delivery
- `UPI_DELIVERY` — UPI QR scan on delivery (PhonePe / Google Pay / Paytm)
- `ONLINE_PREPAID` — Prepaid online UPI payment

**Delivery Slot Types:**
- `INSTANT` — 15–25 minute express delivery
- `EVENING_SLOT` — Evening delivery (6:00 PM – 8:00 PM)

**Cart & Pricing Rules:**
- Free delivery threshold: Orders ≥ ₹199 → delivery charge = ₹0
- Below ₹199 → delivery charge = ₹25
- Packaging & handling charge: ₹5 (flat, always applied when cart is non-empty)
- Coupon discount applied after subtotal
- Final payable = max(0, subtotal + deliveryCharge + packagingCharge − couponDiscount)

---

### 2.2 Shop Dashboard Screen (`shop-dashboard/`)

**URL**: Merchant/shopkeeper management portal

**Key Tabs & Their Data Requirements:**

| Dashboard Tab | Data Needed from Backend |
|---|---|
| **Overview** | Metric counts (total products, pending orders, completed orders, daily sales total), hourly sales chart data |
| **Products** | Full product CRUD — list, create, update, delete, toggle availability |
| **Orders** | All orders for the shop with status filter, search, status update transitions |
| **Store Profile** | Shop info fields — name, hindi name, owner, phone, alternate phone, email, address, landmark, locality, pincode, delivery radius, opening hours, UPI ID, FSSAI number, isOpen toggle |

**Product Status Filters (Orders):**
```
All | Pending | Preparing | Out for Delivery | Completed | Cancelled
```

**Order Actions Available:**
- Accept & Prepare (Pending → Preparing)
- Dispatch Order (Preparing → Out for Delivery)
- Mark Delivered (Out for Delivery → Completed)
- Cancel (any active state → Cancelled)
- View Printable Packing Slip (read-only)

**Low Stock Alert Threshold**: Products with `stock <= 20` OR `inStock = false` appear in the Low Stock Alert panel.

---

## 3. Technology Stack — Backend

| Layer | Technology | Version |
|---|---|---|
| **Language** | Java | 17 (LTS) |
| **Framework** | Spring Boot | 3.2.x |
| **ORM** | Spring Data JPA + Hibernate | 6.x |
| **Database** | MySQL | 8.0+ |
| **Security** | Spring Security + JWT | 6.x |
| **Build Tool** | Maven | 3.9.x |
| **Migration** | Flyway | 9.x |
| **Validation** | Jakarta Bean Validation (Hibernate Validator) | 3.x |
| **API Documentation** | SpringDoc OpenAPI (Swagger UI) | 2.x |
| **Mapping** | MapStruct | 1.5.x |
| **Caching** | Spring Cache + Caffeine | — |
| **Testing** | JUnit 5 + Mockito + Spring Boot Test | — |
| **Containerization** | Docker + Docker Compose | — |

---

## 4. Database Configuration

### 4.1 Database: MySQL 8.0+

```properties
# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/dailygrocer?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=blr_app_user
spring.datasource.password=BlrSecure@2024!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool (HikariCP — default in Spring Boot)
spring.datasource.hikari.pool-name=DailyGrocerHikariPool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.max-lifetime=1800000
```

### 4.2 Database Creation SQL

```sql
CREATE DATABASE IF NOT EXISTS dailygrocer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'blr_app_user'@'localhost' IDENTIFIED BY 'BlrSecure@2024!';
GRANT ALL PRIVILEGES ON dailygrocer.* TO 'blr_app_user'@'localhost';
FLUSH PRIVILEGES;

USE dailygrocer;
```

> **Note**: `utf8mb4` charset is mandatory to support Hindi (Devanagari) characters stored in fields like `hindi_name`, `hindi_shop_name`.

### 4.3 JPA / Hibernate Configuration

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
spring.jpa.open-in-view=false
```

> **`ddl-auto=validate`**: Flyway handles schema migrations. Hibernate only validates against existing schema.

### 4.4 Flyway Migration Configuration

```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
spring.flyway.validate-on-migrate=true
```

Migration scripts location: `src/main/resources/db/migration/`  
Naming convention: `V{version}__{description}.sql`  
Example: `V1__create_initial_schema.sql`, `V2__seed_shops_and_categories.sql`

---

## 5. Database Schemas (All Tables)

### 5.1 Table: `categories`

Stores the 6 product categories visible in both the customer store and shop dashboard.

```sql
CREATE TABLE categories (
    id            VARCHAR(50)  NOT NULL PRIMARY KEY,   -- e.g. 'fruits-vegetables'
    name          VARCHAR(100) NOT NULL,                -- e.g. 'Fruits & Vegetables'
    icon          VARCHAR(50)  NOT NULL,                -- Lucide icon name (e.g. 'Apple')
    color         VARCHAR(20)  NOT NULL DEFAULT '#f5f5f5',
    badge         VARCHAR(100),                         -- e.g. 'Mandi Fresh', 'Daily Needs'
    item_count    INT          NOT NULL DEFAULT 0,      -- Count of active products in this category
    display_order INT          NOT NULL DEFAULT 0,      -- Sort order in horizontal pill list
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Seed Data (6 categories):**

| id | name | icon | badge | display_order |
|---|---|---|---|---|
| `fruits-vegetables` | Fruits & Vegetables | Apple | Mandi Fresh | 1 |
| `dairy-eggs` | Dairy & Eggs | Milk | Daily Needs | 2 |
| `staples` | Staples & Grains | Wheat | Best Value | 3 |
| `snacks` | Snacks & Munchies | Cookie | Crispy & Tasty | 4 |
| `beverages` | Beverages | Coffee | Chilled & Hot | 5 |
| `personal-care` | Personal & Home Care | Sparkles | Clean & Safe | 6 |

---

### 5.2 Table: `localities`

DailyGrocer delivery zones. Used in customer checkout locality selector.

```sql
CREATE TABLE localities (
    id            BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,                   -- e.g. 'Civil Lines'
    pincode       VARCHAR(10)  NOT NULL DEFAULT '271201',
    is_active     TINYINT(1)   NOT NULL DEFAULT 1,
    display_order INT          NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Seed Data (7 localities):**

```
Civil Lines
Veer Vinay Chowk
Station Road
Pahalwara
Purani Bazar
Bhagwati Ganj
Peepal Tiraha
```

---

### 5.3 Table: `shops`

Stores all registered partner shops/merchants. Each shop has its own dashboard login.

```sql
CREATE TABLE shops (
    id                   VARCHAR(20)   NOT NULL PRIMARY KEY,  -- e.g. 'shop-1'
    shop_name            VARCHAR(200)  NOT NULL,              -- English name
    hindi_shop_name      VARCHAR(200),                        -- Hindi board name (Devanagari)
    owner_name           VARCHAR(150)  NOT NULL,
    phone                VARCHAR(20)   NOT NULL,              -- Primary mobile e.g. '+91 98391 24567'
    alternate_phone      VARCHAR(20),                         -- Landline / alternate
    email                VARCHAR(150),
    area                 VARCHAR(200)  NOT NULL,              -- Short area label, e.g. 'Station Road'
    address              TEXT          NOT NULL,              -- Full street address
    landmark             VARCHAR(200),                        -- e.g. 'Opposite PNB ATM & Cycle Stand'
    locality             VARCHAR(150)  NOT NULL,              -- Delivery zone
    pincode              VARCHAR(10)   NOT NULL DEFAULT '271201',
    delivery_radius      VARCHAR(20)   NOT NULL DEFAULT '3.5 km',
    delivery_time        VARCHAR(50)   NOT NULL DEFAULT '15-20 mins',
    opening_hours        VARCHAR(100)  NOT NULL,              -- e.g. '07:00 AM – 10:00 PM (Everyday)'
    upi_id               VARCHAR(100),                        -- e.g. 'ramesh.gupta@okaxis'
    fssai_number         VARCHAR(50),                         -- e.g. '22724589000142'
    min_order_value      INT           NOT NULL DEFAULT 99,   -- Minimum order in INR
    avg_preparation_time VARCHAR(30)   NOT NULL DEFAULT '8 – 12 mins',
    rating               DECIMAL(3,2)  NOT NULL DEFAULT 4.50,
    review_count         INT           NOT NULL DEFAULT 0,
    distance             VARCHAR(20),                         -- e.g. '1.1 km' from city center
    image_url            VARCHAR(500),                        -- Shop cover image URL
    tag                  VARCHAR(100),                        -- e.g. 'DailyGrocer Top Seller'
    is_open              TINYINT(1)    NOT NULL DEFAULT 1,    -- Live open/close toggle
    is_active            TINYINT(1)   NOT NULL DEFAULT 1,     -- Soft delete flag
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_shops_locality (locality),
    INDEX idx_shops_is_open (is_open),
    INDEX idx_shops_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Seed Data (5 shops):**

| id | shop_name | area | rating | min_order | delivery_time | tag |
|---|---|---|---|---|---|---|
| shop-1 | Gupta Ji Kirana & General Store | Station Road | 4.8 | 99 | 15-20 mins | DailyGrocer Top Seller |
| shop-2 | Awadh Fresh Sabzi & Fruit Mandi | Veer Vinay Chowk | 4.9 | 49 | 10-15 mins | Direct from Mandi |
| shop-3 | DailyGrocer Dairy & Paneer Hub | Civil Lines | 4.7 | 79 | 12-18 mins | Pure Desi Milk & Paneer |
| shop-4 | Shree Ram Superstore | Pahalwara Market | 4.6 | 149 | 20-25 mins | Wholesale Rates |
| shop-5 | Mishra Sweets & Namkeen Bhandar | Purani Bazar | 4.9 | 99 | 15-20 mins | Heritage Store since 1984 |

---

### 5.4 Table: `products`

All product listings managed by shop owners. Visible to customers in the store.

```sql
CREATE TABLE products (
    id                   VARCHAR(30)   NOT NULL PRIMARY KEY,  -- e.g. 'prod-01'
    shop_id              VARCHAR(20)   NOT NULL,              -- FK → shops.id
    category_id          VARCHAR(50)   NOT NULL,              -- FK → categories.id
    name                 VARCHAR(300)  NOT NULL,              -- English product name
    hindi_name           VARCHAR(300),                        -- Hindi / local name (Devanagari)
    description          TEXT          NOT NULL,
    price                DECIMAL(10,2) NOT NULL,              -- Selling price in INR
    original_price       DECIMAL(10,2),                       -- MRP (shown as strikethrough)
    discount_percentage  INT           GENERATED ALWAYS AS (
                             CASE
                                WHEN original_price IS NOT NULL AND original_price > price
                                THEN ROUND(((original_price - price) / original_price) * 100)
                                ELSE 0
                             END
                         ) STORED,                            -- Auto-computed discount %
    stock                INT           NOT NULL DEFAULT 0,    -- Current stock quantity
    unit                 VARCHAR(50)   NOT NULL,              -- e.g. '1 kg', '250 g bunch', '1 Litre Pouch'
    weight               VARCHAR(50),                         -- Alias for unit in customer-facing display
    image_url            VARCHAR(500)  NOT NULL,
    sku                  VARCHAR(30),                         -- Stock keeping unit, e.g. 'VEG-TOM-01'
    tag                  VARCHAR(100),                        -- e.g. 'Bestseller', 'Farm Fresh', 'Organic'
    rating               DECIMAL(3,2)  NOT NULL DEFAULT 4.50,
    in_stock             TINYINT(1)    NOT NULL DEFAULT 1,    -- Manual override by shop owner
    is_active            TINYINT(1)   NOT NULL DEFAULT 1,     -- Soft delete flag
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_shop     FOREIGN KEY (shop_id)     REFERENCES shops(id)      ON DELETE CASCADE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_shop_id    (shop_id),
    INDEX idx_products_category   (category_id),
    INDEX idx_products_in_stock   (in_stock),
    INDEX idx_products_is_active  (is_active),
    INDEX idx_products_sku        (sku),
    FULLTEXT INDEX ft_products_name (name, hindi_name)       -- For Hindi + English full-text search
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Business Rules:**
- `in_stock` can be toggled independently of `stock` quantity (manual override by shopkeeper)
- Product is effectively unavailable to customers when `in_stock = 0` OR `stock = 0` OR `is_active = 0`
- `discount_percentage` is a generated column — never manually set
- `weight` field mirrors `unit` for customer-facing display (both columns serve the same data)
- Low-stock alert threshold: `stock <= 20`

---

### 5.5 Table: `customers`

Customer accounts who shop on the customer-facing store.

```sql
CREATE TABLE customers (
    id           BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(150)  NOT NULL,
    phone        VARCHAR(15)   NOT NULL UNIQUE,    -- 10-digit Indian mobile number (stored without +91)
    email        VARCHAR(150)  UNIQUE,
    is_active    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customers_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5.6 Table: `delivery_addresses`

Stores customer delivery addresses. A customer can have multiple saved addresses.

```sql
CREATE TABLE delivery_addresses (
    id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT       NOT NULL,              -- FK → customers.id
    full_name       VARCHAR(150) NOT NULL,              -- Recipient name at this address
    phone           VARCHAR(15)  NOT NULL,              -- Contact at delivery address
    street_address  TEXT         NOT NULL,              -- House / Flat / Street line
    locality        VARCHAR(150) NOT NULL,              -- FK zone (matches localities.name)
    landmark        VARCHAR(200),                       -- Optional, e.g. 'Behind City Hospital'
    instructions    VARCHAR(500),                       -- Rider instructions
    pincode         VARCHAR(10)  NOT NULL DEFAULT '271201',
    is_default      TINYINT(1)  NOT NULL DEFAULT 0,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_address_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_addr_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5.7 Table: `coupons`

All available promo codes configurable by the platform admin.

```sql
CREATE TABLE coupons (
    id                BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code              VARCHAR(30)   NOT NULL UNIQUE,      -- e.g. 'DailyGrocer50', 'FIRST50', 'WELCOME20'
    discount_type     ENUM('FLAT', 'PERCENTAGE') NOT NULL DEFAULT 'FLAT',
    discount_value    DECIMAL(10,2) NOT NULL,             -- ₹50 flat OR 20% off
    min_order_value   DECIMAL(10,2) NOT NULL DEFAULT 0,   -- Minimum cart subtotal to apply coupon
    max_discount_cap  DECIMAL(10,2),                       -- Maximum discount (for PERCENTAGE type)
    description       VARCHAR(200),
    valid_from        DATETIME      NOT NULL,
    valid_until       DATETIME      NOT NULL,
    usage_limit       INT           NOT NULL DEFAULT 1000, -- Total redemptions allowed
    usage_count       INT           NOT NULL DEFAULT 0,    -- Times used so far
    is_active         TINYINT(1)   NOT NULL DEFAULT 1,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Pre-configured Coupons (from frontend source):**

| code | discount_type | discount_value | description |
|---|---|---|---|
| `DailyGrocer50` | FLAT | 50.00 | Flat ₹50 OFF for DailyGrocer customers |
| `FIRST50` | FLAT | 50.00 | First order flat ₹50 OFF |
| `WELCOME20` | FLAT | 20.00 | Welcome discount ₹20 OFF |

---

### 5.8 Table: `orders`

Master order table. One row per placed customer order.

```sql
CREATE TABLE orders (
    id                   VARCHAR(20)   NOT NULL PRIMARY KEY,   -- e.g. 'BLR-2049' (format: BLR-XXXX)
    customer_id          BIGINT,                               -- FK → customers.id (nullable for guest)
    shop_id              VARCHAR(20)   NOT NULL,               -- FK → shops.id
    customer_name        VARCHAR(150)  NOT NULL,               -- Snapshot at order time
    customer_phone       VARCHAR(15)   NOT NULL,               -- Snapshot at order time
    delivery_address     TEXT          NOT NULL,               -- Full address string snapshot
    locality             VARCHAR(150)  NOT NULL,
    landmark             VARCHAR(200),
    delivery_instructions VARCHAR(500),
    item_total           DECIMAL(10,2) NOT NULL,               -- Sum of (price × quantity) for all items
    delivery_fee         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    packaging_charge     DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    coupon_code          VARCHAR(30),                          -- Applied coupon code (nullable)
    coupon_discount      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount         DECIMAL(10,2) NOT NULL,               -- Final payable (item_total + delivery_fee + packaging - discount)
    payment_method       ENUM('COD', 'UPI_DELIVERY', 'ONLINE_PREPAID') NOT NULL,
    payment_status       ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED')  NOT NULL DEFAULT 'PENDING',
    delivery_slot        ENUM('INSTANT', 'EVENING_SLOT')       NOT NULL DEFAULT 'INSTANT',
    status               ENUM('PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    notes                VARCHAR(500),                         -- Customer special instructions
    delivery_boy_id      BIGINT,                              -- FK → delivery_boys.id (assigned on dispatch)
    estimated_delivery_time DATETIME,
    placed_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_shop         FOREIGN KEY (shop_id)         REFERENCES shops(id)         ON DELETE RESTRICT,
    CONSTRAINT fk_order_customer     FOREIGN KEY (customer_id)     REFERENCES customers(id)      ON DELETE SET NULL,
    CONSTRAINT fk_order_delivery_boy FOREIGN KEY (delivery_boy_id) REFERENCES delivery_boys(id)  ON DELETE SET NULL,
    INDEX idx_orders_shop_id   (shop_id),
    INDEX idx_orders_status    (status),
    INDEX idx_orders_placed_at (placed_at),
    INDEX idx_orders_customer  (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Order ID Generation Rule**: Format `BLR-{4-digit-sequential-number}`, starting from `BLR-1000`. Implemented as a sequence generator in the service layer, not AUTO_INCREMENT (to match frontend pattern `#BLR-2049`).

---

### 5.9 Table: `order_items`

Line items for each order. One row per product per order.

```sql
CREATE TABLE order_items (
    id            BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id      VARCHAR(20)   NOT NULL,              -- FK → orders.id
    product_id    VARCHAR(30)   NOT NULL,              -- FK → products.id
    product_name  VARCHAR(300)  NOT NULL,              -- Snapshot of name at order time
    hindi_name    VARCHAR(300),                        -- Snapshot of hindi name at order time
    shop_name     VARCHAR(200)  NOT NULL,              -- Snapshot of shop name
    unit          VARCHAR(50)   NOT NULL,              -- Snapshot of unit (e.g. '1 kg')
    unit_price    DECIMAL(10,2) NOT NULL,              -- Price per unit at time of order
    quantity      INT           NOT NULL,
    line_total    DECIMAL(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    CONSTRAINT fk_order_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id)  ON DELETE RESTRICT,
    INDEX idx_order_items_order   (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Important**: All name/price fields in `order_items` are **snapshots** taken at the moment the order is placed. This ensures order history is preserved even if the product is later edited or deleted.

---

### 5.10 Table: `delivery_boys`

Delivery partners assigned to fulfill orders.

```sql
CREATE TABLE delivery_boys (
    id           BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150)  NOT NULL,              -- e.g. 'Ramesh Yadav'
    phone        VARCHAR(15)   NOT NULL UNIQUE,       -- e.g. '9452018293'
    vehicle      VARCHAR(100)  NOT NULL,              -- e.g. 'Hero Splendor (UP 47 AB 1234)'
    photo_url    VARCHAR(500),                        -- Profile photo URL
    rating       DECIMAL(3,2)  NOT NULL DEFAULT 4.90,
    delivery_count INT         NOT NULL DEFAULT 0,    -- e.g. '520+ deliveries'
    is_available TINYINT(1)   NOT NULL DEFAULT 1,
    is_active    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_delivery_boys_available (is_available, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Seed Data (default delivery partner from frontend):**

| name | phone | vehicle | rating | delivery_count |
|---|---|---|---|---|
| Ramesh Yadav | 9452018293 | Hero Splendor (UP 47 AB 1234) | 4.9 | 520 |

---

### 5.11 Table: `shop_users`

Login credentials for shop dashboard users (merchants).

```sql
CREATE TABLE shop_users (
    id           BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    shop_id      VARCHAR(20)   NOT NULL UNIQUE,       -- FK → shops.id (one user per shop)
    username     VARCHAR(100)  NOT NULL UNIQUE,       -- Login username (email or phone)
    password_hash VARCHAR(255) NOT NULL,              -- BCrypt hashed password
    role         ENUM('SHOP_OWNER', 'SHOP_MANAGER') NOT NULL DEFAULT 'SHOP_OWNER',
    last_login   TIMESTAMP,
    is_active    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shop_user_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    INDEX idx_shop_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5.12 Table: `hourly_sales`

Stores hourly aggregated sales data per shop for the dashboard bar chart.

```sql
CREATE TABLE hourly_sales (
    id          BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    shop_id     VARCHAR(20)   NOT NULL,               -- FK → shops.id
    sale_date   DATE          NOT NULL,               -- e.g. '2026-10-26'
    hour_slot   VARCHAR(10)   NOT NULL,               -- e.g. '08:00', '10:00', '12:00'
    order_count INT           NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_hourly_sales_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    UNIQUE KEY uk_shop_date_hour (shop_id, sale_date, hour_slot),
    INDEX idx_hourly_shop_date (shop_id, sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Default hourly slots** (from frontend mock data):

| hour_slot | typical_orders | typical_amount |
|---|---|---|
| 08:00 | 2 | ₹480 |
| 10:00 | 5 | ₹1,240 |
| 12:00 | 4 | ₹960 |
| 14:00 | 3 | ₹890 |
| 16:00 | 2 | ₹520 |
| 18:00 | 6 | ₹1,680 (Peak) |
| 20:00 | 4 | ₹1,120 |

---

### 5.13 Table: `refresh_tokens`

JWT refresh token store for authenticated sessions.

```sql
CREATE TABLE refresh_tokens (
    id           BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT        NOT NULL,              -- FK → shop_users.id
    token        VARCHAR(500)  NOT NULL UNIQUE,
    expires_at   TIMESTAMP     NOT NULL,
    revoked      TINYINT(1)   NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_shop_user FOREIGN KEY (user_id) REFERENCES shop_users(id) ON DELETE CASCADE,
    INDEX idx_refresh_token (token),
    INDEX idx_refresh_user  (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. Entity Relationships (ERD Overview)

```
categories (1) ──────────< products (M)
shops (1) ───────────────< products (M)
shops (1) ───────────────< orders (M)
shops (1) ───────────────< shop_users (1)
shops (1) ───────────────< hourly_sales (M)
customers (1) ───────────< orders (M)
customers (1) ───────────< delivery_addresses (M)
orders (1) ──────────────< order_items (M)
products (1) ────────────< order_items (M)
delivery_boys (1) ───────< orders (M)
shop_users (1) ──────────< refresh_tokens (M)
```

---

## 7. REST API Endpoints — Customer Store

Base URL: `http://localhost:8080/api/v1`

### 7.1 Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | Get all categories with item counts |

**Response `GET /categories`:**
```json
[
  {
    "id": "fruits-vegetables",
    "name": "Fruits & Vegetables",
    "icon": "Apple",
    "color": "#f5f5f5",
    "badge": "Mandi Fresh",
    "itemCount": 48
  }
]
```

---

### 7.2 Localities

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/localities` | Get all active delivery localities |

**Response:**
```json
[
  { "id": 1, "name": "Civil Lines" },
  { "id": 2, "name": "Veer Vinay Chowk" }
]
```

---

### 7.3 Shops

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/shops` | Get all active shops (with ratings, delivery info) |
| `GET` | `/shops/{shopId}` | Get single shop by ID |
| `GET` | `/shops/{shopId}/products` | Get products for a specific shop |

**Query Params for `GET /shops`:**
- `locality` (optional) — filter shops serving a specific locality

**Response `GET /shops`:**
```json
[
  {
    "id": "shop-1",
    "name": "Gupta Ji Kirana & General Store",
    "area": "Station Road",
    "deliveryTime": "15-20 mins",
    "rating": 4.8,
    "reviewCount": 420,
    "distance": "1.1 km",
    "minOrder": 99,
    "imageUrl": "https://...",
    "tag": "DailyGrocer Top Seller",
    "isOpen": true
  }
]
```

---

### 7.4 Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | Get all available products (with filters) |
| `GET` | `/products/{productId}` | Get single product details |
| `GET` | `/products/search` | Full-text search (English + Hindi) |

**Query Params for `GET /products`:**

| Param | Type | Description |
|---|---|---|
| `category` | `String` | Category ID filter (e.g. `fruits-vegetables`) |
| `shopId` | `String` | Filter by shop |
| `q` | `String` | Search query (name, hindi name, shop name) |
| `inStock` | `Boolean` | Only in-stock products (default: `true`) |
| `page` | `Integer` | Page number (0-indexed, default: 0) |
| `size` | `Integer` | Page size (default: 25) |

**Response `GET /products`:**
```json
{
  "content": [
    {
      "id": "p-1",
      "name": "Fresh Red Hybrid Tomatoes (Tamatar)",
      "hindiName": "देसी हाइब्रिड लाल टमाटर",
      "category": "fruits-vegetables",
      "shopId": "shop-2",
      "shopName": "Awadh Fresh Mandi",
      "price": 36,
      "originalPrice": 48,
      "discountPercentage": 25,
      "weight": "1 kg",
      "imageUrl": "https://...",
      "description": "Juicy, farm-fresh red ripe tomatoes...",
      "inStock": true,
      "tag": "Farm Fresh",
      "rating": 4.8
    }
  ],
  "totalElements": 25,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### 7.5 Coupons

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/coupons/validate` | Validate a coupon code and return discount amount |

**Request Body:**
```json
{
  "code": "DailyGrocer50",
  "cartSubtotal": 250.00
}
```

**Response:**
```json
{
  "valid": true,
  "discountType": "FLAT",
  "discountValue": 50.00,
  "message": "🎉 Flat ₹50 OFF Coupon Applied!"
}
```

**Error Response (invalid coupon):**
```json
{
  "valid": false,
  "message": "Invalid or expired coupon code."
}
```

---

### 7.6 Orders (Customer)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders/{orderId}` | Get order details and current status |

**Request Body `POST /orders`:**
```json
{
  "shopId": "shop-1",
  "customerName": "Aditya Srivastava",
  "customerPhone": "9839123456",
  "deliveryAddress": {
    "streetAddress": "House No. B-42, Near Nagar Palika Road",
    "locality": "Civil Lines",
    "landmark": "Behind City Hospital",
    "instructions": "Please call once rider reaches the colony gate"
  },
  "items": [
    {
      "productId": "p-1",
      "quantity": 2
    },
    {
      "productId": "p-7",
      "quantity": 1
    }
  ],
  "paymentMethod": "UPI_DELIVERY",
  "deliverySlot": "INSTANT",
  "couponCode": "DailyGrocer50"
}
```

**Response `POST /orders`:**
```json
{
  "orderId": "BLR-2050",
  "status": "PENDING",
  "itemTotal": 167.00,
  "deliveryFee": 0.00,
  "packagingCharge": 5.00,
  "couponDiscount": 50.00,
  "totalAmount": 122.00,
  "paymentMethod": "UPI_DELIVERY",
  "placedAt": "02:51 PM",
  "estimatedDeliveryTime": "03:11 PM",
  "deliveryBoy": {
    "name": "Ramesh Yadav",
    "phone": "+91 94520 18293",
    "vehicle": "Hero Splendor (UP 47 AB 1234)",
    "photoUrl": "https://..."
  }
}
```

**Business Logic on `POST /orders`:**
1. Validate all product IDs exist and are `in_stock = true`
2. Validate shop is open (`is_open = true`)
3. Validate cart subtotal ≥ shop's `min_order_value`
4. Validate and apply coupon if provided (increment `usage_count`)
5. Calculate: `item_total`, `delivery_fee` (free if subtotal ≥ 199, else ₹25), `packaging_charge = 5`
6. Generate unique order ID in format `BLR-{sequentialNumber}`
7. Assign available delivery boy (auto-assign based on `is_available = true`)
8. Set `estimated_delivery_time = NOW() + 20 minutes`
9. Insert into `orders` and `order_items` tables
10. Update `hourly_sales` (aggregate for current hour slot)
11. Decrement stock for each ordered product

---

### 7.7 Delivery Boys

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/delivery-boys/{id}` | Get delivery boy info (for order confirmation screen) |

---

## 8. REST API Endpoints — Shop Dashboard

All shop dashboard endpoints require JWT Bearer token authentication.

Base URL: `http://localhost:8080/api/v1/shop`

### 8.1 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Shop owner login — returns JWT access + refresh tokens |
| `POST` | `/auth/refresh` | Refresh access token using refresh token |
| `POST` | `/auth/logout` | Revoke refresh token |

**Request Body `POST /auth/login`:**
```json
{
  "username": "ramesh.gupta@okaxis",
  "password": "Gupta@2024"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresIn": 3600,
  "shopId": "shop-1",
  "shopName": "Gupta Ji Kirana & General Store",
  "ownerName": "Ramesh Chandra Gupta"
}
```

---

### 8.2 Shop Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get current shop's profile |
| `PUT` | `/profile` | Update shop profile details |
| `PATCH` | `/profile/status` | Toggle shop open/closed status |

**Request Body `PUT /profile`:**
```json
{
  "shopName": "Gupta Ji Kirana & General Store",
  "hindiShopName": "गुप्ता जी किराना एवं जनरल स्टोर",
  "ownerName": "Ramesh Chandra Gupta",
  "phone": "+91 98391 24567",
  "alternatePhone": "+91 5263 234120",
  "email": "guptaji.kirana@dailygrocer.in",
  "address": "Shop No. 14, Station Road, Near Railway Crossing",
  "landmark": "Opposite PNB ATM & Cycle Stand",
  "locality": "Station Road",
  "pincode": "271201",
  "deliveryRadius": "3.5 km",
  "openingHours": "07:00 AM – 10:00 PM (Everyday)",
  "upiId": "ramesh.gupta@okaxis",
  "fssaiNumber": "22724589000142",
  "minOrderValue": 99,
  "avgPreparationTime": "8 – 12 mins"
}
```

**Request Body `PATCH /profile/status`:**
```json
{ "isOpen": false }
```

---

### 8.3 Products (Shop Dashboard CRUD)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List all products for authenticated shop |
| `POST` | `/products` | Add new product to shop catalog |
| `PUT` | `/products/{productId}` | Edit existing product |
| `DELETE` | `/products/{productId}` | Soft-delete product (sets `is_active = 0`) |
| `PATCH` | `/products/{productId}/availability` | Toggle in-stock / out-of-stock |

**Query Params for `GET /products` (Shop Dashboard):**

| Param | Type | Description |
|---|---|---|
| `category` | `String` | Filter by category name (e.g. `Fruits & Vegetables`) |
| `q` | `String` | Search by name, hindi name, or SKU |
| `inStock` | `Boolean` | Filter: all / in-stock / out-of-stock |

**Request Body `POST /products` and `PUT /products/{id}`:**
```json
{
  "name": "Fresh Red Hybrid Tomatoes (Tamatar)",
  "hindiName": "देसी हाइब्रिड लाल टमाटर",
  "category": "Fruits & Vegetables",
  "price": 36.00,
  "originalPrice": 48.00,
  "stock": 45,
  "unit": "1 kg",
  "description": "Juicy, farm-fresh red tomatoes sourced directly from local farmers.",
  "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
  "inStock": true
}
```

**Response `POST /products`:**
```json
{
  "id": "prod-1234",
  "sku": "SKU-5821",
  "name": "Fresh Red Hybrid Tomatoes (Tamatar)",
  "category": "Fruits & Vegetables",
  "price": 36.00,
  "originalPrice": 48.00,
  "discountPercentage": 25,
  "stock": 45,
  "unit": "1 kg",
  "inStock": true,
  "createdAt": "2026-10-26T15:00:00"
}
```

**SKU Generation**: Auto-generated by backend using format `SKU-{4-digit-random}`.

**Request Body `PATCH /products/{id}/availability`:**
```json
{ "inStock": false }
```

---

### 8.4 Orders (Shop Dashboard)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/orders` | List all orders for the shop (with filters) |
| `GET` | `/orders/{orderId}` | Get full order details with all items (for packing slip) |
| `PATCH` | `/orders/{orderId}/status` | Update order status |

**Query Params for `GET /orders` (Shop Dashboard):**

| Param | Type | Description |
|---|---|---|
| `status` | `String` | Filter: `PENDING`, `PREPARING`, `OUT_FOR_DELIVERY`, `COMPLETED`, `CANCELLED` |
| `q` | `String` | Search by order ID, customer name, phone, or locality |
| `date` | `String` | Filter by date (ISO format: `2026-10-26`) |
| `page` | `Integer` | Pagination page (default: 0) |
| `size` | `Integer` | Page size (default: 20) |

**Response `GET /orders`:**
```json
{
  "content": [
    {
      "id": "BLR-2049",
      "customerName": "Anil Kumar Tiwari",
      "customerPhone": "+91 94150 78219",
      "deliveryAddress": "House 42, Civil Lines, Near DM Residence",
      "locality": "Civil Lines",
      "orderTime": "8 mins ago (02:43 PM)",
      "status": "PENDING",
      "items": [
        {
          "productName": "Fresh Red Hybrid Tomatoes",
          "hindiName": "देसी हाइब्रिड लाल टमाटर",
          "quantity": 2,
          "unit": "1 kg",
          "unitPrice": 36.00
        }
      ],
      "itemTotal": 211.00,
      "deliveryFee": 15.00,
      "totalAmount": 226.00,
      "paymentMethod": "UPI_DELIVERY",
      "notes": "Please pick red ripe tomatoes, no soft ones."
    }
  ],
  "totalElements": 8,
  "totalPages": 1
}
```

**Request Body `PATCH /orders/{orderId}/status`:**
```json
{ "status": "PREPARING" }
```

**Valid Status Transitions (enforced by backend):**
```
PENDING → PREPARING      (Accept & Prepare)
PREPARING → OUT_FOR_DELIVERY  (Dispatch Order)
OUT_FOR_DELIVERY → COMPLETED  (Mark Delivered)
PENDING → CANCELLED
PREPARING → CANCELLED
```

---

### 8.5 Overview / Dashboard Metrics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/overview/metrics` | Get summary metric counts for the Overview tab |
| `GET` | `/overview/hourly-sales` | Get hourly sales bar chart data |

**Response `GET /overview/metrics`:**
```json
{
  "totalProducts": 15,
  "activeProducts": 14,
  "lowStockProducts": 3,
  "pendingOrders": 2,
  "unconfirmedOrders": 1,
  "inPackingOrders": 1,
  "completedOrdersToday": 5,
  "totalSalesToday": 3248.00,
  "totalOrdersToday": 8
}
```

**Response `GET /overview/hourly-sales`:**
```json
[
  { "hour": "08:00", "orders": 2, "amount": 480.00 },
  { "hour": "10:00", "orders": 5, "amount": 1240.00 },
  { "hour": "12:00", "orders": 4, "amount": 960.00 },
  { "hour": "14:00", "orders": 3, "amount": 890.00 },
  { "hour": "16:00", "orders": 2, "amount": 520.00 },
  { "hour": "18:00", "orders": 6, "amount": 1680.00 },
  { "hour": "20:00", "orders": 4, "amount": 1120.00 }
]
```

---

## 9. Business Logic & Rules

### 9.1 Cart & Pricing Computation

```
Subtotal       = SUM(product.price × quantity)  for all cart items
Delivery Fee   = (Subtotal >= 199) ? 0 : 25     [in INR]
Packaging Fee  = 5                               [flat INR, always applied]
Coupon Discount= coupon.discountValue            [if valid coupon applied]
Final Total    = MAX(0, Subtotal + Delivery + Packaging - Coupon)
```

### 9.2 Product Availability Rules

A product is shown as **available** to customers only when ALL of the following are true:
- `products.is_active = 1`
- `products.in_stock = 1`
- `products.stock > 0`
- `shops.is_open = 1`
- `shops.is_active = 1`

### 9.3 Low Stock Alert Rule

In the Shop Dashboard Overview panel, products appearing in the **Low Stock Alert** box must satisfy:
```sql
WHERE (stock <= 20 OR in_stock = 0) AND is_active = 1
```

### 9.4 Order ID Generation

```java
// Format: BLR-{4-digit sequential number}
// Starting from BLR-1000
// Stored in DB as VARCHAR primary key
// New ID = "BLR-" + String.format("%04d", lastNumericId + 1)
```

Alternatively, use a dedicated `order_sequences` table:
```sql
CREATE TABLE order_sequences (
    shop_id   VARCHAR(20) NOT NULL PRIMARY KEY,
    last_seq  INT         NOT NULL DEFAULT 1000,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
```

### 9.5 Category Item Count Update

After every product add / delete / `is_active` change, update `categories.item_count`:
```sql
UPDATE categories c
SET item_count = (
    SELECT COUNT(*) FROM products p
    WHERE p.category_id = c.id
    AND p.is_active = 1 AND p.in_stock = 1 AND p.stock > 0
)
WHERE c.id = :categoryId;
```

This can be implemented as a Spring `@TransactionalEventListener` triggered after product operations.

---

## 10. Coupon & Discount Engine

### 10.1 Validation Logic (Service Layer)

```java
public CouponValidationResult validateCoupon(String code, BigDecimal cartSubtotal) {
    Coupon coupon = couponRepository.findByCodeAndIsActive(code, true)
        .orElseThrow(() -> new InvalidCouponException("Invalid or expired coupon."));

    if (coupon.getValidUntil().isBefore(LocalDateTime.now())) {
        throw new InvalidCouponException("Coupon has expired.");
    }
    if (coupon.getUsageCount() >= coupon.getUsageLimit()) {
        throw new InvalidCouponException("Coupon usage limit reached.");
    }
    if (cartSubtotal.compareTo(coupon.getMinOrderValue()) < 0) {
        throw new InvalidCouponException(
            "Minimum order of ₹" + coupon.getMinOrderValue() + " required for this coupon."
        );
    }

    BigDecimal discount = coupon.getDiscountType() == DiscountType.FLAT
        ? coupon.getDiscountValue()
        : cartSubtotal.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));

    if (coupon.getMaxDiscountCap() != null) {
        discount = discount.min(coupon.getMaxDiscountCap());
    }

    return new CouponValidationResult(true, discount, "Coupon applied!");
}
```

### 10.2 Pre-configured Valid Coupon Codes

| Code | Type | Value | Min Order | Expiry |
|---|---|---|---|---|
| `DailyGrocer50` | FLAT | ₹50 | ₹0 | Far future |
| `FIRST50` | FLAT | ₹50 | ₹0 | Far future |
| `WELCOME20` | FLAT | ₹20 | ₹0 | Far future |

---

## 11. Order Lifecycle & Status Machine

```
                  ┌─────────────────────────────────────────────────┐
                  │                                                 │
   [Customer]     │   PENDING ──► PREPARING ──► OUT_FOR_DELIVERY   │
   Places Order   │      │                           │             │
                  │      │                           ▼             │
                  │      └──► CANCELLED         COMPLETED          │
                  └─────────────────────────────────────────────────┘
```

**Status Enum Values (exactly as stored in DB):**
```
PENDING           — Order received, awaiting shop acceptance
PREPARING         — Shop accepted & packing items
OUT_FOR_DELIVERY  — Delivery boy dispatched with packed items
COMPLETED         — Delivered to customer
CANCELLED         — Cancelled by shop or customer
```

**Status Labels (customer-facing display):**

| DB Status | Customer Display | Shop Dashboard Display |
|---|---|---|
| `PENDING` | "Order Confirmed" | "Pending" |
| `PREPARING` | "Store Packing Items" | "Preparing" |
| `OUT_FOR_DELIVERY` | "Out for Delivery" | "Out for Delivery" |
| `COMPLETED` | "Delivered" | "Completed" |
| `CANCELLED` | "Order Cancelled" | "Cancelled" |

---

## 12. Delivery Boy Assignment Logic

When an order is placed with `INSTANT` delivery slot:

```java
public DeliveryBoy assignDeliveryBoy() {
    return deliveryBoyRepository
        .findFirstByIsAvailableTrueAndIsActiveTrueOrderByIdAsc()
        .orElseThrow(() -> new ServiceException("No delivery partner available right now."));
}
```

On successful assignment:
- Set `delivery_boy.is_available = false` temporarily (until order is `COMPLETED`)
- Set `orders.delivery_boy_id = deliveryBoy.id`
- Set `orders.estimated_delivery_time = NOW() + 20 minutes`

---

## 13. Spring Boot Project Structure

```
dailygrocer-backend/
├── src/
│   ├── main/
│   │   ├── java/in/dailygrocer/
│   │   │   ├── DailyGrocerApplication.java           ← @SpringBootApplication entry
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java             ← JWT security filter chain
│   │   │   │   ├── CorsConfig.java                 ← CORS for React frontends
│   │   │   │   ├── SwaggerConfig.java              ← SpringDoc OpenAPI config
│   │   │   │   └── CacheConfig.java                ← Caffeine cache setup
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── CategoryController.java         ← GET /api/v1/categories
│   │   │   │   ├── LocalityController.java         ← GET /api/v1/localities
│   │   │   │   ├── ShopController.java             ← GET /api/v1/shops
│   │   │   │   ├── ProductController.java          ← GET /api/v1/products (public)
│   │   │   │   ├── CouponController.java           ← POST /api/v1/coupons/validate
│   │   │   │   ├── OrderController.java            ← POST /api/v1/orders (public)
│   │   │   │   ├── DeliveryBoyController.java
│   │   │   │   └── shop/
│   │   │   │       ├── AuthController.java         ← POST /api/v1/shop/auth/login
│   │   │   │       ├── ShopProfileController.java  ← GET/PUT /api/v1/shop/profile
│   │   │   │       ├── ShopProductController.java  ← CRUD /api/v1/shop/products
│   │   │   │       ├── ShopOrderController.java    ← GET/PATCH /api/v1/shop/orders
│   │   │   │       └── OverviewController.java     ← GET /api/v1/shop/overview
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── CategoryService.java
│   │   │   │   ├── LocalityService.java
│   │   │   │   ├── ShopService.java
│   │   │   │   ├── ProductService.java
│   │   │   │   ├── CouponService.java
│   │   │   │   ├── OrderService.java               ← Core order placement logic
│   │   │   │   ├── DeliveryBoyService.java
│   │   │   │   ├── HourlySalesService.java
│   │   │   │   ├── OverviewService.java
│   │   │   │   └── auth/
│   │   │   │       ├── AuthService.java
│   │   │   │       └── JwtService.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── LocalityRepository.java
│   │   │   │   ├── ShopRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── CouponRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── OrderItemRepository.java
│   │   │   │   ├── DeliveryBoyRepository.java
│   │   │   │   ├── HourlySalesRepository.java
│   │   │   │   ├── ShopUserRepository.java
│   │   │   │   └── RefreshTokenRepository.java
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── Category.java
│   │   │   │   ├── Locality.java
│   │   │   │   ├── Shop.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── Coupon.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Customer.java
│   │   │   │   ├── DeliveryAddress.java
│   │   │   │   ├── DeliveryBoy.java
│   │   │   │   ├── HourlySales.java
│   │   │   │   ├── ShopUser.java
│   │   │   │   └── RefreshToken.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── PlaceOrderRequest.java
│   │   │   │   │   ├── ValidateCouponRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── SaveProductRequest.java
│   │   │   │   │   └── UpdateOrderStatusRequest.java
│   │   │   │   └── response/
│   │   │   │       ├── CategoryResponse.java
│   │   │   │       ├── ShopResponse.java
│   │   │   │       ├── ProductResponse.java
│   │   │   │       ├── OrderResponse.java
│   │   │   │       ├── OrderConfirmationResponse.java
│   │   │   │       ├── CouponValidationResponse.java
│   │   │   │       ├── OverviewMetricsResponse.java
│   │   │   │       ├── HourlySalesResponse.java
│   │   │   │       └── AuthResponse.java
│   │   │   │
│   │   │   ├── enums/
│   │   │   │   ├── OrderStatus.java
│   │   │   │   ├── PaymentMethod.java
│   │   │   │   ├── PaymentStatus.java
│   │   │   │   ├── DeliverySlot.java
│   │   │   │   └── DiscountType.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java     ← @ControllerAdvice
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── InvalidCouponException.java
│   │   │   │   ├── InsufficientStockException.java
│   │   │   │   ├── ShopClosedException.java
│   │   │   │   └── InvalidStatusTransitionException.java
│   │   │   │
│   │   │   └── security/
│   │   │       ├── JwtAuthenticationFilter.java
│   │   │       ├── JwtTokenProvider.java
│   │   │       └── ShopUserDetailsService.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/migration/
│   │           ├── V1__create_initial_schema.sql
│   │           ├── V2__create_auth_tables.sql
│   │           └── V3__seed_data.sql
│   │
│   └── test/
│       └── java/in/dailygrocer/
│           ├── service/
│           │   ├── OrderServiceTest.java
│           │   ├── CouponServiceTest.java
│           │   └── ProductServiceTest.java
│           └── controller/
│               ├── ProductControllerTest.java
│               └── OrderControllerTest.java
│
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

---

## 14. Security & Authentication

### 14.1 Public Endpoints (No Auth Required)

The following endpoints are accessible without JWT token (used by customer store):

```
GET  /api/v1/categories
GET  /api/v1/localities
GET  /api/v1/shops
GET  /api/v1/shops/{shopId}
GET  /api/v1/shops/{shopId}/products
GET  /api/v1/products
GET  /api/v1/products/{productId}
GET  /api/v1/products/search
POST /api/v1/coupons/validate
POST /api/v1/orders
GET  /api/v1/orders/{orderId}
```

### 14.2 Protected Endpoints (JWT Required)

All `/api/v1/shop/**` endpoints require a valid JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### 14.3 JWT Configuration

```properties
# JWT
jwt.secret=DailyGrocer@ExpressMart#SecretKey2024!JWTSigningSecretMustBe256BitsLong
jwt.access-token-expiry=3600000    # 1 hour in ms
jwt.refresh-token-expiry=604800000 # 7 days in ms
```

### 14.4 CORS Configuration

Both React frontends run on different ports during development:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",    // customer-store (Vite default)
        "http://localhost:5174",    // shop-dashboard (Vite alternate)
        "http://localhost:3000"     // alternative dev port
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
    config.setAllowCredentials(true);
    // ...
}
```

---

## 15. Application Configuration (application.properties)

```properties
# ============================================================
# DailyGrocer — Spring Boot Configuration
# ============================================================

## Application Info
spring.application.name=dailygrocer-backend
server.port=8080
server.servlet.context-path=/

## Database
spring.datasource.url=jdbc:mysql://localhost:3306/dailygrocer?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=blr_app_user
spring.datasource.password=BlrSecure@2024!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

## HikariCP Connection Pool
spring.datasource.hikari.pool-name=DailyGrocerHikariPool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.max-lifetime=1800000

## JPA / Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

## Flyway Migration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

## JWT
jwt.secret=DailyGrocer@ExpressMart#SecretKey2024!JWTSigningSecretMustBe256BitsLong
jwt.access-token-expiry=3600000
jwt.refresh-token-expiry=604800000

## Logging
logging.level.root=WARN
logging.level.in.dailygrocer=INFO
logging.level.org.springframework.security=WARN

## Swagger / OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method

## Timezone (India)
spring.jackson.time-zone=Asia/Kolkata
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss

## Free Delivery Threshold (configurable)
app.delivery.free-threshold=199
app.delivery.charge=25
app.delivery.packaging-charge=5
app.order.low-stock-threshold=20
app.order.eta-minutes=20
```

---

## 16. Seed Data Reference

### 16.1 All 25 Products (From Customer Store Frontend)

| ID | Name | Category | Shop | Price | MRP | SKU |
|---|---|---|---|---|---|---|
| p-1 | Fresh Red Hybrid Tomatoes | fruits-vegetables | shop-2 | ₹36 | ₹48 | VEG-TOM-01 |
| p-2 | Fresh Green Palak / Spinach | fruits-vegetables | shop-2 | ₹22 | ₹30 | VEG-PLK-02 |
| p-3 | Nashik Red Onions (Pyaaz) | fruits-vegetables | shop-2 | ₹34 | ₹42 | VEG-ONN-03 |
| p-4 | Himachali Royal Delicious Apples | fruits-vegetables | shop-2 | ₹139 | ₹175 | — |
| p-5 | Fresh Green Coriander (Dhaniya) | fruits-vegetables | shop-2 | ₹15 | ₹20 | — |
| p-6 | Amul Taaza Homogenised Toned Milk | dairy-eggs | shop-3 | ₹56 | ₹56 | DRY-MLK-04 |
| p-7 | Fresh Desi Malai Paneer | dairy-eggs | shop-3 | ₹95 | ₹115 | DRY-PNR-05 |
| p-8 | Amul Pasteurised Salted Butter | dairy-eggs | shop-1 | ₹58 | ₹62 | DRY-BTR-06 |
| p-9 | Mother Dairy Classic Dahi / Curd | dairy-eggs | shop-3 | ₹35 | ₹38 | — |
| p-10 | Farm Fresh White Eggs (Crate of 6) | dairy-eggs | shop-3 | ₹46 | ₹54 | — |
| p-11 | Aashirvaad Shudh Chakki Whole Wheat Atta | staples | shop-1 | ₹242 | ₹285 | STP-ATT-07 |
| p-12 | Fortune Kachi Ghani Pure Mustard Oil | staples | shop-1 | ₹142 | ₹170 | STP-OIL-08 |
| p-13 | Tata Sampann Unpolished Toor Dal | staples | shop-4 | ₹158 | ₹185 | STP-DAL-09 |
| p-14 | India Gate Feast Rozzana Basmati Rice | staples | shop-4 | ₹125 | ₹155 | STP-RIC-10 |
| p-15 | Tata Salt Vacuum Evaporated Iodised | staples | shop-1 | ₹27 | ₹30 | — |
| p-16 | Haldiram's Nagpur Aloo Bhujia | snacks | shop-5 | ₹92 | ₹110 | SNK-BHU-11 |
| p-17 | Maggi 2-Minute Masala Instant Noodles | snacks | shop-1 | ₹54 | ₹60 | SNK-MAG-12 |
| p-18 | Parle-G Gold Glucose Biscuits | snacks | shop-1 | ₹75 | ₹85 | — |
| p-19 | DailyGrocer Special Khasta Samosa (2 pcs) | snacks | shop-5 | ₹30 | ₹40 | — |
| p-20 | Brooke Bond Red Label Tea | beverages | shop-1 | ₹155 | ₹175 | BEV-TEA-13 |
| p-21 | Thums Up Charged Carbonated Drink | beverages | shop-4 | ₹40 | ₹40 | — |
| p-22 | Real Fruit Power Mixed Fruit Juice | beverages | shop-4 | ₹112 | ₹135 | — |
| p-23 | Dettol Original Germ Protection Bathing Soap | personal-care | shop-1 | ₹139 | ₹165 | HOM-DET-14 |
| p-24 | Colgate Strong Teeth Dental Cream | personal-care | shop-4 | ₹105 | ₹125 | — |
| p-25 | Surf Excel Quick Wash Detergent Powder | personal-care | shop-1 | ₹138 | ₹155 | HOM-SRF-15 |

### 16.2 Sample Orders to Seed (From Shop Dashboard Frontend)

| Order ID | Customer | Locality | Status | Amount | Payment |
|---|---|---|---|---|---|
| BLR-2049 | Anil Kumar Tiwari | Civil Lines | PENDING | ₹226 | UPI_DELIVERY |
| BLR-2048 | Pooja Srivastava | Veer Vinay Chowk | PENDING | ₹442 | COD |
| BLR-2047 | Mohd. Salim Khan | Purani Bazar | PREPARING | ₹516 | ONLINE_PREPAID |
| BLR-2046 | Dr. R.K. Mishra | Hospital Road | PREPARING | ₹374 | COD |
| BLR-2045 | Sunita Verma | Pahalwara | OUT_FOR_DELIVERY | ₹258 | UPI_DELIVERY |
| BLR-2044 | Vikas Pandey | Bhagwati Ganj | COMPLETED | ₹800 | ONLINE_PREPAID |
| BLR-2043 | Geeta Agarwal | Station Road | COMPLETED | ₹474 | COD |
| BLR-2042 | Shyam Sundar Jaiswal | Civil Lines | COMPLETED | ₹564 | UPI_DELIVERY |

### 16.3 Delivery Coverage Areas (from StoreProfile component)

```
Station Road & Railway Colony
Veer Vinay Chowk / Chauraha
Civil Lines (DM & Judge Residence)
Pahalwara Ward & Market
Purani Bazar & Clock Tower
Bhagwati Ganj (Ward 7 & 8)
Hospital Road & District Hospital
Peepal Tiraha & Bus Station
```

---

## 📝 Additional Notes for Backend Developer

1. **Character Encoding**: All API responses must use `UTF-8` encoding. The `Content-Type` response header must always include `charset=utf-8` to correctly display Hindi (Devanagari) text like `देसी हाइब्रिड लाल टमाटर`.

2. **Price Precision**: All monetary values must use `DECIMAL(10,2)` in MySQL and `BigDecimal` in Java. Never use `float` or `double` for money.

3. **Snapshot Pattern in Order Items**: When creating an order, always copy `product.name`, `product.hindi_name`, `product.price`, and `product.unit` into the `order_items` row. This preserves billing accuracy even if products are later edited.

4. **Pagination**: All list endpoints that return potentially large collections (`/products`, `/orders`) must support pagination using Spring's `Pageable` (`page`, `size`, `sort` query params).

5. **Soft Delete**: Products and Shops must NEVER be hard-deleted. Use `is_active = 0` flags. This preserves historical order references.

6. **Product Search**: The full-text search across `name` AND `hindi_name` columns must support bilingual queries. Use MySQL `FULLTEXT` index for `MATCH … AGAINST` queries, OR implement `LIKE '%query%'` for simpler setup.

7. **Shop `isOpen` Toggle**: The `PATCH /api/v1/shop/profile/status` endpoint is critical. It's available from the Sidebar footer AND the TopBar in the shop dashboard. It instantly enables or disables customer order placement for that shop.

8. **Hourly Sales Aggregation**: When an order is placed or its status changes to `COMPLETED`, update the `hourly_sales` record for the current date and hour slot using `INSERT ... ON DUPLICATE KEY UPDATE`.

9. **Stock Decrement**: When an order is placed (`POST /api/v1/orders`), decrement `products.stock` for each ordered product using an atomic SQL update:
   ```sql
   UPDATE products SET stock = stock - :quantity WHERE id = :productId AND stock >= :quantity;
   ```
   If the result is 0 rows updated, throw `InsufficientStockException`.

10. **Timezone**: The entire backend operates in `Asia/Kolkata` (IST, UTC+5:30). All `TIMESTAMP` columns store UTC; display conversion to IST is handled in responses via Jackson's timezone config.

---

*Document generated from full source code analysis of both frontend screens: `customer-store/` and `shop-dashboard/` of the DailyGrocer prototype.*  
*Last Updated: October 26, 2026*
