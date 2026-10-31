import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Product, ProductCategory } from '../types';
import { CATEGORIES, DEMO_PRESET_IMAGES } from '../data/mockData';

interface ProductModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialProduct?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  mode,
  initialProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fruits & Vegetables');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('20');
  const [unit, setUnit] = useState<string>('1 kg');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [inStock, setInStock] = useState(true);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProduct && mode === 'edit') {
      setName(initialProduct.name);
      setHindiName(initialProduct.hindiName || '');
      setCategory(initialProduct.category);
      setPrice(initialProduct.price.toString());
      setOriginalPrice(initialProduct.originalPrice ? initialProduct.originalPrice.toString() : '');
      setStock(initialProduct.stock.toString());
      setUnit(initialProduct.unit);
      setDescription(initialProduct.description);
      setImage(initialProduct.image);
      setInStock(initialProduct.inStock);
    } else {
      // Defaults for Add
      setName('');
      setHindiName('');
      setCategory('Fruits & Vegetables');
      setPrice('');
      setOriginalPrice('');
      setStock('25');
      setUnit('1 kg');
      setDescription('');
      setImage(DEMO_PRESET_IMAGES[0].url);
      setInStock(true);
    }
    setErrors({});
  }, [initialProduct, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Valid selling price (greater than ₹0) is required';
    }
    const numStock = parseInt(stock, 10);
    if (stock === '' || isNaN(numStock) || numStock < 0) {
      newErrors.stock = 'Valid stock quantity (0 or more) is required';
    }
    if (!unit.trim()) {
      newErrors.unit = 'Unit is required (e.g. 1 kg, 500 g, 1 Litre)';
    }
    if (!description.trim()) {
      newErrors.description = 'Brief product description is required';
    }
    if (!image.trim()) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numPrice = parseFloat(price);
    const numOriginal = originalPrice ? parseFloat(originalPrice) : undefined;
    const numStock = parseInt(stock, 10);

    const productPayload: Omit<Product, 'id'> = {
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      category,
      price: numPrice,
      originalPrice: numOriginal && numOriginal > numPrice ? numOriginal : undefined,
      stock: numStock,
      unit: unit.trim(),
      inStock,
      image: image.trim(),
      description: description.trim(),
    };

    onSave(productPayload, initialProduct?.id);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {mode === 'add' ? 'Add New Product to Store' : `Edit Product — ${initialProduct?.name}`}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {Object.keys(errors).length > 0 && (
              <div 
                style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: 6, 
                  padding: '10px 14px', 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  color: '#0f172a'
                }}
              >
                <AlertCircle size={16} />
                <span>Please fill in all required fields marked below before saving.</span>
              </div>
            )}

            {/* Product Name (English) */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-name">
                Product Name (English)<span className="req">*</span>
              </label>
              <input
                id="prod-name"
                type="text"
                className="form-control"
                placeholder="e.g. Fresh Red Hybrid Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span style={{ color: '#0f172a', fontSize: 11, fontWeight: 600 }}>{errors.name}</span>}
            </div>

            {/* Hindi Name & Category */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-hindi-name">
                  Hindi / Local Name (Optional)
                </label>
                <input
                  id="prod-hindi-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. देसी हाइब्रिड लाल टमाटर"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">
                  Category<span className="req">*</span>
                </label>
                <select
                  id="prod-category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & MRP */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-price">
                  Selling Price (₹)<span className="req">*</span>
                </label>
                <input
                  id="prod-price"
                  type="number"
                  step="any"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 36"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && <span style={{ color: '#0f172a', fontSize: 11, fontWeight: 600 }}>{errors.price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-original-price">
                  MRP / Original Price (₹) (Optional)
                </label>
                <input
                  id="prod-original-price"
                  type="number"
                  step="any"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 48 (shows discount)"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Stock Quantity & Unit */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-stock">
                  Initial Stock Quantity<span className="req">*</span>
                </label>
                <input
                  id="prod-stock"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.stock && <span style={{ color: '#0f172a', fontSize: 11, fontWeight: 600 }}>{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-unit">
                  Unit Measurement<span className="req">*</span>
                </label>
                <input
                  id="prod-unit"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1 kg, 500 g, 1 Litre, Pack"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
                {errors.unit && <span style={{ color: '#0f172a', fontSize: 11, fontWeight: 600 }}>{errors.unit}</span>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-desc">
                Description<span className="req">*</span>
              </label>
              <textarea
                id="prod-desc"
                className="form-control"
                placeholder="Freshness details, sourcing, grade, brand information..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <span style={{ color: '#0f172a', fontSize: 11, fontWeight: 600 }}>{errors.description}</span>
              )}
            </div>

            {/* Image Selection & Preset Quick-Pick */}
            <div className="form-group">
              <label className="form-label" htmlFor="prod-image">
                Product Image URL<span className="req">*</span>
              </label>
              <input
                id="prod-image"
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                Or select from sample local grocery photos:
              </div>
              <div className="image-preset-picker">
                {DEMO_PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="image-preset-chip"
                    onClick={() => setImage(preset.url)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Live Image Preview */}
              {image && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div className="image-preview-box">
                    <img
                      src={image}
                      alt="Product preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Live Preview: Image will display at full crispness on customer app & store inventory.
                  </div>
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              marginTop: 10
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  Make Available in Store
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>
                  Allow customers to see and order this item immediately.
                </div>
              </div>
              <label className="switch-control" aria-label="Toggle availability">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-product-btn"
              className="btn btn-primary"
            >
              {mode === 'add' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
