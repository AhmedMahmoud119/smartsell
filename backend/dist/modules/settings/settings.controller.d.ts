import { SettingsService } from './settings.service';
import { UpdateCurrenciesDto } from './dto/update-currencies.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAllCurrencies(req: any): Promise<{
        symbol: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        code: string;
        nameAr: string;
        isActive: boolean;
    }[]>;
    createCurrency(req: any, dto: CreateCurrencyDto): Promise<{
        symbol: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        code: string;
        nameAr: string;
        isActive: boolean;
    }>;
    updateCurrency(req: any, currencyId: string, dto: UpdateCurrencyDto): Promise<{
        symbol: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        code: string;
        nameAr: string;
        isActive: boolean;
    }>;
    deleteCurrency(req: any, currencyId: string): Promise<{
        message: string;
    }>;
    getStoreCurrencies(req: any, storeId: string): Promise<{
        defaultCurrency: string;
        enabledCurrencies: string[];
        autoConvert: boolean;
        exchangeRates: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        ratesUpdatedAt: Date;
        availableCurrencies: {
            symbol: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            code: string;
            nameAr: string;
            isActive: boolean;
        }[];
    }>;
    updateStoreCurrencies(req: any, storeId: string, dto: UpdateCurrenciesDto): Promise<{
        defaultCurrency: string;
        enabledCurrencies: string[];
        autoConvert: boolean;
        exchangeRates: string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray;
        ratesUpdatedAt: Date;
        availableCurrencies: {
            symbol: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            code: string;
            nameAr: string;
            isActive: boolean;
        }[];
    }>;
}
