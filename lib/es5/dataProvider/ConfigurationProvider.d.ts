import * as React from "react";
import { PropsWithChildren } from "react";
export declare type CanisterId = string;
export declare type Canister = {
    canisterId: CanisterId;
    name?: string;
};
declare type ThresholdStep = {
    value: number;
    colorHex: string;
};
declare type BaseThreshold = {
    colorHex: string;
};
export declare type MetricsFormat = "none" | "memoryShort" | "cyclesShort";
export declare type MetricsThresholds = {
    mode?: "absolute";
    base: BaseThreshold;
    steps?: Array<ThresholdStep>;
};
declare type ConfigurationMetricsCycles = {
    metricsFormat?: MetricsFormat;
    thresholds?: MetricsThresholds;
    predictionThresholds?: MetricsThresholds;
};
export declare type ConfigurationMetricsMemory = {
    metricsFormat?: MetricsFormat;
    thresholds?: MetricsThresholds;
    predictionThresholds?: MetricsThresholds;
    limitations?: {
        hourly?: {
            maxValue?: number;
            percentFromMaxMinValue?: number;
        };
    };
};
export declare type ConfigurationMetrics = {
    cycles?: ConfigurationMetricsCycles;
    memory?: ConfigurationMetricsMemory;
    heapMemory?: ConfigurationMetricsMemory;
};
export declare type Configuration = {
    canisters: Array<Canister>;
    metrics?: ConfigurationMetrics;
};
interface Context {
    configuration: Configuration;
}
export declare const ConfigurationContext: React.Context<Context>;
export declare const useConfigurationContext: () => Context;
declare type Props = {
    configuration?: Configuration;
};
export declare const ConfigurationProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export {};
