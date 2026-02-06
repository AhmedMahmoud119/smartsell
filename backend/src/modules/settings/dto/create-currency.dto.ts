import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  nameAr: string;

  @IsString()
  symbol: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
