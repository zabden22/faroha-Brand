'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCategories, saveCategories, getProducts, saveProducts } from '@/lib/store';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('/images/category_dresses.jpg');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadData = () => {
    setCategories(getCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storeUpdated', loadData);
    return () => window.removeEventListener('storeUpdated', loadData);
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const created: Category = {
      id: Date.now(),
      name: newCatName.trim(),
      image: newCatImage.trim() || '/images/category_dresses.jpg',
    };

    const updated = [...categories, created];
    setCategories(updated);
    saveCategories(updated);
    setNewCatName('');
    setNewCatImage('/images/category_dresses.jpg');
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    const updated = categories.map((c) =>
      c.id === editingCategory.id ? { ...editingCategory } : c
    );
    setCategories(updated);
    saveCategories(updated);
    setEditingCategory(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`هل ترغبين بحذف قسم "${name}"؟`)) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveCategories(updated);

      // Clean up orphaned products category references
      const products = getProducts();
      const updatedProducts = products.map((p) =>
        p.categoryId === id ? { ...p, categoryId: updated[0]?.id || 1 } : p
      );
      saveProducts(updatedProducts);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">إدارة الأقسام 🏷️</h1>

      <form onSubmit={handleAddCategory} className="checkout-section" style={{ marginBottom: '24px', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>إضافة قسم جديد للمتجر</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">اسم القسم *</label>
            <input
              type="text"
              required
              placeholder="مثال: إسدالات صوفية"
              className="form-input"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">مسار / رابط صوة القسم</label>
            <select
              className="form-select"
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
            >
              <option value="/images/category_esdals.jpg">إسدالات (/images/category_esdals.jpg)</option>
              <option value="/images/category_dresses.jpg">دريسات (/images/category_dresses.jpg)</option>
              <option value="/images/category_loose.jpg">ملابس واسعة (/images/category_loose.jpg)</option>
              <option value="/images/category_new.jpg">تشكيلة جديدة (/images/category_new.jpg)</option>
              <option value="/images/category_offers.jpg">عروض (/images/category_offers.jpg)</option>
            </select>
          </div>

          <div className="form-group full-width" style={{ marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              إضافة القسم وحفظه ➕
            </button>
          </div>
        </div>
      </form>

      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>الأقسام المتاحة حالياً بالمتجر ({categories.length})</h3>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>صورة القسم</th>
                <th>اسم القسم</th>
                <th>رقم المعرف</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Image
                      src={c.image || '/images/category_dresses.jpg'}
                      alt={c.name}
                      width={45}
                      height={55}
                      style={{ borderRadius: '6px', objectFit: 'cover' }}
                    />
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{c.name}</td>
                  <td>#{c.id}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditingCategory(c)}
                      >
                        تعديل ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id, c.name)}
                      >
                        حذف 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setEditingCategory(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px' }}>✏️ تعديل بيانات القسم #{editingCategory.id}</h3>
            <form onSubmit={handleEditCategory} className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">اسم القسم</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">صورة القسم</label>
                <select
                  className="form-select"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                >
                  <option value="/images/category_esdals.jpg">إسدالات (/images/category_esdals.jpg)</option>
                  <option value="/images/category_dresses.jpg">دريسات (/images/category_dresses.jpg)</option>
                  <option value="/images/category_loose.jpg">ملابس واسعة (/images/category_loose.jpg)</option>
                  <option value="/images/category_new.jpg">تشكيلة جديدة (/images/category_new.jpg)</option>
                  <option value="/images/category_offers.jpg">عروض (/images/category_offers.jpg)</option>
                </select>
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingCategory(null)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
