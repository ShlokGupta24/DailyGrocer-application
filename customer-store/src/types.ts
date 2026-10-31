export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  badge?: string;
  itemCount: number;
}

export interface Shop {
  id: string;
  name: string;
  area: string;
  deliveryTime: string;
  rating: number;
  reviewCount: number;
  distance: string;
  minOrder: number;
  image: string;
  tag: string;
  isOpen: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  shopId: string;
  shopName: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
  tag?: string; // e.g. "Bestseller", "Organic", "Fresh Arrival", "Super Saver"
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  locality: string;
  landmark: string;
  instructions: string;
}

export type PaymentMethod = 'cod' | 'upi_delivery' | 'online_mock';

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  couponDiscount: number;
  total: number;
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  placedAt: string;
  estimatedDeliveryTime: string;
  deliveryBoy: {
    name: string;
    phone: string;
    vehicle: string;
    photo: string;
  };
}
