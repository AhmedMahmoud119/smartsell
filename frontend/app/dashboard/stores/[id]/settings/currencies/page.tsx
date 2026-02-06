'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { settingsApi, Currency, CurrencySettings } from '@/lib/api/settings';

export default function CurrenciesSettingsPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeId = params.id as string;

  const [defaultCurrency, setDefaultCurrency] = useState<string>('');
  const [enabledCurrencies, setEnabledCurrencies] = useState<string[]>([]);
  const [autoConvert, setAutoConvert] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch currency settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-currencies', storeId],
    queryFn: () => settingsApi.getStoreCurrencies(storeId),
  });

  // Initialize state when data loads
  useEffect(() => {
    if (settings && !initialized) {
      setDefaultCurrency(settings.defaultCurrency);
      setEnabledCurrencies(settings.enabledCurrencies);
      setAutoConvert(settings.autoConvert);
      setInitialized(true);
    }
  }, [settings, initialized]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: () =>
      settingsApi.updateStoreCurrencies(storeId, {
        defaultCurrency,
        enabledCurrencies,
        autoConvert,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-currencies', storeId] });
      queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      setHasChanges(false);
    },
  });

  const handleToggleCurrency = (code: string) => {
    setHasChanges(true);
    if (enabledCurrencies.includes(code)) {
      // Don't allow removing default currency
      if (code === defaultCurrency) return;
      setEnabledCurrencies(enabledCurrencies.filter((c) => c !== code));
    } else {
      setEnabledCurrencies([...enabledCurrencies, code]);
    }
  };

  const handleSetDefault = (code: string) => {
    setHasChanges(true);
    setDefaultCurrency(code);
    // Ensure default is in enabled list
    if (!enabledCurrencies.includes(code)) {
      setEnabledCurrencies([...enabledCurrencies, code]);
    }
  };

  const handleSave = () => {
    updateMutation.mutate();
  };

  const getCurrencyName = (currency: Currency) => {
    return locale === 'ar' ? currency.nameAr : currency.name;
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('settings.currencies') || 'Currencies'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('settings.currenciesDescription') || 'Manage currencies for your store'}
          </p>
        </div>
      </div>

      {/* Default Currency */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('settings.defaultCurrency') || 'Default Currency'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t('settings.defaultCurrencyDescription') || 'This is the primary currency for your store. All prices will be displayed in this currency.'}
        </p>
        
        <select
          value={defaultCurrency}
          onChange={(e) => handleSetDefault(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {settings.availableCurrencies.map((currency: Currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} - {getCurrencyName(currency)} ({currency.code})
            </option>
          ))}
        </select>
      </div>

      {/* Enabled Currencies */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('settings.enabledCurrencies') || 'Enabled Currencies'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t('settings.enabledCurrenciesDescription') || 'Select which currencies customers can use to view prices.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {settings.availableCurrencies.map((currency: Currency) => {
            const isEnabled = enabledCurrencies.includes(currency.code);
            const isDefault = currency.code === defaultCurrency;

            return (
              <div
                key={currency.code}
                onClick={() => handleToggleCurrency(currency.code)}
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  isEnabled
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.symbol}</span>
                    <div>
                      <p className="font-medium text-gray-900">{currency.code}</p>
                      <p className="text-sm text-gray-600">{getCurrencyName(currency)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                        {t('settings.default') || 'Default'}
                      </span>
                    )}
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleCurrency(currency.code)}
                      disabled={isDefault}
                      className="w-5 h-5 text-blue-600 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto Convert */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.autoConvert') || 'Auto Convert Prices'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('settings.autoConvertDescription') || 'Automatically convert prices to customer\'s selected currency using exchange rates.'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoConvert}
              onChange={(e) => {
                setAutoConvert(e.target.checked);
                setHasChanges(true);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            {updateMutation.isPending
              ? (t('common.saving') || 'Saving...')
              : (t('common.save') || 'Save Changes')}
          </button>
        </div>
      )}
    </div>
  );
}
