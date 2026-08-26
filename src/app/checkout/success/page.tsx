'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Order } from '@/types';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const latestOrderStr = localStorage.getItem('faroha_latest_order');
      if (latestOrderStr) {
        const parsed = JSON.parse(latestOrderStr);
        if (!orderNumberParam || parsed.orderNumber === orderNumberParam) {
          setOrder(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderNumberParam]);

  // WhatsApp Link Message Generator
  const getWhatsAppMessage = () => {
    if (!order) return '';
    const itemsList = order.items
      ?.map((item) => `• ${item.productName} (${item.variantInfo || 'قياسي'}) × ${item.quantity}`)
      .join('\n');

    const msg = `أهلاً FarOha Brand 🌸
أود تأكيد طلبي رقم: *${order.orderNumber}*
👤 الاسم: ${order.customerName}
📞 الهاتف: ${order.phone}
📍 العنوان: ${order.governorate} - ${order.address}
💳 طريقة الدفع: ${order.paymentMethod}
💰 الإجمالي: ${order.totalAmount} ج.م

المنتجات:
${itemsList || ''}`;

    return `https://wa.me/qr/B2BAMH7XYP4VF1?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-2xl)' }}>
      <div className="checkout-section success-container">
        <div className="success-icon-badge">✓</div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>
          تم استلام طلبكِ بنجاح! 🌸
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '15px' }}>
          شكراً لتسوقكِ من FarOha_Brand. سنقوم بتجهيز طلبكِ وتشحيته في أقرب وقت.
        </p>

        <div className="order-badge-number">
          رقم الطلب: {order?.orderNumber || orderNumberParam || 'FAR-1000'}
        </div>

        {order && (
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              marginBlock: 'var(--space-lg)',
              textAlign: 'right',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              ملخص تفاصيل الطلب:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
              <div>
                <strong>👤 الاسم:</strong> {order.customerName}
              </div>
              <div>
                <strong>📞 الهاتف:</strong> {order.phone}
              </div>
              <div>
                <strong>📍 العنوان:</strong> {order.governorate} - {order.address}
              </div>
              <div>
                <strong>💳 طريقة الدفع:</strong> {order.paymentMethod}
              </div>
              <div>
                <strong>🚚 الشحن:</strong> {order.deliveryFee} ج.م
              </div>
              <div>
                <strong>💰 المبلغ الإجمالي:</strong>{' '}
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {order.totalAmount} ج.م
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {/* Direct WhatsApp Confirmation Button */}
          {order && (
            <a
              href={getWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: '#25D366',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <span>💬</span> تأكيد الطلب مباشرة عبر الواتساب (WhatsApp)
            </a>
          )}

          <Link
            href="/shop"
            className="btn btn-outline btn-lg"
            style={{ display: 'inline-flex', justifyContent: 'center' }}
          >
            متابعة التسوق والعودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="container" style={{ padding: '60px', textAlign: 'center' }}>جاري التحميل...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
