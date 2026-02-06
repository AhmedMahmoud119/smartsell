'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { storeApi } from '@/lib/api/store';
import { UpdateStoreDto } from '@/lib/types';

export default function StoreSettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateStoreDto>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch store
  const { data: store, isLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getOne(storeId),
  });

  // Update store mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateStoreDto) => storeApi.update(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        description: store.description || '',
        email: store.email || '',
        phone: store.phone || '',
        whatsapp: store.whatsapp || '',
        address: store.address || '',
        language: store.language,
        currency: store.currency,
        status: store.status,
        shippingPolicy: store.shippingPolicy || '',
        returnPolicy: store.returnPolicy || '',
        privacyPolicy: store.privacyPolicy || '',
        termsOfService: store.termsOfService || '',
        metaTitle: store.metaTitle || '',
        metaDescription: store.metaDescription || '',
      });
    }
  }, [store]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UpdateStoreDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Store not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/dashboard/stores')}
            className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('stores.title')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('stores.settings')}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t('stores.saving') : t('stores.save')}
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('stores.basicInfo')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.storeName')}
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('stores.language')}
              </label>
              <select
                value={formData.language || 'ar'}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('stores.currency')}
              </label>
              <select
                value={formData.currency || 'SAR'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.status')}
            </label>
            <select
              value={formData.status || 'DRAFT'}
              onChange={(e) =>
                handleChange(
                  'status',
                  e.target.value as 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED'
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">{t('stores.draft')}</option>
              <option value="PUBLISHED">{t('stores.published')}</option>
              <option value="PAUSED">{t('stores.paused')}</option>
              <option value="ARCHIVED">{t('stores.archived')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('stores.contactInfo')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.email')}
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('stores.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('stores.whatsapp')}
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.address')}
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('stores.seo')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.metaTitle')}
            </label>
            <input
              type="text"
              value={formData.metaTitle || ''}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.metaDescription')}
            </label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Marketing Pixels */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('pixels.title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('pixels.description')}
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/stores/${storeId}/settings/pixels`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('common.configure')}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">f</span>
            </div>
            <p className="text-xs text-gray-600">Facebook Pixel</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <p className="text-xs text-gray-600">TikTok Pixel</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">G</span>
            </div>
            <p className="text-xs text-gray-600">Google Analytics</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold">C</span>
            </div>
            <p className="text-xs text-gray-600">Microsoft Clarity</p>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('stores.policies')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.shippingPolicy')}
            </label>
            <textarea
              value={formData.shippingPolicy || ''}
              onChange={(e) => handleChange('shippingPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.returnPolicy')}
            </label>
            <textarea
              value={formData.returnPolicy || ''}
              onChange={(e) => handleChange('returnPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.privacyPolicy')}
            </label>
            <textarea
              value={formData.privacyPolicy || ''}
              onChange={(e) => handleChange('privacyPolicy', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('stores.termsOfService')}
            </label>
            <textarea
              value={formData.termsOfService || ''}
              onChange={(e) => handleChange('termsOfService', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? t('stores.saving') : t('stores.save')}
        </button>
      </div>
    </div>
  );
}
