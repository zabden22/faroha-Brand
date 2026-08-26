import { Category, Product, DeliveryFee, Order } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'إسدالات', image: '/images/category_esdals.jpg' },
  { id: 2, name: 'دريسات', image: '/images/category_dresses.jpg' },
  { id: 3, name: 'ملابس واسعة', image: '/images/category_loose.jpg' },
  { id: 4, name: 'تشكيلة جديدة', image: '/images/category_new.jpg' },
  { id: 5, name: 'عروض', image: '/images/category_offers.jpg' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'إسدال الصلاة المريح — بيج ناعم',
    description: 'إسدال صلاة واسع ومريح مصنوع من أجود خامات القطن والفيزكوز الناعم على البشرة، مزود بطرحة متصلة وتطريز أكمام رقيق.',
    price: 650,
    discountPrice: 550,
    categoryId: 1,
    stock: 15,
    material: 'قطن ناعم 100%',
    fit: 'واسع / Oversized',
    careInstructions: 'غسيل يدوي أو ماكينة على درجة حرارة 30 مئوية',
    isNew: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    category: INITIAL_CATEGORIES[0],
    images: [
      { id: 101, productId: 1, imageUrl: '/images/category_esdals.jpg' },
      { id: 102, productId: 1, imageUrl: '/images/hero_image.jpg' }
    ],
    variants: [
      { id: 1, productId: 1, size: 'L', color: 'بيج', colorHex: '#D4B9A7', stock: 5 },
      { id: 2, productId: 1, size: 'XL', color: 'بيج', colorHex: '#D4B9A7', stock: 5 },
      { id: 3, productId: 1, size: 'XXL', color: 'أسود', colorHex: '#222222', stock: 5 }
    ]
  },
  {
    id: 2,
    name: 'دريس فروحة الكلاسيكي — موف هادئ',
    description: 'دريس أنيق بياقة كلاسيكية وحزام خصر رقيق، مناسب للخروج اليومي والمناسبات البسيطة. تصميم مريح ومحتشم بامتياز.',
    price: 890,
    discountPrice: 790,
    categoryId: 2,
    stock: 8,
    material: 'كركستال روزالين عالي الجودة',
    fit: 'مريح ونازل بسلاسة',
    careInstructions: 'كي بالبخار أو على درجة حرارة خفيفة',
    isNew: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    category: INITIAL_CATEGORIES[1],
    images: [
      { id: 201, productId: 2, imageUrl: '/images/category_dresses.jpg' }
    ],
    variants: [
      { id: 4, productId: 2, size: 'M', color: 'موف', colorHex: '#A3798A', stock: 3 },
      { id: 5, productId: 2, size: 'L', color: 'موف', colorHex: '#A3798A', stock: 5 }
    ]
  },
  {
    id: 3,
    name: 'طقم كاجوال واسع — زيتي ملكي',
    description: 'بلوزة واسعة مع بنطال عريض مريح، مناسب للعمل والجامعة والخروجات اليومية. قماش لينن خفيف وعملي جداً.',
    price: 950,
    discountPrice: null,
    categoryId: 3,
    stock: 12,
    material: 'كتان طبيعي (Linen)',
    fit: 'Loose / فضفاض',
    careInstructions: 'غسيل بارد مع عدم استخدام المبيضات',
    isNew: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    category: INITIAL_CATEGORIES[2],
    images: [
      { id: 301, productId: 3, imageUrl: '/images/category_loose.jpg' }
    ],
    variants: [
      { id: 6, productId: 3, size: 'L', color: 'زيتي', colorHex: '#6B8E7B', stock: 6 },
      { id: 7, productId: 3, size: 'XL', color: 'زيتي', colorHex: '#6B8E7B', stock: 6 }
    ]
  },
  {
    id: 4,
    name: 'دريس الخريف الدافئ — بني شوكولاتة',
    description: 'تصميم راقٍ ومحتشم بأكمام طويلة وثنيات خفيفة تعطي حرية كاملة في الحركة والراحة طوال اليوم.',
    price: 1100,
    discountPrice: 920,
    categoryId: 5,
    stock: 6,
    material: 'صوف خفيف وناعم',
    fit: 'مستقيم واسع',
    careInstructions: 'تنظيف جاف أو غسيل يدوي',
    isNew: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    category: INITIAL_CATEGORIES[4],
    images: [
      { id: 401, productId: 4, imageUrl: '/images/category_new.jpg' }
    ],
    variants: [
      { id: 8, productId: 4, size: 'L', color: 'بني', colorHex: '#5C4033', stock: 3 },
      { id: 9, productId: 4, size: 'XL', color: 'بني', colorHex: '#5C4033', stock: 3 }
    ]
  },
  {
    id: 5,
    name: 'فستان السهرة البسيط — نبيذي فاخر',
    description: 'قطعة مميزة ذات طابع أنيق وغير متكلف للمناسبات الخاصة والزيارات العائلية.',
    price: 1250,
    discountPrice: 990,
    categoryId: 5,
    stock: 4,
    material: 'حرير مغسول وفاخر',
    fit: 'واسع ومتهدل',
    careInstructions: 'تنظيف جاف فقط',
    isNew: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    category: INITIAL_CATEGORIES[4],
    images: [
      { id: 501, productId: 5, imageUrl: '/images/category_offers.jpg' }
    ],
    variants: [
      { id: 10, productId: 5, size: 'XL', color: 'نبيذي', colorHex: '#6B1D2F', stock: 4 }
    ]
  }
];

