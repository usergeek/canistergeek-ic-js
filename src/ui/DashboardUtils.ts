import {GetCanisterMetricsFnParams, GetCanisterMetricsFnParamsBlackhole, GetCanisterMetricsFnParamsCanister, GetCanisterMetricsSource} from "../dataProvider/DataProvider";
import {DateTimeUtils} from "./DateTimeUtils";
import {Canister} from "../dataProvider/ConfigurationProvider";
import _ from "lodash"

const getCanisterMetricsHourlyDashboardParams = (canisterId: string): GetCanisterMetricsFnParamsCanister => {
    return {
        canisterId: canisterId,
        source: "canister",
        granularity: "hourly",
        fromMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(8, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    }
}

const getCanisterMetricsDailyDashboardParams = (canisterId: string): GetCanisterMetricsFnParamsCanister => {
    return {
        canisterId: canisterId,
        source: "canister",
        granularity: "daily",
        fromMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(600, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    }
}

const getCanisterMetricsBlackholeDashboardParams = (canisterId: string): GetCanisterMetricsFnParamsBlackhole => {
    return {
        canisterId: canisterId,
        source: "blackhole",
    }
}

const getSummaryPageParams = (canisters: Array<Canister>): Array<GetCanisterMetricsFnParams> => {
    return _.flatten(_.map(canisters, canister => {
        const result: Array<GetCanisterMetricsFnParams> = []
        if (isMetricsSourceCanister(canister.metricsSource)) {
            result.push(getCanisterMetricsHourlyDashboardParams(canister.canisterId))
        }
        if (isMetricsSourceBlackhole(canister.metricsSource)) {
            result.push(getCanisterMetricsBlackholeDashboardParams(canister.canisterId))
        }
        return result
    }))
}

const getCanisterPageParams = (canisterId: string, metricsSource?: Array<GetCanisterMetricsSource>): Array<GetCanisterMetricsFnParams> => {
    const result: Array<GetCanisterMetricsFnParams> = []
    if (isMetricsSourceCanister(metricsSource)) {
        result.push(getCanisterMetricsHourlyDashboardParams(canisterId))
        result.push(getCanisterMetricsDailyDashboardParams(canisterId))
    }
    if (isMetricsSourceBlackhole(metricsSource)) {
        result.push(getCanisterMetricsBlackholeDashboardParams(canisterId))
    }
    return result
}

const isMetricsSourceCanister = (metricsSource?: Array<GetCanisterMetricsSource>): boolean => _.isEmpty(metricsSource) || _.includes(metricsSource, "canister")
const isMetricsSourceBlackhole = (metricsSource?: Array<GetCanisterMetricsSource>): boolean => _.includes(metricsSource, "blackhole")

export const DashboardUtils = {
    getSummaryPageParams: getSummaryPageParams,
    getCanisterPageParams: getCanisterPageParams,
    isMetricsSourceCanister: isMetricsSourceCanister,
    isMetricsSourceBlackhole: isMetricsSourceBlackhole,
}