'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { pixelsApi, StorePixels, UpdatePixelsDto } from '@/lib/api/pixels';

export default function PixelSettingsPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const storeId = params.id as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdatePixelsDto>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: pixels, isLoading } = useQuery({
    queryKey: ['pixels', storeId],
    queryFn: () => pixelsApi.getPixels(storeId),
  });

  useEffect(() => {
    if (pixels) {
      setFormData({
        facebookPixelId: pixels.facebookPixelId || '',
        facebookAccessToken: pixels.facebookAccessToken || '',
        facebookTestMode: pixels.facebookTestMode,
        tiktokPixelId: pixels.tiktokPixelId || '',
        tiktokAccessToken: pixels.tiktokAccessToken || '',
        tiktokTestMode: pixels.tiktokTestMode,
        googleTagManagerId: pixels.googleTagManagerId || '',
        googleAnalyticsId: pixels.googleAnalyticsId || '',
        googleAdsId: pixels.googleAdsId || '',
        clarityId: pixels.clarityId || '',
        snapchatPixelId: pixels.snapchatPixelId || '',
        customHeadScripts: pixels.customHeadScripts || '',
        customBodyScripts: pixels.customBodyScripts || '',
        enabled: pixels.enabled,
      });
    }
  }, [pixels]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePixelsDto) => pixelsApi.updatePixels(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixels', storeId] });
      setSaveMessage({ type: 'success', text: t('common.saved') });
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: () => {
      setSaveMessage({ type: 'error', text: t('common.error') });
      setTimeout(() => setSaveMessage(null), 3000);
    },
  });

  const testPixelMutation = useMutation({
    mutationFn: (pixelType: string) => pixelsApi.testPixel(storeId, pixelType),
    onSuccess: (data, pixelType) => {
      setTestResults((prev) => ({ ...prev, [pixelType]: data }));
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleTestPixel = (pixelType: string) => {
    testPixelMutation.mutate(pixelType);
  };

  const updateField = (field: keyof UpdatePixelsDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('pixels.title')}</h1>
          <p className="text-sm text-gray-600 mt-1">{t('pixels.description')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facebook Pixel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Facebook Pixel</h2>
              <p className="text-sm text-gray-500">{t('pixels.facebookDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.pixelId')}
              </label>
              <input
                type="text"
                value={formData.facebookPixelId || ''}
                onChange={(e) => updateField('facebookPixelId', e.target.value)}
                placeholder="123456789012345"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.accessToken')}
              </label>
              <input
                type="password"
                value={formData.facebookAccessToken || ''}
                onChange={(e) => updateField('facebookAccessToken', e.target.value)}
                placeholder="EAAxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{t('pixels.accessTokenHelp')}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fbTestMode"
                checked={formData.facebookTestMode || false}
                onChange={(e) => updateField('facebookTestMode', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="fbTestMode" className="text-sm text-gray-700">
                {t('pixels.testMode')}
              </label>
            </div>

            <button
              onClick={() => handleTestPixel('facebook')}
              disabled={testPixelMutation.isPending}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {t('pixels.testPixel')}
            </button>

            {testResults.facebook && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  testResults.facebook.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {testResults.facebook.success
                  ? testResults.facebook.pixelName || t('pixels.testSuccess')
                  : testResults.facebook.error || t('pixels.testFailed')}
              </div>
            )}
          </div>
        </div>

        {/* TikTok Pixel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">TikTok Pixel</h2>
              <p className="text-sm text-gray-500">{t('pixels.tiktokDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.pixelId')}
              </label>
              <input
                type="text"
                value={formData.tiktokPixelId || ''}
                onChange={(e) => updateField('tiktokPixelId', e.target.value)}
                placeholder="ABCDEFGHIJK"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.accessToken')}
              </label>
              <input
                type="password"
                value={formData.tiktokAccessToken || ''}
                onChange={(e) => updateField('tiktokAccessToken', e.target.value)}
                placeholder="..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ttTestMode"
                checked={formData.tiktokTestMode || false}
                onChange={(e) => updateField('tiktokTestMode', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="ttTestMode" className="text-sm text-gray-700">
                {t('pixels.testMode')}
              </label>
            </div>

            <button
              onClick={() => handleTestPixel('tiktok')}
              disabled={testPixelMutation.isPending}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {t('pixels.testPixel')}
            </button>

            {testResults.tiktok && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  testResults.tiktok.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {testResults.tiktok.success
                  ? testResults.tiktok.message || t('pixels.testSuccess')
                  : testResults.tiktok.error || t('pixels.testFailed')}
              </div>
            )}
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Google Tag Manager</h2>
              <p className="text-sm text-gray-500">{t('pixels.gtmDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.containerId')}
              </label>
              <input
                type="text"
                value={formData.googleTagManagerId || ''}
                onChange={(e) => updateField('googleTagManagerId', e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics 4 (GA4)
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Ads
              </label>
              <input
                type="text"
                value={formData.googleAdsId || ''}
                onChange={(e) => updateField('googleAdsId', e.target.value)}
                placeholder="AW-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Microsoft Clarity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Microsoft Clarity</h2>
              <p className="text-sm text-gray-500">{t('pixels.clarityDescription')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.projectId')}
              </label>
              <input
                type="text"
                value={formData.clarityId || ''}
                onChange={(e) => updateField('clarityId', e.target.value)}
                placeholder="abc123def456"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Custom Scripts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('pixels.customScripts')}</h2>
              <p className="text-sm text-gray-500">{t('pixels.customScriptsHelp')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.headScripts')}
              </label>
              <textarea
                value={formData.customHeadScripts || ''}
                onChange={(e) => updateField('customHeadScripts', e.target.value)}
                placeholder="<script>...</script>"
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('pixels.bodyScripts')}
              </label>
              <textarea
                value={formData.customBodyScripts || ''}
                onChange={(e) => updateField('customBodyScripts', e.target.value)}
                placeholder="<script>...</script>"
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
