import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum, Min, Max, MaxLength } from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsOptional()
  storeId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  costPrice?: number;

  // Discount fields
  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100) // Max 100% for percentage, or a large fixed amount
  discountValue?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  video?: string;
}

