import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  X,
  PackageSearch
} from 'lucide-react';
import type { Product } from '../types';
import { CATEGORIES } from '../data/mockData';

interface ProductsProps {
  products: Product[];
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onOpenDeleteModal: (product: Product) => void;
  onToggleAvailability: (productId: string, inStock: boolean) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onToggleAvailability,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.hindiName && product.hindiName.includes(searchQuery)) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesStock = 
        stockFilter === 'all' || 
        (stockFilter === 'inStock' && product.inStock) ||
        (stockFilter === 'outOfStock' && !product.inStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  return (
    <div>
      {/* Header Row */}
      <div className="page-header-row">
        <div className="page-header-title-box">
          <h1>Product Catalog & Inventory</h1>
          <p>Manage pricing, stock quantities and instant shop availability ({products.length} total items)</p>
        </div>
        <button
          type="button"
          id="add-product-btn"
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={18} strokeWidth={2.2} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: 240 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by product name, Hindi name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-icon-only"
                style={{ position: 'absolute', right: 8 }}
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Stock Filter:</span>
            <select
              className="form-control"
              style={{ width: 'auto', height: 38 }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'inStock' | 'outOfStock')}
            >
              <option value="all">All Items ({products.length})</option>
              <option value="inStock">In Stock Only ({products.filter((p) => p.inStock).length})</option>
              <option value="outOfStock">Out of Stock ({products.filter((p) => !p.inStock).length})</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          <button
            type="button"
            className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Categories ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <PackageSearch size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>No products found</div>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, maxWidth: 360, marginInline: 'auto' }}>
            No grocery items match your search term &quot;{searchQuery}&quot; or chosen category filter.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStockFilter('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Product Details</th>
                <th>Category</th>
                <th>Price / Unit</th>
                <th>Stock Units</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  {/* Product Details */}
                  <td>
                    <div className="product-row-flex">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          // Fallback to high-quality grocery image placeholder
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="product-name-block">
                        <span className="product-name-en">{product.name}</span>
                        {product.hindiName && (
                          <span className="product-name-hi">{product.hindiName}</span>
                        )}
                        {product.sku && (
                          <span style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 1 }}>
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="badge badge-neutral">{product.category}</span>
                  </td>

                  {/* Price */}
                  <td>
                    <div>
                      <span className="product-price-val">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="mrp-strikethrough">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <span className="product-unit-val">per {product.unit}</span>
                  </td>

                  {/* Stock */}
                  <td>
                    {product.stock <= 10 && product.stock > 0 ? (
                      <span className="stock-tag low">
                        <AlertCircle size={12} color="#0f172a" />
                        {product.stock} left (Low)
                      </span>
                    ) : product.stock === 0 ? (
                      <span className="stock-tag" style={{ color: '#0f172a', fontWeight: 700 }}>
                        0 in stock
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>
                        {product.stock} units
                      </span>
                    )}
                  </td>

                  {/* Availability Toggle */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label 
                        className="switch-control" 
                        title={product.inStock ? 'Available for ordering' : 'Currently hidden from store'}
                      >
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={(e) => onToggleAvailability(product.id, e.target.checked)}
                        />
                        <span className="switch-slider" />
                      </label>
                      <span style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: product.inStock ? '#15803d' : '#64748b' 
                      }}>
                        {product.inStock ? 'In Stock' : 'Unavailable'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        id={`edit-btn-${product.id}`}
                        className="btn-icon-only"
                        title="Edit product"
                        onClick={() => onOpenEditModal(product)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        id={`delete-btn-${product.id}`}
                        className="btn-icon-only"
                        title="Delete product"
                        onClick={() => onOpenDeleteModal(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
