'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error('Error loading orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadOrders();
        alert('تم تحديث حالة الطلب بنجاح! 📦');
      }
    } catch (e) {
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل الطلبات من قاعدة البيانات...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>إدارة الطلبات 📦</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600 }}>تصفية حسب الحالة:</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">جميع الطلبات ({orders.length})</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">تم التأكيد</option>
            <option value="preparing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      <div className="checkout-section">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>اسم العميل</th>
                <th>الهاتف</th>
                <th>المحافظة والمدينة</th>
                <th>إجمالي المبلغ</th>
                <th>طريقة الدفع</th>
                <th>حالة الطلب</th>
                <th>التاريخ</th>
                <th>تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td dir="ltr" style={{ textAlign: 'right' }}>{o.phone}</td>
                    <td>{o.governorate} — {o.city}</td>
                    <td style={{ fontWeight: 700 }}>{o.totalAmount + o.deliveryFee} ج.م</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <span className={`status-badge status-${o.status}`}>
                        {ORDER_STATUS_LABELS[o.status as OrderStatus] || o.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                      {new Date(o.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        <option value="pending">قيد الانتظار ⏳</option>
                        <option value="confirmed">تم التأكيد ✅</option>
                        <option value="preparing">قيد التجهيز 👗</option>
                        <option value="shipped">تم الشحن 🚚</option>
                        <option value="delivered">تم التوصيل 🎉</option>
                        <option value="cancelled">إلغاء الطلب ❌</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px' }}>
                    لا توجد طلبات مطابقة لهذه الحالة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
