import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(req: any, storeId?: string): Promise<{
        totalStores: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        ordersChange: number;
        revenueChange: number;
    }>;
    getRevenueOverTime(req: any, query: AnalyticsQueryDto): Promise<{
        date: string;
        revenue: number;
        orders: number;
    }[]>;
    getTopProducts(req: any, query: AnalyticsQueryDto): Promise<{
        id: string;
        name: string;
        price: number;
        sales: number;
        revenue: number;
        image: import("@prisma/client/runtime/library").JsonValue;
        storeName: string;
    }[]>;
    getTopCustomers(req: any, query: AnalyticsQueryDto): Promise<{
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
    getOrdersByStatus(req: any, storeId?: string): Promise<{
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
        percentage: number;
    }[]>;
    getSalesByStore(req: any): Promise<{
        id: string;
        name: string;
        orders: number;
        revenue: number;
        products: number;
        percentage: number;
    }[]>;
    getRecentOrders(req: any, storeId?: string, limit?: string): Promise<{
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
