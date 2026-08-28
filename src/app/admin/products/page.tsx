'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, Category, ProductVariant } from '@/types';
import {
  FlowerIcon,
  CameraIcon,
  VideoIcon,
  RulerIcon,
  ColorPaletteIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RocketIcon,
  RefreshIcon,
} from '@/components/Icons';

const COLOR_OPTIONS = [
  // ── المحايدات والأساسيات ──
  { name: 'أسود', hex: '#1A1A1A' },
  { name: 'أبيض ناصع', hex: '#FFFFFF' },
  { name: 'أوف وايت', hex: '#F5F2EB' },
  { name: 'بيج فاتح', hex: '#E8D8C8' },
  { name: 'بيج كلاسيك', hex: '#D4B9A7' },
  { name: 'كافيه / لاتيه', hex: '#A67B5B' },
  { name: 'بني شوكولاتة', hex: '#5C4033' },
  { name: 'بني داكن', hex: '#3B2219' },
  { name: 'رمادي فاتح', hex: '#D3D3D3' },
  { name: 'رمادي كلاسيك', hex: '#888888' },
  { name: 'رمادي فحم', hex: '#444444' },

  // ── الوردي، البنك والكشمير ──
  { name: 'بيبي بينك', hex: '#F8BBD0' },
  { name: 'وردي / بينك', hex: '#E8A598' },
  { name: 'كشمير هادئ', hex: '#DDA7A5' },
  { name: 'كشمير غامق', hex: '#B07278' },
  { name: 'روز جولد', hex: '#B76E79' },
  { name: 'فوشيا', hex: '#D81B60' },

  // ── الموف والبنفسجي ──
  { name: 'لافندر', hex: '#C3B1E1' },
  { name: 'موف كلاسيك', hex: '#A3798A' },
  { name: 'بنفسجي باذنجاني', hex: '#5E2B58' },

  // ── الأحمر والنبيذي ──
  { name: 'نبيذي / بورجوندي', hex: '#6B1D2F' },
  { name: 'عنابي داكن', hex: '#4A0E17' },
  { name: 'أحمر ملكي', hex: '#C0392B' },
  { name: 'طوبي / تيراكوتا', hex: '#C86446' },
  { name: 'خوخي / بيتش', hex: '#FFCBA4' },

  // ── الأزرق والكحلي ──
  { name: 'بيبي بلو / سماوي', hex: '#A0C4E2' },
  { name: 'أزرق بترولي / تيل', hex: '#005F73' },
  { name: 'أزرق رويال', hex: '#2A52BE' },
  { name: 'كحلي كلاسيك', hex: '#1B263B' },
  { name: 'كحلي داكن', hex: '#0F172A' },

  // ── الأخضر والزيتي ──
  { name: 'مينت جرين / نعناعي', hex: '#A8E6CF' },
  { name: 'بستاج / فستقي', hex: '#93C572' },
  { name: 'زيتي فاتح', hex: '#8A9A5B' },
  { name: 'زيتي كلاسيك', hex: '#6B8E7B' },
  { name: 'أخضر زمردي', hex: '#1B6B4C' },
  { name: 'زيتي داكن', hex: '#3B4A3F' },

  // ── الأصفر والذهبي والبرتقالي ──
  { name: 'أصفر باستيل', hex: '#FFF9A6' },
  { name: 'مستردة / خردلي', hex: '#E1AD01' },
  { name: 'هافان / ذهبي', hex: '#C59B27' },
  { name: 'برتقالي هادئ', hex: '#E67E22' },
];

