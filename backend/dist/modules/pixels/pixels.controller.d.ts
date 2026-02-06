import { PixelsService } from './pixels.service';
import { UpdatePixelsDto } from './dto/update-pixels.dto';
export declare class PixelsController {
    private pixelsService;
    constructor(pixelsService: PixelsService);
    getPixels(req: any, storeId: string): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePixels(req: any, storeId: string, dto: UpdatePixelsDto): Promise<{
        id: string;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    testPixel(req: any, storeId: string, pixelType: string): Promise<{
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
}
