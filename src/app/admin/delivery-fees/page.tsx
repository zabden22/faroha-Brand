'use client';

import { useState } from 'react';
import { INITIAL_DELIVERY_FEES } from '@/lib/store';

export default function AdminDeliveryFeesPage() {
  const [fees, setFees] = useState(INITIAL_DELIVERY_FEES);
  const [searchGov, setSearchGov] = useState('');

  const handleFeeChange = (id: number, newFee: number) => {
    setFees(fees.map((f) => (f.id === id ? { ...f, fee: newFee } : f)));
  };

  const filteredFees = fees.filter((f) => f.governorate.includes(searchGov));

  return (
    <div>
      <h1 className="admin-page-title">إدارة أسعار الشحن للمحافظات 🚚</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', fontSize: '14px' }}>
        يمكنكِ تعديل تكلفة الشحن لكل محافظة مباشرة وسيتأثر سعر الإجمالي فوراً عند إتمام العميلة للطلب.
      </p>

      <div style={{ marginBottom: '20px', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="ابحثي عن محافظة..."
          className="form-input"
          value={searchGov}
          onChange={(e) => setSearchGov(e.target.value)}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>المحافظة</th>
              <th>سعر الشحن (ج.م)</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.governorate}</td>
                <td>
                  <input
                    type="number"
                    value={item.fee}
                    onChange={(e) => handleFeeChange(item.id, Number(e.target.value))}
                    style={{
                      width: '100px',
                      padding: '6px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                    }}
                  />{' '}
                  ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
