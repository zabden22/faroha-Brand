'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProducts, saveProducts, getCategories } from '@/lib/store';
import { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    description: '',
    material: '',
    fit: '',
    imageUrl: '/images/category_dresses.jpg',
    size: 'L',
    color: 'أسود',
  });

  const loadData = () => {
    const cats = getCategories();
    setCategories(cats);
    setProducts(getProducts());
    if (cats.length > 0 && !newProduct.categoryId) {
      setNewProduct((prev) => ({ ...prev, categoryId: String(cats[0].id) }));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storeUpdated', loadData);
    return () => window.removeEventListener('storeUpdated', loadData);
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const catId = Number(newProduct.categoryId) || categories[0]?.id || 1;
    const selectedCategory = categories.find((c) => c.id === catId) || categories[0];

    const created: Product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      description: newProduct.description || 'منتج جديد أنيق ومميز من FarOha_Brand',
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
      categoryId: catId,
      category: selectedCategory,
      stock: 15,
      material: newProduct.material || 'قطن ممتازة',
      fit: newProduct.fit || 'واسع / مريح',
      careInstructions: 'غسيل يدوي أو ماكينة بارد',
      isNew: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      images: [{ id: Date.now(), productId: Date.now(), imageUrl: newProduct.imageUrl || '/images/category_dresses.jpg' }],
      variants: [
        {
          id: Date.now(),
          productId: Date.now(),
          size: newProduct.size || 'L',
          color: newProduct.color || 'أسود',
          colorHex: '#222222',
          stock: 15,
        },
      ],
    };

    const updated = [created, ...products];
    setProducts(updated);
    saveProducts(updated);
    setShowAddForm(false);
    setNewProduct({
      name: '',
      price: '',
      discountPrice: '',
      categoryId: String(categories[0]?.id || 1),
      description: '',
      material: '',
      fit: '',
      imageUrl: '/images/category_dresses.jpg',
      size: 'L',
      color: 'أسود',
    });
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const catId = Number(editingProduct.categoryId);
    const selectedCategory = categories.find((c) => c.id === catId);

    const updatedProduct = {
      ...editingProduct,
      category: selectedCategory || editingProduct.category,
    };

    const updated = products.map((p) => (p.id === editingProduct.id ? updatedProduct : p));
    setProducts(updated);
    saveProducts(updated);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (confirm(`هل أنتِ متأكدة من حذف المنتج "${name}"؟`)) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
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
        <form onSubmit={handleAddProduct} className="checkout-section" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>إضافة منتج جديد للمتجر</h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">اسم المنتج *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="مثال: إسدال الصلاة المريح"
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
                {categories.map((c) => (
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
                placeholder="مثال: 650"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">السعر بعد الخصم (اختياري)</label>
              <input
                type="number"
                className="form-input"
                placeholder="مثال: 550"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">صورة المنتج الرئيسية</label>
              <select
                className="form-select"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              >
                <option value="/images/category_esdals.jpg">إسدالات (/images/category_esdals.jpg)</option>
                <option value="/images/category_dresses.jpg">دريسات (/images/category_dresses.jpg)</option>
                <option value="/images/category_loose.jpg">ملابس واسعة (/images/category_loose.jpg)</option>
                <option value="/images/category_new.jpg">تشكيلة جديدة (/images/category_new.jpg)</option>
                <option value="/images/category_offers.jpg">عروض (/images/category_offers.jpg)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الخامة</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: قطن ناعم 100%"
                value={newProduct.material}
                onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">الوصف التفصيلي للمنتج</label>
              <textarea
                className="form-textarea"
                placeholder="أدخلي وصف المنتج وخامته ونوعية القماش..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            <div className="form-group full-width" style={{ marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                حفظ وإضافة المنتج للمتجر 🚀
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="checkout-section">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          جميع المنتجات المتاحة حالياً ({products.length})
        </h3>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>اسم المنتج</th>
                <th>القسم</th>
                <th>السعر الأصلي</th>
                <th>السعر الحالي</th>
                <th>الخامة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const catName = categories.find((c) => c.id === p.categoryId)?.name || p.category?.name || 'عام';
                const mainImg = p.images?.[0]?.imageUrl || '/images/category_dresses.jpg';

                return (
                  <tr key={p.id}>
                    <td>
                      <Image
                        src={mainImg}
                        alt={p.name}
                        width={45}
                        height={55}
                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text)' }}>{p.name}</td>
                    <td>
                      <span className="status-badge status-preparing">{catName}</span>
                    </td>
                    <td>{p.price} ج.م</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      {p.discountPrice ? `${p.discountPrice} ج.م` : `${p.price} ج.م`}
                    </td>
                    <td>{p.material || 'قطن'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditingProduct(p)}
                        >
                          تعديل ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                        >
                          حذف 🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
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
          onClick={() => setEditingProduct(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '600px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px' }}>✏️ تعديل منتج: {editingProduct.name}</h3>
            <form onSubmit={handleEditProduct} className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">اسم المنتج</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">القسم</label>
                <select
                  className="form-select"
                  value={editingProduct.categoryId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: Number(e.target.value) })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">السعر الأساسي (ج.م)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">السعر بعد الخصم (ج.م)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingProduct.discountPrice || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">الخامة</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProduct.material || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-textarea"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  حفظ التعديلات
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>
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
