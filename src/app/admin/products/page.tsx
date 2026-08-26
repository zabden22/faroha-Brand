'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/store';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    categoryId: '1',
    description: '',
    material: '',
    fit: '',
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created: Product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description || 'منتج جديد مميز من FarOha_Brand',
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
      categoryId: Number(newProduct.categoryId),
      stock: 10,
      material: newProduct.material || 'قطن مريح',
      fit: newProduct.fit || 'واسع',
      careInstructions: 'غسيل خفيف',
      isNew: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      images: [{ id: Date.now(), productId: Date.now(), imageUrl: '/images/category_dresses.jpg' }],
      variants: [{ id: Date.now(), productId: Date.now(), size: 'L', color: 'بيج', colorHex: '#D4B9A7', stock: 10 }],
    };

    setProducts([created, ...products]);
    setShowAddForm(false);
    setNewProduct({ name: '', price: '', discountPrice: '', categoryId: '1', description: '', material: '', fit: '' });
    alert('تمت إضافة المنتج بنجاح! ✨');
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>إدارة المنتجات 👗</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'إلغاء' : '+ إضافة منتج جديد'}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className="admin-form" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>بيانات المنتج الجديد</h3>

          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">اسم المنتج *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="مثال: دريس فروحة الكلاسيكي"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">القسم *</label>
              <select
                className="form-select"
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
              >
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">السعر الأساسي (ج.م) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="850"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">سعر الخصم (اختياري)</label>
              <input
                type="number"
                className="form-input"
                placeholder="750"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">وصف المنتج</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="اكتبي وصفاً دقيقاً ومميزاً للمنتج..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }}>
            حفظ ونشر المنتج ✨
          </button>
        </form>
      )}

      {/* Products Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>اسم المنتج</th>
              <th>القسم</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <Image
                    src={p.images?.[0]?.imageUrl || '/images/category_dresses.jpg'}
                    alt=""
                    width={48}
                    height={60}
                    style={{ borderRadius: '6px', objectFit: 'cover' }}
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{INITIAL_CATEGORIES.find((c) => c.id === p.categoryId)?.name || 'قسم عام'}</td>
                <td>
                  {p.discountPrice ? (
                    <span>
                      <strong style={{ color: 'var(--color-primary)' }}>{p.discountPrice} ج.م</strong>{' '}
                      <small style={{ textDecoration: 'line-through', opacity: 0.5 }}>{p.price}</small>
                    </span>
                  ) : (
                    <span>{p.price} ج.م</span>
                  )}
                </td>
                <td>
                  <span className="status-badge delivered">متوفر ({p.stock})</span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>
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
