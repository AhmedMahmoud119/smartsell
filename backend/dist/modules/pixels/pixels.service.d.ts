import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePixelsDto } from './dto/update-pixels.dto';
export declare class PixelsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPixels(storeId: string, workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        facebookPixelId: string | null;
        facebookAccessToken: string | null;
        facebookTestMode: boolean;
        tiktokPixelId: string | null;
        tiktokAccessToken: string | null;
        tiktokTestMode: boolean;
        googleTagManagerId: string | null;
        googleAnalyticsId: string | null;
        googleAdsId: string | null;
        clarityId: string | null;
        snapchatPixelId: string | null;
        customHeadScripts: string | null;
        customBodyScripts: string | null;
        enabled: boolean;
    }>;
    updatePixels(storeId: string, workspaceId: string, dto: UpdatePixelsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        facebookPixelId: string | null;
        facebookAccessToken: string | null;
        facebookTestMode: boolean;
        tiktokPixelId: string | null;
        tiktokAccessToken: string | null;
        tiktokTestMode: boolean;
        googleTagManagerId: string | null;
        googleAnalyticsId: string | null;
        googleAdsId: string | null;
        clarityId: string | null;
        snapchatPixelId: string | null;
        customHeadScripts: string | null;
        customBodyScripts: string | null;
        enabled: boolean;
    }>;
    testPixel(storeId: string, workspaceId: string, pixelType: string): Promise<{
        success: boolean;
        warning: string;
        error?: undefined;
        pixelName?: undefined;
    } | {
        success: boolean;
        error: any;
        warning?: undefined;
        pixelName?: undefined;
    } | {
        success: boolean;
        pixelName: any;
        warning?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        warning?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        warning: string;
        error?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
        warning?: undefined;
    } | {
        success: boolean;
    }>;
    private testFacebookPixel;
    private testTiktokPixel;
}
