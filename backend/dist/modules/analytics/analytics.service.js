"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(workspaceId, storeId) {
        const storeFilter = storeId ? { id: storeId, workspaceId } : { workspaceId };
        const orderFilter = storeId ? { storeId, workspaceId } : { workspaceId };
        const [stores, products, orders, revenue] = await Promise.all([
            this.prisma.store.count({
                where: storeFilter,
            }),
            this.prisma.product.count({
                where: {
                    store: storeFilter,
                },
            }),
            this.prisma.order.count({
                where: orderFilter,
            }),
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
    async getRevenueOverTime(workspaceId, query) {
        const { storeId, startDate, endDate, period } = query;
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const orderFilter = {
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
        const grouped = new Map();
        orders.forEach((order) => {
            let key;
            const date = new Date(order.createdAt);
            switch (period) {
                case analytics_query_dto_1.AnalyticsPeriod.WEEK:
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case analytics_query_dto_1.AnalyticsPeriod.MONTH:
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    key = date.toISOString().split('T')[0];
            }
            if (!grouped.has(key)) {
                grouped.set(key, { revenue: 0, orders: 0 });
            }
            const entry = grouped.get(key);
            entry.orders += 1;
            if (order.paymentStatus === 'PAID') {
                entry.revenue += order.total;
            }
        });
        return Array.from(grouped.entries())
            .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
        }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    async getTopProducts(workspaceId, query) {
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
    async getTopCustomers(workspaceId, query) {
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
    async getOrdersByStatus(workspaceId, storeId) {
        const orderFilter = { workspaceId };
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
    async getSalesByStore(workspaceId) {
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
    async getRecentOrders(workspaceId, storeId, limit = 5) {
        const orderFilter = { workspaceId };
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map