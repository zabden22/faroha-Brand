'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LockIcon, RocketIcon } from '@/components/Icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in in current session, redirect to admin dashboard directly
    try {
      if (sessionStorage.getItem('faroha_admin_authenticated') === 'true') {
        router.push('/admin');
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Strict admin credentials check
    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = normalizedEmail === 'farohabrand@gmail.com' || normalizedEmail === 'farohabrand@gmail.cim';
    const isValidPassword = password === 'faroha2006';

    if (isValidEmail && isValidPassword) {
      try {
        sessionStorage.setItem('faroha_admin_authenticated', 'true');
        sessionStorage.setItem('faroha_admin_email', normalizedEmail);
        router.push('/admin');
      } catch (err) {
        setError('حدث خطأ أثناء حفظ الجلسة.');
        setIsSubmitting(false);
      }
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. هذا الحساب لا يملك صلاحيات الإدارة.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ paddingBlock: 'var(--space-2xl)', minHeight: 'calc(100vh - 300px)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="checkout-section" style={{ textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ marginBottom: '16px' }}>
              <Image
                src="/images/logo.png"
                alt="FarOha Brand"
                width={180}
                height={60}
                style={{ objectFit: 'contain', height: '52px', width: 'auto', margin: '0 auto' }}
              />
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              تسجيل دخول الإدارة
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-light)', marginBottom: '24px' }}>
              FarOha_Brand — لوحة التحكم الخاصة بالمتجر
            </p>

            {error && (
              <div
                style={{
                  background: 'var(--color-error-light)',
                  color: 'var(--color-error)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '13px',
                  textAlign: 'right',
                  border: '1px solid var(--color-error)',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني للإدارة (Gmail)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your-email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">كلمة المرور / الرقم السري</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'var(--color-bg-alt)', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: 'var(--color-text-light)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LockIcon size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>متاح الدخول حصرياً للحسابات المصرح لها بإدارة FarOha_Brand.</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{ marginTop: '8px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSubmitting ? 'جاري التحقق...' : (
                  <>
                    <span>دخول لوحة التحكم</span>
                    <RocketIcon size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <Link href="/" style={{ fontSize: '13px', color: 'var(--color-primary)' }}>
                العودة للصفحة الرئيسية للمتجر
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
