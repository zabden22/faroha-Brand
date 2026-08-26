'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from '@/lib/store';
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('faroha_orders') || '[]');
      setOrders(stored.length > 0 ? stored : INITIAL_ORDERS);
    } catch (e) {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalProducts = INITIAL_PRODUCTS.length;
  const totalSales = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div>
      <h1 className="admin-page-title">ملخص إحصائيات المتجر 📊</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon orders">🛍️</div>
          <span className="stat-card-label">إجمالي الطلبات</span>
          <span className="stat-card-value">{totalOrders}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon pending">⏳</div>
          <span className="stat-card-label">طلبات قيد الانتظار</span>
          <span className="stat-card-value">{pendingOrders}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon completed">✅</div>
          <span className="stat-card-label">طلبات مكتملة</span>
          <span className="stat-card-value">{completedOrders}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon products">👗</div>
          <span className="stat-card-label">عدد المنتجات</span>
          <span className="stat-card-value">{totalProducts}</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>أحدث الطلبات</h3>
          <Link href="/admin/orders" className="btn btn-ghost btn-sm">
            عرض الكل ←
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميلة</th>
              <th>الهاتف</th>
              <th>المحافظة</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.governorate}</td>
                <td style={{ fontWeight: 600 }}>{order.totalAmount} ج.م</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    <span className="status-dot" />
                    {ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>
                  {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
