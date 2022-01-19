import { ContextDataDaily, ContextDataHourly } from "./DataProvider";
import { DailyMetricsData, HourlyMetricsData } from "../api/canistergeek.did";
export declare type LatestSignificantHourlyValue = {
    value: number;
    metricIntervalIndex: number;
};
export declare const DataProviderUtils: {
    getHourlyValueForCurrentTime: (values?: Array<bigint>) => number;
    getLatestSignificantHourlyValue: (values?: Array<bigint>, startMetricIntervalIndex?: number) => LatestSignificantHourlyValue | undefined;
    getDataHourlyMetrics: (dataHourly: ContextDataHourly, canisterId: string) => Array<HourlyMetricsData> | undefined;
    getDataDailyMetrics: (dataDaily: ContextDataDaily, canisterId: string) => Array<DailyMetricsData> | undefined;
    getDataHourlyLatestMetrics: (dataHourly: ContextDataHourly, canisterId: string) => HourlyMetricsData | undefined;
    getDataDailyLatestMetrics: (dataDaily: ContextDataDaily, canisterId: string) => DailyMetricsData | undefined;
};
