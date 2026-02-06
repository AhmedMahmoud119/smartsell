export declare class UpdateCurrenciesDto {
    defaultCurrency?: string;
    enabledCurrencies?: string[];
    autoConvert?: boolean;
    exchangeRates?: Record<string, number>;
}
