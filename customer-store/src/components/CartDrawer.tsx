import { useState, type FC, type FormEvent } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles, Check } from 'lucide-react';
import type { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  couponCode: string;
  appliedDiscount: number;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  couponCode,
  appliedDiscount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const originalSubtotal = items.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const productSavings = originalSubtotal - subtotal;

  const FREE_DELIVERY_THRESHOLD = 199;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = isFreeDelivery || items.length === 0 ? 0 : 25;
  const packagingCharge = items.length === 0 ? 0 : 5;
  const finalTotal = Math.max(0, subtotal + deliveryCharge + packagingCharge - appliedDiscount);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const success = onApplyCoupon(inputCoupon.trim().toUpperCase());
    if (success) {
      setCouponError('');
      setInputCoupon('');
    } else {
      setCouponError('Invalid coupon code. Try DailyGrocer50 or WELCOME20');
    }
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside 
        className="cart-drawer animate-fade"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <div className="cart-title-with-badge">
              <ShoppingBag size={18} />
              <h3>My Grocery Basket</h3>
              <span className="cart-count-pill">{items.length} items</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {items.length > 0 && (
                <button
                  className="clear-shop-filter"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  onClick={onClearCart}
                  title="Empty cart"
                >
                  Clear
                </button>
              )}
              <button 
                id="close-cart-btn"
                className="cart-close-btn"
                onClick={onClose}
                title="Close cart"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Delivery Target Progress Bar */}
          {items.length > 0 && (
            <div className="free-delivery-meter">
              <div className="meter-label">
                {isFreeDelivery ? (
                  <span className="free-deliv-success">
                    🎉 <strong>Congratulations!</strong> You unlocked FREE Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{amountNeededForFreeDelivery}</strong> more to unlock <strong>FREE Delivery</strong>
                  </span>
                )}
              </div>
              <div className="meter-bar-track">
                <div 
                  className="meter-bar-fill" 
                  style={{ width: `${freeDeliveryProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="cart-content-scroll">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <div className="cart-empty-art">
                <span className="empty-cart-emoji">🛒</span>
              </div>
              <h4>Your basket is empty</h4>
              <p>Explore farm-fresh veggies, dairy, snacks and staples from local DailyGrocer shops.</p>
              <button 
                className="btn-primary start-shopping-btn"
                onClick={onClose}
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="cart-items-list">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item-row" id={`cart-item-${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="cart-item-thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="cart-item-details">
                      <h5 className="cart-item-name">{product.name}</h5>
                      <div className="cart-item-meta">
                        <span className="cart-item-weight">{product.weight}</span>
                        <span className="cart-item-shop">({product.shopName})</span>
                      </div>
                      <div className="cart-item-pricing">
                        <span className="item-unit-price">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="item-mrp-strike">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controller */}
                    <div className="cart-item-controls">
                      <div className="cart-qty-stepper small">
                        <button
                          className="qty-btn-minus"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          title="Decrease quantity"
                          aria-label="Decrease quantity"
                        >
                          {quantity === 1 ? <Trash2 size={13} color="#ef4444" /> : <Minus size={13} />}
                        </button>
                        <span className="qty-count-display">{quantity}</span>
                        <button
                          className="qty-btn-plus"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="cart-item-line-total">
                        ₹{product.price * quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="cart-coupon-card">
                <div className="coupon-card-header">
                  <Tag size={15} />
                  <span>Have a promo code?</span>
                </div>

                {appliedDiscount > 0 ? (
                  <div className="coupon-applied-pill">
                    <div className="applied-left">
                      <Check size={15} />
                      <span>Code <strong>{couponCode}</strong> applied (-₹{appliedDiscount})</span>
                    </div>
                    <button className="remove-coupon-btn" onClick={onRemoveCoupon}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                    <input
                      type="text"
                      placeholder="Try DailyGrocer50"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="coupon-input"
                    />
                    <button type="submit" className="apply-coupon-btn">
                      Apply
                    </button>
                  </form>
                )}

                {couponError && <p className="coupon-error-text">{couponError}</p>}
                
                {appliedDiscount === 0 && (
                  <div className="coupon-hint-pills">
                    <span 
                      className="hint-code-tag" 
                      onClick={() => {
                        onApplyCoupon('DailyGrocer50');
                        setCouponError('');
                      }}
                    >
                      Use DailyGrocer50 (₹50 off)
                    </span>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="bill-details-card">
                <h5 className="bill-title">Bill Summary</h5>

                <div className="bill-row">
                  <span className="bill-label">Item Total (MRP)</span>
                  <span className="bill-val">₹{originalSubtotal}</span>
                </div>

                {productSavings > 0 && (
                  <div className="bill-row text-green">
                    <span className="bill-label">Product Store Discounts</span>
                    <span className="bill-val">-₹{productSavings}</span>
                  </div>
                )}

                <div className="bill-row">
                  <span className="bill-label">Delivery Partner Fee</span>
                  <span className="bill-val">
                    {deliveryCharge === 0 ? (
                      <span className="free-tag">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="bill-row">
                  <span className="bill-label">Handling & Packaging Charge</span>
                  <span className="bill-val">₹{packagingCharge}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="bill-row text-green">
                    <span className="bill-label">Promo Discount ({couponCode})</span>
                    <span className="bill-val">-₹{appliedDiscount}</span>
                  </div>
                )}

                <div className="bill-divider"></div>

                <div className="bill-row total-row">
                  <span className="bill-total-label">Grand Total to Pay</span>
                  <span className="bill-total-val">₹{finalTotal}</span>
                </div>

                {(productSavings > 0 || appliedDiscount > 0) && (
                  <div className="savings-badge-strip">
                    <Sparkles size={14} />
                    <span>
                      Total Savings: ₹{productSavings + appliedDiscount} on this order!
                    </span>
                  </div>
                )}
              </div>

              {/* Safety notice */}
              <div className="cart-safety-note">
                <ShieldCheck size={16} />
                <span>Hyperlocal 100% Genuine Products guaranteed from DailyGrocer shops.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer sticky CTA */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-info">
              <span className="footer-total-label">Total to Pay</span>
              <span className="footer-total-amount">₹{finalTotal}</span>
            </div>
            <button 
              id="proceed-to-checkout-btn"
              className="btn-primary proceed-btn"
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
