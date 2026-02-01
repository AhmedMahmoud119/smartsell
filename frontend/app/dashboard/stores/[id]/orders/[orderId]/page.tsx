'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { orderApi } from '@/lib/api/order';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeId = params.id as string;
  const orderId = params.orderId as string;

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch order
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOne(orderId),
  });

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => orderApi.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', storeId] });
      setShowStatusModal(false);
    },
  });

  const handleUpdateStatus = (status: string) => {
    updateMutation.mutate({ status: status as any });
  };

  const handleMarkAsPaid = () => {
    updateMutation.mutate({ paymentStatus: 'PAID' });
  };

  const handleMarkAsFulfilled = () => {
    updateMutation.mutate({ fulfillmentStatus: 'FULFILLED' });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('orders.orderNumber')}: {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {order.paymentStatus !== 'PAID' && (
            <button
              onClick={handleMarkAsPaid}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              {t('orders.markAsPaid')}
            </button>
          )}
          {order.fulfillmentStatus === 'UNFULFILLED' && (
            <button
              onClick={handleMarkAsFulfilled}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              {t('orders.markAsDelivered')}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('orders.orderItems')}
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    {item.sku && (
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    )}
                  </div>

                  <div className="text-end">
                    <p className="text-gray-900">
                      {formatCurrency(item.price, order.currency)} x {item.quantity}
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.total, order.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{t('orders.subtotal')}</span>
                <span>{formatCurrency(order.subtotal, order.currency)}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{t('orders.shipping')}</span>
                  <span>{formatCurrency(order.shipping, order.currency)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{t('orders.tax')}</span>
                  <span>{formatCurrency(order.tax, order.currency)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>{t('orders.discount')}</span>
                  <span>-{formatCurrency(order.discount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>{t('orders.total')}</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('orders.customerDetails')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('orders.customerName')}</p>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>

              {order.customerEmail && (
                <div>
                  <p className="text-sm text-gray-500">{t('orders.customerEmail')}</p>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">{t('orders.customerPhone')}</p>
                <p className="font-medium text-gray-900">{order.customerPhone}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">{t('orders.shippingAddress')}</p>
                <p className="font-medium text-gray-900">
                  {order.customerAddress}, {order.customerCity}
                  {order.customerState && `, ${order.customerState}`}
                  {order.customerZipCode && ` ${order.customerZipCode}`}
                  <br />
                  {order.customerCountry}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('orders.status')}
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('orders.status')}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">{t('orders.pending')}</option>
                  <option value="PROCESSING">{t('orders.processing')}</option>
                  <option value="COMPLETED">{t('orders.completed')}</option>
                  <option value="CANCELED">{t('orders.canceled')}</option>
                </select>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{t('orders.paymentStatus')}</p>
                <p className="font-medium text-gray-900">{order.paymentStatus}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{t('orders.fulfillmentStatus')}</p>
                <p className="font-medium text-gray-900">{order.fulfillmentStatus}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{t('orders.paymentMethod')}</p>
                <p className="font-medium text-gray-900">
                  {order.paymentMethod === 'COD' ? t('orders.cod') : order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('orders.notes')}
              </h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
