export declare enum AnalyticsPeriod {
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}
export declare class AnalyticsQueryDto {
    storeId?: string;
    startDate?: string;
    endDate?: string;
    period?: AnalyticsPeriod;
    limit?: number;
}
