'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('all');
  const [priceSort, setPriceSort] = useState<'newest' | 'low-to-high' | 'high-to-low'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | 'all'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        const [cats, prods] = await Promise.all([
          catsRes.json(),
          prodsRes.json(),
        ]);
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(prods)) setProducts(prods);
      } catch (e) {
        console.error('Error loading shop data:', e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (catParam) {
      if (catParam === 'esdals') {
        const found = categories.find((c) => c.name.includes('إسدال'));
        if (found) setSelectedCategory(found.id);
      } else if (!isNaN(Number(catParam))) {
        setSelectedCategory(Number(catParam));
      }
    }
  }, [catParam, categories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
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
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (priceSort === 'low-to-high') return priceA - priceB;
        if (priceSort === 'high-to-low') return priceB - priceA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, priceSort, searchQuery, selectedSize]);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-2xl)' }}>
      {/* Header & Controls */}
      <div className="shop-header">
        <div>
          <h1 className="section-title">المتجر 🌸</h1>
          <p className="shop-results">عرض {filteredProducts.length} من أصل {products.length} منتج</p>
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
            <h3 className="filter-title">بحث في المتجر</h3>
            <input
              type="text"
              placeholder="ابحثي عن فستان، إسدال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Dynamic Categories */}
          <div className="filter-group">
            <h3 className="filter-title">الأقسام</h3>
            <div className="filter-options">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                جميع الأقسام ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div className="filter-group">
            <h3 className="filter-title">المقاس</h3>
            <div className="filter-options" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '8px' }}>
              {['all', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  className={`btn btn-sm ${selectedSize === sz ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz === 'all' ? 'الكل' : sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div style={{ flex: 1 }}>
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">لا توجد نتائج مطابقة لفلترتكِ</h3>
              <p>جربي الفلترة بقسم آخر أو البحث عن كلمة رئيسية أخرى.</p>
              <button
                className="btn btn-outline"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedSize('all');
                }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="shop-page">
        <Suspense fallback={<div className="container" style={{ padding: '60px', textAlign: 'center' }}>جاري تحميل المتجر...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