export const INITIAL_DELIVERY_FEES: DeliveryFee[] = [
  { id: 1, governorate: 'القاهرة', fee: 50 },
  { id: 2, governorate: 'الجيزة', fee: 50 },
  { id: 3, governorate: 'الإسكندرية', fee: 65 },
  { id: 4, governorate: 'الدقهلية', fee: 75 },
  { id: 5, governorate: 'البحيرة', fee: 75 },
  { id: 6, governorate: 'الفيوم', fee: 75 },
  { id: 7, governorate: 'الغربية', fee: 75 },
  { id: 8, governorate: 'الإسماعيلية', fee: 70 },
  { id: 9, governorate: 'المنوفية', fee: 75 },
  { id: 10, governorate: 'الشرقية', fee: 75 },
  { id: 11, governorate: 'القليوبية', fee: 55 },
  { id: 12, governorate: 'السويس', fee: 70 },
  { id: 13, governorate: 'بورسعيد', fee: 70 },
  { id: 14, governorate: 'دمياط', fee: 75 },
  { id: 15, governorate: 'كفر الشيخ', fee: 75 },
  { id: 16, governorate: 'بني سويف', fee: 85 },
  { id: 17, governorate: 'المنيا', fee: 90 },
  { id: 18, governorate: 'أسيوط', fee: 95 },
  { id: 19, governorate: 'سوهاج', fee: 100 },
  { id: 20, governorate: 'قنا', fee: 105 },
  { id: 21, governorate: 'الأقصر', fee: 110 },
  { id: 22, governorate: 'أسوان', fee: 120 },
  { id: 23, governorate: 'مطروح', fee: 100 },
  { id: 24, governorate: 'الوادي الجديد', fee: 120 },
  { id: 25, governorate: 'البحر الأحمر', fee: 110 },
  { id: 26, governorate: 'جنوب سيناء', fee: 110 },
  { id: 27, governorate: 'شمال سيناء', fee: 110 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'FAR-1048',
    userId: null,
    totalAmount: 1300,
    deliveryFee: 50,
    status: 'pending',
    paymentMethod: 'الدفع عند الاستلام',
    customerName: 'سارة أحمد',
    phone: '01012345678',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    address: 'شارع عباس العقاد، عمارة 12، الشقة 4',
    notes: 'الرجاء الاتصال قبل التوصيل',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        id: 1,
        orderId: 1,
        productId: 1,
        variantId: 2,
        quantity: 1,
        unitPrice: 550,
        productName: 'إسدال الصلاة المريح — بيج ناعم',
        variantInfo: 'مقاس: XL | لون: بيج'
      },
      {
        id: 2,
        orderId: 1,
        productId: 2,
        variantId: 4,
        quantity: 1,
        unitPrice: 700,
        productName: 'دريس فروحة الكلاسيكي — موف هادئ',
        variantInfo: 'مقاس: M | لون: موف'
      }
    ]
  }
];

// Helper Dispatch Event for Store Reactivity
export const notifyStoreUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storeUpdated'));
  }
};

// Real-Time Dynamic Storage Getters & Setters
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const data = localStorage.getItem('faroha_categories');
    if (data === null) {
      localStorage.setItem('faroha_categories', JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('faroha_categories', JSON.stringify(categories));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Error saving categories', e);
  }
};

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const data = localStorage.getItem('faroha_products');
    if (data === null) {
      localStorage.setItem('faroha_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('faroha_products', JSON.stringify(products));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Error saving products', e);
  }
};

export const getDeliveryFees = (): DeliveryFee[] => {
  if (typeof window === 'undefined') return INITIAL_DELIVERY_FEES;
  try {
    const data = localStorage.getItem('faroha_delivery_fees');
    if (data === null) {
      localStorage.setItem('faroha_delivery_fees', JSON.stringify(INITIAL_DELIVERY_FEES));
      return INITIAL_DELIVERY_FEES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DELIVERY_FEES;
  }
};

export const saveDeliveryFees = (fees: DeliveryFee[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('faroha_delivery_fees', JSON.stringify(fees));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Error saving delivery fees', e);
  }
};

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem('faroha_orders');
    if (data === null) {
      localStorage.setItem('faroha_orders', JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('faroha_orders', JSON.stringify(orders));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Error saving orders', e);
  }
};
