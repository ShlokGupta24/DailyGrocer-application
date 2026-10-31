import { useState, useMemo } from 'react';
import './App.css';
import { CATEGORIES, SHOPS, PRODUCTS_LOCALITIES } from './data/mockData';
import type { Product, CartItem, CheckoutAddress, PaymentMethod, OrderDetails } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryList } from './components/CategoryList';
import { FeaturedShops } from './components/FeaturedShops';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Footer } from './components/Footer';
import { ArrowRight, Check } from 'lucide-react';

export function App() {
  // Navigation & Location State
  const [selectedLocality, setSelectedLocality] = useState<string>(DailyGrocer_LOCALITIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State (pre-populated with 2 authentic items so prototype is lively right away)
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 }, // Fresh Red Hybrid Tomatoes
    { product: PRODUCTS[6], quantity: 1 }, // Fresh Desi Malai Paneer
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState<string>('DailyGrocer50');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(50);

  // Checkout & Order State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<OrderDetails | null>(null);

  // Quick View Product Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart helper maps & numbers
  const cartItemsMap = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((item) => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const isFreeDelivery = cartSubtotal >= 199;
  const deliveryCharge = isFreeDelivery || cart.length === 0 ? 0 : 25;
  const packagingCharge = cart.length === 0 ? 0 : 5;
  const effectiveDiscount = cart.length === 0 ? 0 : appliedDiscount;
  const finalPayableTotal = Math.max(0, cartSubtotal + deliveryCharge + packagingCharge - effectiveDiscount);

  // Cart Actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    if (code === 'DailyGrocer50' || code === 'FIRST50') {
      setCouponCode(code);
      setAppliedDiscount(50);
      showToast('🎉 Flat ₹50 OFF Coupon Applied!');
      return true;
    } else if (code === 'WELCOME20') {
      setCouponCode(code);
      setAppliedDiscount(20);
      showToast('🎉 ₹20 OFF Coupon Applied!');
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
  };

  // Order Placement
  const handlePlaceOrder = (address: CheckoutAddress, paymentMethod: PaymentMethod) => {
    const now = new Date();
    const placedTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Estimated delivery in 20 mins
    const deliveryTime = new Date(now.getTime() + 20 * 60000);
    const etaStr = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: OrderDetails = {
      orderId: `#BLR-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge,
      packagingCharge,
      couponDiscount: effectiveDiscount,
      total: finalPayableTotal,
      address,
      paymentMethod,
      placedAt: placedTimeStr,
      estimatedDeliveryTime: etaStr,
      deliveryBoy: {
        name: 'Ramesh Yadav',
        phone: '+91 94520 18293',
        vehicle: 'Hero Splendor (UP 47 AB 1234)',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      },
    };

    setPlacedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToShopping = () => {
    setPlacedOrder(null);
    setCart([]); // Reset basket for next round
    setSelectedCategory('all');
    setSelectedShopId(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Ready for new grocery orders!');
  };

  // Filtering products based on:
  // 1. Search Query
  // 2. Category selection
  // 3. Shop selection
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesHindi = product.hindiName ? product.hindiName.toLowerCase().includes(query) : false;
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesShop = product.shopName.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesCategory && !matchesShop) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Shop filter
      if (selectedShopId && product.shopId !== selectedShopId) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedShopId]);

  const activeCategoryTitle = useMemo(() => {
    if (selectedCategory === 'all') return 'All Grocery Essentials';
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    return cat ? cat.name : 'Groceries';
  }, [selectedCategory]);

  return (
    <div className="app-root">
      {/* 1. Header */}
      <Header
        cartItemCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocality={selectedLocality}
        onSelectLocality={setSelectedLocality}
        onNavigateHome={() => {
          setPlacedOrder(null);
          setSelectedCategory('all');
          setSelectedShopId(null);
          setSearchQuery('');
        }}
      />

      {/* Main Content Area */}
      <main>
        {placedOrder ? (
          /* 8. Order Confirmation Screen */
          <OrderConfirmation
            order={placedOrder}
            onReturnToShopping={handleReturnToShopping}
          />
        ) : (
          <>
            {/* 2. Hero Banner */}
            <HeroBanner
              onShopCategory={(catId) => {
                setSelectedCategory(catId);
                const section = document.getElementById('products-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreShops={() => {
                const section = document.getElementById('featured-shops-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. Horizontal Category List */}
            <CategoryList
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const section = document.getElementById('products-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              totalProductsCount={PRODUCTS.length}
            />

            {/* 4. Featured Local Shops in DailyGrocer */}
            <FeaturedShops
              shops={SHOPS}
              selectedShopId={selectedShopId}
              onSelectShop={(shopId) => {
                setSelectedShopId(shopId);
                const section = document.getElementById('products-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 5. Product Grid */}
            <ProductGrid
              products={filteredProducts}
              cartItemsMap={cartItemsMap}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              selectedCategoryName={activeCategoryTitle}
              searchQuery={searchQuery}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedShopId(null);
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* 6. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        couponCode={couponCode}
        appliedDiscount={effectiveDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* 7. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        deliveryCharge={deliveryCharge}
        packagingCharge={packagingCharge}
        discount={effectiveDiscount}
        finalTotal={finalPayableTotal}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        quantityInCart={quickViewProduct ? cartItemsMap[quickViewProduct.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Mobile Floating Sticky Bottom Cart Bar */}
      {!placedOrder && totalCartCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="mobile-floating-cart-bar animate-fade">
          <button 
            className="floating-cart-inner"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="floating-cart-left">
              <span className="floating-badge">{totalCartCount} Items</span>
              <span className="floating-price">₹{cartSubtotal}</span>
            </div>
            <div className="floating-cart-right">
              <span>View Cart</span>
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification success">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
