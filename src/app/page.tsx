import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SizeGuideButton from '@/components/SizeGuideButton';
import { BagIcon, FlowerIcon, RulerIcon } from '@/components/Icons';
import {
  CategoriesSection,
  FeaturedProductsSection,
  CategoriesSkeleton,
  ProductsSkeleton,
} from '@/components/HomeSections';
import prisma from '@/lib/prisma';

// Enable ISR (Incremental Static Regeneration)
// Cache the homepage statically, revalidate at most once every 60 seconds (or on-demand via revalidatePath)
export const revalidate = 60;

export default async function Home() {
  // Lightweight query for Navbar categories so it renders immediately without blocking page stream
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { id: 'asc' },
  }).catch(() => []);

  return (
    <>
      {/* Pass categories to Navbar to avoid client-side API roundtrip on load */}
      <Navbar initialCategories={categories} />

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
                <Link href="/shop" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <BagIcon size={20} />
                  تسوقي الآن
                </Link>
                <Link href="/shop" className="btn btn-outline btn-lg">
                  استكشفي التشكيلة
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section (Streamed via Suspense) */}
        <section className="section bg-secondary">
          <div className="container">
            <h2 className="section-title text-center">أقسام المتجر</h2>
            <p className="section-subtitle text-center">تصفحي تشكيلاتنا المتنوعة والمصممة بحب</p>

            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesSection />
            </Suspense>
          </div>
        </section>

        {/* Featured Products Section (Streamed via Suspense) */}
        <section className="section">
          <div className="container">
            <h2 className="section-title text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FlowerIcon size={24} style={{ color: 'var(--color-primary)' }} />
              المنتجات المميزة
            </h2>
            <p className="section-subtitle text-center">أحدث وأحدث تصاميم FarOha_Brand الأكثر طلباً</p>

            <Suspense fallback={<ProductsSkeleton />}>
              <FeaturedProductsSection />
            </Suspense>

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
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RulerIcon size={22} style={{ color: 'var(--color-primary)' }} />
              لستِ متأكدة من مقاسكِ؟
            </h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '16px' }}>
              شاهدي دليل المقاسات التفاعلي الخاص بـ FarOha_Brand لاختيار المقاس الأنسب لكِ بسهولة
            </p>
            <SizeGuideButton />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
