'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, Product, Category, OrderStatus, ORDER_STATUS_LABELS } from '@/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visitorStats, setVisitorStats] = useState<{
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    thisMonthVisits: number;
  }>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    thisMonthVisits: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, prodsRes, catsRes, visitsRes] = await Promise.all([
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/visits', { cache: 'no-store' }).catch(() => null),
      ]);

      const [ordersData, prodsData, catsData, visitsData] = await Promise.all([
        ordersRes.json().catch(() => []),
        prodsRes.json().catch(() => []),
        catsRes.json().catch(() => []),
        visitsRes ? visitsRes.json().catch(() => null) : null,
      ]);

      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(prodsData)) setProducts(prodsData);
      if (Array.isArray(catsData)) setCategories(catsData);
      if (visitsData) {
        setVisitorStats({
          totalVisits: visitsData.totalVisits || 0,
          uniqueVisitors: visitsData.uniqueVisitors || 0,
          todayVisits: visitsData.todayVisits || 0,
          thisMonthVisits: visitsData.thisMonthVisits || 0,
        });
      }
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount + o.deliveryFee, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل إحصائيات الإدارة والزوار من قاعدة البيانات...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
          نظرة عامة على الإدارة 📊
        </h1>
        <button
          onClick={loadDashboardData}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '13px', padding: '6px 14px' }}
        >
          🔄 تحديث الإحصائيات
        </button>
      </div>

      {/* 👥 Visitor Statistics Section */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px' }}>👥</span>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
            عداد وزوار الموقع (Real-time Visitors Traffic)
          </h2>
        </div>

        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card" style={{ borderTop: '3px solid #3B82F6' }}>
            <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>👥</div>
            <div className="stat-value" style={{ color: '#1E40AF' }}>{visitorStats.uniqueVisitors}</div>
            <div className="stat-label">إجمالي الزوار الفريدين</div>
          </div>

          <div className="stat-card" style={{ borderTop: '3px solid #10B981' }}>
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>👁️</div>
            <div className="stat-value" style={{ color: '#065F46' }}>{visitorStats.totalVisits}</div>
            <div className="stat-label">إجمالي المشاهدات والزيارات</div>
          </div>

          <div className="stat-card" style={{ borderTop: '3px solid #F59E0B' }}>
            <div className="stat-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>📅</div>
            <div className="stat-value" style={{ color: '#92400E' }}>{visitorStats.todayVisits}</div>
            <div className="stat-label">زيارات اليوم</div>
          </div>

          <div className="stat-card" style={{ borderTop: '3px solid #8B5CF6' }}>
            <div className="stat-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>📈</div>
            <div className="stat-value" style={{ color: '#5B21B6' }}>{visitorStats.thisMonthVisits}</div>
            <div className="stat-label">زيارات هذا الشهر</div>
          </div>
        </div>
      </div>

      {/* 💰 Orders & Sales Stats Grid */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px' }}>🛍️</span>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            إحصائيات المبيعات والطلبات
          </h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{totalSales} ج.م</div>
            <div className="stat-label">إجمالي المبيعات</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">إجمالي الطلبات</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{pendingOrdersCount}</div>
            <div className="stat-label">طلبات قيد الانتظار</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👗</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">عدد المنتجات</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Overview */}
      <div className="admin-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="checkout-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>أحدث الطلبات الواردة</h3>
            <Link href="/admin/orders" style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
              عرض الكل ←
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>الإجمالي</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td>{o.totalAmount + o.deliveryFee} ج.م</td>
                    <td>
                      <span className={`status-badge status-${o.status}`}>
                        {ORDER_STATUS_LABELS[o.status as OrderStatus] || o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="checkout-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>أقسام المتجر المتاحة ({categories.length})</h3>
            <Link href="/admin/categories" style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
              إدارة الأقسام ←
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map((cat) => {
              const productCount = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{cat.name}</span>
                  <span style={{ fontSize: '12px', background: 'white', padding: '4px 10px', borderRadius: '12px', color: 'var(--color-text-light)' }}>
                    {productCount} منتجات
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
