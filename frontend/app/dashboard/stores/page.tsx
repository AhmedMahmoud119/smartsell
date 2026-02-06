'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { storeApi } from '@/lib/api/store';
import { Store } from '@/lib/types';

export default function StoresPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreDescription, setNewStoreDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeApi.getAll(),
  });

  // Create store mutation
  const createMutation = useMutation({
    mutationFn: storeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store-stats'] });
      setShowCreateModal(false);
      setNewStoreName('');
      setNewStoreDescription('');
    },
  });

  // Delete store mutation
  const deleteMutation = useMutation({
    mutationFn: storeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store-stats'] });
    },
  });

  const handleCreateStore = async () => {
    if (!newStoreName.trim()) return;

    setIsCreating(true);
    try {
      await createMutation.mutateAsync({
        name: newStoreName,
        description: newStoreDescription || undefined,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStore = async (store: Store) => {
    if (confirm(t('stores.deleteConfirm'))) {
      await deleteMutation.mutateAsync(store.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusKey = status.toLowerCase() as
      | 'draft'
      | 'published'
      | 'paused'
      | 'archived';
    return t(`stores.${statusKey}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('stores.title')}</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
        >
          {t('stores.createStore')}
        </button>
      </div>

      {/* Stores List */}
      {stores && stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-500">{store.slug}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                    store.status
                  )}`}
                >
                  {getStatusText(store.status)}
                </span>
              </div>

              {store.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {store.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>{store._count?.products || 0} {t('stores.products')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>{store._count?.orders || 0} {t('stores.orders')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/stores/${store.id}/products`)
                    }
                    className="flex-1 px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition text-sm"
                  >
                    {t('stores.products')}
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/stores/${store.id}/orders`)
                    }
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                  >
                    {t('stores.orders')}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/stores/${store.id}/settings`)
                    }
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                  >
                    {t('stores.settings')}
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm"
                  >
                    {t('stores.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('stores.noStoresYet')}
          </h3>
          <p className="text-gray-600 mb-6">{t('stores.createFirstStore')}</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            {t('stores.createStore')}
          </button>
        </div>
      )}

      {/* Create Store Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('stores.createStore')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('stores.storeName')}
                </label>
                <input
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder={t('stores.storeName')}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('stores.description')}
                </label>
                <textarea
                  value={newStoreDescription}
                  onChange={(e) => setNewStoreDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows={3}
                  placeholder={t('stores.description')}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewStoreName('');
                  setNewStoreDescription('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                disabled={isCreating}
              >
                {t('stores.cancel')}
              </button>
              <button
                onClick={handleCreateStore}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCreating || !newStoreName.trim()}
              >
                {isCreating ? t('stores.creating') : t('stores.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
