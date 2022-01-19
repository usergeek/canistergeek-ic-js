import { GetCanisterMetricsFnParams } from "../dataProvider/DataProvider";
export declare const DashboardUtils: {
    getCanisterMetricsHourlyDashboardParams: (canisterId: string) => GetCanisterMetricsFnParams;
    getCanisterMetricsDailyDashboardParams: (canisterId: string) => GetCanisterMetricsFnParams;
};
