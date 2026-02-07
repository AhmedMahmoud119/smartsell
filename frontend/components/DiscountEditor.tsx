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
    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700 text-sm">
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
        <>
          {/* Inline Type + Value */}
          <div className="flex gap-2">
            <select
              value={discountType}
              onChange={(e) => onDiscountTypeChange(e.target.value as DiscountType)}
              className="w-32 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="PERCENTAGE">{t('products.percentage') || '%'}</option>
              <option value="FIXED">{t('products.fixedAmount') || currency}</option>
            </select>

            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                value={discountValue || ''}
                onChange={(e) => onDiscountValueChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={discountType === 'PERCENTAGE' ? '20' : '50'}
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {discountType === 'PERCENTAGE' ? '%' : currency}
              </span>
            </div>
          </div>

          {/* Compact Price Preview */}
          {hasDiscount && (
            <div className="pt-2 border-t border-gray-200 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('products.originalPrice') || 'Original'}:</span>
                <span className="text-gray-900">{formatPrice(price)} {currency}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">{t('products.discountAmount') || 'Discount'}:</span>
                <span className="text-green-600 font-medium">
                  {discountType === 'PERCENTAGE' 
                    ? `-${discountValue}%`
                    : `-${discountValue} ${currency}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                <span className="font-medium text-gray-900 text-sm">{t('products.finalPrice') || 'Final'}:</span>
                <span className="text-base font-bold text-blue-600">{formatPrice(finalPrice)} {currency}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
