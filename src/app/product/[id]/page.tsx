'use client';

import { useState, use, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SizeGuide from '@/components/SizeGuide';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((e) => console.error('Error fetching product:', e));
  }, []);

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]?.imageUrl || '/images/category_dresses.jpg');
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care'>('details');

  const similarProducts = products.filter((p) => p.id !== product?.id).slice(0, 3);

  const handleAddToCart = (buyNow = false) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
      const itemIndex = existingCart.findIndex(
        (item: any) => item.productId === product.id && item.variantId === selectedVariant?.id
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
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="product-gallery-main">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={600}
                  height={800}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  priority
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="product-gallery-thumbs">
                  {product.images.map((img) => (
                    <div
                      key={img.id}
                      className={`product-gallery-thumb ${selectedImage === img.imageUrl ? 'active' : ''}`}
                      onClick={() => setSelectedImage(img.imageUrl)}
                    >
                      <Image src={img.imageUrl} alt="" width={80} height={80} style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
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
              {product.variants && (
                <div className="product-options">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="product-option-label">اختاري المقاس:</span>
                    <button className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>
                      📐 دليل المقاسات
                    </button>
                  </div>

                  <div className="size-options">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`size-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`}
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
                <button className="btn btn-primary btn-lg" onClick={() => handleAddToCart(false)}>
                  أضيفي للسلة 🛒
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => handleAddToCart(true)}>
                  اشتري الآن ⚡
                </button>
              </div>

              {/* Product Spec Tabs */}
              <div className="product-tabs">
                <div className="product-tabs-nav">
                  <button
                    className={`product-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    مواصفات القطعة
                  </button>
                  <button
                    className={`product-tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                    onClick={() => setActiveTab('care')}
                  >
                    تعليمات العناية والتعليمات
                  </button>
                </div>

                <div style={{ paddingBlock: '12px', fontSize: '14px', lineHeight: '1.8' }}>
                  {activeTab === 'details' ? (
                    <ul>
                      <li>• <strong>نوع القماش:</strong> {product.material || 'قطن خفيف ومريح'}</li>
                      <li>• <strong>القصّة:</strong> {product.fit || 'فضفاض ومريح (Oversized)'}</li>
                      <li>• <strong>التطريز:</strong> خياطة دقيقة متينة تدوم مع الغسيل المتكرر</li>
                    </ul>
                  ) : (
                    <p>{product.careInstructions || 'يُفضل الغسيل بماء بارد وتجنب استخدام المبيضات للحفاظ على رونق الألوان.'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="section" style={{ marginTop: '60px' }}>
            <h2 className="section-title">قد يعجبكِ أيضاً</h2>
            <div className="products-grid" style={{ marginTop: '24px' }}>
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer />
    </>
  );
}
