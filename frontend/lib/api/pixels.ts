import { apiClient } from './client';

export interface StorePixels {
  id: string;
  storeId: string;

  // Facebook
  facebookPixelId: string | null;
  facebookAccessToken: string | null;
  facebookTestMode: boolean;

  // TikTok
  tiktokPixelId: string | null;
  tiktokAccessToken: string | null;
  tiktokTestMode: boolean;

  // Google
  googleTagManagerId: string | null;
  googleAnalyticsId: string | null;
  googleAdsId: string | null;

  // Microsoft
  clarityId: string | null;

  // Snapchat
  snapchatPixelId: string | null;

  // Custom Scripts
  customHeadScripts: string | null;
  customBodyScripts: string | null;

  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePixelsDto {
  facebookPixelId?: string;
  facebookAccessToken?: string;
  facebookTestMode?: boolean;
  tiktokPixelId?: string;
  tiktokAccessToken?: string;
  tiktokTestMode?: boolean;
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  googleAdsId?: string;
  clarityId?: string;
  snapchatPixelId?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
  enabled?: boolean;
}

export interface PixelTestResult {
  success: boolean;
  error?: string;
  warning?: string;
  pixelName?: string;
  message?: string;
}

export const pixelsApi = {
  getPixels: async (storeId: string): Promise<StorePixels> => {
    const response = await apiClient.get(`/pixels/${storeId}`);
    return response.data;
  },

  updatePixels: async (storeId: string, data: UpdatePixelsDto): Promise<StorePixels> => {
    const response = await apiClient.patch(`/pixels/${storeId}`, data);
    return response.data;
  },

  testPixel: async (storeId: string, pixelType: string): Promise<PixelTestResult> => {
    const response = await apiClient.post(`/pixels/${storeId}/test?type=${pixelType}`);
    return response.data;
  },
};
