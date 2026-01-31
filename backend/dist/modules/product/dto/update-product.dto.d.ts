import { ProductStatus } from '@prisma/client';
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    compareAtPrice?: number;
    costPrice?: number;
    sku?: string;
    trackInventory?: boolean;
    stock?: number;
    images?: string[];
    video?: string;
    status?: ProductStatus;
    metaTitle?: string;
    metaDescription?: string;
}
