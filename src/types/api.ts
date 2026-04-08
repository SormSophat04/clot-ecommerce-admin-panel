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

export interface ProductRecord {
  productId: number;
  productName: string;
  sku: string;
  price: number;
  stockQuantity: number;
  description: string;
  categoryId: number | null;
  categoryName: string;
  brandId: number | null;
  brandName: string;
  colorIds: number[];
  sizeIds: number[];
  colors: Color[];
  sizes: Size[];
  images: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProductImageRecord {
  productImageId: number;
  productId: number;
  imageData: string;
  mimeType: string;
  size: number;
}

export interface CreateProductPayload {
  productName: string;
  sku?: string;
  price: number;
  stockQuantity: number;
  description?: string;
  categoryId: number;
  brandId: number;
  colorIds?: number[];
  sizeIds?: number[];
}

export type UpdateProductPayload = CreateProductPayload;

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
// Category types
export interface Category {
  categoryId: number;
  categoryName: string;
  productCount?: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

// Brand types
export interface Brand {
  brandId: number;
  brandName: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandRequest {
  name: string;
}

export interface UpdateBrandRequest {
  name: string;
}

// Color types
export interface Color {
  colorId: number;
  colorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColorRequest {
  name: string;
}

export interface UpdateColorRequest {
  name: string;
}

// Size types
export interface Size {
  sizeId: number;
  sizeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSizeRequest {
  name: string;
}

export interface UpdateSizeRequest {
  name: string;
}
