import { PropsWithChildren } from "react";
import { DailyMetricsData, HourlyMetricsData } from "../api/canistergeek.did";
import { Identity } from "@dfinity/agent";
import { CanisterId } from "./ConfigurationProvider";
declare type Granularity = "hourly" | "daily";
export declare type GetCanisterMetricsFnParams = {
    canisterId: string;
    fromMillisUTC: bigint;
    toMillisUTC: bigint;
    granularity: Granularity;
};
declare type GetCanisterMetricsFn = (params: Array<GetCanisterMetricsFnParams>) => void;
declare type CollectCanisterMetricsFnParams = {
    canisterIds: Array<string>;
};
declare type CollectCanisterMetricsFn = (params: CollectCanisterMetricsFnParams) => Promise<any>;
export declare type ContextDataHourly = {
    [key: CanisterId]: Array<HourlyMetricsData>;
};
export declare type ContextDataDaily = {
    [key: CanisterId]: Array<DailyMetricsData>;
};
declare type ContentStatus = {
    inProgress: boolean;
    loaded: boolean;
};
declare type CanisterStatus = {
    [key: CanisterId]: ContentStatus;
};
declare type ContentError = {
    isError: boolean;
    error?: Error;
};
export declare type CanisterError = {
    [key: CanisterId]: ContentError;
};
export interface Context {
    status: CanisterStatus;
    error: CanisterError;
    dataHourly: ContextDataHourly;
    dataDaily: ContextDataDaily;
    getCanisterMetrics: GetCanisterMetricsFn;
    collectCanisterMetrics: CollectCanisterMetricsFn;
}
export declare const useDataContext: () => Context;
declare type Props = {
    identity?: Identity;
    host?: string;
};
export declare const DataProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export {};
