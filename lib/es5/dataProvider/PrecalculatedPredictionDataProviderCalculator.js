"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecalculatedPredictionDataProviderCalculator = void 0;
const DataProviderUtils_1 = require("../dataProvider/DataProviderUtils");
const DateUtils_1 = require("./DateUtils");
const Constants_1 = require("./Constants");
const lodash_1 = __importDefault(require("lodash"));
const React = __importStar(require("react"));
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const getPercentFromMax = (value, base, minPercentValue = 5) => {
    const percent = Math.floor(100 * value / base);
    return Math.max(minPercentValue, Math.min(99, percent));
};
const getMetricWrapper = (params) => {
    const valueDifference = params.valueDifference * params.valueDifferenceMultiplier;
    if (valueDifference > 0) {
        const analyzedIntervalDateDiff = params.dateData.difference;
        const differenceInHours = analyzedIntervalDateDiff.days * 24 + analyzedIntervalDateDiff.hours;
        const perHour = valueDifference / differenceInHours;
        const hoursLeft = params.base / perHour;
        const predictedIntervalDateDiff = DateUtils_1.DateUtils.Diff.getDifferenceBetweenToMillis(DateUtils_1.DateUtils.nowTimeUTC(), DateUtils_1.DateUtils.nowTimeUTC() + (hoursLeft * Constants_1.HOUR_MILLIS));
        const label = predictedIntervalDateDiff.days > 0 ?
            `${CalculationUtils_1.CalculationUtils.formatNumericValue(predictedIntervalDateDiff.days)} days`
            :
                `${CalculationUtils_1.CalculationUtils.formatNumericValue(predictedIntervalDateDiff.hours)} hours`;
        let colorHex = undefined;
        let percentFromMax = undefined;
        const predictionThresholds = params.predictionThresholds;
        if (predictionThresholds) {
            if (predictionThresholds.steps && predictionThresholds.steps.length > 0) {
                const maxStepValue = predictionThresholds.steps[predictionThresholds.steps.length - 1].value;
                for (let i = predictionThresholds.steps.length - 1; i >= 0; i--) {
                    const step = predictionThresholds.steps[i];
                    if (predictedIntervalDateDiff.days >= step.value) {
                        colorHex = step.colorHex;
                        percentFromMax = getPercentFromMax(predictedIntervalDateDiff.days, maxStepValue, params.minPercentValue);
                        break;
                    }
                }
                if (percentFromMax == undefined) {
                    percentFromMax = getPercentFromMax(predictedIntervalDateDiff.days, maxStepValue);
                }
            }
            if (!colorHex) {
                colorHex = predictionThresholds.base.colorHex;
            }
        }
        return {
            value: hoursLeft,
            hasValue: true,
            label: React.createElement(React.Fragment, null, label),
            outdatedContext: undefined,
            percentFromMax: percentFromMax,
            colorHex: colorHex,
            metricsThresholds: predictionThresholds
        };
    }
    return {
        value: 0,
        hasValue: false,
        label: Constants_1.NO_OBJECT_VALUE_LABEL,
        outdatedContext: undefined,
        percentFromMax: undefined,
        colorHex: Constants_1.COLOR_GRAY_HEX,
        metricsThresholds: params.predictionThresholds
    };
};
const getPairOfDataPoints = (hourlyMetricsData, predictionInterval, metricIntervalIndexForCurrentTime) => {
    let fromPoint = undefined;
    let toPoint = undefined;
    const nowTimeUTC = DateUtils_1.DateUtils.nowTimeUTC();
    const today_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(nowTimeUTC);
    for (let dayDataIndex = hourlyMetricsData.length - 1; dayDataIndex >= 0; dayDataIndex--) {
        const dataHourlyMetricElement = hourlyMetricsData[dayDataIndex];
        const dataHourlyMetricElementTimeMillis = Number(dataHourlyMetricElement.timeMillis);
        const isToday = dataHourlyMetricElementTimeMillis == today_startOfDayMilliseconds;
        if (!toPoint) {
            const startMetricIntervalIndex = isToday ? metricIntervalIndexForCurrentTime : undefined;
            const toSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
            if (toSignificantHourlyValue) {
                const pointMillis = dataHourlyMetricElementTimeMillis + (toSignificantHourlyValue.metricIntervalIndex * Constants_1.GRANULARITY_SECONDS * 1000);
                const cycles = toSignificantHourlyValue.value;
                const memory = Number(dataHourlyMetricElement.canisterMemorySize[toSignificantHourlyValue.metricIntervalIndex]);
                toPoint = {
                    value: toSignificantHourlyValue,
                    dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                    startMetricIntervalIndex: toSignificantHourlyValue.metricIntervalIndex,
                    pointMillis: pointMillis,
                    cycles: cycles,
                    memory: memory,
                };
            }
        }
        switch (predictionInterval) {
            case "hour": {
                if (toPoint && !fromPoint) {
                    const numberOfGranularityIntervalsInOneHour = 60 * 60 / Constants_1.GRANULARITY_SECONDS;
                    let startMetricIntervalIndex = -1;
                    if (toPoint.dataHourlyMetricMillis == dataHourlyMetricElementTimeMillis) {
                        startMetricIntervalIndex = toPoint.startMetricIntervalIndex - numberOfGranularityIntervalsInOneHour + 1;
                    }
                    else {
                        startMetricIntervalIndex = dataHourlyMetricElement.canisterCycles.length - 1;
                        const differenceInDays = Math.floor((toPoint.pointMillis - dataHourlyMetricElementTimeMillis) / Constants_1.DAY_MILLIS);
                        if (differenceInDays == 1) {
                            if (toPoint.startMetricIntervalIndex < numberOfGranularityIntervalsInOneHour - 1) {
                                startMetricIntervalIndex += toPoint.startMetricIntervalIndex + 2 - numberOfGranularityIntervalsInOneHour;
                            }
                        }
                    }
                    const fromSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
                    if (fromSignificantHourlyValue) {
                        const pointMillis = dataHourlyMetricElementTimeMillis + (fromSignificantHourlyValue.metricIntervalIndex * Constants_1.GRANULARITY_SECONDS * 1000);
                        const cycles = fromSignificantHourlyValue.value;
                        const memory = Number(dataHourlyMetricElement.canisterMemorySize[fromSignificantHourlyValue.metricIntervalIndex]);
                        fromPoint = {
                            value: fromSignificantHourlyValue,
                            dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                            startMetricIntervalIndex: fromSignificantHourlyValue.metricIntervalIndex,
                            pointMillis: pointMillis,
                            cycles: cycles,
                            memory: memory,
                        };
                    }
                }
                break;
            }
            case "day": {
                if (!isToday && toPoint != undefined && fromPoint == undefined) {
                    const differenceInDays = Math.floor((toPoint.pointMillis - dataHourlyMetricElementTimeMillis) / Constants_1.DAY_MILLIS);
                    if (differenceInDays > 0) {
                        const startMetricIntervalIndex = differenceInDays == 1 ? toPoint.startMetricIntervalIndex + 1 : undefined;
                        const fromSignificantHourlyValue = DataProviderUtils_1.DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
                        if (fromSignificantHourlyValue) {
                            const pointMillis = dataHourlyMetricElementTimeMillis + (fromSignificantHourlyValue.metricIntervalIndex * Constants_1.GRANULARITY_SECONDS * 1000);
                            const cycles = fromSignificantHourlyValue.value;
                            const memory = Number(dataHourlyMetricElement.canisterMemorySize[fromSignificantHourlyValue.metricIntervalIndex]);
                            fromPoint = {
                                value: fromSignificantHourlyValue,
                                dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                                startMetricIntervalIndex: fromSignificantHourlyValue.metricIntervalIndex,
                                pointMillis: pointMillis,
                                cycles: cycles,
                                memory: memory,
                            };
                        }
                    }
                }
                break;
            }
        }
        if (fromPoint != undefined && toPoint != undefined) {
            if (fromPoint.pointMillis < toPoint.pointMillis) {
                return [fromPoint, toPoint];
            }
        }
    }
};
const getPredictionMetricsData = (hourlyMetricsData, predictionInterval, metricIntervalIndexForCurrentTime, configurationMetrics) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const points = getPairOfDataPoints(hourlyMetricsData, predictionInterval, metricIntervalIndexForCurrentTime);
    if (points) {
        const [fromPoint, toPoint] = points;
        const cyclesDifference = toPoint.cycles - fromPoint.cycles;
        const memoryDifference = toPoint.memory - fromPoint.memory;
        let fromMillis = fromPoint.pointMillis;
        let toMillis = toPoint.pointMillis + (Constants_1.GRANULARITY_SECONDS * 1000);
        let dateDifference = DateUtils_1.DateUtils.Diff.getDifferenceBetweenToMillis(fromMillis, toMillis);
        const dateData = {
            fromMillis: fromMillis,
            toMillis: toMillis,
            difference: dateDifference
        };
        const cyclesValueData = {
            lastValue: toPoint.cycles,
            difference: cyclesDifference
        };
        const memoryValueData = {
            lastValue: toPoint.memory,
            difference: memoryDifference
        };
        return {
            cycles: {
                predictionInterval: predictionInterval,
                date: dateData,
                data: cyclesValueData,
                metricWrapper: getMetricWrapper({
                    ctx: "cycles",
                    base: cyclesValueData.lastValue,
                    valueDifference: cyclesValueData.difference,
                    dateData: dateData,
                    valueDifferenceMultiplier: -1,
                    predictionThresholds: (_a = configurationMetrics === null || configurationMetrics === void 0 ? void 0 : configurationMetrics.cycles) === null || _a === void 0 ? void 0 : _a.predictionThresholds
                })
            },
            memory: {
                predictionInterval: predictionInterval,
                date: dateData,
                data: memoryValueData,
                metricWrapper: getMetricWrapper({
                    ctx: "memory",
                    base: ((_d = (_c = (_b = configurationMetrics === null || configurationMetrics === void 0 ? void 0 : configurationMetrics.memory) === null || _b === void 0 ? void 0 : _b.limitations) === null || _c === void 0 ? void 0 : _c.hourly) === null || _d === void 0 ? void 0 : _d.maxValue) || Constants_1.MEMORY_MAX_PER_CANISTER,
                    valueDifference: memoryValueData.difference,
                    dateData: dateData,
                    valueDifferenceMultiplier: 1,
                    predictionThresholds: (_e = configurationMetrics === null || configurationMetrics === void 0 ? void 0 : configurationMetrics.memory) === null || _e === void 0 ? void 0 : _e.predictionThresholds,
                    minPercentValue: (_h = (_g = (_f = configurationMetrics === null || configurationMetrics === void 0 ? void 0 : configurationMetrics.memory) === null || _f === void 0 ? void 0 : _f.limitations) === null || _g === void 0 ? void 0 : _g.hourly) === null || _h === void 0 ? void 0 : _h.percentFromMaxMinValue
                })
            }
        };
    }
    return undefined;
};
const getPrecalculatedData = (dataHourly, configuration) => {
    return lodash_1.default.mapKeys(lodash_1.default.compact(lodash_1.default.map(dataHourly, (hourlyMetricsData, canisterId) => {
        if (hourlyMetricsData.length > 0) {
            const metricIntervalIndexForCurrentTime = DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime();
            //let's get cycle and memory differences with "day" interval (more precise prediction)
            const predictionMetricsData_day = getPredictionMetricsData(hourlyMetricsData, "day", metricIntervalIndexForCurrentTime, configuration.metrics);
            let cyclesDayGood = false;
            let cyclesMetricData = undefined;
            let memoryDayGood = false;
            let memoryMetricData = undefined;
            if (predictionMetricsData_day) {
                //first let's analyze if data is valuable for prediction:
                //1. cycles difference should be <= 0
                //1. memory difference should be >= 0
                cyclesMetricData = predictionMetricsData_day.cycles;
                if (predictionMetricsData_day.cycles.data.difference <= 0) {
                    //it is ok that cycles are the same or reduced
                    cyclesDayGood = true;
                }
                memoryMetricData = predictionMetricsData_day.memory;
                if (predictionMetricsData_day.memory.data.difference > 0) {
                    //it is ok that memory is the same or increased
                    memoryDayGood = true;
                }
            }
            if (!cyclesDayGood || !memoryDayGood) {
                //if cycles or memory is not good - lets check with "hour" interval (less precise prediction)
                const predictionMetricsData_hour = getPredictionMetricsData(hourlyMetricsData, "hour", metricIntervalIndexForCurrentTime, configuration.metrics);
                if (predictionMetricsData_hour) {
                    if (!cyclesDayGood) {
                        if (predictionMetricsData_hour.cycles.data.difference <= 0) {
                            //it is ok that cycles are the same or reduced
                            cyclesMetricData = predictionMetricsData_hour.cycles;
                        }
                    }
                    if (!memoryDayGood) {
                        if (predictionMetricsData_hour.memory.data.difference > 0) {
                            //it is ok that memory is the same or increased
                            memoryMetricData = predictionMetricsData_hour.memory;
                        }
                    }
                }
            }
            if (cyclesMetricData && memoryMetricData) {
                return {
                    canisterId: canisterId,
                    predictionData: {
                        cycles: cyclesMetricData,
                        memory: memoryMetricData
                    }
                };
            }
        }
    })), v => v.canisterId);
};
exports.PrecalculatedPredictionDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
};
//# sourceMappingURL=PrecalculatedPredictionDataProviderCalculator.js.map