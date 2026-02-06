"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PixelsService = class PixelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPixels(storeId, workspaceId) {
        const store = await this.prisma.store.findFirst({
            where: {
                id: storeId,
                workspaceId,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
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
    async updatePixels(storeId, workspaceId, dto) {
        const store = await this.prisma.store.findFirst({
            where: {
                id: storeId,
                workspaceId,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
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
    async testPixel(storeId, workspaceId, pixelType) {
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
    async testFacebookPixel(pixelId, accessToken) {
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
            const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}?access_token=${accessToken}`);
            const data = await response.json();
            if (data.error) {
                return { success: false, error: data.error.message };
            }
            return { success: true, pixelName: data.name };
        }
        catch (error) {
            return { success: false, error: 'Failed to connect to Facebook API' };
        }
    }
    async testTiktokPixel(pixelId, accessToken) {
        if (!pixelId) {
            return { success: false, error: 'TikTok Pixel ID not configured' };
        }
        if (!accessToken) {
            return {
                success: true,
                warning: 'Pixel ID configured but Access Token missing for Events API'
            };
        }
        return { success: true, message: 'TikTok pixel configured' };
    }
};
exports.PixelsService = PixelsService;
exports.PixelsService = PixelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PixelsService);
//# sourceMappingURL=pixels.service.js.map