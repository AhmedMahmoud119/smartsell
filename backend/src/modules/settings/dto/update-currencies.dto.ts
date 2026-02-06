import { IsString, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';

export class UpdateCurrenciesDto {
  @IsString()
  @IsOptional()
  defaultCurrency?: string;

  @IsArray()
  @IsOptional()
  enabledCurrencies?: string[];

  @IsBoolean()
  @IsOptional()
  autoConvert?: boolean;

  @IsObject()
  @IsOptional()
  exchangeRates?: Record<string, number>;
}
