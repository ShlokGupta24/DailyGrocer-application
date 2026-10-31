import { useState, type FC, type FormEvent } from 'react';
import { X, MapPin, Phone, User, Home, Clock, CreditCard, Banknote, QrCode, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import type { CartItem, CheckoutAddress, PaymentMethod } from '../types';
import { DailyGrocer_LOCALITIES } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  discount: number;
  finalTotal: number;
  onPlaceOrder: (address: CheckoutAddress, paymentMethod: PaymentMethod) => void;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryCharge,
  packagingCharge,
  discount,
  finalTotal,
  onPlaceOrder,
}) => {
  // Pre-filled realistic DailyGrocer demo data for fast demonstration
  const [address, setAddress] = useState<CheckoutAddress>({
    fullName: 'Aditya Srivastava',
    phone: '9839123456',
    streetAddress: 'House No. B-42, Near Nagar Palika Road',
    locality: DailyGrocer_LOCALITIES[0],
    landmark: 'Behind City Hospital',
    instructions: 'Please call once rider reaches the colony gate',
  });

  const [deliverySlot, setDeliverySlot] = useState<'instant' | 'evening'>('instant');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateAndSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!address.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!address.phone.trim() || address.phone.length < 10) errors.phone = 'Valid 10-digit phone number is required';
    if (!address.streetAddress.trim()) errors.streetAddress = 'Address line is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate realistic 900ms processing delay for delightful experience
    setTimeout(() => {
      setIsSubmitting(false);
      onPlaceOrder(address, paymentMethod);
    }, 900);
  };

  return (
    <div className="checkout-backdrop" onClick={onClose}>
      <div 
        className="checkout-modal-container animate-fade"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-header-left">
            <button className="back-btn" onClick={onClose} title="Back to cart">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3>Checkout & Delivery Address</h3>
              <p>Hyperlocal Delivery • DailyGrocer (UP)</p>
            </div>
          </div>
          <button className="checkout-close-btn" onClick={onClose} title="Close checkout">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={validateAndSubmit} className="checkout-body-form">
          <div className="checkout-grid-layout">
            {/* Left Column: Delivery Details & Payment */}
            <div className="checkout-form-column">
              {/* Delivery Address Card */}
              <div className="checkout-section-card">
                <div className="section-card-title">
                  <div className="card-title-icon">
                    <MapPin size={16} />
                  </div>
                  <h4>1. Delivery Address</h4>
                </div>

                <div className="form-fields-grid">
                  <div className="form-field-group">
                    <label htmlFor="checkout-name">
                      <User size={14} /> Full Name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Aditya Srivastava"
                      required
                    />
                    {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="checkout-phone">
                      <Phone size={14} /> Phone Number (+91)
                    </label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="checkout-phone"
                        type="tel"
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="98391 23456"
                        required
                      />
                    </div>
                    {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                  </div>

                  <div className="form-field-group full-width">
                    <label htmlFor="checkout-locality">
                      <MapPin size={14} /> DailyGrocer Area / Locality
                    </label>
                    <select
                      id="checkout-locality"
                      value={address.locality}
                      onChange={(e) => setAddress({ ...address, locality: e.target.value })}
                      className="form-select"
                    >
                      {DailyGrocer_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc} (15-20 min zone)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group full-width">
                    <label htmlFor="checkout-street">
                      <Home size={14} /> House / Flat / Street Address
                    </label>
                    <input
                      id="checkout-street"
                      type="text"
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      placeholder="e.g. House No. 12, Near Nagar Palika Road"
                      required
                    />
                    {formErrors.streetAddress && <span className="field-error">{formErrors.streetAddress}</span>}
                  </div>

                  <div className="form-field-group full-width">
                    <label htmlFor="checkout-landmark">Landmark (Optional)</label>
                    <input
                      id="checkout-landmark"
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="e.g. Opposite City Hospital / Near SBI Branch"
                    />
                  </div>

                  <div className="form-field-group full-width">
                    <label htmlFor="checkout-instructions">Delivery Instructions for Rider</label>
                    <input
                      id="checkout-instructions"
                      type="text"
                      value={address.instructions}
                      onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                      placeholder="e.g. Please call before reaching gate"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Slot Option */}
              <div className="checkout-section-card">
                <div className="section-card-title">
                  <div className="card-title-icon">
                    <Clock size={16} />
                  </div>
                  <h4>2. Delivery Speed</h4>
                </div>

                <div className="delivery-slot-options">
                  <label 
                    className={`slot-option-card ${deliverySlot === 'instant' ? 'selected' : ''}`}
                    onClick={() => setDeliverySlot('instant')}
                  >
                    <input
                      type="radio"
                      name="deliverySlot"
                      checked={deliverySlot === 'instant'}
                      onChange={() => setDeliverySlot('instant')}
                    />
                    <div className="slot-option-content">
                      <div className="slot-title">
                        <span>⚡ 15-25 Mins Express Delivery</span>
                        <span className="slot-badge">Fastest</span>
                      </div>
                      <div className="slot-desc">
                        Partner store starts packing immediately. Delivery partner dispatched in 3 mins.
                      </div>
                    </div>
                  </label>

                  <label 
                    className={`slot-option-card ${deliverySlot === 'evening' ? 'selected' : ''}`}
                    onClick={() => setDeliverySlot('evening')}
                  >
                    <input
                      type="radio"
                      name="deliverySlot"
                      checked={deliverySlot === 'evening'}
                      onChange={() => setDeliverySlot('evening')}
                    />
                    <div className="slot-option-content">
                      <div className="slot-title">
                        <span>🌆 Evening Slot (6:00 PM - 8:00 PM)</span>
                      </div>
                      <div className="slot-desc">
                        Convenient after-work delivery at your home.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="checkout-section-card">
                <div className="section-card-title">
                  <div className="card-title-icon">
                    <CreditCard size={16} />
                  </div>
                  <h4>3. Payment Option</h4>
                </div>

                <div className="payment-options-list">
                  {/* UPI on Delivery */}
                  <label 
                    className={`payment-option-card ${paymentMethod === 'upi_delivery' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('upi_delivery')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi_delivery'}
                      onChange={() => setPaymentMethod('upi_delivery')}
                    />
                    <div className="payment-icon-wrap">
                      <QrCode size={20} className="text-primary" />
                    </div>
                    <div className="payment-info">
                      <div className="payment-title">
                        <span>UPI on Delivery (Recommended)</span>
                        <span className="rec-badge">Popular</span>
                      </div>
                      <div className="payment-sub">
                        Scan QR code via PhonePe, Google Pay, or Paytm when our DailyGrocer delivery partner arrives.
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label 
                    className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="payment-icon-wrap">
                      <Banknote size={20} className="text-primary" />
                    </div>
                    <div className="payment-info">
                      <div className="payment-title">Cash on Delivery (COD)</div>
                      <div className="payment-sub">
                        Pay exact cash in INR at your doorstep after checking packed items.
                      </div>
                    </div>
                  </label>

                  {/* Online Mock Pay */}
                  <label 
                    className={`payment-option-card ${paymentMethod === 'online_mock' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('online_mock')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'online_mock'}
                      onChange={() => setPaymentMethod('online_mock')}
                    />
                    <div className="payment-icon-wrap">
                      <CreditCard size={20} className="text-primary" />
                    </div>
                    <div className="payment-info">
                      <div className="payment-title">Simulate Prepaid UPI (Instant Demo)</div>
                      <div className="payment-sub">
                        Instant demo authorization without real money deduction.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Placement */}
            <div className="checkout-summary-column">
              <div className="summary-sticky-card">
                <h4>Order Summary ({items.length} items)</h4>

                {/* Compact item list */}
                <div className="summary-items-scroll">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="summary-item-line">
                      <div className="summary-item-left">
                        <span className="qty-tag">{quantity}x</span>
                        <span className="summary-name">{product.name}</span>
                      </div>
                      <span className="summary-price">₹{product.price * quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                {/* Calculation breakdown */}
                <div className="summary-breakdown">
                  <div className="breakdown-row">
                    <span>Items Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Delivery Charge</span>
                    <span>{deliveryCharge === 0 ? <strong className="free-tag">FREE</strong> : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Packaging & Handling</span>
                    <span>₹{packagingCharge}</span>
                  </div>
                  {discount > 0 && (
                    <div className="breakdown-row discount-row">
                      <span>Promo Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="breakdown-total-row">
                    <span>Amount to Pay</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <div className="guarantee-box">
                  <ShieldCheck size={17} />
                  <span>No payment required right now. Safe hyperlocal fulfillment guaranteed.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="place-order-button"
                  className="btn-primary place-order-cta"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="placing-order-spin">
                      <span className="spinner"></span>
                      <span>Placing Order with Store...</span>
                    </span>
                  ) : (
                    <>
                      <span>Place Order (₹{finalTotal})</span>
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className="cancel-checkout-link"
                  onClick={onClose}
                >
                  Return to Cart & Edit Items
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
