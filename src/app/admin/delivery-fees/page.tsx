'use client';

import { useState, useEffect } from 'react';
import { DeliveryFee } from '@/types';
import { TruckIcon, RefreshIcon } from '@/components/Icons';

export default function AdminDeliveryFeesPage() {
  const [fees, setFees] = useState<DeliveryFee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/delivery-fees', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setFees(data);
    } catch (e) {
      console.error('Error loading delivery fees:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1
          className="admin-page-title"
          style={{
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <TruckIcon size={24} style={{ color: 'var(--color-primary)' }} />
          إدارة رسوم الشحن والتوصيل
        </h1>
        <button
          onClick={loadFees}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '13px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshIcon size={14} />
          تحديث
        </button>
      </div>

      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          أسعار التوصيل لجميع محافظات جمهورية مصر العربية ({fees.length})
        </h3>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shimmer-skeleton" style={{ height: '40px', borderRadius: '6px' }} />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
