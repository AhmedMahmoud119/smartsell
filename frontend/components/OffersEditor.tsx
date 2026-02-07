'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Offer {
  id: string;
  quantity: number;
  price: string;
  enabled: boolean;
}

interface OffersEditorProps {
  onOffersChange: (offers: Offer[]) => void;
  currency?: string;
  basePrice?: string;
}

export function OffersEditor({ onOffersChange, currency = 'SAR', basePrice = '0' }: OffersEditorProps) {
  const { t } = useTranslation();
  const [hasOffers, setHasOffers] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Add new offer
  const addOffer = () => {
    const newOffer: Offer = {
      id: Date.now().toString(),
      quantity: 1,
      price: basePrice,
      enabled: true,
    };
    const updated = [...offers, newOffer];
    setOffers(updated);
    onOffersChange(updated);
  };

  // Remove offer
  const removeOffer = (id: string) => {
    const updated = offers.filter(offer => offer.id !== id);
    setOffers(updated);
    onOffersChange(updated);
  };

  // Update offer
  const updateOffer = (id: string, field: keyof Offer, value: any) => {
    const updated = offers.map(offer =>
      offer.id === id ? { ...offer, [field]: value } : offer
    );
    setOffers(updated);
    onOffersChange(updated);
  };

  // Toggle offers
  const toggleOffers = (enabled: boolean) => {
    setHasOffers(enabled);
    if (!enabled) {
      setOffers([]);
      onOffersChange([]);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700 text-sm">
          {t('products.quantityOffers') || 'Quantity-Based Offers'}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasOffers}
            onChange={(e) => toggleOffers(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {t('products.enableOffers') || 'Enable offers'}
          </span>
        </label>
      </div>

      {hasOffers && (
        <div className="space-y-3">
          {/* Offers List */}
          {offers.length > 0 && (
            <div className="space-y-2">
              {offers.map((offer, index) => (
                <div key={offer.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t('products.offer') || 'Offer'} {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOffer(offer.id)}
                      className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Quantity */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('products.quantity') || 'Quantity'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={offer.quantity}
                        onChange={(e) => updateOffer(offer.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {t('products.price') || 'Price'} ({currency})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={offer.price}
                        onChange={(e) => updateOffer(offer.id, 'price', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`offer-${offer.id}-enabled`}
                      checked={offer.enabled}
                      onChange={(e) => updateOffer(offer.id, 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`offer-${offer.id}-enabled`} className="text-xs text-gray-600">
                      {t('common.active') || 'Active'}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Offer Button */}
          <button
            type="button"
            onClick={addOffer}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('products.addOffer') || 'Add Offer'}
          </button>

          {/* Info */}
          {offers.length > 0 && (
            <p className="text-xs text-gray-500">
              {t('products.offersInfo') || 'Customers will see discounted prices when buying in specified quantities'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
