import type { FC } from 'react';
import { Plus, Minus, Star, Store, Eye } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
}) => {
  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Discount / Tag Pill */}
      <div className="product-badge-group">
        {product.discountPercentage && product.discountPercentage > 0 ? (
          <span className="product-discount-badge">
            {product.discountPercentage}% OFF
          </span>
        ) : null}
        {product.tag && (
          <span className="product-feature-tag">{product.tag}</span>
        )}
      </div>

      {/* Product Image */}
      <div 
        className="product-image-container"
        onClick={() => onQuickView(product)}
        title="Click to view details"
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // Fallback gracefully to an unspash fallback if network image fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
          }}
        />
        <button 
          className="quick-view-overlay-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          title="Quick preview"
        >
          <Eye size={16} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Content */}
      <div className="product-card-body">
        {/* Shop origin tag */}
        <div className="product-vendor-meta">
          <Store size={12} className="vendor-icon" />
          <span className="vendor-name">{product.shopName}</span>
        </div>

        {/* Title */}
        <h4 
          className="product-title"
          onClick={() => onQuickView(product)}
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Hindi name if available */}
        {product.hindiName && (
          <div className="product-hindi-name">{product.hindiName}</div>
        )}

        {/* Weight & Rating */}
        <div className="product-meta-row">
          <span className="product-weight-pill">{product.weight}</span>
          <div className="product-rating">
            <Star size={11} fill="#111111" color="#111111" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="product-card-bottom">
          <div className="product-pricing">
            <div className="price-primary">
              <span className="currency-symbol">₹</span>
              <span className="price-val">{product.price}</span>
            </div>
            {product.originalPrice > product.price && (
              <span className="price-original">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="product-actions-wrap">
            {quantityInCart === 0 ? (
              <button 
                id={`add-btn-${product.id}`}
                className="btn-add-to-cart"
                onClick={() => onAddToCart(product)}
                title={`Add ${product.name} to cart`}
              >
                <Plus size={15} />
                <span>ADD</span>
              </button>
            ) : (
              <div className="cart-qty-stepper" id={`qty-stepper-${product.id}`}>
                <button 
                  className="qty-btn-minus"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  title="Decrease quantity"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-count-display">{quantityInCart}</span>
                <button 
                  className="qty-btn-plus"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  title="Increase quantity"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
