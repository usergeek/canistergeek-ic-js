import * as React from "react";
import { PropsWithChildren } from "react";
import { MetricWrapper } from "./PrecalculatedDataProvider";
import { CanisterId } from "./ConfigurationProvider";
export declare type SummaryPageRealtimeSectionData = {
    canisterId: string;
    cycles: MetricWrapper<number>;
    memory: MetricWrapper<number>;
    heapMemory: MetricWrapper<number>;
};
export declare type PrecalculatedData = {
    [key: CanisterId]: SummaryPageRealtimeSectionData;
};
export interface Context {
    precalculatedData: PrecalculatedData;
}
export declare const PrecalculatedRealtimeDataContext: React.Context<Context>;
export declare const usePrecalculatedRealtimeDataContext: () => Context;
export declare const PrecalculatedRealtimeDataProvider: (props: PropsWithChildren<any>) => JSX.Element;
