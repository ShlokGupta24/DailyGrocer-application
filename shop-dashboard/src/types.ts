export type TabType = 'overview' | 'products' | 'orders' | 'profile';

export type ProductCategory = 
  | 'Fruits & Vegetables'
  | 'Dairy & Milk'
  | 'Staples & Grains'
  | 'Snacks & Munchies'
  | 'Beverages'
  | 'Personal & Home Care';

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string; // e.g. "1 kg", "500 g", "1 Litre", "Pack"
  inStock: boolean;
  image: string;
  description: string;
  sku?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productName: string;
  hindiName?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  locality: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI QR on Delivery' | 'Prepaid UPI';
  orderTime: string;
  status: OrderStatus;
  notes?: string;
}

export interface StoreProfile {
  shopName: string;
  hindiShopName: string;
  ownerName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  address: string;
  landmark: string;
  locality: string;
  pincode: string;
  deliveryRadius: string;
  openingHours: string;
  upiId: string;
  fssaiNumber: string;
  isOpen: boolean;
  minOrderValue: number;
  avgPreparationTime: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}
