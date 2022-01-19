import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, CanisterMetrics } from './canistergeek.did';
declare type Granularity = "hourly" | "daily";
declare type CanisterMetricsParams = {
    actor: ActorSubclass<_SERVICE>;
    granularity: Granularity;
    dateFromMillis: number;
    dateToMillis: number;
};
export declare const CanistergeekService: {
    createCanisterActor: (canisterId: string, identity: import("@dfinity/agent").Identity, host: string) => any;
    getCanisterMetrics: ({ actor, granularity, dateFromMillis, dateToMillis }: CanisterMetricsParams) => Promise<CanisterMetrics | undefined>;
};
export {};
