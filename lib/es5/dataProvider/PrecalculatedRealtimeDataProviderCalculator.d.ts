import { ContextDataHourly } from "./DataProvider";
import { Configuration, MetricsFormat, MetricsThresholds } from "./ConfigurationProvider";
import { MetricWrapper } from "./PrecalculatedDataProvider";
import { PrecalculatedData } from "./PrecalculatedRealtimeDataProvider";
import { HourlyMetricsData } from "../api/canistergeek.did";
export declare const PrecalculatedRealtimeDataProviderCalculator: {
    getPrecalculatedData: (dataHourly: ContextDataHourly, configuration: Configuration) => PrecalculatedData;
    getUpdateCallsMetricWrapperFromHourlyMetricsData: (data: HourlyMetricsData | undefined) => MetricWrapper<number> | undefined;
    getCyclesMetricWrapperFromHourlyMetricsData: (data: HourlyMetricsData | undefined, configuration: Configuration) => MetricWrapper<number> | undefined;
    getMemoryMetricWrapperFromHourlyMetricsData: (data: HourlyMetricsData | undefined, configuration: Configuration) => MetricWrapper<number> | undefined;
    getHeapMemoryMetricWrapperFromHourlyMetricsData: (data: HourlyMetricsData | undefined, configuration: Configuration) => MetricWrapper<number> | undefined;
    getMetricWrapperFromValue: (value: number | bigint | undefined, metricsFormat: MetricsFormat | undefined, thresholds: MetricsThresholds | undefined) => MetricWrapper<number> | undefined;
};
