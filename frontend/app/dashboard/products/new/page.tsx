'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { productApi } from '@/lib/api/product';
import { storeApi } from '@/lib/api/store';
import { settingsApi } from '@/lib/api/settings';
import { ImageUpload } from '@/components/ImageUpload';
import { DiscountEditor } from '@/components/DiscountEditor';

type DiscountType = 'FIXED' | 'PERCENTAGE' | null;

export default function NewStandaloneProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    storeId: '', // Optional - can be empty for workspace-level products
    name: '',
    description: '',
    price: '',
    currency: 'SAR', // Default currency
    costPrice: '',
    sku: '',
    trackInventory: true,
    stock: '',
    images: [] as string[],
    video: '',
    discountType: null as DiscountType,
    discountValue: 0,
  });

  // Fetch all stores for selection
  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeApi.getAll(),
  });

  // Fetch all currencies
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => settingsApi.getAllCurrencies(),
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-all'] });
      if (formData.storeId) {
        queryClient.invalidateQueries({ queryKey: ['products', formData.storeId] });
      }
      router.push('/dashboard/products');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate price in cents
    const priceInCents = Math.round(parseFloat(formData.price) * 100);

    const data = {
      storeId: formData.storeId || undefined, // Optional - undefined for workspace-level products
      name: formData.name,
      description: formData.description || undefined,
      price: priceInCents,
      costPrice: formData.costPrice ? Math.round(parseFloat(formData.costPrice) * 100) : undefined,
      discountType: formData.discountType || undefined,
      discountValue: formData.discountType ? formData.discountValue : undefined,
      sku: formData.sku || undefined,
      trackInventory: formData.trackInventory,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      images: formData.images.length > 0 ? formData.images : undefined,
      video: formData.video || undefined,
    };

    await createMutation.mutateAsync(data);
  };

  // Calculate price in cents for DiscountEditor
  const priceInCents = formData.price ? Math.round(parseFloat(formData.price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('products.createProduct') || 'Create Product'}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('products.createProductDescription') || 'Create a new product for your workspace'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.productDetails')}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.productName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder={t('products.productName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('stores.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder={t('stores.description')}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Discount */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.pricing')}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Price with inline currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.price')} *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    >
                      {currencies?.filter(c => c.isActive).map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.costPrice')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount Editor */}
              <DiscountEditor
                discountType={formData.discountType}
                discountValue={formData.discountValue}
                price={priceInCents}
                currency={formData.currency}
                onDiscountTypeChange={(type) => setFormData({ ...formData, discountType: type })}
                onDiscountValueChange={(value) => setFormData({ ...formData, discountValue: value })}
              />
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.media')}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.images')}
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    maxImages={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.videoUrl')}
                  </label>
                  <input
                    type="url"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings (1/3 width) */}
          <div className="space-y-4">
            {/* Store Assignment */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.storeAssignment') || 'Store Assignment'}
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('products.assignToStore') || 'Assign to Store'}
                </label>
                <select
                  value={formData.storeId}
                  onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">{t('products.noStore') || 'No Store'}</option>
                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('common.optional') || 'Optional'}
                </p>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.inventory')}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.sku')}
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="SKU-001"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="trackInventory"
                    checked={formData.trackInventory}
                    onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="trackInventory" className="text-sm font-medium text-gray-700">
                    {t('products.trackInventory')}
                  </label>
                </div>

                {formData.trackInventory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('products.stock')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 font-medium"
                >
                  {createMutation.isPending ? t('common.loading') : t('products.createProduct')}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
