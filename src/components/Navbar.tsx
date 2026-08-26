'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/shop', label: 'المتجر' },
    { href: '/shop?category=esdals', label: 'إسدالات' },
    { href: '/about', label: 'من نحن' },
    { href: '/return-policy', label: 'سياسة الاستبدال' },
    { href: '/contact', label: 'تواصلي معنا' },
  ];

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/images/logo.png"
              alt="FarOha Brand"
              width={150}
              height={50}
              style={{ objectFit: 'contain', height: '44px', width: 'auto', borderRadius: '4px' }}
              priority
            />
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="navbar-actions">
            {/* Search link */}
            <Link href="/shop" className="btn-icon" title="بحث في المتجر">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>

            {/* Cart Link */}
            <Link href="/cart" className="btn-icon cart-badge" title="سلة التسوق">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </Link>

            {/* Admin / Profile Link */}
            <Link href="/admin/login" className="btn-icon" title="دخول الإدارة / الحساب">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className="btn-icon mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
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
          <Link href="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            FarOha<span>_Brand</span>
          </Link>
          <button className="modal-close" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="mobile-menu-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
