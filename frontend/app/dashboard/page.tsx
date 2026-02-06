'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store/authStore';
import { analyticsApi } from '@/lib/api/analytics';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { OrderStatusChart } from '@/components/charts/OrderStatusChart';
import { TopProductsTable } from '@/components/charts/TopProductsTable';
import { DateRangePicker, DateRange } from '@/components/DateRangePicker';

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();

  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsApi.getDashboardStats(),
  });

  // Fetch revenue over time
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['analytics-revenue', startDate, endDate],
    queryFn: () => analyticsApi.getRevenueOverTime({ startDate, endDate, period: 'day' }),
  });

  // Fetch order status distribution
  const { data: orderStatusData, isLoading: orderStatusLoading } = useQuery({
    queryKey: ['analytics-order-status'],
    queryFn: () => analyticsApi.getOrdersByStatus(),
  });

  // Fetch top products
  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['analytics-top-products'],
    queryFn: () => analyticsApi.getTopProducts({ limit: 5 }),
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['analytics-recent-orders'],
    queryFn: () => analyticsApi.getRecentOrders(undefined, 5),
  });

  const handleDateRangeChange = (range: DateRange, start?: string, end?: string) => {
    setDateRange(range);
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(value / 100);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcomeBack', { name: user?.name || 'User' })}
          </h1>
          <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Stores */}
        <div className="bg-pink-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalStores')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : formatNumber(stats?.totalStores || 0)}
              </p>
            </div>
            <div className="bg-pink-100 text-pink-600 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-green-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalProducts')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : formatNumber(stats?.totalProducts || 0)}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-purple-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{t('dashboard.totalOrders')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : formatNumber(stats?.totalOrders || 0)}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-orange-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{t('analytics.totalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.revenueOverTime')}</h3>
          <RevenueChart data={revenueData || []} isLoading={revenueLoading} />
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.ordersByStatus')}</h3>
          <OrderStatusChart data={orderStatusData || []} isLoading={orderStatusLoading} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.topProducts')}</h3>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('analytics.viewAll')}
            </button>
          </div>
          <TopProductsTable data={topProducts || []} isLoading={topProductsLoading} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.recentOrders')}</h3>
            <button
              onClick={() => router.push('/dashboard/stores')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('analytics.viewAll')}
            </button>
          </div>
          
          {recentOrdersLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : !recentOrders || recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {t('dashboard.noOrders')}
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-semibold text-gray-900 text-sm">{formatCurrency(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                      {t(`orders.${order.status.toLowerCase()}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
