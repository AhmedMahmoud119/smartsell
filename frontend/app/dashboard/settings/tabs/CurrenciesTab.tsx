'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { settingsApi, Currency } from '@/lib/api/settings';

export default function CurrenciesTab() {
  const { t, locale } = useTranslation();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameAr: '',
    symbol: '',
    isActive: true,
  });

  // Fetch currencies
  const { data: currencies, isLoading } = useQuery({
    queryKey: ['workspace-currencies'],
    queryFn: () => settingsApi.getAllCurrencies(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: settingsApi.createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-currencies'] });
      closeModal();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      settingsApi.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-currencies'] });
      closeModal();
    },
  });

  // Delete mutation
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
        nameAr: currency.nameAr,
        symbol: currency.symbol,
        isActive: currency.isActive,
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        name: '',
        nameAr: '',
        symbol: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCurrency(null);
    setFormData({
      code: '',
      name: '',
      nameAr: '',
      symbol: '',
      isActive: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurrency) {
      updateMutation.mutate({
        id: editingCurrency.id,
        data: {
          name: formData.name,
          nameAr: formData.nameAr,
          symbol: formData.symbol,
          isActive: formData.isActive,
        },
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t('settings.confirmDeleteCurrency') || 'Are you sure you want to delete this currency?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCurrencyName = (currency: Currency) => {
    return locale === 'ar' ? currency.nameAr : currency.name;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('settings.manageCurrencies') || 'Manage Currencies'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('settings.manageCurrenciesDescription') || 'Add, edit, or remove currencies for your workspace'}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('settings.addCurrency') || 'Add Currency'}
        </button>
      </div>

      {/* Currencies Grid */}
      {currencies && currencies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currencies.map((currency: Currency) => (
            <div
              key={currency.id}
              className={`p-4 rounded-lg border-2 transition ${
                currency.isActive
                  ? 'border-gray-200 bg-white'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currency.symbol}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{currency.code}</p>
                    <p className="text-sm text-gray-600">{getCurrencyName(currency)}</p>
                  </div>
                </div>
                {!currency.isActive && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {t('settings.inactive') || 'Inactive'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(currency)}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  {t('common.edit') || 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(currency.id)}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  {t('common.delete') || 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {t('settings.noCurrencies') || 'No currencies yet'}
          </p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('settings.addFirstCurrency') || 'Add your first currency'}
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCurrency
                ? (t('settings.editCurrency') || 'Edit Currency')
                : (t('settings.addCurrency') || 'Add Currency')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.currencyCode') || 'Currency Code'} *
                </label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  disabled={!!editingCurrency}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="SAR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.currencyName') || 'Currency Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Saudi Riyal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.currencyNameAr') || 'Currency Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ريال سعودي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('settings.currencySymbol') || 'Currency Symbol'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ر.س"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="isActive" className="ms-2 text-sm text-gray-700">
                  {t('settings.activeCurrency') || 'Active'}
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? (t('common.saving') || 'Saving...')
                    : (t('common.save') || 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
