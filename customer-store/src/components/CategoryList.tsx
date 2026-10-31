import type { CSSProperties, FC } from 'react';
import { Apple, Milk, Wheat, Cookie, Coffee, Sparkles, LayoutGrid } from 'lucide-react';
import type { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  totalProductsCount: number;
}

export const CategoryList: FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Apple':
        return <Apple size={22} className="cat-icon" />;
      case 'Milk':
        return <Milk size={22} className="cat-icon" />;
      case 'Wheat':
        return <Wheat size={22} className="cat-icon" />;
      case 'Cookie':
        return <Cookie size={22} className="cat-icon" />;
      case 'Coffee':
        return <Coffee size={22} className="cat-icon" />;
      case 'Sparkles':
        return <Sparkles size={22} className="cat-icon" />;
      default:
        return <LayoutGrid size={22} className="cat-icon" />;
    }
  };

  return (
    <section className="categories-section" id="categories-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle">Everything you need for your home, sorted and fresh</p>
          </div>
          {selectedCategory !== 'all' && (
            <button 
              className="clear-cat-btn"
              onClick={() => onSelectCategory('all')}
            >
              Reset to All ({totalProductsCount})
            </button>
          )}
        </div>

        {/* Scrollable horizontal category cards */}
        <div className="categories-scroll-wrapper">
          {/* All categories pill */}
          <button
            className={`category-item-card ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCategory('all')}
            style={{ '--cat-bg': '#f1f5f9' } as CSSProperties}
          >
            <div className="cat-icon-container">
              <LayoutGrid size={22} className="cat-icon" />
            </div>
            <span className="cat-name">All Items</span>
            <span className="cat-count-chip">{totalProductsCount} items</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-item-card ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                style={{ '--cat-bg': cat.color } as CSSProperties}
              >
                {cat.badge && (
                  <span className="cat-badge-pill">{cat.badge}</span>
                )}
                <div className="cat-icon-container">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count-chip">{cat.itemCount} items</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
