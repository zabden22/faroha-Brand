// ============================================================
// FarOha_Brand — Type Definitions
// ============================================================

export interface Category {
  id: number;
  name: string;
  image: string;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  categoryId: number;
  stock: number;
  material: string | null;
  fit: string | null;
  careInstructions: string | null;
  isNew: boolean;
  isFeatured: boolean;
  videoUrl?: string | null;
  createdAt: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartData {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  unitPrice: number;
  productName: string;
  variantInfo: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number | null;
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentMethod: string;
  customerName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  notes: string | null;
  createdAt: string;
  items?: OrderItem[];
  depositAmount?: number;
  remainingAmount?: number;
}

export interface DeliveryFee {
  id: number;
  governorate: string;
  fee: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'customer' | 'admin';
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  totalSales: number;
}

// Status labels in Arabic
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'تم التأكيد',
  preparing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

// Egyptian Governorates
export const EGYPTIAN_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج',
];
