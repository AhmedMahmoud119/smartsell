import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCurrencies(userId: string, workspaceId: string): Promise<{
        symbol: string;
        id: string;
        workspaceId: string;
        code: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCurrency(userId: string, workspaceId: string, dto: CreateCurrencyDto): Promise<{
        symbol: string;
        id: string;
        workspaceId: string;
        code: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCurrency(userId: string, workspaceId: string, currencyId: string, dto: UpdateCurrencyDto): Promise<{
        symbol: string;
        id: string;
        workspaceId: string;
        code: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCurrency(userId: string, workspaceId: string, currencyId: string): Promise<{
        message: string;
    }>;
    getStoreCurrencies(userId: string, workspaceId: string, storeId: string): Promise<{
        defaultCurrency: string;
        enabledCurrencies: string[];
        autoConvert: boolean;
        exchangeRates: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        ratesUpdatedAt: Date;
        availableCurrencies: {
            symbol: string;
            id: string;
            workspaceId: string;
            code: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    updateStoreCurrencies(userId: string, workspaceId: string, storeId: string, dto: UpdateCurrenciesDto): Promise<{
        defaultCurrency: string;
        enabledCurrencies: string[];
        autoConvert: boolean;
        exchangeRates: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        ratesUpdatedAt: Date;
        availableCurrencies: {
            symbol: string;
            id: string;
            workspaceId: string;
            code: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
