'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SizeGuide from '@/components/SizeGuide';
import { getCategories, getProducts } from '@/lib/store';
import { Category, Product } from '@/types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = () => {
    setCategories(getCategories());
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storeUpdated', loadData);
    return () => window.removeEventListener('storeUpdated', loadData);
  }, []);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const featuredProducts = products.filter((p) => p.isFeatured || p.isNew).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg">
            <Image
              src="/images/hero_image.jpg"
              alt="FarOha Brand Hero"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hero-overlay" />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-content">
              <h1 className="hero-title">الأناقة في كل التفاصيل</h1>
              <p className="hero-subtitle">
                اكتشفي تشكيلتنا المميزة من الملابس المحتشمة، المريحة والأنيقة التي تُبرز جمالكِ بأسلوب بسيط وراقٍ.
              </p>
              <div className="hero-actions">
                <Link href="/shop" className="btn btn-primary btn-lg">
                  تسوقي الآن 🛍️
                </Link>
                <Link href="/shop" className="btn btn-outline btn-lg">
                  استكشفي التشكيلة
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section (Dynamic) */}
        <section className="section bg-secondary">
          <div className="container">
            <h2 className="section-title text-center">أقسام المتجر</h2>
            <p className="section-subtitle text-center">تصفحي تشكيلاتنا المتنوعة والمصممة بحب</p>

            <div className="categories-grid">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/shop?category=${cat.id}`} className="category-card">
                  <div className="category-card-image">
                    <Image
                      src={cat.image || '/images/category_dresses.jpg'}
                      alt={cat.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="category-card-overlay" />
                  <div className="category-card-content">
                    <h3 className="category-card-name">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section (Dynamic) */}
        <section className="section">
          <div className="container">
            <h2 className="section-title text-center">المنتجات المميزة 🌸</h2>
            <p className="section-subtitle text-center">أحدث وأحدث تصاميم FarOha_Brand الأكثر طلباً</p>

            <div className="products-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/shop" className="btn btn-outline btn-lg">
                عرض جميع المنتجات في المتجر ↗
              </Link>
            </div>
          </div>
        </section>

        {/* Size Guide Section */}
        <section className="section bg-secondary text-center">
          <div className="container">
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>📏 لستِ متأكدة من مقاسكِ؟</h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>
              شاهدي دليل المقاسات التفاعلي الخاص بـ FarOha_Brand لاختيار المقاس الأنسب لكِ بسهولة
            </p>
            <button className="btn btn-outline" onClick={() => setIsSizeGuideOpen(true)}>
              عرض دليل المقاسات 📏
            </button>
            <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
