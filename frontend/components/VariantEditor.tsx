'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

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

interface VariantEditorProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  basePrice: number;
}

const PRESET_COLORS = [
  { name: 'أحمر', code: '#EF4444' },
  { name: 'أزرق', code: '#3B82F6' },
  { name: 'أخضر', code: '#10B981' },
  { name: 'أصفر', code: '#F59E0B' },
  { name: 'أسود', code: '#000000' },
  { name: 'أبيض', code: '#FFFFFF' },
  { name: 'رمادي', code: '#6B7280' },
  { name: 'وردي', code: '#EC4899' },
  { name: 'بنفسجي', code: '#8B5CF6' },
  { name: 'برتقالي', code: '#F97316' },
];

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

export function VariantEditor({ variants, onVariantsChange, basePrice }: VariantEditorProps) {
  const { t } = useTranslation();
  const [variantType, setVariantType] = useState<VariantType>('COLOR');

  const addVariant = (type: VariantType, value: string, colorCode?: string) => {
    // Check if variant already exists
    const exists = variants.some((v) => v.type === type && v.value === value);
    if (exists) return;

    const newVariant: ProductVariant = {
      name: value,
      type,
      value,
      colorCode,
      stock: 0,
    };
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    onVariantsChange(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    onVariantsChange(newVariants);
  };

  const addCustomVariant = () => {
    const defaultValue = variantType === 'COLOR' ? 'Custom Color' : variantType === 'SIZE' ? 'Custom Size' : 'Custom';
    addVariant(variantType, defaultValue, variantType === 'COLOR' ? '#000000' : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Variant Type Selector */}
      <div className="flex gap-2">
        {(['COLOR', 'SIZE', 'TEXT'] as VariantType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setVariantType(type)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              variantType === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {type === 'COLOR' && (t('products.variantColor') || 'Color')}
            {type === 'SIZE' && (t('products.variantSize') || 'Size')}
            {type === 'TEXT' && (t('products.variantText') || 'Text')}
          </button>
        ))}
      </div>

      {/* Quick Add Presets */}
      {variantType === 'COLOR' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('products.selectColors') || 'Select Colors'}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => {
              const isSelected = variants.some((v) => v.colorCode === color.code);
              return (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => !isSelected && addVariant('COLOR', color.name, color.code)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                >
                  {isSelected && (
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {variantType === 'SIZE' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('products.selectSizes') || 'Select Sizes'}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_SIZES.map((size) => {
              const isSelected = variants.some((v) => v.type === 'SIZE' && v.value === size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => !isSelected && addVariant('SIZE', size)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Variant Button */}
      <button
        type="button"
        onClick={addCustomVariant}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t('products.addCustomVariant') || 'Add Custom Variant'}
      </button>

      {/* Variants List */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            {t('products.variantsList') || 'Variants'} ({variants.length})
          </label>
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Color Preview */}
                {variant.type === 'COLOR' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={variant.colorCode || '#000000'}
                      onChange={(e) => updateVariant(index, { colorCode: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                )}

                {/* Variant Name/Value */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={variant.value}
                    onChange={(e) => updateVariant(index, { value: e.target.value, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('products.variantName') || 'Variant name'}
                  />
                </div>

                {/* Stock */}
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, { stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('products.stock') || 'Stock'}
                  />
                </div>

                {/* Price Override (optional) */}
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    value={variant.price || ''}
                    onChange={(e) => updateVariant(index, { price: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`${basePrice / 100}`}
                  />
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Stock Summary */}
      {variants.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {t('products.totalStock') || 'Total Stock'}: {' '}
            <span className="font-bold">{variants.reduce((sum, v) => sum + v.stock, 0)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
