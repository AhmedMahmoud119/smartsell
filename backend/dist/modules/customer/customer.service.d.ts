import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, dto: CreateCustomerDto): Promise<{
        store: {
            name: string;
            id: string;
        };
    } & {
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    }>;
    findAll(workspaceId: string, storeId?: string): Promise<({
        store: {
            name: string;
            id: string;
        };
        _count: {
            orders: number;
        };
    } & {
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    })[]>;
    findOne(workspaceId: string, id: string): Promise<{
        store: {
            name: string;
            id: string;
        };
        orders: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            total: number;
        }[];
    } & {
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    }>;
    update(workspaceId: string, id: string, dto: UpdateCustomerDto): Promise<{
        store: {
            name: string;
            id: string;
        };
    } & {
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    }>;
    remove(workspaceId: string, id: string): Promise<{
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    }>;
    findByPhone(workspaceId: string, storeId: string, phone: string): Promise<{
        email: string | null;
        name: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        state: string | null;
        address: string | null;
        totalOrders: number;
        storeId: string;
        notes: string | null;
        city: string | null;
        zipCode: string | null;
        country: string;
        acceptsMarketing: boolean;
        totalSpent: number;
    }>;
}
