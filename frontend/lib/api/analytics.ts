import { apiClient } from './client';

export interface DashboardStats {
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersChange: number;
  revenueChange: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
  image: string | null;
  storeName: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  store: {
    id: string;
    name: string;
  };
}

export interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface StoreSalesData {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  products: number;
  percentage: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  store: {
    id: string;
    name: string;
  };
}

export interface AnalyticsQuery {
  storeId?: string;
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month';
  limit?: number;
}

export const analyticsApi = {
  getDashboardStats: async (storeId?: string): Promise<DashboardStats> => {
    const params = storeId ? { storeId } : {};
    const response = await apiClient.get('/analytics/dashboard', { params });
    return response.data;
  },

  getRevenueOverTime: async (query: AnalyticsQuery = {}): Promise<RevenueDataPoint[]> => {
    const response = await apiClient.get('/analytics/revenue', { params: query });
    return response.data;
  },

  getTopProducts: async (query: AnalyticsQuery = {}): Promise<TopProduct[]> => {
    const response = await apiClient.get('/analytics/top-products', { params: query });
    return response.data;
  },

  getTopCustomers: async (query: AnalyticsQuery = {}): Promise<TopCustomer[]> => {
    const response = await apiClient.get('/analytics/top-customers', { params: query });
    return response.data;
  },

  getOrdersByStatus: async (storeId?: string): Promise<OrderStatusData[]> => {
    const params = storeId ? { storeId } : {};
    const response = await apiClient.get('/analytics/orders-by-status', { params });
    return response.data;
  },

  getSalesByStore: async (): Promise<StoreSalesData[]> => {
    const response = await apiClient.get('/analytics/sales-by-store');
    return response.data;
  },

  getRecentOrders: async (storeId?: string, limit = 5): Promise<RecentOrder[]> => {
    const params: any = { limit };
    if (storeId) params.storeId = storeId;
    const response = await apiClient.get('/analytics/recent-orders', { params });
    return response.data;
  },
};
