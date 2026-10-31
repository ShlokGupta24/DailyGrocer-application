import type { FC } from 'react';
import { Star, Clock, MapPin, Store, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Shop } from '../types';

interface FeaturedShopsProps {
  shops: Shop[];
  selectedShopId: string | null;
  onSelectShop: (shopId: string | null) => void;
}

export const FeaturedShops: FC<FeaturedShopsProps> = ({
  shops,
  selectedShopId,
  onSelectShop,
}) => {
  return (
    <section className="featured-shops-section" id="featured-shops-section">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-tag">
              <Store size={14} />
              <span>Hyperlocal Network</span>
            </div>
            <h2 className="section-title">Partner Stores in DailyGrocer</h2>
            <p className="section-subtitle">
              We deliver from the most trusted local grocery stores and mandis you already know
            </p>
          </div>
          {selectedShopId && (
            <button 
              className="view-all-shops-btn"
              onClick={() => onSelectShop(null)}
            >
              Show All Stores ({shops.length})
            </button>
          )}
        </div>

        {selectedShopId && (
          <div className="shop-filter-banner animate-fade">
            <div className="banner-left">
              <span className="dot-active"></span>
              <span>
                Filtering products from: <strong>{shops.find(s => s.id === selectedShopId)?.name}</strong>
              </span>
            </div>
            <button 
              className="clear-shop-filter" 
              onClick={() => onSelectShop(null)}
            >
              Clear Store Filter
            </button>
          </div>
        )}

        <div className="shops-grid">
          {shops.map((shop) => {
            const isSelected = selectedShopId === shop.id;
            return (
              <div 
                key={shop.id}
                className={`shop-card ${isSelected ? 'shop-card-selected' : ''}`}
                onClick={() => onSelectShop(isSelected ? null : shop.id)}
              >
                <div className="shop-card-image-wrap">
                  <img 
                    src={shop.image} 
                    alt={shop.name} 
                    className="shop-card-image"
                    loading="lazy" 
                  />
                  <div className="shop-card-overlay">
                    <span className="shop-badge-tag">{shop.tag}</span>
                    <span className="shop-status-pill">
                      <span className="green-status-dot"></span>
                      Open Now
                    </span>
                  </div>
                </div>

                <div className="shop-card-body">
                  <div className="shop-header-row">
                    <h3 className="shop-name">{shop.name}</h3>
                    <div className="shop-rating-pill">
                      <Star size={12} className="star-icon" fill="#111111" color="#111111" />
                      <span>{shop.rating}</span>
                      <span className="review-count">({shop.reviewCount})</span>
                    </div>
                  </div>

                  <div className="shop-meta-row">
                    <div className="shop-meta-item">
                      <MapPin size={13} />
                      <span>{shop.area}</span>
                    </div>
                  </div>

                  <div className="shop-perks-row">
                    <div className="shop-delivery-pill">
                      <Clock size={13} />
                      <span>{shop.deliveryTime}</span>
                    </div>
                    <div className="shop-distance-pill">
                      <span>{shop.distance}</span>
                    </div>
                    <div className="shop-min-pill">
                      <span>Min ₹{shop.minOrder}</span>
                    </div>
                  </div>

                  <div className="shop-card-footer">
                    <button 
                      className={`shop-select-btn ${isSelected ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShop(isSelected ? null : shop.id);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Store Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Browse Store</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
