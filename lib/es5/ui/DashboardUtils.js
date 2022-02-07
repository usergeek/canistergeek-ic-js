"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUtils = void 0;
const DateTimeUtils_1 = require("./DateTimeUtils");
const lodash_1 = __importDefault(require("lodash"));
const getCanisterMetricsHourlyDashboardParams = (canisterId) => {
    return {
        canisterId: canisterId,
        source: "canister",
        granularity: "hourly",
        fromMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(8, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    };
};
const getCanisterMetricsDailyDashboardParams = (canisterId) => {
    return {
        canisterId: canisterId,
        source: "canister",
        granularity: "daily",
        fromMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(600, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    };
};
const getCanisterMetricsBlackholeDashboardParams = (canisterId) => {
    return {
        canisterId: canisterId,
        source: "blackhole",
    };
};
const getSummaryPageParams = (canisters) => {
    return lodash_1.default.flatten(lodash_1.default.map(canisters, canister => {
        const result = [];
        if (isMetricsSourceCanister(canister.metricsSource)) {
            result.push(getCanisterMetricsHourlyDashboardParams(canister.canisterId));
        }
        if (isMetricsSourceBlackhole(canister.metricsSource)) {
            result.push(getCanisterMetricsBlackholeDashboardParams(canister.canisterId));
        }
        return result;
    }));
};
const getCanisterPageParams = (canisterId, metricsSource) => {
    const result = [];
    if (isMetricsSourceCanister(metricsSource)) {
        result.push(getCanisterMetricsHourlyDashboardParams(canisterId));
        result.push(getCanisterMetricsDailyDashboardParams(canisterId));
    }
    if (isMetricsSourceBlackhole(metricsSource)) {
        result.push(getCanisterMetricsBlackholeDashboardParams(canisterId));
    }
    return result;
};
const isMetricsSourceCanister = (metricsSource) => lodash_1.default.isEmpty(metricsSource) || lodash_1.default.includes(metricsSource, "canister");
const isMetricsSourceBlackhole = (metricsSource) => lodash_1.default.includes(metricsSource, "blackhole");
exports.DashboardUtils = {
    getSummaryPageParams: getSummaryPageParams,
    getCanisterPageParams: getCanisterPageParams,
    isMetricsSourceCanister: isMetricsSourceCanister,
    isMetricsSourceBlackhole: isMetricsSourceBlackhole,
};
//# sourceMappingURL=DashboardUtils.js.map