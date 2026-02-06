import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsQueryDto, AnalyticsPeriod } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard overview stats
   */
  async getDashboardStats(workspaceId: string, storeId?: string) {
    const storeFilter = storeId ? { id: storeId, workspaceId } : { workspaceId };
    const orderFilter = storeId ? { storeId, workspaceId } : { workspaceId };

    const [stores, products, orders, revenue] = await Promise.all([
      // Total stores
      this.prisma.store.count({
        where: storeFilter,
      }),
      // Total products
      this.prisma.product.count({
        where: {
          store: storeFilter,
        },
      }),
      // Total orders
      this.prisma.order.count({
        where: orderFilter,
      }),
      // Total revenue
      this.prisma.order.aggregate({
        where: {
          ...orderFilter,
          paymentStatus: 'PAID',
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    // Get comparison with previous period (last 30 days vs 30 days before)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentPeriodOrders, previousPeriodOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          ...orderFilter,
          createdAt: { gte: thirtyDaysAgo },
        },
        _count: true,
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: {
          ...orderFilter,
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
        _count: true,
        _sum: { total: true },
      }),
    ]);

    // Calculate percentage changes
    const ordersChange = previousPeriodOrders._count
      ? ((currentPeriodOrders._count - previousPeriodOrders._count) / previousPeriodOrders._count) * 100
      : 0;

    const revenueChange = previousPeriodOrders._sum.total
      ? (((currentPeriodOrders._sum.total || 0) - (previousPeriodOrders._sum.total || 0)) / previousPeriodOrders._sum.total) * 100
      : 0;

    return {
      totalStores: stores,
      totalProducts: products,
      totalOrders: orders,
      totalRevenue: revenue._sum.total || 0,
      ordersChange: Math.round(ordersChange * 10) / 10,
      revenueChange: Math.round(revenueChange * 10) / 10,
    };
  }

  /**
   * Get revenue over time
   */
  async getRevenueOverTime(workspaceId: string, query: AnalyticsQueryDto) {
    const { storeId, startDate, endDate, period } = query;

    // Default to last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const orderFilter: any = {
      workspaceId,
      createdAt: {
        gte: start,
        lte: end,
      },
    };

    if (storeId) {
      orderFilter.storeId = storeId;
    }

    const orders = await this.prisma.order.findMany({
      where: orderFilter,
      select: {
        total: true,
        createdAt: true,
        paymentStatus: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by period
    const grouped = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((order) => {
      let key: string;
      const date = new Date(order.createdAt);

      switch (period) {
        case AnalyticsPeriod.WEEK:
          // Get week start (Sunday)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case AnalyticsPeriod.MONTH:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // DAY
          key = date.toISOString().split('T')[0];
      }

      if (!grouped.has(key)) {
        grouped.set(key, { revenue: 0, orders: 0 });
      }

      const entry = grouped.get(key)!;
      entry.orders += 1;
      if (order.paymentStatus === 'PAID') {
        entry.revenue += order.total;
      }
    });

    // Convert to array and sort
    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get top selling products
   */
  async getTopProducts(workspaceId: string, query: AnalyticsQueryDto) {
    const { storeId, limit = 10 } = query;

    const storeFilter = storeId ? { id: storeId, workspaceId } : { workspaceId };

    const products = await this.prisma.product.findMany({
      where: {
        store: storeFilter,
      },
      select: {
        id: true,
        name: true,
        price: true,
        sales: true,
        images: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { sales: 'desc' },
      take: limit,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sales: product.sales,
      revenue: product.price * product.sales,
      image: Array.isArray(product.images) ? product.images[0] : null,
      storeName: product.store.name,
    }));
  }

  /**
   * Get top customers by spending
   */
  async getTopCustomers(workspaceId: string, query: AnalyticsQueryDto) {
    const { storeId, limit = 10 } = query;

    const storeFilter = storeId ? { id: storeId, workspaceId } : { workspaceId };

    const customers = await this.prisma.customer.findMany({
      where: {
        store: storeFilter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        totalOrders: true,
        totalSpent: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { totalSpent: 'desc' },
      take: limit,
    });

    return customers;
  }

  /**
   * Get order distribution by status
   */
  async getOrdersByStatus(workspaceId: string, storeId?: string) {
    const orderFilter: any = { workspaceId };
    if (storeId) {
      orderFilter.storeId = storeId;
    }

    const statusCounts = await this.prisma.order.groupBy({
      by: ['status'],
      where: orderFilter,
      _count: {
        status: true,
      },
    });

    const total = statusCounts.reduce((sum, item) => sum + item._count.status, 0);

    return statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
      percentage: total > 0 ? Math.round((item._count.status / total) * 100) : 0,
    }));
  }

  /**
   * Get sales breakdown by store
   */
  async getSalesByStore(workspaceId: string) {
    const stores = await this.prisma.store.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        totalOrders: true,
        totalRevenue: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { totalRevenue: 'desc' },
    });

    const totalRevenue = stores.reduce((sum, store) => sum + store.totalRevenue, 0);

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      orders: store.totalOrders,
      revenue: store.totalRevenue,
      products: store._count.products,
      percentage: totalRevenue > 0 ? Math.round((store.totalRevenue / totalRevenue) * 100) : 0,
    }));
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(workspaceId: string, storeId?: string, limit = 5) {
    const orderFilter: any = { workspaceId };
    if (storeId) {
      orderFilter.storeId = storeId;
    }

    return this.prisma.order.findMany({
      where: orderFilter,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
