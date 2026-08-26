'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('/images/category_dresses.jpg');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error('Error loading categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit && editingCategory) {
        setEditingCategory({ ...editingCategory, image: base64String });
      } else {
        setNewCatImage(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), image: newCatImage }),
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatImage('/images/category_dresses.jpg');
        await loadCategories();
        alert('تمت إضافة القسم وحفظه في قاعدة البيانات بنجاح! 🎉');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name, image: editingCategory.image }),
      });
      if (res.ok) {
        setEditingCategory(null);
        await loadCategories();
        alert('تم حفظ التعديلات بنجاح! ✨');
      }
    } catch (e) {
      alert('حدث خطأ أثناء التعديل');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`هل ترغبين بحذف قسم "${name}"؟ سيتم حذف جميع منتجاته أيضاً.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadCategories();
        alert('تم حذف القسم بنجاح! 🗑️');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل الأقسام من قاعدة البيانات...</div>;
  }

  return (
    <div>
      <h1 className="admin-page-title">إدارة الأقسام 🏷️</h1>

      <form onSubmit={handleAddCategory} className="checkout-section" style={{ marginBottom: '24px', maxWidth: '650px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>إضافة قسم جديد للمتجر</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">اسم القسم *</label>
            <input type="text" required placeholder="مثال: إسدالات صوفية" className="form-input" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">اختيار صورة جاهزة</label>
            <select className="form-select" value={newCatImage.startsWith('data:') ? 'custom' : newCatImage} onChange={(e) => { if (e.target.value !== 'custom') setNewCatImage(e.target.value); }}>
              <option value="/images/category_esdals.jpg">إسدالات</option>
              <option value="/images/category_dresses.jpg">دريسات</option>
              <option value="/images/category_loose.jpg">ملابس واسعة</option>
              <option value="/images/category_new.jpg">تشكيلة جديدة</option>
              <option value="/images/category_offers.jpg">عروض</option>
              {newCatImage.startsWith('data:') && <option value="custom">صورة مخصصة 📁</option>}
            </select>
          </div>
          <div className="form-group full-width">
            <label className="form-label">أو رفع صورة من جهازك 📁</label>
            <input type="file" accept="image/*" className="form-input" onChange={(e) => handleImageFileUpload(e, false)} />
          </div>
          {newCatImage && (
            <div className="form-group full-width" style={{ alignItems: 'center', marginBlock: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>معاينة:</span>
              <Image src={newCatImage} alt="معاينة" width={80} height={100} style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
            </div>
          )}
          <div className="form-group full-width" style={{ marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>إضافة القسم وحفظه ➕</button>
          </div>
        </div>
      </form>

      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>الأقسام المتاحة ({categories.length})</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>الصورة</th><th>اسم القسم</th><th>#</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td><Image src={c.image || '/images/category_dresses.jpg'} alt={c.name} width={45} height={55} style={{ borderRadius: '6px', objectFit: 'cover' }} /></td>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>#{c.id}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditingCategory(c)}>تعديل ✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, c.name)}>حذف 🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={() => setEditingCategory(null)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>✏️ تعديل القسم</h3>
            <form onSubmit={handleEditCategory} className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">اسم القسم</label>
                <input type="text" className="form-input" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">رفع صورة جديدة (اختياري)</label>
                <input type="file" accept="image/*" className="form-input" onChange={(e) => handleImageFileUpload(e, true)} />
              </div>
              <div className="form-group full-width" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>حفظ التعديلات</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingCategory(null)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
