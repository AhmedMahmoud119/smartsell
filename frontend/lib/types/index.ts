export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  locale: string;
  createdAt: string;
  workspaces?: WorkspaceMembership[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  customDomain: string | null;
  plan?: Plan;
}

export interface WorkspaceMembership {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  workspace: Workspace;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxStores: number;
  maxProductsPerStore: number;
  maxOrdersPerMonth: number;
  maxAiGenerations: number;
  customDomain: boolean;
  multiCurrency: boolean;
  whatsappIntegration: boolean;
  analyticsAdvanced: boolean;
  conversionAPI: boolean;
  removeBranding: boolean;
  prioritySupport: boolean;
}

export interface AuthResponse {
  user: User;
  workspace: Workspace;
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName: string;
  locale?: string;
}

export interface Store {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  subdomain: string | null;
  customDomain: string | null;
  domainVerified: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
  publishedAt: string | null;
  theme: any;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  currency: string;
  language: string;
  timezone: string;
  shippingPolicy: string | null;
  returnPolicy: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
    orders: number;
    customers: number;
  };
}

export interface CreateStoreDto {
  name: string;
  description?: string;
  language?: string;
  currency?: string;
}

export interface UpdateStoreDto {
  name?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  language?: string;
  currency?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
  shippingPolicy?: string;
  returnPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface StoreStats {
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  sku: string | null;
  trackInventory: boolean;
  stock: number;
  images: string[];
  video: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProductDto {
  storeId: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  trackInventory?: boolean;
  stock?: number;
  images?: string[];
  video?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  trackInventory?: boolean;
  stock?: number;
  images?: string[];
  video?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  variantName: string | null;
  sku: string | null;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string | null;
  workspaceId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState: string | null;
  customerZipCode: string | null;
  customerCountry: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  exchangeRate: number | null;
  totalInPrimaryCurrency: number | null;
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER' | 'WALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  fulfillmentStatus: 'UNFULFILLED' | 'PARTIAL' | 'FULFILLED' | 'RETURNED';
  trackingNumber: string | null;
  carrier: string | null;
  deliveredAt: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';
  canceledAt: string | null;
  cancelReason: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  store?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  storeId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState?: string;
  customerZipCode?: string;
  customerCountry?: string;
  items: OrderItemInput[];
  shipping?: number;
  tax?: number;
  discount?: number;
  paymentMethod?: 'COD' | 'CARD' | 'BANK_TRANSFER' | 'WALLET';
  notes?: string;
  source?: string;
}

export interface UpdateOrderDto {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  fulfillmentStatus?: 'UNFULFILLED' | 'PARTIAL' | 'FULFILLED' | 'RETURNED';
  trackingNumber?: string;
  carrier?: string;
  deliveredAt?: string;
  paidAt?: string;
  cancelReason?: string;
  notes?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}
