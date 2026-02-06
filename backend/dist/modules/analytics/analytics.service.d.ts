import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(workspaceId: string, storeId?: string): Promise<{
        totalStores: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        ordersChange: number;
        revenueChange: number;
    }>;
    getRevenueOverTime(workspaceId: string, query: AnalyticsQueryDto): Promise<{
        date: string;
        revenue: number;
        orders: number;
    }[]>;
    getTopProducts(workspaceId: string, query: AnalyticsQueryDto): Promise<{
        id: string;
        name: string;
        price: number;
        sales: number;
        revenue: number;
        image: import("@prisma/client/runtime/library").JsonValue;
        storeName: string;
    }[]>;
    getTopCustomers(workspaceId: string, query: AnalyticsQueryDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        totalOrders: number;
        store: {
            id: string;
            name: string;
        };
        totalSpent: number;
    }[]>;
    getOrdersByStatus(workspaceId: string, storeId?: string): Promise<{
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
        percentage: number;
    }[]>;
    getSalesByStore(workspaceId: string): Promise<{
        id: string;
        name: string;
        orders: number;
        revenue: number;
        products: number;
        percentage: number;
    }[]>;
    getRecentOrders(workspaceId: string, storeId?: string, limit?: number): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        total: number;
        store: {
            id: string;
            name: string;
        };
        orderNumber: string;
        customerName: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
    }[]>;
}
