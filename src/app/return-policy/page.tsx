import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="section-title text-center" style={{ marginBottom: '12px' }}>
            سياسة الاستبدال والإرجاع 🔄
          </h1>
          <p className="section-subtitle text-center" style={{ marginBottom: '40px' }}>
            نحرص في FarOha_Brand على رضاكِ الكامل عن اختياركِ وتجربتكِ معنا.
          </p>

          <div className="form-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
              1. مهلة الاستبدال والإرجاع
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
              يمكنكِ طلب استبدال أو إرجاع أي قطعة خلال <strong>14 يوماً</strong> من تاريخ تسلم الطلب.
            </p>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
              2. شروط الاستبدال والإرجاع
            </h3>
            <ul style={{ lineHeight: '2', color: 'var(--color-text-light)', paddingRight: '20px' }}>
              <li>أن تكون القطعة في حالتها الأصلية غير مستعملة أو مغسولة.</li>
              <li>وجود جميع الملصقات والعلامات التجارية (Tags) الأصلية على القطعة.</li>
              <li>أن يتم إرفاق الفاتورة أو رقم الطلب عند التسليم لمندوب الشحن.</li>
            </ul>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
              3. تكاليف الشحن
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
              • في حالة وجود عيب تصنيع أو خطأ في المقاس/اللون المرسل من طرفنا: <strong>نتحمل مصاريف الشحن بالكامل</strong>.<br />
              • في حالة رغبة العميلة في تغيير المقاس أو اللون بناءً على رغبتها الشخصية: <strong>تتحمل العميلة تكلفة الشحن</strong>.
            </p>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
              4. كيف تقدمين طلب الاستبدال؟
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
              كل ما عليكِ هو التواصل معنا عبر خدمة العملاء على <strong>واتساب (01099998877)</strong> وتزويدنا برقم الطلب مع توضيح سبب الطلب، وسيقوم فريقنا بتنسيق زيارة المندوب لاستلام القطعة وإرسال البديل فوراً.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
