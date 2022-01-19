import {GetCanisterMetricsFnParams} from "../dataProvider/DataProvider";
import {DateTimeUtils} from "./DateTimeUtils";

const getCanisterMetricsHourlyDashboardParams = (canisterId: string): GetCanisterMetricsFnParams => {
    return {
        granularity: "hourly",
        canisterId: canisterId,
        fromMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(8, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    }
}

const getCanisterMetricsDailyDashboardParams = (canisterId: string): GetCanisterMetricsFnParams => {
    return {
        granularity: "daily",
        canisterId: canisterId,
        fromMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(600, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    }
}

export const DashboardUtils = {
    getCanisterMetricsHourlyDashboardParams: getCanisterMetricsHourlyDashboardParams,
    getCanisterMetricsDailyDashboardParams: getCanisterMetricsDailyDashboardParams,
}