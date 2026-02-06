import { IsString, IsEmail, IsOptional, IsBoolean, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  storeId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  phone: string;

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
  @IsBoolean()
  acceptsMarketing?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
