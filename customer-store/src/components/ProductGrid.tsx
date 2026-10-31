import { useState, useMemo, type FC } from 'react';
import { ArrowUpDown, AlertCircle, RefreshCw } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  selectedCategoryName: string;
  searchQuery: string;
  onResetFilters: () => void;
}

export const ProductGrid: FC<ProductGridProps> = ({
  products,
  cartItemsMap,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  selectedCategoryName,
  searchQuery,
  onResetFilters,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating'>('featured');
  const [activeFilterChip, setActiveFilterChip] = useState<'all' | 'under100' | 'discounts' | 'topRated'>('all');

  // Filter products based on chips
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter chip
    if (activeFilterChip === 'under100') {
      list = list.filter((p) => p.price <= 100);
    } else if (activeFilterChip === 'discounts') {
      list = list.filter((p) => (p.discountPercentage || 0) >= 15);
    } else if (activeFilterChip === 'topRated') {
      list = list.filter((p) => p.rating >= 4.8);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeFilterChip, sortBy]);

  return (
    <section className="products-section" id="products-section">
      <div className="container">
        {/* Controls bar: Category Heading, Result Count, Sort & Filter chips */}
        <div className="products-header-bar">
          <div className="products-title-col">
            <h2 className="products-main-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategoryName}
            </h2>
            <p className="products-count-text">
              Showing {filteredAndSortedProducts.length} items available in DailyGrocer
            </p>
          </div>

          <div className="products-controls-col">
            {/* Filter pills */}
            <div className="filter-chips-row">
              <button
                className={`filter-chip ${activeFilterChip === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilterChip('all')}
              >
                All Items
              </button>
              <button
                className={`filter-chip ${activeFilterChip === 'under100' ? 'active' : ''}`}
                onClick={() => setActiveFilterChip('under100')}
              >
                Under ₹100
              </button>
              <button
                className={`filter-chip ${activeFilterChip === 'discounts' ? 'active' : ''}`}
                onClick={() => setActiveFilterChip('discounts')}
              >
                Big Discounts (15%+)
              </button>
              <button
                className={`filter-chip ${activeFilterChip === 'topRated' ? 'active' : ''}`}
                onClick={() => setActiveFilterChip('topRated')}
              >
                ⭐ Top Rated
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrap">
              <ArrowUpDown size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="empty-products-state">
            <div className="empty-icon-wrap">
              <AlertCircle size={36} />
            </div>
            <h3>No products found</h3>
            <p>
              We couldn't find items matching your search or filters. Try adjusting your search term or reset filters.
            </p>
            <button className="reset-filters-btn" onClick={onResetFilters}>
              <RefreshCw size={15} />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={cartItemsMap[product.id] || 0}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
