import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    create(req: any, createCustomerDto: CreateCustomerDto): Promise<{
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
    findAll(req: any, storeId?: string): Promise<({
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
    findByPhone(req: any, storeId: string, phone: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateCustomerDto: UpdateCustomerDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
