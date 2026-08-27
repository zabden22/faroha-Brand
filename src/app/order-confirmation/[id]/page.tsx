'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    // Try API first (orders from DB), then fallback to latest_order in localStorage (for same-session)
    const loadOrder = async () => {
      try {
        // 1) Try from database API
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (res.ok) {
          const orders = await res.json();
          const found = orders.find((o: any) => o.orderNumber === orderNumber);
          if (found) {
            setOrderAndWhatsapp(found);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      // 2) Fallback: latest order saved in localStorage (same session redirect)
      try {
        const latestStr = localStorage.getItem('faroha_latest_order');
        if (latestStr) {
          const found = JSON.parse(latestStr);
          if (found.orderNumber === orderNumber) {
            setOrderAndWhatsapp(found);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const setOrderAndWhatsapp = (found: any) => {
      setOrder(found);
      const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '201099998877';
      const itemsText = (found.items || [])
        .map(
          (item: any) =>
            `• ${item.productName || 'منتج'} — ${item.variantInfo || ''} (العدد: ${item.quantity})`
        )
        .join('\n');

      const message = `🛍️ طلب جديد من FarOha_Brand\n\n` +
        `رقم الطلب: ${found.orderNumber}\n` +
        `الاسم: ${found.customerName}\n` +
        `الهاتف: ${found.phone}\n\n` +
        `المنتجات:\n${itemsText}\n\n` +
        `مصاريف الشحن: ${found.deliveryFee} جنيه\n` +
        `الإجمالي الكلي: ${found.totalAmount + (found.deliveryFee || 0)} جنيه\n\n` +
        `العنوان:\n${found.governorate}، ${found.city} — ${found.address}\n\n` +
        `طريقة الدفع:\n${found.paymentMethod}`;

      setWhatsappUrl(`https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`);
    };

    loadOrder();
  }, [orderNumber]);

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="order-confirmation">
          <div className="order-confirmation-icon">✓</div>
          <h1 className="section-title">تم استلام طلبكِ بنجاح! 🎉</h1>
          <p className="order-number">رقم الطلب: {orderNumber}</p>
          <p className="section-subtitle">
            شكراً لثقتكِ بـ FarOha_Brand! تم تسجيل طلبكِ في قاعدة البيانات وجاري تجهيزه للشحن.
          </p>

          {order && (
            <div className="form-section" style={{ textAlign: 'start', marginBlock: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>تفاصيل الطلب:</h3>
              <p><strong>الاسم:</strong> {order.customerName}</p>
              <p><strong>الهاتف:</strong> {order.phone}</p>
              <p><strong>العنوان:</strong> {order.governorate}، {order.city} — {order.address}</p>
              <p style={{ marginTop: '8px' }}>
                <strong>إجمالي المبلغ:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{order.totalAmount + (order.deliveryFee || 0)} ج.م</span> (شامل الشحن)
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '32px' }}>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn whatsapp-btn btn-lg"
                style={{ width: '100%', maxWidth: '400px' }}
              >
                أرسلي طلبكِ عبر واتساب 💬
              </a>
            )}

            <Link href="/shop" className="btn btn-outline">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
