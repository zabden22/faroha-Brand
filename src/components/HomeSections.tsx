import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';

// ── SERVER SECTION: Categories List ──
export async function CategoriesSection() {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
  });

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image,
  }));

  return (
    <div className="categories-grid">
      {serializedCategories.map((cat) => (
        <Link key={cat.id} href={`/shop?category=${cat.id}`} className="category-card">
          <Image
            src={cat.image || '/images/category_dresses.jpg'}
            alt={cat.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 250px"
            style={{ objectFit: 'cover' }}
          />
          <div className="category-card-overlay" />
          <div className="category-card-content">
            <h3 className="category-card-name">{cat.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── SERVER SECTION: Featured Products List ──
export async function FeaturedProductsSection() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

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

  const featuredProducts = serializedProducts.filter((p) => p.isFeatured || p.isNew).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : serializedProducts.slice(0, 4);

  return (
    <div className="products-grid">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ── SKELETON LOADERS ──

export function CategoriesSkeleton() {
  return (
    <div className="categories-grid">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="shimmer-skeleton"
          style={{
            borderRadius: 'var(--radius-lg)',
            aspectRatio: '3/4',
            width: '100%',
          }}
        />
      ))}
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="products-grid">
      {Array.from({ length: 4 }).map((_, idx) => (
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
          {/* Shimmer Image Area */}
          <div
            className="shimmer-skeleton"
            style={{
              aspectRatio: '3/4',
              width: '100%',
            }}
          />
          {/* Text Placeholders */}
          <div style={{ padding: '16px', flex: 1 }}>
            <div
              className="shimmer-skeleton"
              style={{
                height: '18px',
                width: '70%',
                marginBottom: '10px',
                borderRadius: '4px',
              }}
            />
            <div
              className="shimmer-skeleton"
              style={{
                height: '14px',
                width: '40%',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
