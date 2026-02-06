import { DiscountType } from '@prisma/client';
export declare class CreateProductDto {
    storeId: string;
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    discountType?: DiscountType;
    discountValue?: number;
    sku?: string;
    trackInventory?: boolean;
    stock?: number;
    images?: string[];
    video?: string;
}
