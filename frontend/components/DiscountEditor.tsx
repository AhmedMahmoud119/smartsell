'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

type DiscountType = 'FIXED' | 'PERCENTAGE' | null;

interface DiscountEditorProps {
  price: number; // in cents
  discountType: DiscountType;
  discountValue: number;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
  currency?: string;
}

export function DiscountEditor({
  price,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
  currency = 'SAR',
}: DiscountEditorProps) {
  const { t } = useTranslation();

  const calculateFinalPrice = () => {
    if (!discountType || !discountValue) return price;
    
    if (discountType === 'PERCENTAGE') {
      return Math.round(price * (1 - discountValue / 100));
    } else {
      // FIXED - discountValue is in cents
      return Math.max(0, price - discountValue * 100);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const finalPrice = calculateFinalPrice();
  const hasDiscount = discountType && discountValue > 0;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700">
          {t('products.discount') || 'Discount'}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={discountType !== null}
            onChange={(e) => onDiscountTypeChange(e.target.checked ? 'PERCENTAGE' : null)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {t('products.enableDiscount') || 'Enable discount'}
          </span>
        </label>
      </div>

      {discountType && (
        <div className="grid grid-cols-2 gap-4">
          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t('products.discountType') || 'Discount Type'}
            </label>
            <select
              value={discountType}
              onChange={(e) => onDiscountTypeChange(e.target.value as DiscountType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="PERCENTAGE">{t('products.percentage') || 'Percentage (%)'}</option>
              <option value="FIXED">{t('products.fixedAmount') || 'Fixed Amount'}</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {discountType === 'PERCENTAGE' 
                ? (t('products.percentageValue') || 'Percentage')
                : (t('products.amountOff') || 'Amount Off')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                value={discountValue || ''}
                onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={discountType === 'PERCENTAGE' ? '20' : '50'}
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400">
                {discountType === 'PERCENTAGE' ? '%' : currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Price Preview */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {t('products.originalPrice') || 'Original Price'}:
          </span>
          <span className="text-gray-900">
            {formatPrice(price)} {currency}
          </span>
        </div>

        {hasDiscount && (
          <>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-green-600 font-medium">
                {t('products.discountAmount') || 'Discount'}:
              </span>
              <span className="text-green-600 font-medium">
                {discountType === 'PERCENTAGE' 
                  ? `-${discountValue}%`
                  : `-${discountValue} ${currency}`}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">
                {t('products.finalPrice') || 'Final Price'}:
              </span>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(finalPrice)} {currency}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
