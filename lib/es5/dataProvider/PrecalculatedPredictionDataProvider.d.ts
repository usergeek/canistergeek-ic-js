import * as React from "react";
import { PropsWithChildren } from "react";
import { CanisterId } from "./ConfigurationProvider";
import { DateDifference } from "./DateUtils";
import { MetricWrapper } from "./PrecalculatedDataProvider";
export declare type PredictionInterval = "hour" | "day";
export declare type DateData = {
    fromMillis: number;
    toMillis: number;
    difference: DateDifference;
};
export declare type ValueData = {
    lastValue: number;
    difference: number;
};
export declare type MetricsData<V> = {
    predictionInterval: PredictionInterval;
    date: DateData;
    data: ValueData;
    metricWrapper?: MetricWrapper<V>;
};
export declare type PredictionMetricsData = {
    cycles: MetricsData<number>;
    memory: MetricsData<number>;
};
export declare type CanisterPredictionData = {
    canisterId: string;
    predictionData: PredictionMetricsData;
};
export declare type PrecalculatedData = {
    [key: CanisterId]: CanisterPredictionData;
};
export interface Context {
    precalculatedData: PrecalculatedData;
}
export declare const PrecalculatedPredictionDataContext: React.Context<Context>;
export declare const usePrecalculatedPredictionDataContext: () => Context;
export declare const PrecalculatedPredictionDataProvider: (props: PropsWithChildren<any>) => JSX.Element;
