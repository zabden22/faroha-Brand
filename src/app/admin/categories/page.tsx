'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INITIAL_CATEGORIES } from '@/lib/store';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const created = {
      id: Date.now(),
      name: newCatName,
      image: '/images/category_dresses.jpg',
    };

    setCategories([...categories, created]);
    setNewCatName('');
    alert('تمت إضافة القسم بنجاح! 🎉');
  };

  const handleDelete = (id: number) => {
    if (confirm('هل ترغبين بحذف هذا القسم؟')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">إدارة الأقسام 🏷️</h1>

      <form onSubmit={handleAddCategory} className="admin-form" style={{ marginBottom: '24px', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>إضافة قسم جديد</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            required
            placeholder="اسم القسم (مثال: ملابس الشتاء)"
            className="form-input"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            إضافة
          </button>
        </div>
      </form>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>صورة القسم</th>
              <th>اسم القسم</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <Image src={c.image} alt={c.name} width={40} height={50} style={{ borderRadius: '6px', objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                    حذف 🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
