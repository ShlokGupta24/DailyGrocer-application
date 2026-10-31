import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  MapPin, 
  Clock, 
  Package 
} from 'lucide-react';
import type { StoreProfile } from '../types';

interface TopBarProps {
  storeProfile: StoreProfile;
  setIsMobileOpen: (open: boolean) => void;
  pendingOrdersCount: number;
  onOpenOrders: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  storeProfile,
  setIsMobileOpen,
  pendingOrdersCount,
  onOpenOrders,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="shop-identity-wrapper">
          <div>
            <div className="shop-name-title">{storeProfile.shopName}</div>
            <div className="shop-location-badge">
              <MapPin size={11} />
              <span>{storeProfile.locality} • Delivery Radius: {storeProfile.deliveryRadius}</span>
            </div>
          </div>
        </div>

        <div className="demo-chip">
          <span className="demo-chip-pulse" />
          <span>DailyGrocer Merchant Prototype</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications Icon & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="icon-btn"
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            title="Recent Store Notifications"
          >
            <Bell size={18} />
            {pendingOrdersCount > 0 && <span className="notification-dot" />}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <span>Recent Alerts</span>
                <span className="badge badge-green">{pendingOrdersCount} action required</span>
              </div>
              <div
                className="notif-item"
                onClick={() => {
                  setShowNotifications(false);
                  onOpenOrders();
                }}
              >
                <div className="notif-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={14} color="#15803d" />
                  <span>Order #BLR-2049 received</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Anil Kumar Tiwari • Civil Lines (₹226)
                </div>
                <div className="notif-time">8 minutes ago</div>
              </div>

              <div
                className="notif-item"
                onClick={() => {
                  setShowNotifications(false);
                  onOpenOrders();
                }}
              >
                <div className="notif-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#15803d" />
                  <span>Order #BLR-2048 awaiting confirmation</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Pooja Srivastava • Veer Vinay Chowk (₹442)
                </div>
                <div className="notif-time">22 minutes ago</div>
              </div>

              <div style={{ padding: '10px 16px', background: '#f8fafc', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenOrders();
                  }}
                >
                  View All Orders
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Owner Profile Badge */}
        <div className="user-profile-badge" title="Logged in as Store Owner">
          <div className="user-avatar">
            {storeProfile.ownerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{storeProfile.ownerName}</span>
            <span className="user-role">Shopkeeper</span>
          </div>
        </div>
      </div>
    </header>
  );
};
