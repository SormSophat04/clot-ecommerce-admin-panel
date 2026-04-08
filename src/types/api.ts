// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  createdAt: string;
}

// Dashboard types
export interface DashboardSummary {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  revenueChange: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  reviewText: string;
  rating: number;
  productImageUrl: string;
  productName: string;
  createdAt: string;
}

export interface CustomerLocation {
  country: string;
  customers: number;
  revenue: number;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  status?: 'active' | 'draft' | 'archived';
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Update Order Status
export interface UpdateOrderStatusRequest {
  status: Order['status'];
  paymentStatus?: Order['paymentStatus'];
}
