'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import SizeGuide from './SizeGuide';
import {
  CameraIcon,
  VideoIcon,
  RulerIcon,
  CartIcon,
  LightningIcon,
} from '@/components/Icons';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideoMain, setShowVideoMain] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'video'>('details');

  // Extract all unique available colors defined by the admin
  const availableColors = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];
    const colorMap = new Map<string, { color: string; colorHex: string }>();
    product.variants.forEach((v) => {
      if (v.color && v.color.trim()) {
        const key = v.color.trim();
        if (!colorMap.has(key)) {
          colorMap.set(key, {
            color: key,
            colorHex: v.colorHex || '#888888',
          });
        }
      }
    });
    return Array.from(colorMap.values());
  }, [product]);

  // Extract all unique available sizes defined by the admin
  const availableSizes = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];
    const sizeSet = new Set<string>();
    product.variants.forEach((v) => {
      if (v.size && v.size.trim()) sizeSet.add(v.size.trim());
    });
    return Array.from(sizeSet);
  }, [product]);

  // Sync default color, size and variant when product is loaded
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      const firstVar = product.variants?.[0];
      if (firstVar) {
        setSelectedVariant(firstVar);
        setSelectedColor(firstVar.color || '');
        setSelectedSize(firstVar.size || 'L');
      } else {
        setSelectedVariant(null);
        setSelectedColor('');
        setSelectedSize('L');
      }
    }
  }, [product?.id]);

  // Handler when user selects a color
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const matched =
      product?.variants?.find(
        (v) => v.color === colorName && v.size === selectedSize
      ) ||
      product?.variants?.find((v) => v.color === colorName) ||
      selectedVariant;
    if (matched) setSelectedVariant(matched);
  };

  // Handler when user selects a size
  const handleSelectSize = (sizeName: string) => {
    setSelectedSize(sizeName);
    const matched =
      product?.variants?.find(
        (v) => v.size === sizeName && v.color === selectedColor
      ) ||
      product?.variants?.find((v) => v.size === sizeName) ||
      selectedVariant;
    if (matched) setSelectedVariant(matched);
  };

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

  const handleAddToCart = (buyNow = false) => {
    if (!product) return;
    try {
      const activeColor = selectedColor || availableColors[0]?.color || 'افتراضي';
      const activeSize = selectedSize || availableSizes[0] || 'L';

      const variantData = selectedVariant || {
        id: 0,
        productId: product.id,
        size: activeSize,
        color: activeColor,
        colorHex: availableColors.find((c) => c.color === activeColor)?.colorHex || '#888888',
        stock: 10,
      };

      const existingCart = JSON.parse(
        localStorage.getItem('faroha_cart') || '[]'
      );
      const itemIndex = existingCart.findIndex(
        (item: any) =>
          item.productId === product.id &&
          item.variant?.color === activeColor &&
          item.variant?.size === activeSize
      );

      if (itemIndex > -1) {
        existingCart[itemIndex].quantity += quantity;
      } else {
        existingCart.push({
          productId: product.id,
          variantId: variantData.id || null,
          product,
          variant: variantData,
          quantity,
        });
      }

      localStorage.setItem('faroha_cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));

      if (buyNow) {
        window.location.href = '/checkout';
      } else {
        alert(`تمت إضافة ${quantity} من "${product.name}" (اللون: ${activeColor}) إلى السلة!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
                  style={{ marginTop: '12px', background: 'rgba(255,255,255,0.9)', color: '#222', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  العودة لصور المنتج
                  <CameraIcon size={16} />
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{currentImageIndex + 1} / {imagesList.length}</span>
                      <CameraIcon size={14} />
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
                <VideoIcon size={20} style={{ color: 'white' }} />
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

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="product-options" style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span className="product-option-label" style={{ marginBottom: 0, fontSize: '15px' }}>
                  اللون المختار:{' '}
                  <strong
                    style={{
                      color: 'var(--color-primary-dark)',
                      fontWeight: 800,
                      fontSize: '15px',
                    }}
                  >
                    {selectedColor || availableColors[0]?.color}
                  </strong>
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                  (متوفر {availableColors.length} {availableColors.length === 1 ? 'لون' : 'ألوان'})
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableColors.map((c) => {
                  const isSelected =
                    selectedColor === c.color ||
                    (!selectedColor && c.color === availableColors[0]?.color);
                  const isLight =
                    c.colorHex.toLowerCase() === '#ffffff' ||
                    c.colorHex.toLowerCase() === '#fff' ||
                    c.color === 'أبيض';

                  return (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => handleSelectColor(c.color)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-surface)' : 'white',
                        color: isSelected
                          ? 'var(--color-primary-dark)'
                          : 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 3px 10px rgba(155, 123, 107, 0.25)'
                          : '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: c.colorHex,
                          border: isLight
                            ? '1px solid #ccc'
                            : '1px solid rgba(0,0,0,0.15)',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
                          display: 'inline-block',
                        }}
                      />
                      <span>{c.color}</span>
                      {isSelected && (
                        <span
                          style={{
                            color: 'var(--color-primary)',
                            fontSize: '14px',
                            fontWeight: 800,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes Selection */}
          {availableSizes.length > 0 && (
            <div className="product-options" style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span className="product-option-label" style={{ marginBottom: 0, fontSize: '15px' }}>
                  المقاس:{' '}
                  <strong
                    style={{
                      color: 'var(--color-primary-dark)',
                      fontWeight: 800,
                    }}
                  >
                    {selectedSize || availableSizes[0]}
                  </strong>
                </span>
                <button
                  className="size-guide-link"
                  onClick={() => setSizeGuideOpen(true)}
                  style={{
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RulerIcon size={14} />
                  دليل المقاسات
                </button>
              </div>

              <div
                className="size-options"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
              >
                {availableSizes.map((sz) => {
                  const isSelected =
                    selectedSize === sz ||
                    (!selectedSize && sz === availableSizes[0]);
                  return (
                    <button
                      key={sz}
                      type="button"
                      className={`size-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectSize(sz)}
                      style={{
                        minWidth: '55px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: isSelected
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        background: isSelected ? 'var(--color-primary)' : 'white',
                        color: isSelected ? 'white' : 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
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
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <CartIcon size={20} />
              أضيفي للسلة
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => handleAddToCart(true)}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <LightningIcon size={20} />
              اشتري الآن
            </button>
          </div>

          {/* Product Spec Tabs */}
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
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <VideoIcon size={14} />
                  فيديو المنتج
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

      <SizeGuide
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </>
  );
}
