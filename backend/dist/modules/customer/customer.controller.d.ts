import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    create(req: any, createCustomerDto: CreateCustomerDto): Promise<{
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
    findAll(req: any, storeId?: string): Promise<({
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
    findByPhone(req: any, storeId: string, phone: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateCustomerDto: UpdateCustomerDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
