import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client';
export declare class UpdateOrderDto {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    fulfillmentStatus?: FulfillmentStatus;
    trackingNumber?: string;
    carrier?: string;
    deliveredAt?: string;
    paidAt?: string;
    cancelReason?: string;
    notes?: string;
}
