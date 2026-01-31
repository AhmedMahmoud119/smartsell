export declare class CreateProductDto {
    storeId: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    sku?: string;
    trackInventory?: boolean;
    stock?: number;
    images?: string[];
    video?: string;
}
