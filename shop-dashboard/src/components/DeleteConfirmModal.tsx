import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Product } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="#0f172a" />
            <span>Confirm Product Removal</span>
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

        <div className="modal-body">
          <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>{product.name}</strong> from your shop inventory?
          </p>

          <div style={{
            marginTop: 14,
            padding: 12,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{product.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                ₹{product.price} / {product.unit} • {product.stock} units remaining
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>
            This item will immediately be taken off your shelf for demonstration. You can add it back anytime using &quot;Add Product&quot;.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Keep Product
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            className="btn btn-dark"
            onClick={() => onConfirm(product.id)}
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};
