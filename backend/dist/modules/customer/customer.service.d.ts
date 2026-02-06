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
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
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
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
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
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
    }>;
    update(workspaceId: string, id: string, dto: UpdateCustomerDto): Promise<{
        store: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
    }>;
    remove(workspaceId: string, id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
    }>;
    findByPhone(workspaceId: string, storeId: string, phone: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        phone: string;
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
        totalSpent: number;
        acceptsMarketing: boolean;
    }>;
}
