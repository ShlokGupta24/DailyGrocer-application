import React from 'react';
import { X, Printer, MapPin, Phone, Clock, Store } from 'lucide-react';
import type { Order, StoreProfile } from '../types';

interface OrderReceiptModalProps {
  order: Order | null;
  storeProfile: StoreProfile;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  storeProfile,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Store size={18} color="#15803d" />
            <span>Order Packing Slip #{order.id}</span>
          </div>
          <button
            type="button"
            className="btn-icon-only"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc' }}>
          {/* Paper receipt container */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 20,
            boxShadow: 'var(--shadow-xs)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {storeProfile.shopName}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                {storeProfile.address}, {storeProfile.locality}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                FSSAI Lic: {storeProfile.fssaiNumber} • Phone: {storeProfile.phone}
              </div>
              <div style={{
                display: 'inline-block',
                marginTop: 8,
                padding: '2px 8px',
                background: '#f0fdf4',
                color: '#15803d',
                borderRadius: 4,
                fontSize: 11.5,
                fontWeight: 600,
                border: '1px solid #bbf7d0'
              }}>
                DailyGrocer Delivery • 15 Mins
              </div>
            </div>

            {/* Order & Customer Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Order ID</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>#{order.id}</div>
                <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Clock size={11} /> {order.orderTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Customer</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{order.customerName}</div>
                <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Phone size={11} /> {order.customerPhone}
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={{ padding: '10px 0', borderBottom: '1px dashed #cbd5e1', fontSize: 12, color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <MapPin size={13} color="#15803d" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong>Delivery Address:</strong> {order.deliveryAddress}
                </div>
              </div>
              {order.notes && (
                <div style={{ marginTop: 6, padding: '6px 10px', background: '#f8fafc', borderRadius: 4, fontSize: 11.5, color: '#0f172a', border: '1px solid #e2e8f0' }}>
                  <strong>Customer Note:</strong> &quot;{order.notes}&quot;
                </div>
              )}
            </div>

            {/* Itemized list */}
            <div style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
                Items to Pack
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.quantity}x</span>{' '}
                      <span style={{ color: '#0f172a' }}>{item.productName}</span>{' '}
                      <span style={{ fontSize: 11, color: '#64748b' }}>({item.unit})</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      ₹{item.quantity * item.unitPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Items Subtotal</span>
                <span>₹{order.itemTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Delivery Charge</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 14,
                color: '#0f172a',
                paddingTop: 8,
                marginTop: 4,
                borderTop: '1px solid #e2e8f0'
              }}>
                <span>Total Bill Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                <span>Payment Mode</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{order.paymentMethod}</span>
              </div>
            </div>

            {/* Status Footer */}
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              background: '#f8fafc',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12
            }}>
              <span style={{ color: '#64748b' }}>Current Status:</span>
              <span className={`badge ${order.status === 'Completed' ? 'badge-green' : 'badge-neutral'}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.print();
            }}
          >
            <Printer size={16} />
            <span>Print Packing Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
