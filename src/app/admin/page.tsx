'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, Product, Category, OrderStatus, ORDER_STATUS_LABELS } from '@/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, prodsRes, catsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const [ordersData, prodsData, catsData] = await Promise.all([
        ordersRes.json(),
        prodsRes.json(),
        catsRes.json(),
      ]);
      setOrders(ordersData);
      setProducts(prodsData);
      setCategories(catsData);
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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل إحصائيات الإدارة من قاعدة البيانات...</div>;

  return (
    <div>
      <h1 className="admin-page-title">نظرة عامة على الإدارة 📊</h1>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
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
