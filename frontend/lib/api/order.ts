import { apiClient } from './client';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStats } from '../types';

export const orderApi = {
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post('/order', data);
    return response.data;
  },

  getAll: async (storeId?: string, status?: string): Promise<Order[]> => {
    const params: Record<string, string> = {};
    if (storeId) params.storeId = storeId;
    if (status) params.status = status;

    const response = await apiClient.get('/order', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/order/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    const response = await apiClient.patch(`/order/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/order/${id}`);
    return response.data;
  },

  getStats: async (storeId?: string): Promise<OrderStats> => {
    const params: Record<string, string> = {};
    if (storeId) params.storeId = storeId;

    const response = await apiClient.get('/order/stats', { params });
    return response.data;
  },
};
