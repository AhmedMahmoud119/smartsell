import { PaymentMethod } from '@prisma/client';
declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    storeId: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerState?: string;
    customerZipCode?: string;
    customerCountry?: string;
    items: OrderItemDto[];
    shipping?: number;
    tax?: number;
    discount?: number;
    paymentMethod?: PaymentMethod;
    notes?: string;
    source?: string;
}
export {};
