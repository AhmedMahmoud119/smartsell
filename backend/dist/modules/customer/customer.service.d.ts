import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, dto: CreateCustomerDto): Promise<{
        store: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    findAll(workspaceId: string, storeId?: string): Promise<({
        store: {
            id: string;
            name: string;
        };
        _count: {
            orders: number;
        };
    } & {
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    })[]>;
    findOne(workspaceId: string, id: string): Promise<{
        store: {
            id: string;
            name: string;
        };
        orders: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            total: number;
        }[];
    } & {
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    update(workspaceId: string, id: string, dto: UpdateCustomerDto): Promise<{
        store: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    remove(workspaceId: string, id: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
    findByPhone(workspaceId: string, storeId: string, phone: string): Promise<{
        id: string;
        name: string;
        email: string | null;
        phone: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        totalOrders: number;
        totalSpent: number;
        acceptsMarketing: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
    }>;
}
