import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import {
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
} from '@prisma/client';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsEnum(FulfillmentStatus)
  @IsOptional()
  fulfillmentStatus?: FulfillmentStatus;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsDateString()
  @IsOptional()
  deliveredAt?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;

  @IsString()
  @IsOptional()
  cancelReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
