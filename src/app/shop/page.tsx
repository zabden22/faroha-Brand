'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/store';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [priceSort, setPriceSort] = useState<'newest' | 'low-to-high' | 'high-to-low'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | 'all'>('all');

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== Number(selectedCategory)) {
        return false;
      }
      // Size filter
      if (selectedSize !== 'all') {
        const hasSize = product.variants?.some((v) => v.size === selectedSize);
        if (!hasSize) return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (priceSort === 'low-to-high') return priceA - priceB;
      if (priceSort === 'high-to-low') return priceB - priceA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [selectedCategory, priceSort, searchQuery, selectedSize]);

  return (
    <>
      <Navbar />

      <main className="shop-page">
        <div className="container">
          {/* Header & Controls */}
          <div className="shop-header">
            <div>
              <h1 className="section-title">المتجر</h1>
              <p className="shop-results">عرض {filteredProducts.length} من أصل {INITIAL_PRODUCTS.length} منتج</p>
            </div>

            <div className="shop-sort">
              <label htmlFor="sort-select" style={{ fontSize: '14px', fontWeight: 500 }}>
                ترتيب حسب:
              </label>
              <select
                id="sort-select"
                value={priceSort}
                onChange={(e: any) => setPriceSort(e.target.value)}
              >
                <option value="newest">الأحدث وصولاً</option>
                <option value="low-to-high">السعر: من الأقل للأعلى</option>
                <option value="high-to-low">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          <div className="shop-layout">
            {/* Sidebar Filters */}
            <aside className="shop-filters">
              {/* Search */}
              <div className="filter-group">
                <h3 className="filter-title">بحث</h3>
                <input
                  type="text"
                  placeholder="ابحثي عن فستان، إسدال..."
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="filter-group">
                <h3 className="filter-title">الأقسام</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                    />
                    <span>جميع الأقسام</span>
                  </label>
                  {INITIAL_CATEGORIES.map((cat) => (
                    <label key={cat.id} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="filter-group">
                <h3 className="filter-title">المقاس</h3>
                <div className="filter-options">
                  {['all', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <label key={size} className="filter-option">
                      <input
                        type="radio"
                        name="size"
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                      />
                      <span>{size === 'all' ? 'جميع المقاسات' : size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <section>
              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3 className="empty-state-title">لا توجد منتجات مطابقة لخيارات البحث</h3>
                  <p>جربي تغيير الخيارات أو إعادة ضبط التصفية</p>
                  <button
                    style={{ marginTop: '16px' }}
                    className="btn btn-outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSize('all');
                      setSearchQuery('');
                    }}
                  >
                    إعادة ضبط التصفية
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
