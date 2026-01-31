import { StoreStatus } from '@prisma/client';
export declare class UpdateStoreDto {
    name?: string;
    description?: string;
    logo?: string;
    favicon?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    language?: string;
    currency?: string;
    status?: StoreStatus;
    shippingPolicy?: string;
    returnPolicy?: string;
    privacyPolicy?: string;
    termsOfService?: string;
    metaTitle?: string;
    metaDescription?: string;
}
