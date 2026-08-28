'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Order } from '@/types';
import {
  FlowerIcon,
  CreditCardIcon,
  CopyIcon,
  PhoneIcon,
  LocationIcon,
  LockIcon,
  ChatIcon,
  CheckCircleIcon,
} from '@/components/Icons';

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
      ?.map(
        (item: any) =>
          `• ${item.productName || 'قطعة'} (${item.variantInfo || 'قياسي'}) × ${item.quantity}`
      )
      .join('\n');

    const total = order.totalAmount || 0;
    const deposit = order.depositAmount || Math.round(total * 0.25);
    const remaining = order.remainingAmount || total - deposit;

    const msg = `طلب جديد من FarOha Brand
-----------------------------
رقم الطلب: *${order.orderNumber}*
الاسم: ${order.customerName}
الهاتف: ${order.phone}
العنوان: ${order.governorate} - ${order.address}

المنتجات المطلوبة:
${itemsList || ''}

تفاصيل الحساب والدفع:
• إجمالي الطلب: ${total} ج.م
• العربون المطلوب (ديبوزيت 25%): ${deposit} ج.م
• المبلغ المتبقي عند الاستلام: ${remaining} ج.م
• طريقة الدفع: ${order.paymentMethod || 'عربون فودافون كاش والباقي عند الاستلام'}

(يرجى تحويل العربون على رقم فودافون كاش: 01006955864 لتأكيد الشحن)`;

    return `https://api.whatsapp.com/send?phone=201006955864&text=${encodeURIComponent(msg)}`;
  };

  const deposit = order?.depositAmount || (order ? Math.round(order.totalAmount * 0.25) : 0);
  const remaining = order?.remainingAmount || (order ? order.totalAmount - deposit : 0);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-2xl)' }}>
      <div className="checkout-section success-container">
        <div
          className="success-icon-badge"
          style={{
            background: 'rgba(155, 123, 107, 0.12)',
            color: 'var(--color-primary-dark)',
          }}
        >
          <CheckCircleIcon size={44} style={{ color: 'var(--color-primary)' }} />
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <FlowerIcon size={26} style={{ color: 'var(--color-primary)' }} />
          تم استلام طلبكِ بنجاح!
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '15px' }}>
          شكراً لتسوقكِ من FarOha_Brand. سنقوم بتجهيز طلبكِ وشحنه في أقرب وقت فور تأكيد العربون.
        </p>

        <div className="order-badge-number">
          رقم الطلب: {order?.orderNumber || orderNumberParam || 'FAR-1000'}
        </div>

        {/* 25% Deposit Instruction Card */}
        <div
          style={{
            background: '#fdf7f3',
            border: '2px solid #e8d0c2',
            borderRadius: '12px',
            padding: '18px',
            marginBlock: '20px',
            textAlign: 'right',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CreditCardIcon size={20} style={{ color: 'var(--color-primary)' }} />
            خطوة هامة لتأكيد وشحن الطلب (العربون 25%):
          </h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>
            يرجى تحويل مبلغ العربون <strong>({deposit} ج.م)</strong> عبر <strong>فودافون كاش أو إنستاباي</strong> إلى الرقم أدناه، وإرسال صورة التحويل عبر واتساب:
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '10px 16px',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                letterSpacing: '1px',
              }}
            >
              01006955864
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('01006955864');
                alert('تم نسخ رقم الهاتف (01006955864) بنجاح!');
              }}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <CopyIcon size={14} />
              نسخ الرقم
            </button>
          </div>
        </div>

        {order && (
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-lg)',
              textAlign: 'right',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              ملخص تفاصيل الطلب:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
              <div>
                <strong>الاسم:</strong> {order.customerName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PhoneIcon size={15} style={{ color: 'var(--color-primary)' }} />
                <span><strong>الهاتف:</strong> {order.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LocationIcon size={15} style={{ color: 'var(--color-primary)' }} />
                <span><strong>العنوان:</strong> {order.governorate} - {order.address}</span>
              </div>
              <div>
                <strong>المبلغ الإجمالي:</strong>{' '}
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {order.totalAmount} ج.م
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LockIcon size={14} style={{ color: 'var(--color-primary)' }} />
                <span>
                  <strong>العربون (25%):</strong>{' '}
                  <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                    {deposit} ج.م
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CreditCardIcon size={14} style={{ color: 'var(--color-primary)' }} />
                <span>
                  <strong>المتبقي عند الاستلام:</strong>{' '}
                  <span style={{ fontWeight: 700 }}>
                    {remaining} ج.م
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
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
                fontWeight: 800,
                padding: '16px 24px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              }}
            >
              <ChatIcon size={20} style={{ color: 'white' }} />
              إرسال تفاصيل الطلب والعربون عبر الواتساب (01006955864)
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
