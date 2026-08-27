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
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    description: '',
    material: '',
    fit: '',
    videoUrl: '',
  });
  const [newProductImages, setNewProductImages] = useState<string[]>([
    '/images/category_dresses.jpg',
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>(['بيج', 'أسود']);

  const loadData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' }),
      ]);
      const [cats, prods] = await Promise.all([catsRes.json(), prodsRes.json()]);
      if (Array.isArray(cats)) {
        setCategories(cats);
        if (cats.length > 0) {
          setNewProduct((prev) => ({
            ...prev,
            categoryId: prev.categoryId || String(cats[0].id),
          }));
        }
      }
      if (Array.isArray(prods)) setProducts(prods);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Multi-image file upload handler
  const handleMultiImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit) {
          setEditingImages((prev) => [...prev, base64]);
        } else {
          setNewProductImages((prev) => {
            // Remove the default placeholder if adding first real image
            const filtered = prev.filter(
              (img) => img !== '/images/category_dresses.jpg'
            );
            return [...filtered, base64];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-selected if needed
    e.target.value = '';
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewProductImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        return updated.length > 0 ? updated : ['/images/category_dresses.jpg'];
      });
    }
  };

  const toggleColor = (colorName: string, isEdit = false) => {
    if (isEdit && editingProduct) {
      const currentVariants = editingProduct.variants || [];
      const exists = currentVariants.some((v) => v.color === colorName);
      if (exists) {
        setEditingProduct({
          ...editingProduct,
          variants: currentVariants.filter((v) => v.color !== colorName),
        });
      } else {
        const colorObj = COLOR_OPTIONS.find((c) => c.name === colorName) || {
          name: colorName,
          hex: '#888',
        };
        const newVariant: ProductVariant = {
          id: 0,
          productId: editingProduct.id,
          size: 'L',
          color: colorObj.name,
          colorHex: colorObj.hex,
          stock: 10,
        };
        setEditingProduct({
          ...editingProduct,
          variants: [...currentVariants, newVariant],
        });
      }
    } else {
      setSelectedColors((prev) =>
        prev.includes(colorName)
          ? prev.filter((c) => c !== colorName)
          : [...prev, colorName]
      );
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const existingImgs = p.images?.map((img) => img.imageUrl) || [
      '/images/category_dresses.jpg',
    ];
    setEditingImages(existingImgs);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const variants = (
      selectedColors.length > 0 ? selectedColors : ['أسود']
    ).map((colorName) => {
      const colorObj = COLOR_OPTIONS.find((c) => c.name === colorName) || {
        name: colorName,
        hex: '#888',
      };
      return { size: 'L', color: colorObj.name, colorHex: colorObj.hex, stock: 10 };
    });

    const categoryId =
      Number(newProduct.categoryId) ||
      (categories.length > 0 ? categories[0].id : 1);

    const imagesToSave =
      newProductImages.length > 0
        ? newProductImages.map((url) => ({ imageUrl: url }))
        : [{ imageUrl: '/images/category_dresses.jpg' }];

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          description:
            newProduct.description || 'منتج جديد أنيق ومميز من FarOha_Brand',
          price: Number(newProduct.price),
          discountPrice: newProduct.discountPrice
            ? Number(newProduct.discountPrice)
            : null,
          categoryId: categoryId,
          material: newProduct.material || null,
          fit: newProduct.fit || null,
          videoUrl: newProduct.videoUrl.trim() || null,
          images: imagesToSave,
          variants,
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewProduct({
          name: '',
          price: '',
          discountPrice: '',
          categoryId: String(categories[0]?.id || 1),
          description: '',
          material: '',
          fit: '',
          videoUrl: '',
        });
        setNewProductImages(['/images/category_dresses.jpg']);
        setSelectedColors(['بيج', 'أسود']);
        await loadData();
        alert('تمت إضافة المنتج بجميع صوره بنجاح في قاعدة البيانات! 🚀');
      } else {
        alert('حدث خطأ أثناء الإضافة. تأكدي من صحة البيانات.');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بقاعدة البيانات');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const imagesToSave =
      editingImages.length > 0
        ? editingImages.map((url) => ({ imageUrl: url }))
        : [{ imageUrl: '/images/category_dresses.jpg' }];

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
          fit: editingProduct.fit,
          videoUrl: editingProduct.videoUrl || null,
          variants: editingProduct.variants?.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock,
          })),
          images: imagesToSave,
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        await loadData();
        alert('تم حفظ التعديلات وتحديث الصور بنجاح! ✨');
      } else {
        alert('حدث خطأ أثناء التعديل.');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بقاعدة البيانات');
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`هل أنتِ متأكدة من حذف المنتج "${name}" نهائياً من قاعدة البيانات؟`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
        alert('تم حذف المنتج بنجاح! 🗑️');
      } else {
        alert('حدث خطأ أثناء حذف المنتج.');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  if (loading)
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        جاري تحميل المنتجات من قاعدة البيانات...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
          إدارة المنتجات 👗
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'إلغاء' : '+ إضافة منتج جديد'}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddProduct}
          className="checkout-section"
          style={{ marginBottom: '32px' }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            إضافة منتج جديد
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">اسم المنتج *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="مثال: إسدال الصلاة الفاخر"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">القسم *</label>
              <select
                className="form-select"
                value={newProduct.categoryId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, categoryId: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">السعر (ج.م) *</label>
              <input
                type="number"
                required
                className="form-input"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">السعر بعد الخصم (اختياري)</label>
              <input
                type="number"
                className="form-input"
                placeholder="مثال: 450"
                value={newProduct.discountPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, discountPrice: e.target.value })
                }
              />
            </div>

            {/* Multiple Images Upload */}
            <div className="form-group full-width">
              <label className="form-label">
                صور المنتج 📷 (يمكنكِ اختيار أكثر من صورة معاً)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-input"
                onChange={(e) => handleMultiImageUpload(e, false)}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-light)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                💡 نصيحة: حددي عدة صور من جهازك بالضغط مع الاستمرار على Ctrl أو Shift. الصورة الأولى ستكون صورة الغلاف الرئيسية.
              </span>
            </div>

            {/* Uploaded Images Gallery Preview */}
            {newProductImages.length > 0 && (
              <div className="form-group full-width">
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  الصور المضافة ({newProductImages.length}):
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: '8px',
                  }}
                >
                  {newProductImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '110px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border:
                          idx === 0
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                      }}
                    >
                      <Image
                        src={imgUrl}
                        alt={`صورة ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      {idx === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(155, 123, 107, 0.9)',
                            color: 'white',
                            fontSize: '9px',
                            textAlign: 'center',
                            padding: '2px',
                            fontWeight: 700,
                          }}
                        >
                          الغلاف ★
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx, false)}
                        title="حذف الصورة"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'rgba(196, 105, 106, 0.9)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video URL Input */}
            <div className="form-group full-width">
              <label className="form-label">
                رابط فيديو للمنتج 🎬 (اختياري)
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="رابط مباشر لفيديو MP4 أو رابط من يوتيوب / تيك توك / ريلز"
                value={newProduct.videoUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, videoUrl: e.target.value })
                }
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">الألوان المتاحة 🎨</label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '6px',
                }}
              >
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = selectedColors.includes(c.name);
                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => toggleColor(c.name, false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        background: isSelected
                          ? 'var(--color-surface)'
                          : 'var(--color-bg)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: '1px solid rgba(0,0,0,0.2)',
                        }}
                      />
                      <span>{c.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">الخامة</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: قطن كريب معالج"
                value={newProduct.material}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, material: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">القصة</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: واسع وفضفاض (Oversized)"
                value={newProduct.fit}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, fit: e.target.value })
                }
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">الوصف</label>
              <textarea
                className="form-textarea"
                placeholder="اكتبي وصفاً جذاباً وتفاصيل مميزة عن القطعة..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
            </div>
            <div className="form-group full-width" style={{ marginTop: '12px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                حفظ المنتج في قاعدة البيانات 🚀
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="checkout-section">
        <h3
          style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}
        >
          جميع المنتجات ({products.length})
        </h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>المنتج</th>
                <th>القسم</th>
                <th>الصور</th>
                <th>السعر</th>
                <th>الألوان</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const catName =
                  categories.find((c) => c.id === p.categoryId)?.name ||
                  p.category?.name ||
                  'عام';
                const mainImg =
                  p.images?.[0]?.imageUrl || '/images/category_dresses.jpg';
                const colorNames = [
                  ...new Set(p.variants?.map((v) => v.color) || []),
                ];
                const imagesCount = p.images?.length || 1;
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
                    <td style={{ fontWeight: 700 }}>
                      {p.name}
                      {p.videoUrl && (
                        <span
                          style={{
                            marginRight: '6px',
                            fontSize: '11px',
                            background: '#e0f2fe',
                            color: '#0284c7',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          🎬 فيديو
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="status-badge status-preparing">
                        {catName}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                        }}
                      >
                        📷 {imagesCount} صور
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: 'var(--color-primary-dark)',
                      }}
                    >
                      {p.discountPrice || p.price} ج.م
                    </td>
                    <td>
                      <div
                        style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}
                      >
                        {colorNames.map((col, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11px',
                              background: 'var(--color-bg-secondary)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEditModal(p)}
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
              maxWidth: '650px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px' }}>
              ✏️ تعديل: {editingProduct.name}
            </h3>
            <form onSubmit={handleEditProduct} className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">اسم المنتج</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">القسم</label>
                <select
                  className="form-select"
                  value={editingProduct.categoryId}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">السعر (ج.م)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">السعر بعد الخصم</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingProduct.discountPrice || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountPrice: e.target.value
                        ? Number(e.target.value)
                        : null,
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
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      material: e.target.value,
                    })
                  }
                />
              </div>

              {/* Edit Multi Images */}
              <div className="form-group full-width">
                <label className="form-label">
                  إضافة صور جديدة 📷 (يمكنكِ اختيار عدة صور معاً)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-input"
                  onChange={(e) => handleMultiImageUpload(e, true)}
                />
              </div>

              {editingImages.length > 0 && (
                <div className="form-group full-width">
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    الصور الحالية للمنتج ({editingImages.length}):
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      padding: '10px',
                      background: 'var(--color-bg-alt)',
                      borderRadius: '8px',
                    }}
                  >
                    {editingImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          width: '75px',
                          height: '95px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border:
                            idx === 0
                              ? '2px solid var(--color-primary)'
                              : '1px solid var(--color-border)',
                        }}
                      >
                        <Image
                          src={imgUrl}
                          alt={`صورة ${idx + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                        {idx === 0 && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'rgba(155, 123, 107, 0.9)',
                              color: 'white',
                              fontSize: '8px',
                              textAlign: 'center',
                              padding: '1px',
                              fontWeight: 700,
                            }}
                          >
                            الغلاف
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx, true)}
                          title="حذف الصورة"
                          style={{
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'rgba(196, 105, 106, 0.9)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Video URL */}
              <div className="form-group full-width">
                <label className="form-label">رابط الفيديو 🎬</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="رابط مباشر لفيديو MP4 أو يوتيوب / تيك توك / ريلز"
                  value={editingProduct.videoUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      videoUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">الألوان المتاحة</label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '6px',
                  }}
                >
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = editingProduct.variants?.some(
                      (v) => v.color === c.name
                    );
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => toggleColor(c.name, true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          background: isSelected
                            ? 'var(--color-surface)'
                            : 'var(--color-bg)',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: c.hex,
                          }}
                        />
                        <span>{c.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group full-width">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-textarea"
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div
                className="form-group full-width"
                style={{ marginTop: '12px', display: 'flex', gap: '8px' }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingProduct(null)}
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
