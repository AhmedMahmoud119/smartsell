'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { orderApi } from '@/lib/api/order';
import { storeApi } from '@/lib/api/store';
import { Order } from '@/lib/types';

export default function OrdersPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  // Fetch store
  const { data: store } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getOne(storeId),
  });

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', storeId],
    queryFn: () => orderApi.getAll(storeId),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'pending',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      CANCELED: 'canceled',
    };
    return t(`orders.${statusMap[status] || 'pending'}`);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'paymentPending',
      PAID: 'paymentPaid',
      FAILED: 'paymentFailed',
    };
    return t(`orders.${statusMap[status] || 'paymentPending'}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return (amount / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ' + currency;
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
          {store && (
            <p className="text-sm text-gray-600 mt-1">
              {store.name}
            </p>
          )}
        </div>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.orderNumber')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.customer')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.date')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.total')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.paymentStatus')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.status')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(order.total, order.currency)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <button
                      onClick={() => router.push(`/dashboard/stores/${storeId}/orders/${order.id}`)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('orders.noOrdersYet')}
          </h3>
          <p className="text-gray-600">
            Orders will appear here once customers start purchasing
          </p>
        </div>
      )}
    </div>
  );
}