export const SIZE_OPTIONS = [
  'One Size (فري سايز)',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  'M',
  'S',
  '50',
  '52',
  '54',
  '56',
  '58',
  '60',
  '62',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Colors
  const [customColors, setCustomColors] = useState<{ name: string; hex: string }[]>([]);
  const [newCustomColorName, setNewCustomColorName] = useState('');
  const [newCustomColorHex, setNewCustomColorHex] = useState('#E8A598');
  const allColorOptions = [...COLOR_OPTIONS, ...customColors];

  // Custom Sizes
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [newCustomSizeName, setNewCustomSizeName] = useState('');
  const allSizeOptions = [...SIZE_OPTIONS, ...customSizes];

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
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['One Size (فري سايز)']);

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

  // Client-side image compression to prevent large payload errors
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } else {
            resolve(img.src);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve('');
    });
  };

  // Multi-image file upload handler with auto compression
  const handleMultiImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    for (const file of fileList) {
      try {
        const compressedBase64 = await compressImageFile(file);
        if (!compressedBase64) continue;

        if (isEdit) {
          setEditingImages((prev) => [...prev, compressedBase64]);
        } else {
          setNewProductImages((prev) => {
            const filtered = prev.filter(
              (img) => img !== '/images/category_dresses.jpg'
            );
            return [...filtered, compressedBase64];
          });
        }
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

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

  // Direct video file upload handler
  const handleVideoFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check 4.5MB payload safety limit for serverless upload
    if (file.size > 4.5 * 1024 * 1024) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      alert(
        `⚠️ حجم ملف الفيديو (${mb} ميجابايت) أكبر من الحد المسموح للرفع المباشر (4.5 ميجابايت).\n\n💡 الحل الأفضل والأسرع:\nانسخي رابط الفيديو من (Instagram Reel أو YouTube Shorts أو TikTok أو Google Drive أو Streamable) وضعيه في خانة الرابط بالأسفل، وسيعمل فوراً بجودة وسرعة فائقة!`
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, videoUrl: base64 });
      } else {
        setNewProduct((prev) => ({ ...prev, videoUrl: base64 }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeVideo = (isEdit = false) => {
    if (isEdit && editingProduct) {
      setEditingProduct({ ...editingProduct, videoUrl: null });
    } else {
      setNewProduct((prev) => ({ ...prev, videoUrl: '' }));
    }
  };

  const toggleColor = (colorName: string, isEdit = false, customHex?: string) => {
    if (isEdit && editingProduct) {
      const currentVariants = editingProduct.variants || [];
      const exists = currentVariants.some((v) => v.color === colorName);
      if (exists) {
        setEditingProduct({
          ...editingProduct,
          variants: currentVariants.filter((v) => v.color !== colorName),
        });
      } else {
        const colorObj = allColorOptions.find((c) => c.name === colorName) || {
          name: colorName,
          hex: customHex || '#888888',
        };
        const newVariant: ProductVariant = {
          id: 0,
          productId: editingProduct.id,
          size: 'L',
          color: colorObj.name,
          colorHex: customHex || colorObj.hex,
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

  const handleAddCustomColor = (e: React.MouseEvent, isEdit = false) => {
    e.preventDefault();
    if (!newCustomColorName.trim()) return;
    const name = newCustomColorName.trim();
    const hex = newCustomColorHex;
    if (!allColorOptions.some((c) => c.name === name)) {
      setCustomColors((prev) => [...prev, { name, hex }]);
    }
    toggleColor(name, isEdit, hex);
    setNewCustomColorName('');
  };

  const toggleSize = (sizeName: string, isEdit = false) => {
    if (isEdit && editingProduct) {
      const currentVariants = editingProduct.variants || [];
      const hasThisSize = currentVariants.some((v) => v.size === sizeName);
      if (hasThisSize) {
        const remaining = currentVariants.filter((v) => v.size !== sizeName);
        if (remaining.length > 0) {
          setEditingProduct({ ...editingProduct, variants: remaining });
        } else {
          alert('يجب الإبقاء على مقاس واحد على الأقل للمنتج.');
        }
      } else {
        const colors = Array.from(
          new Set(currentVariants.map((v) => v.color).filter(Boolean))
        );
        const colorsToAdd = colors.length > 0 ? colors : ['أسود'];
        const newVars = colorsToAdd.map((col) => {
          const colHex =
            currentVariants.find((v) => v.color === col)?.colorHex || '#888888';
          return {
            id: 0,
            productId: editingProduct.id,
            size: sizeName,
            color: col,
            colorHex: colHex,
            stock: 10,
          };
        });
        setEditingProduct({
          ...editingProduct,
          variants: [...currentVariants, ...newVars],
        });
      }
    } else {
      setSelectedSizes((prev) =>
        prev.includes(sizeName)
          ? prev.filter((s) => s !== sizeName)
          : [...prev, sizeName]
      );
    }
  };

  const handleAddCustomSize = (e: React.MouseEvent, isEdit = false) => {
    e.preventDefault();
    if (!newCustomSizeName.trim()) return;
    const name = newCustomSizeName.trim();
    if (!allSizeOptions.includes(name)) {
      setCustomSizes((prev) => [...prev, name]);
    }
    toggleSize(name, isEdit);
    setNewCustomSizeName('');
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
    if (!newProduct.name || !newProduct.price) {
      alert('يرجى ملء اسم المنتج والسعر');
      return;
    }

    setIsSubmitting(true);

    const colorsToUse = selectedColors.length > 0 ? selectedColors : ['أسود'];
    const sizesToUse =
      selectedSizes.length > 0 ? selectedSizes : ['One Size (فري سايز)'];

    const variants: any[] = [];
    sizesToUse.forEach((sz) => {
      colorsToUse.forEach((colorName) => {
        const colorObj = allColorOptions.find((c) => c.name === colorName) || {
          name: colorName,
          hex: '#888888',
        };
        variants.push({
          size: sz,
          color: colorObj.name,
          colorHex: colorObj.hex,
          stock: 10,
        });
      });
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
          videoUrl: newProduct.videoUrl ? String(newProduct.videoUrl).trim() : null,
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
        setSelectedSizes(['One Size (فري سايز)']);
        await loadData();
        alert('تمت إضافة المنتج بجميع مقاساته وألوانه بنجاح! 🚀');
      } else {
        const errData = await res.json().catch(() => null);
        alert(
          errData?.error
            ? `تعذر الحفظ: ${errData.error}`
            : 'حدث خطأ أثناء الإضافة. تأكدي من صحة البيانات وحجم الصور/الفيديو.'
        );
      }
    } catch (e: any) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);

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
          videoUrl: editingProduct.videoUrl
            ? String(editingProduct.videoUrl).trim()
            : null,
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
        const errData = await res.json().catch(() => null);
        alert(
          errData?.error
            ? `تعذر الحفظ: ${errData.error}`
            : 'حدث خطأ أثناء التعديل.'
        );
      }
    } catch (e: any) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بقاعدة البيانات');
    } finally {
      setIsSubmitting(false);
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
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1
          className="admin-page-title"
          style={{
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FlowerIcon size={24} style={{ color: 'var(--color-primary)' }} />
          إدارة المنتجات
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={loadData}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '13px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshIcon size={14} />
            تحديث
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {showAddForm ? 'إلغاء' : (
              <>
                <PlusIcon size={16} />
                <span>إضافة منتج جديد</span>
              </>
            )}
          </button>
        </div>
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
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CameraIcon size={16} style={{ color: 'var(--color-primary)' }} />
                صور المنتج (يمكنكِ اختيار أكثر من صورة معاً)
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
                نصيحة: حددي عدة صور من جهازك بالضغط مع الاستمرار على Ctrl أو Shift. الصورة الأولى ستكون صورة الغلاف الرئيسية.
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
                          الغلاف الرئيسي
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

            {/* Direct Video File Upload & Preview */}
            <div className="form-group full-width">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <VideoIcon size={16} style={{ color: 'var(--color-primary)' }} />
                فيديو للمنتج (رفع مباشر من جهازك أو هاتفك)
              </label>
              <input
                type="file"
                accept="video/*"
                className="form-input"
                onChange={(e) => handleVideoFileUpload(e, false)}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-light)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                يمكنكِ رفع فيديو مصور للمنتج من الكاميرا أو المعرض مباشرة (MP4, MOV, WebM).
              </span>

              {newProduct.videoUrl && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <VideoIcon size={14} />
                      معاينة الفيديو المرفوع:
                    </span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeVideo(false)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      ✕ إزالة الفيديو
                    </button>
                  </div>
                  <video
                    src={newProduct.videoUrl}
                    controls
                    playsInline
                    style={{
                      maxWidth: '100%',
                      maxHeight: '220px',
                      borderRadius: '8px',
                      background: '#000',
                    }}
                  />
                </div>
              )}

              {/* Optional Link Input */}
              <div style={{ marginTop: '10px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-light)',
                  }}
                >
                  أو وضع رابط فيديو خارجي (YouTube / Reels):
                </span>
                <input
                  type="url"
                  className="form-input"
                  placeholder="رابط مباشر لفيديو MP4 أو يوتيوب / تيك توك / ريلز"
                  value={
                    newProduct.videoUrl.startsWith('data:')
                      ? ''
                      : newProduct.videoUrl
                  }
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, videoUrl: e.target.value })
                  }
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            {/* Sizes Selection (المقاسات المتاحة) */}
            <div className="form-group full-width">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RulerIcon size={16} style={{ color: 'var(--color-primary)' }} />
                المقاسات المتاحة للمنتج
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '6px',
                  padding: '10px',
                  background: 'var(--color-bg-alt)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {allSizeOptions.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz, false)}
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
                          : 'white',
                        color: isSelected
                          ? 'var(--color-primary-dark)'
                          : 'var(--color-text)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '0 2px 6px rgba(155,123,107,0.2)'
                          : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{sz}</span>
                      {isSelected && (
                        <span
                          style={{
                            color: 'var(--color-primary)',
                            fontWeight: 800,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                  أضيفي مقاساً مخصصاً جديداً:
                </span>
                <input
                  type="text"
                  placeholder="مثال: مقاس خاص أو طول 155"
                  className="form-input"
                  style={{
                    maxWidth: '200px',
                    padding: '6px 12px',
                    fontSize: '13px',
                  }}
                  value={newCustomSizeName}
                  onChange={(e) => setNewCustomSizeName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={(e) => handleAddCustomSize(e, false)}
                >
                  + إضافة المقاس
                </button>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ColorPaletteIcon size={16} style={{ color: 'var(--color-primary)' }} />
                الألوان المتاحة للمنتج
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '6px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: 'var(--color-bg-alt)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {allColorOptions.map((c) => {
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
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        background: isSelected
                          ? 'var(--color-surface)'
                          : 'white',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 2px 6px rgba(155,123,107,0.2)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: c.hex.toLowerCase() === '#ffffff' ? '1px solid #ccc' : '1px solid rgba(0,0,0,0.15)',
                          flexShrink: 0,
                        }}
                      />
                      <span>{c.name}</span>
                      {isSelected && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                  أضيفي لوناً مخصصاً جديداً:
                </span>
                <input
                  type="text"
                  placeholder="اسم اللون (مثلاً: زيتي زاهي)"
                  className="form-input"
                  style={{ maxWidth: '180px', padding: '6px 12px', fontSize: '13px' }}
                  value={newCustomColorName}
                  onChange={(e) => setNewCustomColorName(e.target.value)}
                />
                <input
                  type="color"
                  title="اختاري درجة اللون"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                  value={newCustomColorHex}
                  onChange={(e) => setNewCustomColorHex(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={(e) => handleAddCustomColor(e, false)}
                >
                  + إضافة اللون
                </button>
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
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isSubmitting ? 'جاري حفظ ومعالجة المنتج...' : (
                  <>
                    <span>حفظ المنتج في قاعدة البيانات</span>
                    <RocketIcon size={18} />
                  </>
                )}
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
                            background: 'rgba(155, 123, 107, 0.1)',
                            color: 'var(--color-primary-dark)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <VideoIcon size={12} />
                          فيديو
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
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CameraIcon size={13} />
                        {imagesCount} صور
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
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <EditIcon size={13} />
                          تعديل
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <TrashIcon size={13} style={{ color: 'white' }} />
                          حذف
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
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <EditIcon size={18} />
              تعديل: {editingProduct.name}
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
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CameraIcon size={16} style={{ color: 'var(--color-primary)' }} />
                  إضافة صور جديدة (يمكنكِ اختيار عدة صور معاً)
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

              {/* Edit Video (Direct File Upload + Preview) */}
              <div className="form-group full-width">
                <label className="form-label">
                  فيديو للمنتج 🎬 (رفع مباشر من جهازك)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="form-input"
                  onChange={(e) => handleVideoFileUpload(e, true)}
                />

                {editingProduct.videoUrl && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: 'var(--color-bg-alt)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-primary-dark)',
                        }}
                      >
                        🎬 الفيديو الحالي:
                      </span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeVideo(true)}
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                      >
                        ✕ إزالة الفيديو
                      </button>
                    </div>
                    <video
                      src={editingProduct.videoUrl}
                      controls
                      playsInline
                      style={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        borderRadius: '6px',
                        background: '#000',
                      }}
                    />
                  </div>
                )}

                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    أو رابط فيديو خارجي:
                  </span>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="رابط مباشر لفيديو MP4 أو يوتيوب / تيك توك / ريلز"
                    value={
                      editingProduct.videoUrl &&
                      editingProduct.videoUrl.startsWith('data:')
                        ? ''
                        : editingProduct.videoUrl || ''
                    }
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        videoUrl: e.target.value,
                      })
                    }
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              {/* Edit Modal Sizes Selection */}
              <div className="form-group full-width">
                <label className="form-label">المقاسات المتاحة للمنتج 📏</label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '6px',
                    padding: '8px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {allSizeOptions.map((sz) => {
                    const isSelected = editingProduct.variants?.some(
                      (v) => v.size === sz
                    );
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSize(sz, true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          background: isSelected
                            ? 'var(--color-surface)'
                            : 'white',
                          color: isSelected
                            ? 'var(--color-primary-dark)'
                            : 'var(--color-text)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 500,
                          boxShadow: isSelected
                            ? '0 2px 6px rgba(155,123,107,0.2)'
                            : 'none',
                        }}
                      >
                        <span>{sz}</span>
                        {isSelected && (
                          <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Edit Modal Custom Size Input */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                    ✨ أضيفي مقاساً مخصصاً:
                  </span>
                  <input
                    type="text"
                    placeholder="اسم المقاس"
                    className="form-input"
                    style={{ maxWidth: '160px', padding: '4px 8px', fontSize: '12px' }}
                    value={newCustomSizeName}
                    onChange={(e) => setNewCustomSizeName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                    onClick={(e) => handleAddCustomSize(e, true)}
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">الألوان المتاحة للمنتج 🎨</label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '6px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    padding: '8px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {allColorOptions.map((c) => {
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
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          background: isSelected
                            ? 'var(--color-surface)'
                            : 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 500,
                          boxShadow: isSelected ? '0 2px 6px rgba(155,123,107,0.2)' : 'none',
                        }}
                      >
                        <span
                          style={{
                            width: '13px',
                            height: '13px',
                            borderRadius: '50%',
                            background: c.hex,
                            border: c.hex.toLowerCase() === '#ffffff' ? '1px solid #ccc' : '1px solid rgba(0,0,0,0.15)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{c.name}</span>
                        {isSelected && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Edit Modal Custom Color Input */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                    ✨ أضيفي لوناً مخصصاً:
                  </span>
                  <input
                    type="text"
                    placeholder="اسم اللون"
                    className="form-input"
                    style={{ maxWidth: '140px', padding: '4px 8px', fontSize: '12px' }}
                    value={newCustomColorName}
                    onChange={(e) => setNewCustomColorName(e.target.value)}
                  />
                  <input
                    type="color"
                    title="درجة اللون"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    value={newCustomColorHex}
                    onChange={(e) => setNewCustomColorHex(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                    onClick={(e) => handleAddCustomColor(e, true)}
                  >
                    + إضافة
                  </button>
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
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'جاري حفظ التعديلات... ⏳' : 'حفظ التعديلات ✨'}
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
