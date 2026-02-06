'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface OrderStatusChartProps {
  data: OrderStatusData[];
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  PROCESSING: '#8B5CF6',
  SHIPPED: '#6366F1',
  DELIVERED: '#10B981',
  CANCELED: '#EF4444',
  REFUNDED: '#6B7280',
};

export function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-400">{t('analytics.noData')}</p>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const statusKey = status.toLowerCase();
    return t(`orders.${statusKey}`) || status;
  };

  const chartData = data.map((item) => ({
    ...item,
    name: getStatusLabel(item.status),
    color: STATUS_COLORS[item.status] || '#6B7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="count"
          label={({ name, payload }) => `${name} (${(payload as { percentage?: number })?.percentage || 0}%)`}
          labelLine={{ strokeWidth: 1 }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            value as number,
            t('analytics.ordersCount'),
          ]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => (
            <span className="text-sm text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
