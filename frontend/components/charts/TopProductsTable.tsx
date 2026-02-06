'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface TopProduct {
  id: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
  image: string | null;
  storeName: string;
}

interface TopProductsTableProps {
  data: TopProduct[];
  isLoading?: boolean;
}

export function TopProductsTable({ data, isLoading }: TopProductsTableProps) {
  const { t, locale } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(value / 100);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('analytics.noProducts')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">
              #
            </th>
            <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">
              {t('analytics.product')}
            </th>
            <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">
              {t('analytics.store')}
            </th>
            <th className="text-end py-3 px-2 text-sm font-medium text-gray-500">
              {t('analytics.sales')}
            </th>
            <th className="text-end py-3 px-2 text-sm font-medium text-gray-500">
              {t('analytics.revenue')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-2 text-sm text-gray-500">{index + 1}</td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
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
                  <span className="font-medium text-gray-900 line-clamp-1">
                    {product.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2 text-sm text-gray-600">
                {product.storeName}
              </td>
              <td className="py-3 px-2 text-sm text-gray-900 text-end font-medium">
                {product.sales}
              </td>
              <td className="py-3 px-2 text-sm text-green-600 text-end font-semibold">
                {formatCurrency(product.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
