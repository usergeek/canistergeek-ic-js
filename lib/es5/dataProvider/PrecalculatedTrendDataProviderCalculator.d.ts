import { PrecalculatedData } from "./PrecalculatedTrendDataProvider";
import { HourlyMetricsData } from "../api/canistergeek.did";
import { ContextDataHourly } from "./DataProvider";
export declare type PairOfDaysDataForFull24HoursInterval = {
    from: HourlyMetricsData;
    to: HourlyMetricsData;
};
export declare const PrecalculatedTrendDataProviderCalculator: {
    getPrecalculatedData: (dataHourly: ContextDataHourly) => PrecalculatedData;
};
