import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/store';

export default function Home() {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.isFeatured);
  const newArrivals = INITIAL_PRODUCTS.filter((p) => p.isNew);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg">
            <Image
              src="/images/hero_image.jpg"
              alt="FarOha Brand Hero"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hero-overlay" />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-content">
              <h1 className="hero-title">الأناقة في كل التفاصيل</h1>
              <p className="hero-subtitle">
                اكتشفي تشكيلتنا المميزة من الملابس المحتشمة، المريحة والأنيقة التي تُبرز جمالكِ بأسلوب بسيط وراقٍ.
              </p>
              <div className="hero-actions">
                <Link href="/shop" className="btn btn-primary btn-lg">
                  تسوقي الآن 🛍️
                </Link>
                <Link href="/shop?category=esdals" className="btn btn-outline btn-lg">
                  استكشفي الإسدالات
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">تسوقي حسب القسم</h2>
              <p className="section-subtitle">تشكيلة واسعة تناسب كل أوقاتكِ وتطلعاتكِ</p>
            </div>

            <div className="categories-grid">
              {INITIAL_CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/shop?category=${cat.id}`} className="category-card">
                  <Image src={cat.image} alt={cat.name} fill sizes="300px" style={{ objectFit: 'cover' }} />
                  <div className="category-card-overlay">
                    <span className="category-card-name">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">الموديلات الأكثر طلباً</h2>
              <p className="section-subtitle">اخترناها لكِ بعناية لتعكس حشمتكِ وأناقتكِ</p>
            </div>

            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center" style={{ marginTop: '40px' }}>
              <Link href="/shop" className="btn btn-outline btn-lg">
                عرض جميع المنتجات
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">وصل حديثاً ✨</h2>
              <p className="section-subtitle">أحدث إبداعات FarOha_Brand هذا الموسم</p>
            </div>

            <div className="products-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* About Brand Banner */}
        <section className="section" style={{ paddingBlock: '40px' }}>
          <div className="container">
            <div className="about-section">
              <h2 className="section-title" style={{ marginBottom: '16px' }}>
                عن FarOha_Brand
              </h2>
              <p>
                FarOha_Brand بتقدملك ملابس للمرأة اللي بتحب الحشمة، الراحة، والأناقة البسيطة.
                نصمم كل قطعة باهتمام بالغ بالتفاصيل وجودة الأقمشة، لنوفر لكِ إطلالة فضفاضة تعبر عن ذاتك وتمنحكِ الثقة في كل خطوة.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
