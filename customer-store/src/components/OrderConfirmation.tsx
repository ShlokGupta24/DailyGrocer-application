import { useState, type FC } from 'react';
import { CheckCircle2, Clock, MapPin, Phone, ArrowLeft, Bike, Store, AlertCircle } from 'lucide-react';
import type { OrderDetails } from '../types';

interface OrderConfirmationProps {
  order: OrderDetails;
  onReturnToShopping: () => void;
}

export const OrderConfirmation: FC<OrderConfirmationProps> = ({
  order,
  onReturnToShopping,
}) => {
  const [showCallAlert, setShowCallAlert] = useState(false);

  const getPaymentName = () => {
    switch (order.paymentMethod) {
      case 'cod':
        return 'Cash on Delivery (₹' + order.total + ' to pay on arrival)';
      case 'upi_delivery':
        return 'UPI on Delivery (Scan QR with PhonePe / GPay)';
      default:
        return 'Prepaid Demo UPI (Authorized)';
    }
  };

  return (
    <div className="confirmation-page animate-fade" id="order-confirmation-screen">
      <div className="container confirmation-container">
        {/* Top Success Banner */}
        <div className="success-banner-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={56} className="text-success" />
          </div>

          <h2 className="success-heading">Order Placed Successfully! 🎉</h2>
          <p className="success-subheading">
            Your neighborhood store has accepted your order and is currently hand-picking your fresh groceries.
          </p>

          <div className="order-id-chip">
            <span>Order Reference:</span>
            <strong>{order.orderId}</strong>
            <span className="dot">•</span>
            <span>Placed at {order.placedAt}</span>
          </div>

          {/* Big ETA Countdown Highlight */}
          <div className="eta-highlight-card">
            <div className="eta-clock-icon">
              <Clock size={28} />
            </div>
            <div className="eta-details">
              <span className="eta-label">Estimated Delivery Time</span>
              <h3 className="eta-time">{order.estimatedDeliveryTime} (approx 18 mins)</h3>
              <p className="eta-note">Rider is assigned and dispatching from DailyGrocer Hub.</p>
            </div>
          </div>
        </div>

        {/* Live Order Tracker Timeline */}
        <div className="order-tracker-card">
          <h4 className="tracker-card-title">Live Order Status</h4>
          
          <div className="tracker-timeline">
            {/* Step 1 */}
            <div className="timeline-step step-done">
              <div className="step-circle">✓</div>
              <div className="step-content">
                <h5>Order Confirmed</h5>
                <p>Sent to DailyGrocer partner store</p>
                <span className="step-timestamp">Just now</span>
              </div>
            </div>

            <div className="timeline-line line-done"></div>

            {/* Step 2 */}
            <div className="timeline-step step-active">
              <div className="step-circle pulse">
                <Store size={14} />
              </div>
              <div className="step-content">
                <h5>Store Packing Items</h5>
                <p>Selecting freshest veggies & groceries</p>
                <span className="step-timestamp active-txt">In Progress</span>
              </div>
            </div>

            <div className="timeline-line"></div>

            {/* Step 3 */}
            <div className="timeline-step step-pending">
              <div className="step-circle">
                <Bike size={14} />
              </div>
              <div className="step-content">
                <h5>Out for Delivery</h5>
                <p>Ramesh is on his way to your address</p>
                <span className="step-timestamp">Upcoming (~10 mins)</span>
              </div>
            </div>

            <div className="timeline-line"></div>

            {/* Step 4 */}
            <div className="timeline-step step-pending">
              <div className="step-circle">🏠</div>
              <div className="step-content">
                <h5>Delivered</h5>
                <p>Handed over at your doorstep</p>
                <span className="step-timestamp">~18 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column Details Layout: Delivery Partner & Address */}
        <div className="details-two-col">
          {/* Assigned Delivery Rider */}
          <div className="confirmation-card rider-card">
            <div className="card-badge-row">
              <span className="badge-assigned">🛵 Assigned Partner</span>
              <span className="badge-rating">⭐ 4.9 (520+ deliveries)</span>
            </div>

            <div className="rider-profile">
              <img 
                src={order.deliveryBoy.photo} 
                alt={order.deliveryBoy.name} 
                className="rider-avatar" 
              />
              <div className="rider-info">
                <h4>{order.deliveryBoy.name}</h4>
                <p className="rider-vehicle">{order.deliveryBoy.vehicle}</p>
                <span className="rider-status">Verified Local Delivery Agent</span>
              </div>
            </div>

            <div className="rider-actions">
              <button 
                className="btn-call-rider"
                onClick={() => setShowCallAlert(true)}
              >
                <Phone size={15} />
                <span>Call Rider ({order.deliveryBoy.phone})</span>
              </button>
            </div>

            {showCallAlert && (
              <div className="call-mock-alert animate-fade">
                <AlertCircle size={15} />
                <span>Simulated call: Connecting to rider {order.deliveryBoy.name}...</span>
              </div>
            )}
          </div>

          {/* Delivery Address & Mode */}
          <div className="confirmation-card address-card">
            <h4>Delivery Location</h4>
            <div className="address-display">
              <div className="addr-row">
                <MapPin size={16} />
                <div>
                  <strong>{order.address.fullName}</strong> ({order.address.phone})
                  <p>{order.address.streetAddress}</p>
                  <p className="locality-badge">{order.address.locality}</p>
                  {order.address.landmark && (
                    <p className="landmark-text">Landmark: {order.address.landmark}</p>
                  )}
                  {order.address.instructions && (
                    <p className="notes-text">Note: "{order.address.instructions}"</p>
                  )}
                </div>
              </div>
            </div>

            <div className="payment-display-row">
              <span className="pay-label">Payment Method:</span>
              <strong className="pay-value">{getPaymentName()}</strong>
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="confirmation-card items-summary-card">
          <h4>Items in this Order ({order.items.length})</h4>
          <div className="confirmed-items-list">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="confirmed-item-row">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="confirmed-item-thumb" 
                />
                <div className="confirmed-item-desc">
                  <h5>{product.name}</h5>
                  <span>{product.weight} • Fulfilled by {product.shopName}</span>
                </div>
                <div className="confirmed-item-qty">
                  <span>Qty: <strong>{quantity}</strong></span>
                </div>
                <div className="confirmed-item-price">
                  ₹{product.price * quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Bill breakdown in confirmation */}
          <div className="confirmation-bill-summary">
            <div className="c-bill-line">
              <span>Items Total:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="c-bill-line">
              <span>Delivery Fee:</span>
              <span>{order.deliveryCharge === 0 ? <strong className="free-tag">FREE</strong> : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="c-bill-line">
              <span>Packaging & Handling:</span>
              <span>₹{order.packagingCharge}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="c-bill-line">
                <span>Coupon Discount:</span>
                <span>-₹{order.couponDiscount}</span>
              </div>
            )}
            <div className="c-bill-line c-bill-total">
              <span>Total Paid / Payable:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Return to shopping CTA */}
        <div className="return-shopping-section">
          <button 
            id="return-to-shopping-btn"
            className="btn-primary return-home-btn"
            onClick={onReturnToShopping}
          >
            <ArrowLeft size={18} />
            <span>Return to Shopping & Explore More Stores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
