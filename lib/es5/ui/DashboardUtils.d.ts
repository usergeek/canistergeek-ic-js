import { GetCanisterMetricsFnParams, GetCanisterMetricsSource } from "../dataProvider/DataProvider";
import { Canister } from "../dataProvider/ConfigurationProvider";
export declare const DashboardUtils: {
    getSummaryPageParams: (canisters: Array<Canister>) => Array<GetCanisterMetricsFnParams>;
    getCanisterPageParams: (canisterId: string, metricsSource?: Array<GetCanisterMetricsSource>) => Array<GetCanisterMetricsFnParams>;
    isMetricsSourceCanister: (metricsSource?: Array<GetCanisterMetricsSource>) => boolean;
    isMetricsSourceBlackhole: (metricsSource?: Array<GetCanisterMetricsSource>) => boolean;
};
