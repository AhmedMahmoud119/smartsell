import { apiClient } from './client';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  nameAr: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencySettings {
  defaultCurrency: string;
  enabledCurrencies: string[];
  autoConvert: boolean;
  exchangeRates: Record<string, number>;
  ratesUpdatedAt: string | null;
  availableCurrencies: Currency[];
}

export interface CreateCurrencyData {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  isActive?: boolean;
}

export interface UpdateCurrencyData {
  name?: string;
  nameAr?: string;
  symbol?: string;
  isActive?: boolean;
}

export interface UpdateCurrencySettings {
  defaultCurrency?: string;
  enabledCurrencies?: string[];
  autoConvert?: boolean;
  exchangeRates?: Record<string, number>;
}

export const settingsApi = {
  // ==================== CURRENCIES CRUD ====================

  // Get all workspace currencies
  getAllCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get('/settings/currencies');
    return response.data;
  },

  // Create currency
  createCurrency: async (data: CreateCurrencyData): Promise<Currency> => {
    const response = await apiClient.post('/settings/currencies', data);
    return response.data;
  },

  // Update currency
  updateCurrency: async (id: string, data: UpdateCurrencyData): Promise<Currency> => {
    const response = await apiClient.put(`/settings/currencies/${id}`, data);
    return response.data;
  },

  // Delete currency
  deleteCurrency: async (id: string): Promise<void> => {
    await apiClient.delete(`/settings/currencies/${id}`);
  },

  // ==================== STORE CURRENCIES ====================

  // Get store currency settings
  getStoreCurrencies: async (storeId: string): Promise<CurrencySettings> => {
    const response = await apiClient.get(`/settings/stores/${storeId}/currencies`);
    return response.data;
  },

  // Update store currency settings
  updateStoreCurrencies: async (storeId: string, data: UpdateCurrencySettings): Promise<CurrencySettings> => {
    const response = await apiClient.put(`/settings/stores/${storeId}/currencies`, data);
    return response.data;
  },
};
