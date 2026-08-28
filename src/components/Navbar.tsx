'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FlowerIcon, BagIcon } from '@/components/Icons';

interface NavbarProps {
  initialCategories?: { id: number; name: string }[];
}

export default function Navbar({ initialCategories }: NavbarProps = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(initialCategories || []);

  useEffect(() => {
    // Update cart count from localStorage
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('faroha_cart') || '[]');
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cartUpdated', updateCount);

    // Fetch dynamic categories if not provided initially
    if (!initialCategories) {
      fetch('/api/categories', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch((e) => console.error('Error loading navbar categories:', e));
    }

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, [initialCategories]);

  // Main navigation links for both Desktop and Mobile
  const baseLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/return-policy', label: 'سياسة الاستبدال' },
    { href: '/contact', label: 'تواصلي معنا' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Mobile Hamburger Button (Placed on Start / Right in RTL) */}
          <button
            className="btn-icon mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة الرئيسية"
            title="القائمة"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Brand Logo (Centered on mobile, Start on desktop) */}
          <Link href="/" className="navbar-logo">
            <Image
              src="/images/logo.png"
              alt="FarOha Brand Logo"
              width={180}
              height={60}
              style={{
                objectFit: 'contain',
                height: '46px',
                width: 'auto',
                borderRadius: '6px',
              }}
              priority
            />
          </Link>

          {/* Nav Links (Desktop Only) */}
          <nav className="navbar-links">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              الرئيسية
            </Link>

            {/* Dropdown Menu for Shop & Categories */}
            <div className="nav-item-dropdown">
              <span className={`nav-link-with-icon ${pathname.startsWith('/shop') ? 'active' : ''}`}>
                المتجر
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
              <div className="dropdown-menu">
                <Link href="/shop" className={pathname === '/shop' ? 'active' : ''}>
                  <FlowerIcon size={14} style={{ display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
                  كل المنتجات
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className={pathname === `/shop?category=${cat.id}` ? 'active' : ''}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
              من نحن
            </Link>
            <Link href="/return-policy" className={pathname === '/return-policy' ? 'active' : ''}>
              سياسة الاستبدال
            </Link>
            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
              تواصلي معنا
            </Link>
          </nav>

          {/* Action Buttons (Search, Cart, and Admin) */}
          <div className="navbar-actions">
            {/* Search link */}
            <Link href="/shop" className="btn-icon" title="بحث في المتجر">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>

            {/* Cart Link with Badge */}
            <Link href="/cart" className="btn-icon cart-badge" title="سلة التسوق">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </Link>

            {/* Admin / Profile Link (Desktop) */}
            <Link href="/admin/login" className="btn-icon navbar-admin-btn" title="دخول الإدارة / الحساب">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <aside className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image
              src="/images/logo.png"
              alt="FarOha Brand Logo"
              width={140}
              height={45}
              style={{
                objectFit: 'contain',
                height: '38px',
                width: 'auto',
                borderRadius: '4px',
              }}
            />
          </Link>
          <button className="modal-close" onClick={() => setMobileMenuOpen(false)} aria-label="إغلاق القائمة">
            ✕
          </button>
        </div>

        <nav className="mobile-menu-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
            الرئيسية
          </Link>
          
          {/* Shop Header in mobile */}
          <div style={{ paddingBlock: '12px 6px', fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-dark)', borderBottom: '1px dashed var(--color-border)' }}>
            أقسام المتجر
          </div>
          <Link href="/shop" className={pathname === '/shop' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)} style={{ paddingRight: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BagIcon size={16} style={{ color: 'var(--color-primary)' }} />
            كل المنتجات
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={pathname === `/shop?category=${cat.id}` ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
              style={{ paddingRight: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FlowerIcon size={14} style={{ color: 'var(--color-primary-light)' }} />
              {cat.name}
            </Link>
          ))}

          <div style={{ height: '16px' }} />

          {baseLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <Link
              href="/admin/login"
              className="btn btn-outline btn-sm"
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              دخول الإدارة
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
