import { apiClient } from './client';
import { Product, CreateProductDto, UpdateProductDto } from '../types';

export const productApi = {
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post('/product', data);
    return response.data;
  },

  getAll: async (storeId?: string, status?: string): Promise<Product[]> => {
    const params: Record<string, string> = {};
    if (storeId) params.storeId = storeId;
    if (status) params.status = status;

    const response = await apiClient.get('/product', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/product/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.patch(`/product/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/product/${id}`);
    return response.data;
  },

  bulkUpdateStatus: async (productIds: string[], status: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/product/bulk-update-status', {
      productIds,
      status,
    });
    return response.data;
  },

  getUnassigned: async (): Promise<Product[]> => {
    const response = await apiClient.get('/product/unassigned/list');
    return response.data;
  },

  assignToStore: async (productId: string, storeId: string): Promise<Product> => {
    const response = await apiClient.post(`/product/${productId}/assign-store`, { storeId });
    return response.data;
  },

  unassignFromStore: async (productId: string): Promise<Product> => {
    const response = await apiClient.delete(`/product/${productId}/unassign-store`);
    return response.data;
  },
};
