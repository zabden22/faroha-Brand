'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { INITIAL_DELIVERY_FEES } from '@/lib/store';
import { EGYPTIAN_GOVERNORATES, Order } from '@/types';

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

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
      setCartItems(cart);
    } catch (e) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Calculate Delivery Fee for selected governorate
  const matchedFeeObj = INITIAL_DELIVERY_FEES.find(
    (item) => item.governorate.trim() === governorate.trim()
  );
  const deliveryFee = matchedFeeObj ? matchedFeeObj.fee : 60;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !governorate || !address) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، المحافظة، والعنوان التفصيلي).');
      return;
    }

    setIsSubmitting(true);

    // Map Payment Method Label
    let paymentLabel = 'الدفع عند الاستلام (كاش)';
    if (paymentMethod === 'vodafone') {
      paymentLabel = `تحويل فودافون كاش ${transferPhone ? `(من رقم: ${transferPhone})` : ''}`;
    } else if (paymentMethod === 'instapay') {
      paymentLabel = `تحويل إنستا باي (InstaPay) ${transferRef ? `(مرجع: ${transferRef})` : ''}`;
    }

    const orderNumber = `FAR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: Date.now(),
      orderNumber,
      userId: null,
      totalAmount,
      deliveryFee,
      status: 'pending',
      paymentMethod: paymentLabel,
      customerName,
      phone: altPhone ? `${phone} / ${altPhone}` : phone,
      governorate,
      city: city || governorate,
      address,
      notes: notes || null,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item, index) => ({
        id: index + 1,
        orderId: 0,
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: item.product?.discountPrice || item.product?.price || 0,
        productName: item.product?.name || 'منتج',
        variantInfo: item.variant ? `مقاس: ${item.variant.size} | لون: ${item.variant.color}` : '',
      })),
    };

    // Save Order to localStorage orders list
    try {
      const existingOrders = JSON.parse(localStorage.getItem('faroha_orders') || '[]');
      localStorage.setItem('faroha_orders', JSON.stringify([newOrder, ...existingOrders]));
      
      // Save current order details for success page display
      localStorage.setItem('faroha_latest_order', JSON.stringify(newOrder));

      // Clear cart
      localStorage.removeItem('faroha_cart');
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirect to success page
      router.push(`/checkout/success?orderNumber=${orderNumber}`);
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
            <div className="empty-state-icon">🛍️</div>
            <h2 className="empty-state-title">سلة التسوق فارغة حالياً</h2>
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

              {/* Section 2: Payment Method Choice */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span>💳</span> طريقة الدفع
                </h2>

                <div className="payment-methods">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">💵</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">الدفع عند الاستلام (كاش)</div>
                      <div className="payment-card-desc">سداد قيمة الطلب نقدياً لمندوب الشحن عند المعاينة والاستلام.</div>
                    </div>
                  </div>

                  {/* Option 2: Vodafone Cash */}
                  <div
                    className={`payment-card ${paymentMethod === 'vodafone' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('vodafone')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">📱</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">تحويل فودافون كاش</div>
                      <div className="payment-card-desc">تحويل المبلغ إلى محفظة فودافون كاش الخاصة بالبراند.</div>
                    </div>
                  </div>

                  {/* Option 3: InstaPay */}
                  <div
                    className={`payment-card ${paymentMethod === 'instapay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('instapay')}
                  >
                    <div className="payment-card-radio" />
                    <div className="payment-card-icon">⚡</div>
                    <div className="payment-card-info">
                      <div className="payment-card-title">تحويل إنستا باي (InstaPay)</div>
                      <div className="payment-card-desc">تحويل مباشر وسريع بدون رسوم عبر تطبيق InstaPay.</div>
                    </div>
                  </div>
                </div>

                {/* Conditional Payment Instructions & Fields */}
                {paymentMethod === 'vodafone' && (
                  <div className="payment-instruction-box">
                    <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                      📌 بيانات تحويل فودافون كاش:
                    </p>
                    <p style={{ fontSize: '15px' }}>
                      يرجى تحويل قيمة الطلب الإجمالية <strong>({totalAmount} ج.م)</strong> إلى الرقم:
                    </p>
                    <p
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--color-primary-dark)',
                        letterSpacing: '1px',
                        marginBlock: '8px',
                      }}
                    >
                      01012345678
                    </p>
                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label className="form-label">رقم المحفظة التي تم التحويل منها (اختياري للتأكيد):</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="010XXXXXXXX"
                        value={transferPhone}
                        onChange={(e) => setTransferPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'instapay' && (
                  <div className="payment-instruction-box">
                    <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                      ⚡ بيانات تحويل InstaPay:
                    </p>
                    <p style={{ fontSize: '15px' }}>
                      يرجى تحويل قيمة الطلب الإجمالية <strong>({totalAmount} ج.م)</strong> إلى عنوان InstaPay:
                    </p>
                    <p
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '17px',
                        fontWeight: 700,
                        color: 'var(--color-primary-dark)',
                        marginBlock: '8px',
                      }}
                    >
                      faroha_brand@instapay
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                      أو التحويل على رقم الهاتف: <strong>01012345678</strong>
                    </p>
                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label className="form-label">الاسم أو المرجع في التحويل (اختياري):</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="أدخلي اسم حساب InstaPay أو رقم العملية"
                        value={transferRef}
                        onChange={(e) => setTransferRef(e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                  maxHeight: '260px',
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

              <hr style={{ borderColor: 'var(--color-border)', marginBlock: '16px' }} />

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

              <div className="cart-summary-row total" style={{ marginTop: '12px' }}>
                <span>الإجمالي النهائي:</span>
                <span style={{ color: 'var(--color-primary)' }}>{totalAmount} ج.م</span>
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
