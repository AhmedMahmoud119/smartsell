import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  nameAr?: string;

  @IsString()
  @IsOptional()
  symbol?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
