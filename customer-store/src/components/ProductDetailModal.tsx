import type { FC } from 'react';
import { X, Plus, Minus, Star, Store, ShieldCheck, Zap } from 'lucide-react';
import type { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductDetailModal: FC<ProductDetailModalProps> = ({
  product,
  onClose,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content product-detail-modal animate-fade"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} title="Close details">
          <X size={20} />
        </button>

        <div className="product-detail-layout">
          {/* Image & Badges */}
          <div className="product-detail-media">
            <div className="detail-image-wrap">
              <img 
                src={product.image} 
                alt={product.name}
                className="detail-large-image" 
              />
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="detail-discount-tag">
                  {product.discountPercentage}% DISCOUNT
                </span>
              )}
            </div>
            <div className="detail-guarantee-strip">
              <div className="guarantee-chip">
                <Zap size={14} className="icon-green" />
                <span>15-min Express Delivery</span>
              </div>
              <div className="guarantee-chip">
                <ShieldCheck size={14} className="icon-blue" />
                <span>100% Quality Inspected</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <div className="detail-vendor-tag">
              <Store size={14} />
              <span>Fulfilled by <strong>{product.shopName}</strong></span>
            </div>

            <h3 className="detail-product-title">{product.name}</h3>
            {product.hindiName && (
              <div className="detail-hindi-title">{product.hindiName}</div>
            )}

            <div className="detail-rating-row">
              <div className="rating-badge">
                <Star size={12} fill="#111111" color="#111111" />
                <span>{product.rating}</span>
              </div>
              <span className="dot">•</span>
              <span className="detail-weight">{product.weight}</span>
              <span className="dot">•</span>
              <span className="in-stock-badge">✓ In Stock in DailyGrocer</span>
            </div>

            <div className="detail-pricing-box">
              <div className="price-tag-big">
                <span className="currency">₹</span>
                <span className="amount">{product.price}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="original-strike">
                  <span>MRP ₹{product.originalPrice}</span>
                  <span className="save-pill">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </div>
              )}
              <div className="inclusive-tax">(Inclusive of all taxes)</div>
            </div>

            <div className="detail-description-section">
              <h5>Product Description</h5>
              <p>{product.description}</p>
            </div>

            {/* Quick delivery promise */}
            <div className="detail-delivery-note">
              <Zap size={16} />
              <div>
                <strong>Delivering to DailyGrocer</strong> in 15-20 minutes from our partner store hub.
              </div>
            </div>

            {/* Actions bottom */}
            <div className="detail-action-footer">
              {quantityInCart === 0 ? (
                <button
                  className="btn-primary detail-add-btn"
                  onClick={() => onAddToCart(product)}
                >
                  <Plus size={18} />
                  <span>Add to Cart • ₹{product.price}</span>
                </button>
              ) : (
                <div className="detail-stepper-row">
                  <div className="cart-qty-stepper large">
                    <button
                      className="qty-btn-minus"
                      onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-count-display">{quantityInCart} in Cart</span>
                    <button
                      className="qty-btn-plus"
                      onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button className="btn-secondary" onClick={onClose}>
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
