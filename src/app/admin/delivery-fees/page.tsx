'use client';

import { useState, useEffect } from 'react';
import { DeliveryFee } from '@/types';

export default function AdminDeliveryFeesPage() {
  const [fees, setFees] = useState<DeliveryFee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFees = async () => {
    try {
      const res = await fetch('/api/delivery-fees', { cache: 'no-store' });
      const data = await res.json();
      setFees(data);
    } catch (e) {
      console.error('Error loading delivery fees:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل أسعار الشحن من قاعدة البيانات...</div>;

  return (
    <div>
      <h1 className="admin-page-title">إدارة رسوم الشحن والتوصيل 🚚</h1>

      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          أسعار التوصيل لجميع محافظات جمهورية مصر العربية ({fees.length})
        </h3>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المحافظة</th>
                <th>تكلفة التوصيل (ج.م)</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 700 }}>{item.governorate}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{item.fee} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
