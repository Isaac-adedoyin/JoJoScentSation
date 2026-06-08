export type UserRole = 'admin' | 'manager' | 'customer';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paid: boolean;
  paystackReference?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
