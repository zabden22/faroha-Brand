'use client';

import { useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '@/lib/store';
import { ORDER_STATUS_LABELS, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('faroha_orders') || '[]');
      setOrders(stored.length > 0 ? stored : INITIAL_ORDERS);
    } catch (e) {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('faroha_orders', JSON.stringify(updated));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">إدارة الطلبات 🛍️</h1>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>اسم العميلة</th>
              <th>الهاتف</th>
              <th>المحافظة</th>
              <th>المبلغ الكلي</th>
              <th>حالة الطلب</th>
              <th>تغيير الحالة</th>
              <th>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="preparing">قيد التجهيز</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(order)}>
                    معاينة 👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay open" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">تفاصيل الطلب #{selectedOrder.orderNumber}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ✕
              </button>
            </div>

            <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
              <p><strong>الاسم:</strong> {selectedOrder.customerName}</p>
              <p><strong>الهاتف:</strong> {selectedOrder.phone}</p>
              <p><strong>العنوان:</strong> {selectedOrder.governorate} — {selectedOrder.city} — {selectedOrder.address}</p>
              {selectedOrder.notes && <p><strong>ملاحظات:</strong> {selectedOrder.notes}</p>}

              <hr style={{ marginBlock: '16px', border: 'none', borderTop: '1px solid var(--color-border)' }} />

              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>المنتجات المطلوبة:</h4>
              {(selectedOrder.items || []).map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>
                    • {item.product?.name || item.productName || 'منتج'} ({item.variant?.size || ''} - {item.variant?.color || ''}) × {item.quantity}
                  </span>
                  <span>{((item.product?.discountPrice || item.product?.price || item.unitPrice || 0) * item.quantity)} ج.م</span>
                </div>
              ))}

              <hr style={{ marginBlock: '16px', border: 'none', borderTop: '1px solid var(--color-border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', color: 'var(--color-primary)' }}>
                <span>إجمالي الطلب مع الشحن:</span>
                <span>{selectedOrder.totalAmount} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
