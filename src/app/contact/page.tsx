'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main style={{ paddingBlock: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-2xl) auto' }}>
            <h1 className="section-title">تواصلي معنا 💌</h1>
            <p className="section-subtitle">
              يسعدنا تواصلكِ المباشر معنا عبر منصات التواصل الاجتماعي الرسمية لـ FarOha_Brand أو عبر النموذج أدناه:
            </p>
          </div>

          {/* Official Social Media Links Grid */}
          <div className="social-grid">
            {/* WhatsApp */}
            <a
              href="https://wa.me/201006955864"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card whatsapp"
            >
              <div className="social-card-icon">💬</div>
              <div className="social-card-title">واتساب | WhatsApp</div>
              <div className="social-card-handle">01006955864 (تواصل وتأكيد فوري)</div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/faroha_brand_eg?igsh=MXJ0aGQ4NWtnMXFlMA=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-card instagram"
            >
              <div className="social-card-icon">📸</div>
              <div className="social-card-title">إنستجرام | Instagram</div>
              <div className="social-card-handle">@faroha_brand_eg</div>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1DnoR36wAd/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-card facebook"
            >
              <div className="social-card-icon">📘</div>
              <div className="social-card-title">فيسبوك | Facebook</div>
              <div className="social-card-handle">الصفحة الرسمية على فيسبوك</div>
            </a>
          </div>

          <div className="checkout-grid" style={{ marginTop: 'var(--space-2xl)' }}>
            {/* Contact Form */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span>✉️</span> أرسلي لنا رسالة مباشرة
              </h2>

              {submitted ? (
                <div
                  style={{
                    padding: 'var(--space-xl)',
                    textAlign: 'center',
                    background: 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #4caf50',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                  <h3 style={{ color: '#2e7d32', marginBottom: '8px' }}>تم إرسال رسالتكِ بنجاح!</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text)' }}>
                    شكراً لتواصلكِ مع FarOha_Brand. سيرد فريق خدمة العملاء عليكِ في أقرب وقت.
                  </p>
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: '16px' }}
                    onClick={() => setSubmitted(false)}
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">الاسم بالكامل <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="أدخلي اسمكِ"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">رقم الهاتف / الواتساب <span className="required">*</span></label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="010XXXXXXXX"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">موضوع الاستفسار</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="مثال: استفسار عن تفاصيل مقاس أو خامة الإسدال"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">الرسالة <span className="required">*</span></label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="أدخلي تفاصيل رسالتكِ هنا..."
                      required
                    />
                  </div>

                  <div className="form-group full-width" style={{ marginTop: '8px' }}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                      إرسال الرسالة 🚀
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Side Working Hours & Details */}
            <div className="cart-summary">
              <h3 className="cart-summary-title">معلومات التواصل والساعات</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.6 }}>
                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', display: 'block', marginBottom: '4px' }}>
                    💬 الواتساب المباشر:
                  </strong>
                  <a
                    href="https://wa.me/qr/B2BAMH7XYP4VF1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25D366', fontWeight: 700 }}
                  >
                    انقري هنا للمراسلة الفورية عبر الواتساب ↗
                  </a>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', display: 'block', marginBottom: '4px' }}>
                    🕒 مواعيد خدمة العملاء:
                  </strong>
                  يومياً من 10 صباحاً وحتى 10 مساءً.
                </div>

                <div>
                  <strong style={{ color: 'var(--color-primary-dark)', display: 'block', marginBottom: '4px' }}>
                    🚚 التوصيل والشحن:
                  </strong>
                  توصيل سريع لجميع المحافظات المصرية.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
