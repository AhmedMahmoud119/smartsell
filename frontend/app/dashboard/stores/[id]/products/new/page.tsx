'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { productApi } from '@/lib/api/product';
import { storeApi } from '@/lib/api/store';
import { ImageUpload } from '@/components/ImageUpload';
import { DiscountEditor } from '@/components/DiscountEditor';
import { VariantEditor } from '@/components/VariantEditor';

type DiscountType = 'FIXED' | 'PERCENTAGE' | null;
type VariantType = 'COLOR' | 'SIZE' | 'TEXT';

interface ProductVariant {
  id?: string;
  name: string;
  type: VariantType;
  value: string;
  colorCode?: string;
  price?: number;
  stock: number;
  image?: string;
}

export default function NewProductPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    sku: '',
    trackInventory: true,
    stock: '',
    images: [] as string[],
    video: '',
    discountType: null as DiscountType,
    discountValue: 0,
    variants: [] as ProductVariant[],
  });

  // Fetch store
  const { data: store } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getOne(storeId),
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      router.push(`/dashboard/stores/${storeId}/products`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate price in cents
    const priceInCents = Math.round(parseFloat(formData.price) * 100);

    const data = {
      storeId,
      name: formData.name,
      description: formData.description || undefined,
      price: priceInCents,
      compareAtPrice: formData.compareAtPrice ? Math.round(parseFloat(formData.compareAtPrice) * 100) : undefined,
      costPrice: formData.costPrice ? Math.round(parseFloat(formData.costPrice) * 100) : undefined,
      discountType: formData.discountType || undefined,
      discountValue: formData.discountType ? formData.discountValue : undefined,
      sku: formData.sku || undefined,
      trackInventory: formData.trackInventory,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      images: formData.images.length > 0 ? formData.images : undefined,
      video: formData.video || undefined,
      // Variants will be handled separately by a variants endpoint
    };

    await createMutation.mutateAsync(data);
  };

  // Calculate price in cents for DiscountEditor
  const priceInCents = formData.price ? Math.round(parseFloat(formData.price) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">{t('products.addProduct')}</h1>
          {store && (
            <p className="text-sm text-gray-600 mt-1">{store.name}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('products.productDetails')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('products.productName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder={t('stores.description')}
              />
            </div>
          </div>
        </div>

        {/* Media - Image Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('products.media')}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.images')}
              </label>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                maxImages={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('products.video')} URL
              </label>
              <input
                type="url"
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('products.pricing')}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('products.price')} * ({store?.currency || 'SAR'})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('products.compareAtPrice')} ({store?.currency || 'SAR'})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('products.costPrice')} ({store?.currency || 'SAR'})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Discount Section */}
            <DiscountEditor
              price={priceInCents}
              discountType={formData.discountType}
              discountValue={formData.discountValue}
              onDiscountTypeChange={(type) => setFormData({ ...formData, discountType: type })}
              onDiscountValueChange={(value) => setFormData({ ...formData, discountValue: value })}
              currency={store?.currency || 'SAR'}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('products.variants')}
          </h2>

          <VariantEditor
            variants={formData.variants}
            onVariantsChange={(variants) => setFormData({ ...formData, variants })}
            basePrice={priceInCents}
          />
        </div>

        {/* Inventory (only if no variants) */}
        {formData.variants.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('products.inventory')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.sku')}
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SKU-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('products.stock')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    disabled={!formData.trackInventory}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trackInventory"
                  checked={formData.trackInventory}
                  onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="trackInventory" className="ms-2 text-sm text-gray-700">
                  {t('products.trackInventory')}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Info when variants are used */}
        {formData.variants.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 {t('products.totalStock')}: <strong>{formData.variants.reduce((sum, v) => sum + v.stock, 0)}</strong> —
              {' '} Stock is managed per variant when variants are added.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? t('products.creating') : t('common.create')}
          </button>
        </div>
      </form>
    </div>
  );
}
