"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProviderUtils = void 0;
const DateUtils_1 = require("./DateUtils");
const getHourlyValueForCurrentTime = (values) => {
    if (values) {
        const metricIntervalIndex = DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime();
        return Number(values[metricIntervalIndex]);
    }
    return 0;
};
const getLatestSignificantHourlyValue = (values, startMetricIntervalIndex) => {
    if (values) {
        if (startMetricIntervalIndex == undefined) {
            startMetricIntervalIndex = values.length - 1;
        }
        for (let i = startMetricIntervalIndex; i >= 0; i--) {
            const value = values[i];
            if (value > 0) {
                return {
                    value: Number(value),
                    metricIntervalIndex: i
                };
            }
        }
    }
};
const getDataHourlyMetrics = (dataHourly, canisterId) => {
    const data = dataHourly[canisterId];
    if (data && data.length > 0) {
        return data;
    }
};
const getDataDailyMetrics = (dataDaily, canisterId) => {
    const data = dataDaily[canisterId];
    if (data && data.length > 0) {
        return data;
    }
};
const getDataHourlyLatestMetrics = (dataHourly, canisterId) => {
    const dataHourlyMetrics = getDataHourlyMetrics(dataHourly, canisterId);
    if (dataHourlyMetrics && dataHourlyMetrics.length > 0) {
        return dataHourlyMetrics[dataHourlyMetrics.length - 1];
    }
};
const getDataDailyLatestMetrics = (dataDaily, canisterId) => {
    const dataDailyMetrics = getDataDailyMetrics(dataDaily, canisterId);
    if (dataDailyMetrics && dataDailyMetrics.length > 0) {
        return dataDailyMetrics[dataDailyMetrics.length - 1];
    }
};
exports.DataProviderUtils = {
    getHourlyValueForCurrentTime: getHourlyValueForCurrentTime,
    getLatestSignificantHourlyValue: getLatestSignificantHourlyValue,
    getDataHourlyMetrics: getDataHourlyMetrics,
    getDataDailyMetrics: getDataDailyMetrics,
    getDataHourlyLatestMetrics: getDataHourlyLatestMetrics,
    getDataDailyLatestMetrics: getDataDailyLatestMetrics,
};
//# sourceMappingURL=DataProviderUtils.js.map