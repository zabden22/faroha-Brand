import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopContent from '@/components/ShopContent';
import prisma from '@/lib/prisma';

// Enable ISR (Incremental Static Regeneration)
// Cache the shop page statically, revalidate at most once every 60 seconds (or on-demand via revalidatePath)
export const revalidate = 60;

export default async function ShopPage() {
  // Lightweight query for Navbar categories so it renders immediately without blocking page stream
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { id: 'asc' },
  }).catch(() => []);

  return (
    <>
      {/* Pass categories to Navbar to avoid client-side API roundtrip on load */}
      <Navbar initialCategories={categories} />
      
      <main className="shop-page">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopDataWrapper />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

// ── SERVER DATA WRAPPER: Executes database queries inside Suspense ──
async function ShopDataWrapper() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { id: 'asc' },
    }),
    prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Serialize models to plain JSON objects (converting Date to ISOString) to satisfy Next.js page prop serialization
  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image,
    _count: cat._count,
  }));

  const serializedProducts = products.map((prod) => ({
    ...prod,
    createdAt: prod.createdAt.toISOString(),
    category: prod.category ? {
      id: prod.category.id,
      name: prod.category.name,
      image: prod.category.image,
    } : undefined,
    images: prod.images.map((img) => ({
      id: img.id,
      productId: img.productId,
      imageUrl: img.imageUrl,
    })),
    variants: prod.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
    })),
  }));

  return (
    <ShopContent
      initialProducts={serializedProducts}
      initialCategories={serializedCategories}
    />
  );
}

// ── SKELETON LOADER FOR SHOP PAGE ──
function ShopSkeleton() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-2xl)' }}>
      {/* Header Skeleton */}
      <div className="shop-header" style={{ marginBottom: '32px' }}>
        <div>
          <div
            className="shimmer-skeleton"
            style={{ height: '32px', width: '150px', marginBottom: '8px', borderRadius: '6px' }}
          />
          <div
            className="shimmer-skeleton"
            style={{ height: '18px', width: '100px', borderRadius: '4px' }}
          />
        </div>
        <div
          className="shimmer-skeleton"
          style={{ height: '38px', width: '200px', borderRadius: '8px' }}
        />
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters Skeleton */}
        <aside className="shop-filters">
          <div className="filter-group">
            <div
              className="shimmer-skeleton"
              style={{ height: '20px', width: '100px', marginBottom: '12px', borderRadius: '4px' }}
            />
            <div
              className="shimmer-skeleton"
              style={{ height: '42px', width: '100%', borderRadius: '8px' }}
            />
          </div>

          <div className="filter-group">
            <div
              className="shimmer-skeleton"
              style={{ height: '20px', width: '80px', marginBottom: '12px', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shimmer-skeleton"
                  style={{ height: '36px', width: '100%', borderRadius: '6px' }}
                />
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div
              className="shimmer-skeleton"
              style={{ height: '20px', width: '60px', marginBottom: '12px', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shimmer-skeleton"
                  style={{ height: '32px', width: '45px', borderRadius: '6px' }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid Skeleton */}
        <div style={{ flex: 1 }}>
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-light)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className="shimmer-skeleton"
                  style={{ aspectRatio: '3/4', width: '100%' }}
                />
                <div style={{ padding: '16px', flex: 1 }}>
                  <div
                    className="shimmer-skeleton"
                    style={{ height: '18px', width: '80%', marginBottom: '10px', borderRadius: '4px' }}
                  />
                  <div
                    className="shimmer-skeleton"
                    style={{ height: '14px', width: '35%', borderRadius: '4px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
