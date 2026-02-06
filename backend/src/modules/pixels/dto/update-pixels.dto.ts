import {
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdatePixelsDto {
  // Facebook
  @IsOptional()
  @IsString()
  facebookPixelId?: string;

  @IsOptional()
  @IsString()
  facebookAccessToken?: string;

  @IsOptional()
  @IsBoolean()
  facebookTestMode?: boolean;

  // TikTok
  @IsOptional()
  @IsString()
  tiktokPixelId?: string;

  @IsOptional()
  @IsString()
  tiktokAccessToken?: string;

  @IsOptional()
  @IsBoolean()
  tiktokTestMode?: boolean;

  // Google
  @IsOptional()
  @IsString()
  googleTagManagerId?: string;

  @IsOptional()
  @IsString()
  googleAnalyticsId?: string;

  @IsOptional()
  @IsString()
  googleAdsId?: string;

  // Microsoft
  @IsOptional()
  @IsString()
  clarityId?: string;

  // Snapchat
  @IsOptional()
  @IsString()
  snapchatPixelId?: string;

  // Custom Scripts
  @IsOptional()
  @IsString()
  customHeadScripts?: string;

  @IsOptional()
  @IsString()
  customBodyScripts?: string;

  // Status
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
