import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Store, 
  X, 
  Store as StoreIcon 
} from 'lucide-react';
import type { TabType, StoreProfile } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  productCount: number;
  pendingOrdersCount: number;
  storeProfile: StoreProfile;
  setStoreProfile: React.Dispatch<React.SetStateAction<StoreProfile>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onStoreStatusToggle: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  productCount,
  pendingOrdersCount,
  storeProfile,
  isMobileOpen,
  setIsMobileOpen,
  onStoreStatusToggle,
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as TabType,
      label: 'My Products',
      icon: Package,
      badge: productCount,
    },
    {
      id: 'orders' as TabType,
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
    },
    {
      id: 'profile' as TabType,
      label: 'Store Profile',
      icon: Store,
    },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const renderContent = (isMobile = false) => (
    <>
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <StoreIcon size={20} strokeWidth={2.2} />
        </div>
        <div className="brand-details">
          <span className="brand-title">DailyGrocer</span>
          <span className="brand-sub">Shopkeeper Portal</span>
        </div>
        {isMobile && (
          <button 
            type="button" 
            className="btn-icon-only" 
            style={{ marginLeft: 'auto' }} 
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`nav-${item.id}`}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <IconComponent size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="store-status-card">
          <div className="store-status-info">
            <span className="store-status-label">
              {storeProfile.isOpen ? 'Store Active' : 'Store Paused'}
            </span>
            <div className="store-status-indicator">
              <span className={`status-dot ${storeProfile.isOpen ? 'active' : ''}`} />
              <span>{storeProfile.isOpen ? 'Accepting Orders' : 'Offline'}</span>
            </div>
          </div>
          <label className="switch-control" aria-label="Toggle store online status">
            <input
              type="checkbox"
              checked={storeProfile.isOpen}
              onChange={(e) => onStoreStatusToggle(e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar-desktop">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      <div 
        className={`mobile-sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <div className={`mobile-sidebar-drawer ${isMobileOpen ? 'open' : ''}`}>
        {renderContent(true)}
      </div>
    </>
  );
};
