import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePixelsDto } from './dto/update-pixels.dto';

@Injectable()
export class PixelsService {
  constructor(private prisma: PrismaService) {}

  async getPixels(storeId: string, workspaceId: string) {
    // Verify store belongs to workspace
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        workspaceId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Get or create pixels record
    let pixels = await this.prisma.storePixels.findUnique({
      where: { storeId },
    });

    if (!pixels) {
      pixels = await this.prisma.storePixels.create({
        data: {
          storeId,
          enabled: true,
        },
      });
    }

    return pixels;
  }

  async updatePixels(storeId: string, workspaceId: string, dto: UpdatePixelsDto) {
    // Verify store belongs to workspace
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
        workspaceId,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Upsert pixels record
    const pixels = await this.prisma.storePixels.upsert({
      where: { storeId },
      update: {
        ...dto,
        updatedAt: new Date(),
      },
      create: {
        storeId,
        ...dto,
      },
    });

    return pixels;
  }

  async testPixel(storeId: string, workspaceId: string, pixelType: string) {
    const pixels = await this.getPixels(storeId, workspaceId);

    switch (pixelType) {
      case 'facebook':
        return this.testFacebookPixel(pixels.facebookPixelId, pixels.facebookAccessToken);
      case 'tiktok':
        return this.testTiktokPixel(pixels.tiktokPixelId, pixels.tiktokAccessToken);
      case 'google':
        return { success: !!pixels.googleTagManagerId || !!pixels.googleAnalyticsId };
      case 'clarity':
        return { success: !!pixels.clarityId };
      default:
        return { success: false, error: 'Unknown pixel type' };
    }
  }

  private async testFacebookPixel(pixelId?: string | null, accessToken?: string | null) {
    if (!pixelId) {
      return { success: false, error: 'Facebook Pixel ID not configured' };
    }

    if (!accessToken) {
      return { 
        success: true, 
        warning: 'Pixel ID configured but Access Token missing for Conversion API' 
      };
    }

    try {
      // Test by fetching pixel info from Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pixelId}?access_token=${accessToken}`,
      );
      const data = await response.json();

      if (data.error) {
        return { success: false, error: data.error.message };
      }

      return { success: true, pixelName: data.name };
    } catch (error) {
      return { success: false, error: 'Failed to connect to Facebook API' };
    }
  }

  private async testTiktokPixel(pixelId?: string | null, accessToken?: string | null) {
    if (!pixelId) {
      return { success: false, error: 'TikTok Pixel ID not configured' };
    }

    if (!accessToken) {
      return { 
        success: true, 
        warning: 'Pixel ID configured but Access Token missing for Events API' 
      };
    }

    // TikTok doesn't have a simple test endpoint, return success if configured
    return { success: true, message: 'TikTok pixel configured' };
  }
}
