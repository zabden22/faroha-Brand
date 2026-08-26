import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="section-title text-center" style={{ marginBottom: '12px' }}>
            عن FarOha_Brand
          </h1>
          <p className="section-subtitle text-center" style={{ marginBottom: '40px' }}>
            الأناقة في كل التفاصيل • حشمة • راحة • تميز
          </p>

          <div className="about-section" style={{ marginBottom: '32px' }}>
            <p>
              تأسست <strong>FarOha_Brand</strong> لتقديم رؤية جديدة ومميزة للملابس النسائية المحتشمة. 
              نؤمن بأن الحشمة هي أساس الأناقة، وأن الملابس الفضفاضة يمكن أن تكون غاية في الجمال والراحة في آن واحد.
            </p>
          </div>

          <div className="form-section">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>
              رؤيتنا
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-light)' }}>
              تمكين كل امرأة محجبة ومحتشمة من التألق بتصاميم مريحة تجمع بين خامات عالية الجودة، ألوان هادئة، وقصّات عصرية تناسب كل الأوقات والمناسبات.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
