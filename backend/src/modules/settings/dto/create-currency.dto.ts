import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
