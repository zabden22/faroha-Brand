'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
        setCartItems(cart);
      } catch (e) {
        setCartItems([]);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
    localStorage.setItem('faroha_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('faroha_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: '24px' }}>
            سلة التسوق 🛒
          </h1>

          {cartItems.length > 0 ? (
            <div className="cart-grid">
              {/* Cart Items List */}
              <div className="cart-items">
                {cartItems.map((item, idx) => {
                  const p = item.product;
                  const price = p?.discountPrice || p?.price || 0;
                  const img = p?.images?.[0]?.imageUrl || '/images/category_dresses.jpg';

                  return (
                    <div key={idx} className="cart-item">
                      <div className="cart-item-image">
                        <Image src={img} alt={p?.name || ''} width={100} height={120} style={{ objectFit: 'cover' }} />
                      </div>

                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{p?.name}</h3>
                        {item.variant && (
                          <span className="cart-item-variant">
                            المقاس: {item.variant.size} | اللون: {item.variant.color}
                          </span>
                        )}
                        <span className="cart-item-price">{price} ج.م</span>

                        <div className="cart-item-actions">
                          <div className="quantity-selector">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button className="cart-item-remove" onClick={() => removeItem(idx)}>
                            حذف من السلة
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Box */}
              <div className="cart-summary">
                <h3 className="cart-summary-title">ملخص الطلب</h3>

                <div className="cart-summary-row">
                  <span>المجموع الفرعي:</span>
                  <span style={{ fontWeight: 600 }}>{subtotal} ج.م</span>
                </div>

                <div className="cart-summary-row">
                  <span>مصاريف الشحن:</span>
                  <span style={{ color: 'var(--color-text-light)', fontSize: '13px' }}>
                    تُحسب في الخطوة التالية
                  </span>
                </div>

                <div className="cart-summary-row total">
                  <span>الإجمالي المبدئي:</span>
                  <span>{subtotal} ج.م</span>
                </div>

                <Link href="/checkout" className="btn btn-primary btn-lg" style={{ marginTop: '24px', display: 'flex' }}>
                  إتمام الطلب 🛍️
                </Link>

                <Link
                  href="/shop"
                  style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--color-primary)' }}
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <h3 className="empty-state-title">سلة التسوق فارغة حالياً</h3>
              <p>استكشفي تشكيلتنا الأنيقة وأضيفي قطعكِ المفضلة إلى السلة</p>
              <Link href="/shop" className="btn btn-primary btn-lg" style={{ marginTop: '24px', display: 'inline-flex' }}>
                تسوقي الآن
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
