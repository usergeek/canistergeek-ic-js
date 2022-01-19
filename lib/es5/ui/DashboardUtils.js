"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUtils = void 0;
const DateTimeUtils_1 = require("./DateTimeUtils");
const getCanisterMetricsHourlyDashboardParams = (canisterId) => {
    return {
        granularity: "hourly",
        canisterId: canisterId,
        fromMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(8, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    };
};
const getCanisterMetricsDailyDashboardParams = (canisterId) => {
    return {
        granularity: "daily",
        canisterId: canisterId,
        fromMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().subtract(600, "days").valueOf()),
        toMillisUTC: BigInt(DateTimeUtils_1.DateTimeUtils.getMomentFromCurrentEndOfDay().valueOf())
    };
};
exports.DashboardUtils = {
    getCanisterMetricsHourlyDashboardParams: getCanisterMetricsHourlyDashboardParams,
    getCanisterMetricsDailyDashboardParams: getCanisterMetricsDailyDashboardParams,
};
//# sourceMappingURL=DashboardUtils.js.map