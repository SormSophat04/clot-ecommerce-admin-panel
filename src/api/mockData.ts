// Mock data for development/testing when API is not available
import type {
  DashboardSummary,
  RevenueDataPoint,
  CategoryDataPoint,
  Review,
  CustomerLocation,
  Product,
  Order,
  Customer,
  LoginResponse,
  User,
} from '../types/api';

// Generate last N days dates
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const mockUser: User = {
  id: '1',
  phoneNumber: '+1234567890',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=E94560&color=fff&bold=true',
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockLoginResponse: LoginResponse = {
  token: 'mock_jwt_token_12345',
  user: mockUser,
};

export const mockDashboardSummary: DashboardSummary = {
  totalOrders: 8432,
  totalProducts: 12084,
  totalCustomers: 4670,
  totalRevenue: 128000,
  ordersChange: 12,
  productsChange: 8,
  customersChange: 5,
  revenueChange: 18,
};

export const mockRevenueData: RevenueDataPoint[] = generateDates(30).map((date) => ({
  date,
  revenue: Math.floor(Math.random() * 5000) + 3000,
  orders: Math.floor(Math.random() * 200) + 100,
}));

export const mockCategoryData: CategoryDataPoint[] = [
  { name: 'Apparel', value: 68, color: '#E94560' },
  { name: 'Footwear', value: 21, color: '#3B82F6' },
  { name: 'Accessories', value: 11, color: '#10B981' },
];

export const mockCustomerLocations: CustomerLocation[] = [
  { country: 'United States', customers: 2450, revenue: 65000 },
  { country: 'United Kingdom', customers: 890, revenue: 23000 },
  { country: 'Canada', customers: 560, revenue: 15000 },
  { country: 'Australia', customers: 340, revenue: 9000 },
  { country: 'Germany', customers: 430, revenue: 16000 },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Emma Johnson',
    customerAvatar: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=E94560&color=fff&bold=true',
    reviewText: 'The quality of the jeans is outstanding. Fits perfectly and the denim feels premium. Definitely will buy again!',
    rating: 5,
    productImageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
    productName: 'Classic Denim Jeans',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerName: 'James Carter',
    customerAvatar: 'https://ui-avatars.com/api/?name=James+Carter&background=3B82F6&color=fff&bold=true',
    reviewText: 'The sneakers look exactly like in the pictures. Super comfortable and delivered in 2 days. Will recommend to friends.',
    rating: 4,
    productImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    productName: 'Urban Sneakers',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerName: 'Sophia Lee',
    customerAvatar: 'https://ui-avatars.com/api/?name=Sophia+Lee&background=10B981&color=fff&bold=true',
    reviewText: 'Absolutely love the jacket! The material is lightweight but warm. Great for the season. Perfect purchase!',
    rating: 5,
    productImageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop',
    productName: 'Bomber Jacket',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    customerName: 'Liam Brown',
    customerAvatar: 'https://ui-avatars.com/api/?name=Liam+Brown&background=8B5CF6&color=fff&bold=true',
    reviewText: 'The shirt fabric is very soft. Love the minimalist design — pairs with basically anything in my wardrobe.',
    rating: 4,
    productImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    productName: 'Essential T-Shirt',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Denim Jeans',
    description: 'Premium quality denim jeans with a modern fit',
    price: 89.99,
    category: 'Apparel',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
    stock: 150,
    sku: 'DNM-001',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Urban Sneakers',
    description: 'Comfortable and stylish sneakers for everyday wear',
    price: 129.99,
    category: 'Footwear',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    stock: 85,
    sku: 'SNK-001',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: '1',
      name: 'Emma Johnson',
      email: 'emma@example.com',
      totalOrders: 5,
      totalSpent: 450.00,
      createdAt: '2024-01-01T00:00:00Z',
    },
    items: [
      {
        id: '1',
        product: mockProducts[0],
        quantity: 2,
        price: 89.99,
      },
    ],
    total: 179.98,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
    },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    phone: '+1234567890',
    totalOrders: 5,
    totalSpent: 450.00,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'James Carter',
    email: 'james@example.com',
    phone: '+1234567891',
    totalOrders: 3,
    totalSpent: 320.00,
    createdAt: '2024-01-15T00:00:00Z',
  },
];
