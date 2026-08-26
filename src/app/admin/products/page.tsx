'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Category, ProductVariant } from '@/types';

const COLOR_OPTIONS = [
  { name: 'أسود', hex: '#222222' },
  { name: 'بيج', hex: '#D4B9A7' },
  { name: 'موف', hex: '#A3798A' },
  { name: 'زيتي', hex: '#6B8E7B' },
  { name: 'نبيذي', hex: '#6B1D2F' },
  { name: 'بني', hex: '#5C4033' },
  { name: 'كحلي', hex: '#1B263B' },
  { name: 'أوف وايت', hex: '#F5F5DC' },
  { name: 'وردي', hex: '#E8A598' },
  { name: 'رمادي', hex: '#888888' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '', price: '', discountPrice: '', categoryId: '', description: '', material: '', fit: '',
    imageUrl: '/images/category_dresses.jpg',
  });
  const [selectedColors, setSelectedColors] = useState<string[]>(['بيج', 'أسود']);

  const loadData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
      ]);
      const [cats, prods] = await Promise.all([catsRes.json(), prodsRes.json()]);
      if (Array.isArray(cats)) {
        setCategories(cats);
        if (cats.length > 0) setNewProduct((prev) => ({ ...prev, categoryId: String(cats[0].id) }));
      }
      if (Array.isArray(prods)) setProducts(prods);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, images: [{ id: 0, productId: editingProduct.id, imageUrl: base64 }] });
      } else {
        setNewProduct({ ...newProduct, imageUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleColor = (colorName: string, isEdit = false) => {
    if (isEdit && editingProduct) {
      const currentVariants = editingProduct.variants || [];
      const exists = currentVariants.some((v) => v.color === colorName);
      if (exists) {
        setEditingProduct({ ...editingProduct, variants: currentVariants.filter((v) => v.color !== colorName) });
      } else {
        const colorObj = COLOR_OPTIONS.find((c) => c.name === colorName) || { name: colorName, hex: '#888' };
        const newVariant: ProductVariant = { id: 0, productId: editingProduct.id, size: 'L', color: colorObj.name, colorHex: colorObj.hex, stock: 10 };
        setEditingProduct({ ...editingProduct, variants: [...currentVariants, newVariant] });
      }
    } else {
      setSelectedColors((prev) => prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const variants = (selectedColors.length > 0 ? selectedColors : ['أسود']).map((colorName) => {
      const colorObj = COLOR_OPTIONS.find((c) => c.name === colorName) || { name: colorName, hex: '#888' };
      return { size: 'L', color: colorObj.name, colorHex: colorObj.hex, stock: 10 };
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          description: newProduct.description || 'منتج جديد أنيق ومميز من FarOha_Brand',
          price: Number(newProduct.price),
          discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
          categoryId: Number(newProduct.categoryId) || categories[0]?.id || 1,
          material: newProduct.material || null,
          fit: newProduct.fit || null,
          images: [{ imageUrl: newProduct.imageUrl || '/images/category_dresses.jpg' }],
          variants,
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewProduct({ name: '', price: '', discountPrice: '', categoryId: String(categories[0]?.id || 1), description: '', material: '', fit: '', imageUrl: '/images/category_dresses.jpg' });
        setSelectedColors(['بيج', 'أسود']);
        await loadData();
        alert('تمت إضافة المنتج وحفظه في قاعدة البيانات بنجاح! 🚀');
      } else {
        alert('حدث خطأ أثناء الإضافة. حاول مرة أخرى.');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بقاعدة البيانات');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          discountPrice: editingProduct.discountPrice,
          categoryId: editingProduct.categoryId,
          material: editingProduct.material,
          variants: editingProduct.variants?.map((v) => ({ size: v.size, color: v.color, colorHex: v.colorHex, stock: v.stock })),
          images: editingProduct.images?.map((img) => ({ imageUrl: img.imageUrl })),
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        await loadData();
        alert('تم حفظ التعديلات في قاعدة البيانات بنجاح! ✨');
      } else {
        alert('حدث خطأ أثناء التعديل.');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بقاعدة البيانات');
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`هل أنتِ متأكدة من حذف المنتج "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
        alert('تم حذف المنتج من قاعدة البيانات بنجاح! 🗑️');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل المنتجات من قاعدة البيانات...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>إدارة المنتجات 👗</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'إلغاء' : '+ إضافة منتج جديد'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="checkout-section" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>إضافة منتج جديد</h3>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">اسم المنتج *</label><input type="text" required className="form-input" placeholder="مثال: إسدال الصلاة المريح" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">القسم *</label><select className="form-select" value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}>{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
            <div className="form-group"><label className="form-label">السعر (ج.م) *</label><input type="number" required className="form-input" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">السعر بعد الخصم</label><input type="number" className="form-input" value={newProduct.discountPrice} onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })} /></div>
            <div className="form-group full-width"><label className="form-label">رفع صورة المنتج 📁</label><input type="file" accept="image/*" className="form-input" onChange={(e) => handleImageFileUpload(e, false)} /></div>
            {newProduct.imageUrl && (
              <div className="form-group full-width" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>معاينة:</span>
                <Image src={newProduct.imageUrl} alt="معاينة" width={90} height={110} style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
              </div>
            )}
            <div className="form-group full-width">
              <label className="form-label">الألوان المتاحة 🎨</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = selectedColors.includes(c.name);
                  return (
                    <button type="button" key={c.name} onClick={() => toggleColor(c.name, false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: isSelected ? 'var(--color-surface)' : 'var(--color-bg)', fontWeight: isSelected ? 700 : 500, fontSize: '13px', cursor: 'pointer' }}>
                      <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.2)' }} />
                      <span>{c.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="form-group"><label className="form-label">الخامة</label><input type="text" className="form-input" value={newProduct.material} onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">القصة</label><input type="text" className="form-input" value={newProduct.fit} onChange={(e) => setNewProduct({ ...newProduct, fit: e.target.value })} /></div>
            <div className="form-group full-width"><label className="form-label">الوصف</label><textarea className="form-textarea" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
            <div className="form-group full-width" style={{ marginTop: '12px' }}><button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>حفظ المنتج في قاعدة البيانات 🚀</button></div>
          </div>
        </form>
      )}

      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>جميع المنتجات ({products.length})</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead><tr><th>الصورة</th><th>المنتج</th><th>القسم</th><th>السعر</th><th>الألوان</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {products.map((p) => {
                const catName = categories.find((c) => c.id === p.categoryId)?.name || p.category?.name || 'عام';
                const mainImg = p.images?.[0]?.imageUrl || '/images/category_dresses.jpg';
                const colorNames = [...new Set(p.variants?.map((v) => v.color) || [])];
                return (
                  <tr key={p.id}>
                    <td><Image src={mainImg} alt={p.name} width={45} height={55} style={{ borderRadius: '6px', objectFit: 'cover' }} /></td>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td><span className="status-badge status-preparing">{catName}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{p.discountPrice || p.price} ج.م</td>
                    <td><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{colorNames.map((col, idx) => (<span key={idx} style={{ fontSize: '11px', background: 'var(--color-bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{col}</span>))}</div></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditingProduct(p)}>تعديل ✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id, p.name)}>حذف 🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={() => setEditingProduct(null)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', maxWidth: '650px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>✏️ تعديل: {editingProduct.name}</h3>
            <form onSubmit={handleEditProduct} className="form-grid">
              <div className="form-group full-width"><label className="form-label">اسم المنتج</label><input type="text" className="form-input" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">القسم</label><select className="form-select" value={editingProduct.categoryId} onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: Number(e.target.value) })}>{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
              <div className="form-group"><label className="form-label">السعر (ج.م)</label><input type="number" className="form-input" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} required /></div>
              <div className="form-group full-width"><label className="form-label">رفع صورة جديدة</label><input type="file" accept="image/*" className="form-input" onChange={(e) => handleImageFileUpload(e, true)} /></div>
              <div className="form-group full-width">
                <label className="form-label">الألوان المتاحة</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = editingProduct.variants?.some((v) => v.color === c.name);
                    return (
                      <button type="button" key={c.name} onClick={() => toggleColor(c.name, true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: isSelected ? 'var(--color-surface)' : 'var(--color-bg)', fontSize: '12px', cursor: 'pointer' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex }} /><span>{c.name}</span>{isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group full-width"><label className="form-label">الوصف</label><textarea className="form-textarea" value={editingProduct.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
              <div className="form-group full-width" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>حفظ التعديلات</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
