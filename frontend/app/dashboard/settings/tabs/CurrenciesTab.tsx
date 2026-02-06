'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { settingsApi, Currency } from '@/lib/api/settings';
import { CURRENCY_CODES } from '@/lib/constants/currencies';
import SearchableSelect from '@/components/SearchableSelect';

export default function CurrenciesTab() {
  const { t, locale } = useTranslation();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    isActive: true,
  });

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['workspace-currencies'],
    queryFn: () => settingsApi.getAllCurrencies(),
  });

  const createMutation = useMutation({
    mutationFn: settingsApi.createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-currencies'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      settingsApi.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-currencies'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: settingsApi.deleteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-currencies'] });
    },
  });

  const openModal = (currency?: Currency) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        isActive: currency.isActive,
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        name: '',
        symbol: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCurrency(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurrency) {
      updateMutation.mutate({
        id: editingCurrency.id,
        data: {
          name: formData.name,
          symbol: formData.symbol,
          isActive: formData.isActive,
        },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t('settings.confirmDeleteCurrency') || 'Are you sure?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCurrencyName = (currency: Currency) => {
    return currency.name;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {t('settings.manageCurrencies') || 'إدارة العملات'}
          </h2>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + {t('settings.addCurrency') || 'إضافة عملة'}
        </button>
      </div>

      {/* Table */}
      {currencies && currencies.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('settings.currencyCode') || 'الرمز'}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('settings.currencySymbol') || 'الرمز'}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('settings.currencyName') || 'الاسم'}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.status') || 'الحالة'}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions') || 'الإجراءات'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currencies.map((currency: Currency) => (
                <tr key={currency.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{currency.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg text-gray-700">{currency.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{currency.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {currency.isActive ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                        {t('settings.active') || 'نشط'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-600">
                        {t('settings.inactive') || 'غير نشط'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(currency)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title={t('common.edit') || 'تعديل'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(currency.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('common.delete') || 'حذف'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">{t('settings.noCurrencies') || 'لا توجد عملات'}</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + {t('settings.addFirstCurrency') || 'إضافة أول عملة'}
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCurrency
                  ? (t('settings.editCurrency') || 'تعديل العملة')
                  : (t('settings.addCurrency') || 'إضافة عملة')}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('settings.currencyCode') || 'رمز العملة'} *
                </label>
                <SearchableSelect
                  options={CURRENCY_CODES.map((c) => ({
                    value: c.code,
                    label: `${c.code} - ${locale === 'ar' ? c.nameAr : c.name} (${c.symbol})`,
                  }))}
                  value={formData.code}
                  onChange={(value) => {
                    const selected = CURRENCY_CODES.find((c) => c.code === value);
                    setFormData({
                      ...formData,
                      code: value,
                      name: selected?.name || '',
                      symbol: selected?.symbol || '',
                    });
                  }}
                  placeholder={t('settings.selectCurrency') || 'اختر العملة'}
                  disabled={!!editingCurrency}
                  isRTL={locale === 'ar'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('settings.currencyName') || 'اسم العملة'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t('settings.currencyNamePlaceholder') || 'مثال: ريال سعودي'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('settings.currencySymbol') || 'رمز العملة'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t('settings.currencySymbolPlaceholder') || 'مثال: ر.س'}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  {t('settings.activeCurrency') || 'نشط'}
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  {t('common.cancel') || 'إلغاء'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? (t('common.saving') || 'جاري الحفظ...')
                    : (t('common.save') || 'حفظ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
