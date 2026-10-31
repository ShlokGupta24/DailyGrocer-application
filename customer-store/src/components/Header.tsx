import { useState, type FC } from 'react';
import { ShoppingBag, Search, MapPin, ChevronDown, X, Sparkles, Store, PhoneCall } from 'lucide-react';
import { DailyGrocer_LOCALITIES } from '../data/mockData';

interface HeaderProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocality: string;
  onSelectLocality: (locality: string) => void;
  onNavigateHome: () => void;
}

export const Header: FC<HeaderProps> = ({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  selectedLocality,
  onSelectLocality,
  onNavigateHome,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="top-banner">
        <div className="container top-banner-content">
          <div className="top-banner-left">
            <span className="live-dot"></span>
            <span>Serving DailyGrocer, UP with <strong>15-20 Min Express Delivery</strong></span>
          </div>
          <div className="top-banner-right">
            <span>🎉 Use Code <strong>DailyGrocer50</strong> for ₹50 OFF</span>
            <span className="divider-dot">•</span>
            <span className="support-link">
              <PhoneCall size={13} />
              <span>Local Support: 05263-234567</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main sticky navigation header */}
      <header className="main-header">
        <div className="container header-container">
          {/* Logo & Brand */}
          <div className="header-brand-group">
            <button 
              className="brand-logo-btn" 
              onClick={onNavigateHome}
              title="DailyGrocer - Home"
            >
              <div className="brand-logo-icon">
                <span className="bolt">⚡</span>
                <span className="cart-mini">🛒</span>
              </div>
              <div className="brand-text">
                <div className="brand-title">
                  <span className="brand-highlight">DailyGrocer</span> Express
                </div>
                <div className="brand-subtitle">Hyperlocal Grocery Platform</div>
              </div>
            </button>

            {/* Delivery Location Selector */}
            <div className="location-selector-wrap">
              <button 
                className="location-pill-btn"
                onClick={() => setShowLocationModal(true)}
                title="Change delivery location in DailyGrocer"
              >
                <div className="loc-icon-bubble">
                  <MapPin size={16} className="loc-icon" />
                </div>
                <div className="loc-text-col">
                  <span className="loc-label">Delivering in <strong>15 mins</strong></span>
                  <span className="loc-active-address">
                    {selectedLocality}
                    <ChevronDown size={14} className="chevron-down" />
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className={`header-search-wrap ${isSearchFocused ? 'search-focused' : ''}`}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search 'Aashirvaad Atta', 'Desi Paneer', 'Lal Tamatar', 'Maggi'..."
              className="header-search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="header-actions">
            <button 
              className="store-partners-pill"
              onClick={() => {
                const shopsSection = document.getElementById('featured-shops-section');
                if (shopsSection) {
                  shopsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              title="View partner local shops in DailyGrocer"
            >
              <Store size={16} />
              <span className="hide-on-mobile">Local Stores</span>
            </button>

            {/* Cart Trigger */}
            <button 
              id="header-cart-button"
              className={`cart-trigger-btn ${cartItemCount > 0 ? 'has-items' : ''}`}
              onClick={onOpenCart}
              title="Open shopping cart"
            >
              <div className="cart-icon-wrap">
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="cart-badge-count badge-bounce">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="cart-trigger-text">
                <span className="cart-label">My Cart</span>
                <span className="cart-subtotal-val">
                  {cartItemCount > 0 ? `₹${cartSubtotal}` : '₹0'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="mobile-search-bar">
          <div className="container">
            <div className="header-search-wrap mobile-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                id="mobile-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search fresh groceries, dairy, snacks..."
                className="header-search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => onSearchChange('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={() => setShowLocationModal(false)}>
          <div 
            className="modal-content location-modal animate-fade"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <MapPin className="modal-title-icon" size={20} />
                <h3>Choose Delivery Location</h3>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="modal-description">
              We currently offer 15-20 min hyper-fast delivery to the following localities across <strong>Your City, India</strong>:
            </p>

            <div className="locality-list">
              {DailyGrocer_LOCALITIES.map((loc) => {
                const isSelected = selectedLocality === loc;
                return (
                  <button
                    key={loc}
                    className={`locality-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectLocality(loc);
                      setShowLocationModal(false);
                    }}
                  >
                    <div className="locality-btn-inner">
                      <div className="loc-bullet-circle"></div>
                      <div className="locality-text">
                        <span className="locality-name">{loc}</span>
                        <span className="locality-delivery-time">⚡ 15-20 mins delivery</span>
                      </div>
                    </div>
                    {isSelected && <span className="selected-tag">Current</span>}
                  </button>
                );
              })}
            </div>

            <div className="location-modal-footer">
              <div className="delivery-guarantee-note">
                <Sparkles size={16} className="sparkle-icon" />
                <span>GPS Pinpoint Accuracy • Local DailyGrocer Riders Only</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
