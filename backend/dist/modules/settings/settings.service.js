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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCurrencies(userId, workspaceId) {
        return this.prisma.currency.findMany({
            where: { workspaceId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCurrency(userId, workspaceId, dto) {
        const existing = await this.prisma.currency.findFirst({
            where: {
                workspaceId,
                code: dto.code.toUpperCase(),
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Currency with code ${dto.code} already exists`);
        }
        return this.prisma.currency.create({
            data: {
                workspaceId,
                code: dto.code.toUpperCase(),
                name: dto.name,
                nameAr: dto.nameAr,
                symbol: dto.symbol,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async updateCurrency(userId, workspaceId, currencyId, dto) {
        const currency = await this.prisma.currency.findFirst({
            where: {
                id: currencyId,
                workspaceId,
            },
        });
        if (!currency) {
            throw new common_1.NotFoundException('Currency not found');
        }
        return this.prisma.currency.update({
            where: { id: currencyId },
            data: dto,
        });
    }
    async deleteCurrency(userId, workspaceId, currencyId) {
        const currency = await this.prisma.currency.findFirst({
            where: {
                id: currencyId,
                workspaceId,
            },
        });
        if (!currency) {
            throw new common_1.NotFoundException('Currency not found');
        }
        await this.prisma.currency.delete({
            where: { id: currencyId },
        });
        return { message: 'Currency deleted successfully' };
    }
    async getStoreCurrencies(userId, workspaceId, storeId) {
        const store = await this.prisma.store.findFirst({
            where: {
                id: storeId,
                workspaceId,
            },
            select: {
                id: true,
                currency: true,
                enabledCurrencies: true,
                autoConvert: true,
                exchangeRates: true,
                ratesUpdatedAt: true,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const workspaceCurrencies = await this.getAllCurrencies(userId, workspaceId);
        return {
            defaultCurrency: store.currency,
            enabledCurrencies: store.enabledCurrencies || [store.currency],
            autoConvert: store.autoConvert,
            exchangeRates: store.exchangeRates || {},
            ratesUpdatedAt: store.ratesUpdatedAt,
            availableCurrencies: workspaceCurrencies,
        };
    }
    async updateStoreCurrencies(userId, workspaceId, storeId, dto) {
        const store = await this.prisma.store.findFirst({
            where: {
                id: storeId,
                workspaceId,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const workspaceCurrencies = await this.getAllCurrencies(userId, workspaceId);
        const validCodes = workspaceCurrencies.map((c) => c.code);
        if (dto.defaultCurrency && !validCodes.includes(dto.defaultCurrency)) {
            throw new common_1.NotFoundException(`Invalid currency code: ${dto.defaultCurrency}`);
        }
        if (dto.enabledCurrencies) {
            for (const code of dto.enabledCurrencies) {
                if (!validCodes.includes(code)) {
                    throw new common_1.NotFoundException(`Invalid currency code: ${code}`);
                }
            }
        }
        let enabledCurrencies = dto.enabledCurrencies;
        if (enabledCurrencies && dto.defaultCurrency && !enabledCurrencies.includes(dto.defaultCurrency)) {
            enabledCurrencies = [dto.defaultCurrency, ...enabledCurrencies];
        }
        const updatedStore = await this.prisma.store.update({
            where: { id: storeId },
            data: {
                currency: dto.defaultCurrency,
                enabledCurrencies: enabledCurrencies,
                autoConvert: dto.autoConvert,
                exchangeRates: dto.exchangeRates,
                ratesUpdatedAt: dto.exchangeRates ? new Date() : undefined,
            },
            select: {
                id: true,
                currency: true,
                enabledCurrencies: true,
                autoConvert: true,
                exchangeRates: true,
                ratesUpdatedAt: true,
            },
        });
        return {
            defaultCurrency: updatedStore.currency,
            enabledCurrencies: updatedStore.enabledCurrencies || [updatedStore.currency],
            autoConvert: updatedStore.autoConvert,
            exchangeRates: updatedStore.exchangeRates || {},
            ratesUpdatedAt: updatedStore.ratesUpdatedAt,
            availableCurrencies: workspaceCurrencies,
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map