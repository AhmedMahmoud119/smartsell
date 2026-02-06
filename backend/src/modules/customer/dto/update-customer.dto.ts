import { IsString, IsEmail, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsInt()
  totalOrders?: number;

  @IsOptional()
  @IsInt()
  totalSpent?: number;

  @IsOptional()
  @IsBoolean()
  acceptsMarketing?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
