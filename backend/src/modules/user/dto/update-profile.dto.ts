import { IsString, IsOptional, MinLength, IsIn } from 'class-validator';
import { SUPPORTED_LOCALES } from '../../../common/constants/locales';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LOCALES, { message: 'Locale must be either ar or en' })
  locale?: string;
}
