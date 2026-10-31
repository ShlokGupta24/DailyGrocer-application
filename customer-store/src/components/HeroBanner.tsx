import type { FC } from 'react';
import { Zap, ShieldCheck, BadgePercent, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

interface HeroBannerProps {
  onShopCategory: (categoryId: string) => void;
  onExploreShops: () => void;
}

export const HeroBanner: FC<HeroBannerProps> = ({ onShopCategory, onExploreShops }) => {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Main Hero Card */}
        <div className="hero-main-card">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-glow"></span>
              <Sparkles size={14} className="badge-icon" />
              <span>Hyperlocal Grocery Delivery for DailyGrocer</span>
            </div>

            <h1 className="hero-heading">
              Fresh Groceries from Your <span className="highlight-text">Favorite Local Stores</span> in 15 Mins
            </h1>

            <p className="hero-subtext">
              Skip the crowded bazaars of Veer Vinay Chowk & Station Road. Order fresh veggies, pure milk, chakki atta and daily essentials from trusted neighborhood stores delivered right to your doorstep.
            </p>

            {/* Value Propositions */}
            <div className="hero-highlights-row">
              <div className="highlight-item">
                <div className="highlight-icon green">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="highlight-title">15-20 Mins</span>
                  <span className="highlight-desc">Average delivery</span>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon orange">
                  <BadgePercent size={16} />
                </div>
                <div>
                  <span className="highlight-title">Local Prices</span>
                  <span className="highlight-desc">No hidden markups</span>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon blue">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="highlight-title">COD & UPI</span>
                  <span className="highlight-desc">Pay at your door</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="hero-cta-group">
              <button 
                className="btn-primary hero-btn"
                onClick={() => {
                  const productsSection = document.getElementById('products-section');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <ShoppingBag size={18} />
                <span>Shop Everyday Essentials</span>
                <ArrowRight size={16} />
              </button>

              <button 
                className="btn-secondary hero-btn"
                onClick={onExploreShops}
              >
                <span>Browse Local Shops</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual / Promotional showcase */}
          <div className="hero-visual-side">
            <div className="promo-card morning-fresh animate-fade">
              <div className="promo-card-badge">Mandi Fresh 🌿</div>
              <h3 className="promo-title">local mandi Fresh</h3>
              <p className="promo-desc">Direct harvest tomatoes, palak, and greens delivered fresh.</p>
              <div className="promo-footer">
                <span className="promo-discount">Up to 25% OFF</span>
                <button 
                  className="promo-btn-arrow" 
                  onClick={() => onShopCategory('fruits-vegetables')}
                  title="Explore fresh produce"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="promo-row-dual">
              <div className="promo-card dairy-special">
                <span className="promo-tag-mini">🥛 Daily Dairy</span>
                <h4>Fresh Malai Paneer & Milk</h4>
                <p>Pure buffalo milk & khoya cut paneer.</p>
                <button 
                  className="mini-link-btn" 
                  onClick={() => onShopCategory('dairy-eggs')}
                >
                  Order Now →
                </button>
              </div>

              <div className="promo-card free-deliv">
                <span className="promo-tag-mini">🚚 Special Offer</span>
                <h4>FREE Delivery</h4>
                <p>On all orders above ₹199 across DailyGrocer.</p>
                <span className="code-chip">Code: FREEDEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
