import { PropsWithChildren } from "react";
import { _SERVICE as CanistergeekService, CanisterLogRequest, CanisterLogResponse, CanisterMetrics, CollectMetricsRequestType, DailyMetricsData, GetMetricsParameters, HourlyMetricsData } from "../api/canistergeek.did";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { CanisterId } from "./ConfigurationProvider";
import { KeysOfUnion } from "../util/typescriptAddons";
import { CGErrorByKey, CGStatusByKey, CreateActorFn } from "./Commons";
import { InfoData } from "./LogMessagesDataProvider";
declare type Granularity = "hourly" | "daily";
export declare type GetCanisterMetricsSource = "canister" | "blackhole";
declare type GetCanisterMetricsFnParamsCommon<S extends GetCanisterMetricsSource = GetCanisterMetricsSource> = {
    canisterId: string;
    source: S;
};
export declare type GetCanisterMetricsFnParamsCanister = GetCanisterMetricsFnParamsCommon<"canister"> & {
    fromMillisUTC: bigint;
    toMillisUTC: bigint;
    granularity: Granularity;
};
export declare type GetCanisterMetricsFnParamsBlackhole = GetCanisterMetricsFnParamsCommon<"blackhole"> & {};
export declare type GetCanisterMetricsFnParams = GetCanisterMetricsFnParamsCanister | GetCanisterMetricsFnParamsBlackhole;
declare type GetCanisterMetricsFn = (params: Array<GetCanisterMetricsFnParams>) => void;
declare type CollectCanisterMetricsFnParams = {
    canisterIds: Array<string>;
    collectMetricsType?: KeysOfUnion<CollectMetricsRequestType>;
};
declare type CollectCanisterMetricsFn = (params: CollectCanisterMetricsFnParams) => Promise<any>;
export declare type CanisterBlackholeData = {
    cycles: bigint;
    memory_size: bigint;
};
export declare type ContextDataHourly = {
    [key: CanisterId]: Array<HourlyMetricsData> | undefined;
};
export declare type ContextDataDaily = {
    [key: CanisterId]: Array<DailyMetricsData> | undefined;
};
export declare type ContextDataBlackhole = {
    [key: CanisterId]: CanisterBlackholeData | undefined;
};
export interface Context {
    status: CGStatusByKey;
    error: CGErrorByKey;
    dataHourly: ContextDataHourly;
    dataDaily: ContextDataDaily;
    dataBlackhole: ContextDataBlackhole;
    getCanisterMetrics: GetCanisterMetricsFn;
    collectCanisterMetrics: CollectCanisterMetricsFn;
}
export declare const useDataContext: () => Context;
declare type Props = {
    identity?: Identity;
    host?: string;
    createActorFn: CreateActorFn;
};
export declare const DataProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export declare const CanistergeekAPIHelper: {
    getCanisterMetrics: (canisterActor: ActorSubclass<CanistergeekService>, parameters: GetMetricsParameters) => Promise<[] | [CanisterMetrics]>;
    collectCanisterMetrics: (canisterActor: ActorSubclass<CanistergeekService>, collectMetricsType: KeysOfUnion<CollectMetricsRequestType>) => Promise<undefined>;
    getCanisterLogMessagesInfo: (canisterId: CanisterId, createActorFn: CreateActorFn, identity?: Identity, host?: string) => Promise<InfoData | undefined>;
    getCanisterLogResponse: (canisterActor: ActorSubclass<CanistergeekService>, logRequest: CanisterLogRequest) => Promise<CanisterLogResponse | undefined>;
};
export {};
