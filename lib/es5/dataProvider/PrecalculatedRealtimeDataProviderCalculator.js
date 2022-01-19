"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecalculatedRealtimeDataProviderCalculator = void 0;
const lodash_1 = __importDefault(require("lodash"));
const DateUtils_1 = require("./DateUtils");
const DataProviderUtils_1 = require("../dataProvider/DataProviderUtils");
const Constants_1 = require("./Constants");
const PrecalculatedDataProviderUtils_1 = require("./PrecalculatedDataProviderUtils");
const getUpdateCallsMetricWrapperFromHourlyMetricsData = (data) => {
    if (data) {
        const today_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(DateUtils_1.DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds;
        let value = DataProviderUtils_1.DataProviderUtils.getHourlyValueForCurrentTime(data.updateCalls);
        let outdatedContext = undefined;
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(data.updateCalls, isToday ? DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value;
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (Constants_1.GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                };
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils_1.PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value);
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: undefined,
            metricsThresholds: undefined,
            outdatedContext: outdatedContext
        };
    }
};
const getCyclesMetricWrapperFromHourlyMetricsData = (data, configuration) => {
    var _a, _b, _c, _d;
    if (data) {
        const today_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(DateUtils_1.DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds;
        const thresholds = (_b = (_a = configuration.metrics) === null || _a === void 0 ? void 0 : _a.cycles) === null || _b === void 0 ? void 0 : _b.thresholds;
        let value = DataProviderUtils_1.DataProviderUtils.getHourlyValueForCurrentTime(data.canisterCycles);
        let outdatedContext = undefined;
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(data.canisterCycles, isToday ? DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value;
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (Constants_1.GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                };
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils_1.PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, (_d = (_c = configuration.metrics) === null || _c === void 0 ? void 0 : _c.cycles) === null || _d === void 0 ? void 0 : _d.metricsFormat);
        let colorHex = undefined;
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = (thresholds.steps)[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex;
                        break;
                    }
                }
            }
            if (!colorHex) {
                colorHex = thresholds.base.colorHex;
            }
        }
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: colorHex,
            metricsThresholds: thresholds,
            outdatedContext: outdatedContext
        };
    }
};
const getMemoryMetricWrapperFromHourlyMetricsData = (data, configuration) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (data) {
        const today_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(DateUtils_1.DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds;
        const thresholds = (_b = (_a = configuration.metrics) === null || _a === void 0 ? void 0 : _a.memory) === null || _b === void 0 ? void 0 : _b.thresholds;
        let value = DataProviderUtils_1.DataProviderUtils.getHourlyValueForCurrentTime(data.canisterMemorySize);
        let outdatedContext = undefined;
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(data.canisterMemorySize, isToday ? DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value;
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (Constants_1.GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                };
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils_1.PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, (_d = (_c = configuration.metrics) === null || _c === void 0 ? void 0 : _c.memory) === null || _d === void 0 ? void 0 : _d.metricsFormat);
        let colorHex = undefined;
        let percentFromMax = undefined;
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = thresholds.steps[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex;
                        break;
                    }
                }
            }
            if (!colorHex) {
                if (value > 0) {
                    colorHex = thresholds.base.colorHex;
                }
                else {
                    colorHex = Constants_1.COLOR_GRAY_HEX;
                }
            }
        }
        const limitations = (_g = (_f = (_e = configuration.metrics) === null || _e === void 0 ? void 0 : _e.memory) === null || _f === void 0 ? void 0 : _f.limitations) === null || _g === void 0 ? void 0 : _g.hourly;
        if (limitations === null || limitations === void 0 ? void 0 : limitations.maxValue) {
            percentFromMax = (value / limitations.maxValue) * 100;
            if (value > 0 && limitations.percentFromMaxMinValue) {
                if (percentFromMax < limitations.percentFromMaxMinValue) {
                    percentFromMax = limitations.percentFromMaxMinValue;
                }
            }
        }
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: colorHex,
            percentFromMax: percentFromMax,
            metricsThresholds: thresholds,
            outdatedContext: outdatedContext
        };
    }
};
const getHeapMemoryMetricWrapperFromHourlyMetricsData = (data, configuration) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (data) {
        const today_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(DateUtils_1.DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds;
        const thresholds = (_b = (_a = configuration.metrics) === null || _a === void 0 ? void 0 : _a.heapMemory) === null || _b === void 0 ? void 0 : _b.thresholds;
        let value = DataProviderUtils_1.DataProviderUtils.getHourlyValueForCurrentTime(data.canisterHeapMemorySize);
        let outdatedContext = undefined;
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(data.canisterHeapMemorySize, isToday ? DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value;
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (Constants_1.GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                };
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils_1.PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, (_d = (_c = configuration.metrics) === null || _c === void 0 ? void 0 : _c.heapMemory) === null || _d === void 0 ? void 0 : _d.metricsFormat);
        let colorHex = undefined;
        let percentFromMax = undefined;
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = thresholds.steps[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex;
                        break;
                    }
                }
            }
            if (!colorHex) {
                if (value > 0) {
                    colorHex = thresholds.base.colorHex;
                }
                else {
                    colorHex = Constants_1.COLOR_GRAY_HEX;
                }
            }
        }
        const limitations = (_g = (_f = (_e = configuration.metrics) === null || _e === void 0 ? void 0 : _e.heapMemory) === null || _f === void 0 ? void 0 : _f.limitations) === null || _g === void 0 ? void 0 : _g.hourly;
        if (limitations === null || limitations === void 0 ? void 0 : limitations.maxValue) {
            percentFromMax = (value / limitations.maxValue) * 100;
            if (value > 0 && limitations.percentFromMaxMinValue) {
                if (percentFromMax < limitations.percentFromMaxMinValue) {
                    percentFromMax = limitations.percentFromMaxMinValue;
                }
            }
        }
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: colorHex,
            percentFromMax: percentFromMax,
            metricsThresholds: thresholds,
            outdatedContext: outdatedContext
        };
    }
};
const getMetricWrapperFromValue = (value = 0, metricsFormat, thresholds) => {
    const valueNumber = value == undefined ? 0 : Number(value);
    const valueFormatted = PrecalculatedDataProviderUtils_1.PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(valueNumber, metricsFormat);
    let colorHex = undefined;
    if (thresholds) {
        if (thresholds.steps) {
            for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                const step = (thresholds.steps)[i];
                if (valueNumber >= step.value) {
                    colorHex = step.colorHex;
                    break;
                }
            }
        }
        if (!colorHex) {
            colorHex = thresholds.base.colorHex;
        }
    }
    return {
        value: valueNumber,
        hasValue: valueNumber > 0,
        label: valueFormatted,
        colorHex: colorHex,
        metricsThresholds: thresholds,
        outdatedContext: undefined
    };
};
const getPrecalculatedData = (dataHourly, configuration) => {
    return lodash_1.default.mapKeys(lodash_1.default.compact(lodash_1.default.map(dataHourly, (hourlyMetricsData, canisterId) => {
        const data = lodash_1.default.last(hourlyMetricsData);
        if (data) {
            //Cycles
            const cyclesMetricWrapper = getCyclesMetricWrapperFromHourlyMetricsData(data, configuration);
            //Memory
            const memoryMetricWrapper = getMemoryMetricWrapperFromHourlyMetricsData(data, configuration);
            //Heap Memory
            const heapMemoryMetricWrapper = getHeapMemoryMetricWrapperFromHourlyMetricsData(data, configuration);
            const canisterPrecalculatedData = {
                canisterId: canisterId,
                cycles: cyclesMetricWrapper,
                memory: memoryMetricWrapper,
                heapMemory: heapMemoryMetricWrapper,
            };
            return canisterPrecalculatedData;
        }
    })), v => v.canisterId);
};
exports.PrecalculatedRealtimeDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
    getUpdateCallsMetricWrapperFromHourlyMetricsData: getUpdateCallsMetricWrapperFromHourlyMetricsData,
    getCyclesMetricWrapperFromHourlyMetricsData: getCyclesMetricWrapperFromHourlyMetricsData,
    getMemoryMetricWrapperFromHourlyMetricsData: getMemoryMetricWrapperFromHourlyMetricsData,
    getHeapMemoryMetricWrapperFromHourlyMetricsData: getHeapMemoryMetricWrapperFromHourlyMetricsData,
    getMetricWrapperFromValue: getMetricWrapperFromValue,
};
//# sourceMappingURL=PrecalculatedRealtimeDataProviderCalculator.js.map