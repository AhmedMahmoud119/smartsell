import { apiClient } from './client';
import { Store, CreateStoreDto, UpdateStoreDto, StoreStats } from '../types';

export const storeApi = {
  create: async (dto: CreateStoreDto): Promise<Store> => {
    const { data } = await apiClient.post<Store>('/store', dto);
    return data;
  },

  getAll: async (): Promise<Store[]> => {
    const { data } = await apiClient.get<Store[]>('/store');
    return data;
  },

  getOne: async (id: string): Promise<Store> => {
    const { data } = await apiClient.get<Store>(`/store/${id}`);
    return data;
  },

  update: async (id: string, dto: UpdateStoreDto): Promise<Store> => {
    const { data } = await apiClient.patch<Store>(`/store/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/store/${id}`);
  },

  getStats: async (): Promise<StoreStats> => {
    const { data} = await apiClient.get<StoreStats>('/store/stats');
    return data;
  },
};
