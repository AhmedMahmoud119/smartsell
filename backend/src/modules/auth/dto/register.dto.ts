import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../../../common/constants/locales';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  workspaceName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LOCALES, { message: 'Locale must be either ar or en' })
  locale?: string = DEFAULT_LOCALE;
}
