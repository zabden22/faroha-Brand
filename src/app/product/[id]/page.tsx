import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailClient from '@/components/ProductDetailClient';
import prisma from '@/lib/prisma';

// Enable ISR (Incremental Static Regeneration)
// Cache the product details statically, revalidate at most once every 60 seconds (or on-demand via revalidatePath)
export const revalidate = 60;

// Dynamic SEO metadata generation on the server
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);

  if (isNaN(productId)) return {};

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true, description: true },
  });

  if (!product) return {};

  return {
    title: `${product.name} | FarOha_Brand`,
    description: product.description.substring(0, 155),
    openGraph: {
      title: `${product.name} | FarOha_Brand`,
      description: product.description.substring(0, 155),
    },
  };
}

// Pre-generate product pages at build time for extreme loading speed
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true },
    });
    return products.map((p) => ({
      id: String(p.id),
    }));
  } catch (e) {
    console.error('Error generating static params:', e);
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Lightweight categories query for Navbar so it loads instantly
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { id: 'asc' },
  }).catch(() => []);

  return (
    <>
      {/* Pass categories to Navbar to avoid client-side API roundtrip on load */}
      <Navbar initialCategories={categories} />

      <main className="product-detail">
        <div className="container">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductDataWrapper params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ── SERVER DATA WRAPPER: Executes database queries inside Suspense ──
async function ProductDataWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);

  if (isNaN(productId)) {
    notFound();
  }

  // Fetch product data
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch up to 3 similar products in the same category
  const similarProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
    },
    include: {
      images: true,
      variants: true,
    },
    take: 3,
  });

  // Serialize product and similar products
  const serializedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      image: product.category.image,
    } : undefined,
    images: product.images.map((img) => ({
      id: img.id,
      productId: img.productId,
      imageUrl: img.imageUrl,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
    })),
  };

  const serializedSimilarProducts = similarProducts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    images: p.images.map((img) => ({
      id: img.id,
      productId: img.productId,
      imageUrl: img.imageUrl,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
    })),
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>الرئيسية</span>
        <span className="breadcrumb-separator">/</span>
        <span>المتجر</span>
        <span className="breadcrumb-separator">/</span>
        <span>{serializedProduct.name}</span>
      </div>

      {/* Interactive Client Gallery & Selection Section */}
      <ProductDetailClient product={serializedProduct} />

      {/* Similar Products */}
      {serializedSimilarProducts.length > 0 && (
        <div className="section" style={{ marginTop: '60px' }}>
          <h2 className="section-title">قد يعجبكِ أيضاً</h2>
          <div className="products-grid" style={{ marginTop: '24px' }}>
            {serializedSimilarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── SKELETON LOADER FOR PRODUCT DETAIL PAGE ──
function ProductSkeleton() {
  return (
    <div style={{ paddingBlock: '12px' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <div className="shimmer-skeleton" style={{ height: '16px', width: '60px', borderRadius: '4px' }} />
        <span style={{ color: '#ccc' }}>/</span>
        <div className="shimmer-skeleton" style={{ height: '16px', width: '50px', borderRadius: '4px' }} />
        <span style={{ color: '#ccc' }}>/</span>
        <div className="shimmer-skeleton" style={{ height: '16px', width: '120px', borderRadius: '4px' }} />
      </div>

      <div className="product-detail-grid">
        {/* Gallery Image Skeleton */}
        <div className="product-gallery">
          <div
            className="shimmer-skeleton"
            style={{
              width: '100%',
              minHeight: '450px',
              borderRadius: '12px',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="shimmer-skeleton"
                style={{ width: '72px', height: '72px', borderRadius: '8px' }}
              />
            ))}
          </div>
        </div>

        {/* Details Spec Skeleton */}
        <div className="product-info">
          {/* Title */}
          <div
            className="shimmer-skeleton"
            style={{ height: '36px', width: '80%', marginBottom: '14px', borderRadius: '6px' }}
          />

          {/* Price */}
          <div
            className="shimmer-skeleton"
            style={{ height: '28px', width: '30%', marginBottom: '18px', borderRadius: '6px' }}
          />

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <div className="shimmer-skeleton" style={{ height: '16px', width: '100%', borderRadius: '4px' }} />
            <div className="shimmer-skeleton" style={{ height: '16px', width: '95%', borderRadius: '4px' }} />
            <div className="shimmer-skeleton" style={{ height: '16px', width: '70%', borderRadius: '4px' }} />
          </div>

          {/* Color Option placeholder */}
          <div style={{ marginBottom: '20px' }}>
            <div className="shimmer-skeleton" style={{ height: '16px', width: '90px', marginBottom: '8px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shimmer-skeleton"
                  style={{ height: '36px', width: '90px', borderRadius: '20px' }}
                />
              ))}
            </div>
          </div>

          {/* Size Option placeholder */}
          <div style={{ marginBottom: '20px' }}>
            <div className="shimmer-skeleton" style={{ height: '16px', width: '70px', marginBottom: '8px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shimmer-skeleton"
                  style={{ height: '36px', width: '55px', borderRadius: '8px' }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            <div className="shimmer-skeleton" style={{ height: '48px', flex: 1, minWidth: '150px', borderRadius: '8px' }} />
            <div className="shimmer-skeleton" style={{ height: '48px', flex: 1, minWidth: '150px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
