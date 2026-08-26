'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    try {
      const auth = sessionStorage.getItem('faroha_admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    } catch (e) {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('faroha_admin_authenticated');
    sessionStorage.removeItem('faroha_admin_email');
    localStorage.removeItem('faroha_admin_authenticated');
    localStorage.removeItem('faroha_admin_email');
    router.push('/admin/login');
  };

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <h2>جاري التحقق من صلاحيات الإدارة... 🔒</h2>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const adminLinks = [
    { href: '/admin', label: 'لوحة الأحصائيات', icon: '📊' },
    { href: '/admin/orders', label: 'إدارة الطلبات', icon: '🛍️' },
    { href: '/admin/products', label: 'إدارة المنتجات', icon: '👗' },
    { href: '/admin/categories', label: 'إدارة الأقسام', icon: '🏷️' },
    { href: '/admin/delivery-fees', label: 'أسعار الشحن', icon: '🚚' },
  ];

  return (
    <>
      <Navbar />

      <div className="admin-layout">
        {/* Admin Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
            <Image
              src="/images/logo.png"
              alt="FarOha Brand"
              width={140}
              height={45}
              style={{ objectFit: 'contain', height: '40px', width: 'auto', marginBottom: '8px', borderRadius: '4px' }}
            />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
              لوحة الإدارة ⚙️
            </h2>
          </div>

          <nav className="admin-sidebar-nav">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-sidebar-link ${pathname === link.href ? 'active' : ''}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', color: '#e53e3e', borderColor: '#feb2b2' }}
            >
              تسجيل الخروج 🚪
            </button>
            <Link href="/" className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
              العودة للمتجر ↗
            </Link>
          </div>
        </aside>

        {/* Admin Main Content Area */}
        <main className="admin-content">{children}</main>
      </div>
    </>
  );
}

