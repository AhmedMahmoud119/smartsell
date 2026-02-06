import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // ==================== CURRENCIES CRUD ====================

  // Get all currencies for workspace
  async getAllCurrencies(userId: string, workspaceId: string) {
    return this.prisma.currency.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Create currency
  async createCurrency(userId: string, workspaceId: string, dto: CreateCurrencyDto) {
    // Check if currency code already exists for this workspace
    const existing = await this.prisma.currency.findFirst({
      where: {
        workspaceId,
        code: dto.code.toUpperCase(),
      },
    });

    if (existing) {
      throw new BadRequestException(`Currency with code ${dto.code} already exists`);
    }

    return this.prisma.currency.create({
      data: {
        workspaceId,
        code: dto.code.toUpperCase(),
        name: dto.name,
        symbol: dto.symbol,
        isActive: dto.isActive ?? true,
      },
    });
  }

  // Update currency
  async updateCurrency(
    userId: string,
    workspaceId: string,
    currencyId: string,
    dto: UpdateCurrencyDto,
  ) {
    // Verify currency belongs to workspace
    const currency = await this.prisma.currency.findFirst({
      where: {
        id: currencyId,
        workspaceId,
      },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.currency.update({
      where: { id: currencyId },
      data: dto,
    });
  }

  // Delete currency
  async deleteCurrency(userId: string, workspaceId: string, currencyId: string) {
    // Verify currency belongs to workspace
    const currency = await this.prisma.currency.findFirst({
      where: {
        id: currencyId,
        workspaceId,
      },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    await this.prisma.currency.delete({
      where: { id: currencyId },
    });

    return { message: 'Currency deleted successfully' };
  }

  // ==================== STORE CURRENCIES ====================

  // Get store currencies settings
  async getStoreCurrencies(userId: string, workspaceId: string, storeId: string) {
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
      throw new NotFoundException('Store not found');
    }

    // Get workspace currencies
    const workspaceCurrencies = await this.getAllCurrencies(userId, workspaceId);

    return {
      defaultCurrency: store.currency,
      enabledCurrencies: (store.enabledCurrencies as string[]) || [store.currency],
      autoConvert: store.autoConvert,
      exchangeRates: store.exchangeRates || {},
      ratesUpdatedAt: store.ratesUpdatedAt,
      availableCurrencies: workspaceCurrencies,
    };
  }

  // Update store currencies settings
  async updateStoreCurrencies(
    userId: string,
    workspaceId: string,
    storeId: string,
    dto: UpdateCurrenciesDto,
  ) {
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

    // Get workspace currencies to validate
    const workspaceCurrencies = await this.getAllCurrencies(userId, workspaceId);
    const validCodes = workspaceCurrencies.map((c) => c.code);

    if (dto.defaultCurrency && !validCodes.includes(dto.defaultCurrency)) {
      throw new NotFoundException(`Invalid currency code: ${dto.defaultCurrency}`);
    }

    if (dto.enabledCurrencies) {
      for (const code of dto.enabledCurrencies) {
        if (!validCodes.includes(code)) {
          throw new NotFoundException(`Invalid currency code: ${code}`);
        }
      }
    }

    // Ensure default currency is in enabled currencies
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
      enabledCurrencies: (updatedStore.enabledCurrencies as string[]) || [updatedStore.currency],
      autoConvert: updatedStore.autoConvert,
      exchangeRates: updatedStore.exchangeRates || {},
      ratesUpdatedAt: updatedStore.ratesUpdatedAt,
      availableCurrencies: workspaceCurrencies,
    };
  }
}
