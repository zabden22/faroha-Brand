'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EGYPTIAN_GOVERNORATES } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Method State: 'cod' | 'vodafone' | 'instapay'
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vodafone' | 'instapay'>('cod');
  const [transferPhone, setTransferPhone] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryFeesList, setDeliveryFeesList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
      setCartItems(cart);
    } catch (e) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }

    // Load delivery fees from database API
    fetch('/api/delivery-fees', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDeliveryFeesList(data);
      })
      .catch((e) => console.error(e));
  }, []);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Calculate Delivery Fee for selected governorate
  const matchedFeeObj = deliveryFeesList.find(
    (item) => item.governorate.trim() === governorate.trim()
  );
  const deliveryFee = matchedFeeObj ? matchedFeeObj.fee : 60;
  const totalAmount = subtotal + deliveryFee;

  // 25% Deposit calculation
  const depositAmount = Math.round(totalAmount * 0.25);
  const remainingAmount = totalAmount - depositAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !governorate || !address) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، المحافظة، والعنوان التفصيلي).');
      return;
    }

    setIsSubmitting(true);

    // Map Payment Method Label
    let paymentLabel = `عربون 25% (${depositAmount} ج.م) فودافون كاش + الباقي (${remainingAmount} ج.م) كاش عند الاستلام`;
    if (paymentMethod === 'instapay') {
      paymentLabel = `عربون 25% (${depositAmount} ج.م) إنستا باي + الباقي (${remainingAmount} ج.م) كاش عند الاستلام`;
    }

    const payload = {
      totalAmount,
      deliveryFee,
      paymentMethod: paymentLabel,
      customerName,
      phone: altPhone ? `${phone} / ${altPhone}` : phone,
      governorate,
      city: city || governorate,
      address,
      notes: notes || null,
      items: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.product?.discountPrice || item.product?.price || 0,
        productName: item.product?.name || 'منتج',
        variantInfo: item.variant ? `مقاس: ${item.variant.size} | لون: ${item.variant.color}` : '',
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const createdOrder = await res.json();
        // Save current order details for success page display
        localStorage.setItem('faroha_latest_order', JSON.stringify({
          ...createdOrder,
          depositAmount,
          remainingAmount,
        }));

        // Clear cart
        localStorage.removeItem('faroha_cart');
        window.dispatchEvent(new Event('cartUpdated'));

        // Redirect to success page
        router.push(`/checkout/success?orderNumber=${createdOrder.orderNumber}`);
      } else {
        alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
        setIsSubmitting(false);
      }
    } catch (err) {
      alert('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: '60px var(--space-md)', textAlign: 'center' }}>
          <h2>جاري تحميل بيانات الطلب...</h2>
        </main>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: '80px var(--space-md)', textAlign: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h2 className="section-title">سلة التسوق فارغة</h2>
            <p>لا يمكنك إتمام الطلب لأن سلة التسوق لا تحتوي على أي منتجات.</p>
            <Link href="/shop" className="btn btn-primary btn-lg" style={{ marginTop: '24px', display: 'inline-flex' }}>
              العودة للمتجر والتسوق
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ paddingBlock: 'var(--space-2xl)' }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: '24px' }}>
            إتمام الطلب 🛍️
          </h1>

          <form onSubmit={handleSubmitOrder} className="checkout-grid">
            {/* Left Column: Customer Info & Shipping & Payment */}
            <div>
              {/* Section 1: Customer Details */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span>📍</span> بيانات التوصيل والإستلام
                </h2>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">
                      الاسم بالكامل <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="مثال: سارة محمد محمود"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      رقم الهاتف (للتواصل واتساب والتوصيل) <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">رقم هاتف إضافي (اختياري)</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="011XXXXXXXX"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      المحافظة <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      required
                    >
                      {EGYPTIAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">المدينة / المنطقة</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="مثال: مدينة نصر / الدقي"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      العنوان التفصيلي <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="اسم الشارع، رقم العمارة، الشقة، أو أقرب علامة مميزة"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">ملاحظات للتوصيل (اختياري)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="مثال: الاتصال قبل التوصيل بساعة"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Method Choice & 25% Deposit Policy */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span>💳</span> طريقة الدفع وسياسة العربون
                </h2>

                <div
                  style={{
                    background: '#fdf7f3',
                    border: '1px solid #e8d0c2',
                    borderRadius: '8px',
                    padding: '14px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'var(--color-primary-dark)' }}>
                    📌 تنبيه هام بخصوص تأكيد الطلبات:
                  </strong>
                  <p style={{ marginTop: '4px', marginBottom: 0 }}>
                    لتأكيد جدية الحجز وبدء تجهيز القطع وشحنها، يُشترط دفع <strong>ديبوزيت (عربون 25% = {depositAmount} ج.م)</strong> مقدماً عبر <strong>فودافون كاش أو إنستاباي</strong>، ويتم سداد المبلغ المتبقي <strong>({remainingAmount} ج.م)</strong> نقداً لمندوب الشحن عند الاستلام.
                  </p>
                </div>

                <div className="payment-methods">
                  {/* Option 1: Vodafone Cash Deposit */}
                  <div
                    className={`payment-card ${paymentMethod === 'vodafone' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('vodafone')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">📱</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">عربون 25% عبر فودافون كاش + الباقي عند الاستلام</div>
                      <div className="payment-card-desc">تحويل العربون ({depositAmount} ج.م) لمحفظة فودافون كاش وسداد الباقي كاش للمندوب.</div>
                    </div>
                  </div>

                  {/* Option 2: InstaPay Deposit */}
                  <div
                    className={`payment-card ${paymentMethod === 'instapay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('instapay')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">⚡</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">عربون 25% عبر إنستا باي (InstaPay) + الباقي عند الاستلام</div>
                      <div className="payment-card-desc">تحويل العربون ({depositAmount} ج.م) عبر تطبيق إنستاباي وسداد الباقي عند الاستلام.</div>
                    </div>
                  </div>

                  {/* Option 3: COD Note */}
                  <div
                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">💵</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">دفع العربون (25%) فودافون كاش / إنستاباي والباقي كاش</div>
                      <div className="payment-card-desc">سداد باقي المبلغ ({remainingAmount} ج.م) نقداً لمندوب الشحن عند استلام الشحنة.</div>
                    </div>
                  </div>
                </div>

                {/* Wallet Details Box */}
                <div
                  className="payment-instruction-box"
                  style={{ marginTop: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}
                >
                  <p style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                    📱 رقم التحويل (فودافون كاش / إنستاباي):
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      marginBlock: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '20px',
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
                        alert('تم نسخ رقم الهاتف (01006955864) بنجاح! 📋');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ marginRight: 'auto', fontSize: '12px', padding: '4px 10px' }}
                    >
                      📋 نسخ الرقم
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--color-text)', marginTop: '8px' }}>
                    العربون المطلوب تحويله لتأكيد الطلب: <strong style={{ color: 'var(--color-primary-dark)' }}>{depositAmount} ج.م</strong>
                  </p>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">رقم المحفظة التي قمتِ بالتحويل منها (اختياري للتأكيد السريع):</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010XXXXXXXX"
                      value={transferPhone}
                      onChange={(e) => setTransferPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="cart-summary-title">ملخص المنتجات والطلب</h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  marginBottom: '16px',
                  paddingRight: '4px',
                }}
              >
                {cartItems.map((item, idx) => {
                  const p = item.product;
                  const price = p?.discountPrice || p?.price || 0;
                  const img = p?.images?.[0]?.imageUrl || '/images/category_dresses.jpg';

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Image
                        src={img}
                        alt={p?.name || ''}
                        width={50}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div style={{ flex: 1, fontSize: '13px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{p?.name}</div>
                        {item.variant && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                            {item.variant.size} | {item.variant.color}
                          </div>
                        )}
                        <div style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                          {item.quantity} × {price} ج.م
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr style={{ borderColor: 'var(--color-border)', marginBlock: '12px' }} />

              <div className="cart-summary-row">
                <span>مجموع المنتجات:</span>
                <span style={{ fontWeight: 600 }}>{subtotal} ج.م</span>
              </div>

              <div className="cart-summary-row">
                <span>مصاريف الشحن ({governorate}):</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                  {deliveryFee} ج.م
                </span>
              </div>

              <div className="cart-summary-row total" style={{ marginTop: '8px' }}>
                <span>الإجمالي الكلي:</span>
                <span style={{ color: 'var(--color-primary)' }}>{totalAmount} ج.م</span>
              </div>

              {/* Deposit Breakdown Badge */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '4px',
                  }}
                >
                  <span>🔒 العربون المطلوب (ديبوزيت 25%):</span>
                  <span>{depositAmount} ج.م</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--color-text)',
                  }}
                >
                  <span>💵 المتبقي عند الاستلام:</span>
                  <span style={{ fontWeight: 600 }}>{remainingAmount} ج.م</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
              >
                {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد وإرسال الطلب 🚀'}
              </button>

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-light)',
                  textAlign: 'center',
                  marginTop: '12px',
                  lineHeight: 1.5,
                }}
              >
                🔒 بياناتكِ وسدادكِ آمنة بالكامل مع FarOha_Brand
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
