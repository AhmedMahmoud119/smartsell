import { api } from './client';

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  acceptsMarketing: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  store: {
    id: string;
    name: string;
  };
  orders?: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  _count?: {
    orders: number;
  };
}

export interface CreateCustomerDto {
  storeId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  acceptsMarketing?: boolean;
  notes?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  acceptsMarketing?: boolean;
  notes?: string;
}

export const customersApi = {
  getAll: (storeId?: string) => {
    const params = storeId ? `?storeId=${storeId}` : '';
    return api.get<Customer[]>(`/customers${params}`);
  },

  getOne: (id: string) => {
    return api.get<Customer>(`/customers/${id}`);
  },

  create: (data: CreateCustomerDto) => {
    return api.post<Customer>('/customers', data);
  },

  update: (id: string, data: UpdateCustomerDto) => {
    return api.patch<Customer>(`/customers/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/customers/${id}`);
  },

  getByPhone: (storeId: string, phone: string) => {
    return api.get<Customer>(`/customers/by-phone?storeId=${storeId}&phone=${phone}`);
  },
};
