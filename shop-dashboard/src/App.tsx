import { useState, useCallback } from 'react';
import type { 
  TabType, 
  Product, 
  Order, 
  OrderStatus, 
  StoreProfile as StoreProfileType, 
  ToastMessage 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_STORE_PROFILE 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './components/Overview';
import { Products } from './components/Products';
import { Orders } from './components/Orders';
import { StoreProfile } from './components/StoreProfile';
import { ProductModal } from './components/ProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { Toast } from './components/Toast';
import './App.css';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Core Local State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [storeProfile, setStoreProfile] = useState<StoreProfileType>(INITIAL_STORE_PROFILE);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setProductModalMode('add');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductModalMode('edit');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>, existingId?: string) => {
    if (productModalMode === 'add' || !existingId) {
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now().toString().slice(-4)}`,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
      addToast('Product Added', `"${newProduct.name}" is now listed on your store shelf.`);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === existingId ? { ...productData, id: existingId } : p))
      );
      addToast('Product Updated', `Changes to "${productData.name}" have been saved.`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setDeletingProduct(null);
    addToast('Product Deleted', prod ? `"${prod.name}" was removed from inventory.` : 'Product removed.');
  };

  const handleToggleAvailability = (productId: string, inStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock } : p))
    );
    const prod = products.find((p) => p.id === productId);
    addToast(
      inStock ? 'Item Available' : 'Item Marked Unavailable',
      prod ? `"${prod.name}" status updated.` : undefined
    );
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    addToast('Order Status Updated', `Order #${orderId} moved to "${newStatus}".`);
  };

  // Store Profile Actions
  const handleSaveStoreProfile = (updated: StoreProfileType) => {
    setStoreProfile(updated);
    addToast('Profile Saved', 'Store details and delivery settings updated.');
  };

  const handleStoreStatusToggle = (isOpen: boolean) => {
    setStoreProfile((prev) => ({ ...prev, isOpen }));
    addToast(
      isOpen ? 'Store Now Open' : 'Store Paused',
      isOpen ? 'Accepting customer orders in DailyGrocer.' : 'Customers cannot place orders right now.'
    );
  };

  // Metrics count for navigation badges
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing'
  ).length;

  return (
    <div className="app-container">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        pendingOrdersCount={pendingOrdersCount}
        storeProfile={storeProfile}
        setStoreProfile={setStoreProfile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onStoreStatusToggle={handleStoreStatusToggle}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <TopBar
          storeProfile={storeProfile}
          setIsMobileOpen={setIsMobileOpen}
          pendingOrdersCount={pendingOrdersCount}
          onOpenOrders={() => setActiveTab('orders')}
        />

        <main className="content-area">
          {activeTab === 'overview' && (
            <Overview
              products={products}
              orders={orders}
              setActiveTab={setActiveTab}
              onOpenAddProduct={handleOpenAddProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewOrderDetails={(order) => setViewingOrder(order)}
            />
          )}

          {activeTab === 'products' && (
            <Products
              products={products}
              onOpenAddModal={handleOpenAddProduct}
              onOpenEditModal={handleOpenEditProduct}
              onOpenDeleteModal={(product) => setDeletingProduct(product)}
              onToggleAvailability={handleToggleAvailability}
            />
          )}

          {activeTab === 'orders' && (
            <Orders
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewOrderDetails={(order) => setViewingOrder(order)}
            />
          )}

          {activeTab === 'profile' && (
            <StoreProfile
              storeProfile={storeProfile}
              onSaveProfile={handleSaveStoreProfile}
            />
          )}
        </main>
      </div>

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        mode={productModalMode}
        initialProduct={selectedProduct}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
      />

      {/* Order Packing Slip Modal */}
      <OrderReceiptModal
        order={viewingOrder}
        storeProfile={storeProfile}
        onClose={() => setViewingOrder(null)}
      />

      {/* Floating Action Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
