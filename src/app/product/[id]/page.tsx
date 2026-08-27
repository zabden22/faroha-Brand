'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SizeGuide from '@/components/SizeGuide';
import { Product } from '@/types';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoMain, setShowVideoMain] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'video'>('details');

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((e) => console.error('Error fetching product:', e))
      .finally(() => setIsLoaded(true));
  }, []);

  const product = products.find((p) => p.id === productId);

  // Sync default variant and reset image index when product is loaded
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedVariant(product.variants?.[0] || null);
    }
  }, [product?.id]);

  const imagesList =
    product?.images && product.images.length > 0
      ? product.images.map((img) => img.imageUrl)
      : ['/images/category_dresses.jpg'];

  const currentImage = imagesList[currentImageIndex] || imagesList[0];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imagesList.length - 1 ? 0 : prev + 1
    );
  };

  const similarProducts = products
    .filter((p) => p.id !== product?.id)
    .slice(0, 3);

  const handleAddToCart = (buyNow = false) => {
    if (!product) return;
    try {
      const existingCart = JSON.parse(
        localStorage.getItem('faroha_cart') || '[]'
      );
      const itemIndex = existingCart.findIndex(
        (item: any) =>
          item.productId === product.id &&
          item.variantId === selectedVariant?.id
      );

      if (itemIndex > -1) {
        existingCart[itemIndex].quantity += quantity;
      } else {
        existingCart.push({
          productId: product.id,
          variantId: selectedVariant?.id || null,
          product,
          variant: selectedVariant,
          quantity,
        });
      }

      localStorage.setItem('faroha_cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));

      if (buyNow) {
        window.location.href = '/checkout';
      } else {
        alert(`تمت إضافة ${quantity} من "${product.name}" إلى السلة! 🛍️`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Loading state ──
  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="product-detail">
          <div className="container">
            <div className="loading-page">
              <div
                className="loading-spinner"
                style={{ width: 40, height: 40, borderWidth: 4 }}
              />
              <p style={{ color: 'var(--color-text-light)', marginTop: 12 }}>
                جاري تحميل المنتج...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Product not found ──
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="product-detail">
          <div className="container">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">المنتج غير موجود</h3>
              <p>يبدو أن هذا المنتج غير متوفر أو تم حذفه.</p>
              <Link
                href="/shop"
                className="btn btn-primary btn-lg"
                style={{ marginTop: 24, display: 'inline-flex' }}
              >
                العودة للمتجر
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Helper to render video player or iframe for all platforms
  const renderVideoPlayer = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();

    const isDirectVideo =
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.m4v') ||
      cleanUrl.includes('blob:') ||
      cleanUrl.includes('data:video');

    if (isDirectVideo) {
      return (
        <video
          src={cleanUrl}
          controls
          playsInline
          style={{
            width: '100%',
            maxHeight: '450px',
            borderRadius: '12px',
            background: '#000',
          }}
        />
      );
    }

    // Embed for YouTube / YouTube Shorts
    let embedUrl = cleanUrl;
    if (cleanUrl.includes('youtube.com/shorts/')) {
      const id = cleanUrl.split('youtube.com/shorts/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (cleanUrl.includes('youtube.com/watch?v=')) {
      embedUrl = cleanUrl.replace('watch?v=', 'embed/');
    } else if (cleanUrl.includes('youtu.be/')) {
      embedUrl = cleanUrl.replace('youtu.be/', 'youtube.com/embed/');
    } else if (cleanUrl.includes('instagram.com/reel/') || cleanUrl.includes('instagram.com/p/')) {
      const match = cleanUrl.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
      if (match && match[1]) {
        embedUrl = `https://www.instagram.com/p/${match[1]}/embed/`;
      }
    } else if (cleanUrl.includes('streamable.com/')) {
      const id = cleanUrl.split('streamable.com/')[1]?.split('?')[0];
      embedUrl = `https://streamable.com/e/${id}`;
    } else if (cleanUrl.includes('drive.google.com/file/d/')) {
      const id = cleanUrl.split('/d/')[1]?.split('/')[0];
      embedUrl = `https://drive.google.com/file/d/${id}/preview`;
    }

    return (
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          background: '#000',
        }}
      >
        <iframe
          src={embedUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">الرئيسية</Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/shop">المتجر</Link>
            <span className="breadcrumb-separator">/</span>
            <span>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* Multi-Image & Video Gallery */}
            <div className="product-gallery">
              <div
                className="product-gallery-main"
                style={{ position: 'relative', overflow: 'hidden', minHeight: '400px', background: '#f5efe9' }}
              >
                {showVideoMain && product.videoUrl ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '8px', minHeight: '450px' }}>
                    {renderVideoPlayer(product.videoUrl)}
                    <button
                      onClick={() => setShowVideoMain(false)}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '12px', background: 'rgba(255,255,255,0.9)', color: '#222' }}
                    >
                      ← العودة لصور المنتج 📷
                    </button>
                  </div>
                ) : (
                  <>
                    <Image
                      src={currentImage}
                      alt={product.name}
                      width={600}
                      height={800}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        transition: 'opacity 0.2s ease',
                      }}
                      priority
                    />

                    {/* Multiple Images Navigation Arrows */}
                    {imagesList.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          title="الصورة السابقة"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '12px',
                            transform: 'translateY(-50%)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--color-primary-dark)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 2,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ›
                        </button>
                        <button
                          onClick={handleNextImage}
                          title="الصورة التالية"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '12px',
                            transform: 'translateY(-50%)',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--color-primary-dark)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            zIndex: 2,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          ‹
                        </button>

                        {/* Image Counter Badge */}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            background: 'rgba(0, 0, 0, 0.65)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '12px',
                            fontWeight: 600,
                            zIndex: 2,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {currentImageIndex + 1} / {imagesList.length} 📷
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnails row (Images + Video thumbnail) */}
              <div
                className="product-gallery-thumbs"
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}
              >
                {imagesList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`product-gallery-thumb ${
                      !showVideoMain && currentImageIndex === idx ? 'active' : ''
                    }`}
                    onClick={() => {
                      setShowVideoMain(false);
                      setCurrentImageIndex(idx);
                    }}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border:
                        !showVideoMain && currentImageIndex === idx
                          ? '2px solid var(--color-primary)'
                          : '2px solid transparent',
                      opacity: !showVideoMain && currentImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Image
                      src={imgUrl}
                      alt={`صورة مصغرة ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}

                {/* Video thumbnail if available */}
                {product.videoUrl && (
                  <div
                    className={`product-gallery-thumb ${showVideoMain ? 'active' : ''}`}
                    onClick={() => setShowVideoMain(true)}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1B263B 0%, #3D3029 100%)',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: showVideoMain
                        ? '2px solid var(--color-primary)'
                        : '2px solid transparent',
                      opacity: showVideoMain ? 1 : 0.75,
                      transition: 'all 0.2s ease',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🎬</span>
                    <span style={{ fontSize: '10px', fontWeight: 700 }}>فيديو</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details & Actions */}
            <div className="product-info">
              <h1 className="product-info-title">{product.name}</h1>

              <div className="product-info-price">
                {product.discountPrice ? (
                  <>
                    <span className="current">{product.discountPrice} ج.م</span>
                    <span className="original">{product.price} ج.م</span>
                    <span className="discount-badge">
                      وفّري {product.price - product.discountPrice} ج.م
                    </span>
                  </>
                ) : (
                  <span className="current">{product.price} ج.م</span>
                )}
              </div>

              <p className="product-info-description">{product.description}</p>

              {/* Sizes Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="product-options">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span className="product-option-label">اختاري المقاس واللون:</span>
                    <button
                      className="size-guide-link"
                      onClick={() => setSizeGuideOpen(true)}
                    >
                      📐 دليل المقاسات
                    </button>
                  </div>

                  <div className="size-options">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`size-btn ${
                          selectedVariant?.id === variant.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.size} ({variant.color})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="stock-status in-stock">
                <span className="status-dot"></span>
                <span>متوفر في المخزون (جاهز للشحن الفوري)</span>
              </div>

              {/* Quantity */}
              <div className="product-options">
                <span className="product-option-label">الكمية:</span>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="product-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleAddToCart(false)}
                >
                  أضيفي للسلة 🛒
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => handleAddToCart(true)}
                >
                  اشتري الآن ⚡
                </button>
              </div>

              {/* Product Spec Tabs & Video */}
              <div className="product-tabs">
                <div className="product-tabs-nav">
                  <button
                    className={`product-tab-btn ${
                      activeTab === 'details' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    مواصفات القطعة
                  </button>
                  <button
                    className={`product-tab-btn ${
                      activeTab === 'care' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('care')}
                  >
                    تعليمات العناية
                  </button>
                  {product.videoUrl && (
                    <button
                      className={`product-tab-btn ${
                        activeTab === 'video' ? 'active' : ''
                      }`}
                      onClick={() => setActiveTab('video')}
                    >
                      فيديو المنتج 🎬
                    </button>
                  )}
                </div>

                <div
                  style={{
                    paddingBlock: '12px',
                    fontSize: '14px',
                    lineHeight: '1.8',
                  }}
                >
                  {activeTab === 'details' && (
                    <ul>
                      <li>
                        • <strong>نوع القماش:</strong>{' '}
                        {product.material || 'قطن خفيف ومريح'}
                      </li>
                      <li>
                        • <strong>القصّة:</strong>{' '}
                        {product.fit || 'فضفاض ومريح (Oversized)'}
                      </li>
                      <li>
                        • <strong>التطريز والجودة:</strong> خياطة دقيقة متينة
                        تدوم مع الغسيل المتكرر
                      </li>
                    </ul>
                  )}

                  {activeTab === 'care' && (
                    <p>
                      {product.careInstructions ||
                        'يُفضل الغسيل بماء بارد وتجنب استخدام المبيضات للحفاظ على رونق الألوان.'}
                    </p>
                  )}

                  {activeTab === 'video' && product.videoUrl && (
                    <div style={{ marginTop: '8px' }}>
                      {renderVideoPlayer(product.videoUrl)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="section" style={{ marginTop: '60px' }}>
              <h2 className="section-title">قد يعجبكِ أيضاً</h2>
              <div className="products-grid" style={{ marginTop: '24px' }}>
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SizeGuide
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
      <Footer />
    </>
  );
}
