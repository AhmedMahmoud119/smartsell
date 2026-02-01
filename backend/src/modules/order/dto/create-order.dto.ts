import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  storeId: string;

  // Customer information
  @IsString()
  @MaxLength(200)
  customerName: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  customerPhone: string;

  @IsString()
  customerAddress: string;

  @IsString()
  customerCity: string;

  @IsString()
  @IsOptional()
  customerState?: string;

  @IsString()
  @IsOptional()
  customerZipCode?: string;

  @IsString()
  @IsOptional()
  customerCountry?: string;

  // Order items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // Pricing
  @IsNumber()
  @Min(0)
  @IsOptional()
  shipping?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  // Payment
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  source?: string;
}
