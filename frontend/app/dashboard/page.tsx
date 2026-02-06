'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store/authStore';
import { storeApi } from '@/lib/api/store';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  // Fetch store stats
  const { data: stats } = useQuery({
    queryKey: ['store-stats'],
    queryFn: () => storeApi.getStats(),
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-4xl font-bold">
          {t('dashboard.welcomeBack', { name: user?.name || 'User' })}
        </h2>
        <p className="text-blue-100 mt-3 text-lg">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Stores */}
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 font-medium uppercase tracking-wide">
                {t('dashboard.totalStores')}
              </p>
              <p className="text-5xl font-bold mt-3">
                {stats?.totalStores || 0}
              </p>
              {stats && stats.totalStores === 0 && (
                <p className="text-sm text-blue-100 mt-3">
                  {t('dashboard.noStores')}
                </p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8"
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
          </div>
        </div>

        {/* Total Products */}
        <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 font-medium uppercase tracking-wide">
                {t('dashboard.totalProducts')}
              </p>
              <p className="text-5xl font-bold mt-3">
                {stats?.totalProducts || 0}
              </p>
              {stats && stats.totalProducts === 0 && (
                <p className="text-sm text-green-100 mt-3">
                  {t('dashboard.noProducts')}
                </p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8"
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
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 font-medium uppercase tracking-wide">
                {t('dashboard.totalOrders')}
              </p>
              <p className="text-5xl font-bold mt-3">
                {stats?.totalOrders || 0}
              </p>
              {stats && stats.totalOrders === 0 && (
                <p className="text-sm text-purple-100 mt-3">
                  {t('dashboard.noOrders')}
                </p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8"
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
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/dashboard/stores')}
            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="text-left ltr:text-left rtl:text-right">
              <p className="font-bold text-gray-900 text-lg">{t('stores.createStore')}</p>
              <p className="text-sm text-gray-500 mt-1">
                Start selling in minutes
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/dashboard/stores')}
            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
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
            <div className="text-left ltr:text-left rtl:text-right">
              <p className="font-bold text-gray-900 text-lg">View Stores</p>
              <p className="text-sm text-gray-500 mt-1">
                Manage your stores
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
