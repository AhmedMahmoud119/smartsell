'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { productApi } from '@/lib/api/product';
import { settingsApi } from '@/lib/api/settings';
import { ImageUpload } from '@/components/ImageUpload';
import { DiscountEditor } from '@/components/DiscountEditor';
import { VariantsEditor } from '@/components/VariantsEditor';
import { OffersEditor } from '@/components/OffersEditor';

type DiscountType = 'FIXED' | 'PERCENTAGE' | null;
type TabType = 'main' | 'variants' | 'offers';

export default function EditProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'SAR',
    costPrice: '',
    sku: '',
    trackInventory: true,
    stock: '',
    images: [] as string[],
    video: '',
    discountType: null as DiscountType,
    discountValue: 0,
    variants: [] as any[],
    offers: [] as any[],
  });

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getOne(productId),
    enabled: !!productId,
  });

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      console.log('Product loaded:', product); // Debug log
      
      // Parse images if it's a JSON string
      let parsedImages: string[] = [];
      if (product.images) {
        if (typeof product.images === 'string') {
          try {
            parsedImages = JSON.parse(product.images);
          } catch (e) {
            parsedImages = [];
          }
        } else if (Array.isArray(product.images)) {
          parsedImages = product.images;
        }
      }

      setFormData({
        name: product.name,
        description: product.description || '',
        price: (product.price / 100).toFixed(2),
        currency: 'SAR',
        costPrice: product.costPrice ? (product.costPrice / 100).toFixed(2) : '',
        sku: product.sku || '',
        trackInventory: product.trackInventory,
        stock: product.stock.toString(),
        images: parsedImages,
        video: product.video || '',
        discountType: (product as any).discountType || null,
        discountValue: (product as any).discountValue || 0,
        variants: [],
        offers: [],
      });
      
      console.log('Form populated'); // Debug log
    }
  }, [product]);

  // Fetch currencies
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => settingsApi.getAllCurrencies(),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => productApi.update(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/dashboard/products');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert price to cents
    const priceInCents = Math.round(parseFloat(formData.price || '0') * 100);
    const costPriceInCents = formData.costPrice ? Math.round(parseFloat(formData.costPrice) * 100) : undefined;

    console.log('Submitting variants:', formData.variants); // Debug log
    console.log('Submitting offers:', formData.offers); // Debug log

    await updateMutation.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
      price: priceInCents,
      costPrice: costPriceInCents,
      discountType: formData.discountType || undefined,
      discountValue: formData.discountValue || undefined,
      sku: formData.sku || undefined,
      trackInventory: formData.trackInventory,
      stock: parseInt(formData.stock || '0'),
      images: formData.images,
      video: formData.video || undefined,
      variants: formData.variants,
      offers: formData.offers,
    });
  };

  const priceInCents = Math.round(parseFloat(formData.price || '0') * 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  const tabs = [
    { id: 'main' as TabType, label: t('products.mainData') || 'Main Data' },
    { id: 'variants' as TabType, label: t('products.variants') || 'Variants' },
    { id: 'offers' as TabType, label: t('products.offers') || 'Offers' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('products.editProduct') || 'Edit Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {product?.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit}>
          {/* Main Data Tab */}
          {activeTab === 'main' && (
            <div className="space-y-4">
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

                <div className="space-y-3">
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
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.variants')}
              </h2>
              <VariantsEditor
                onVariantsChange={(variants) => setFormData({ ...formData, variants })}
                currency={formData.currency}
              />
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('products.quantityOffers')}
              </h2>
              <OffersEditor
                onOffersChange={(offers) => setFormData({ ...formData, offers })}
                currency={formData.currency}
                basePrice={formData.price}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard/products')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
