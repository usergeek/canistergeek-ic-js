"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecalculatedTrendDataProviderCalculator = void 0;
const Constants_1 = require("./Constants");
const lodash_1 = __importDefault(require("lodash"));
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const DateUtils_1 = require("./DateUtils");
const getPairOfDaysDataForFull24HoursIntervalFromNow = (dataHourlyMetrics, numberOfShiftsBy24Hours) => {
    const nowTimeUTC = DateUtils_1.DateUtils.nowTimeUTC();
    const dayTo_millis = nowTimeUTC - (Constants_1.DAY_MILLIS * numberOfShiftsBy24Hours);
    const dayTo_startOfDayMilliseconds = DateUtils_1.DateUtils.getStartOfDayMilliseconds(dayTo_millis);
    let dayTo_data = dataHourlyMetrics.find(value => Number(value.timeMillis) == dayTo_startOfDayMilliseconds);
    const dayFrom_startOfDayMilliseconds = dayTo_startOfDayMilliseconds - Constants_1.DAY_MILLIS;
    let dayFrom_data = dataHourlyMetrics.find(value => Number(value.timeMillis) == dayFrom_startOfDayMilliseconds);
    if (dayTo_data || dayFrom_data) {
        if (!dayTo_data) {
            //mock dayTo_data as empty structure
            const array = new Array(Constants_1.DAY_INTERVALS_COUNT).fill(BigInt(0));
            dayTo_data = { timeMillis: BigInt(dayTo_startOfDayMilliseconds), updateCalls: array, canisterCycles: array, canisterMemorySize: array, canisterHeapMemorySize: array };
        }
        if (!dayFrom_data) {
            //mock dayFrom_data as empty structure
            const array = new Array(Constants_1.DAY_INTERVALS_COUNT).fill(BigInt(0));
            dayFrom_data = { timeMillis: BigInt(dayFrom_startOfDayMilliseconds), updateCalls: array, canisterCycles: array, canisterMemorySize: array, canisterHeapMemorySize: array };
        }
        return {
            from: dayFrom_data,
            to: dayTo_data
        };
    }
    return undefined;
};
const calculateTrendSection24HoursData = (data, metricIntervalIndex) => {
    const index = metricIntervalIndex + 1;
    const from_targetMillis = Number(data.from.timeMillis) + (index * Constants_1.GRANULARITY_SECONDS * 1000);
    const to_targetMillis = Number(data.to.timeMillis) + ((index - 1) * Constants_1.GRANULARITY_SECONDS * 1000);
    const hourlyMetricsData = {
        updateCalls: lodash_1.default.concat(lodash_1.default.slice(data.from.updateCalls, index), lodash_1.default.slice(data.to.updateCalls, 0, index)),
        canisterCycles: lodash_1.default.concat(lodash_1.default.slice(data.from.canisterCycles, index), lodash_1.default.slice(data.to.canisterCycles, 0, index)),
        canisterMemorySize: lodash_1.default.concat(lodash_1.default.slice(data.from.canisterMemorySize, index), lodash_1.default.slice(data.to.canisterMemorySize, 0, index)),
        canisterHeapMemorySize: lodash_1.default.concat(lodash_1.default.slice(data.from.canisterHeapMemorySize, index), lodash_1.default.slice(data.to.canisterHeapMemorySize, 0, index)),
        timeMillis: BigInt(0)
    };
    ////////////////////////////////////////////////
    // last24HoursTrendData
    ////////////////////////////////////////////////
    const updateCallsTotal = CalculationUtils_1.CalculationUtils.sumArray(hourlyMetricsData.updateCalls);
    const cyclesDifference = Number(CalculationUtils_1.CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterCycles));
    const cyclesDifferenceInDollars = CalculationUtils_1.CalculationUtils.recalculateCyclesToDollars(cyclesDifference);
    const memoryDifference = Number(CalculationUtils_1.CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterMemorySize));
    const heapMemoryDifference = Number(CalculationUtils_1.CalculationUtils.findDifferenceAsNumber(hourlyMetricsData.canisterHeapMemorySize));
    return {
        interval: {
            fromMillis: from_targetMillis,
            toMillis: to_targetMillis
        },
        updateCalls: updateCallsTotal,
        cyclesDifference: cyclesDifference,
        cyclesDifferenceInDollars: cyclesDifferenceInDollars,
        memoryDifference: memoryDifference,
        heapMemoryDifference: heapMemoryDifference
    };
};
const createTrendSection24HoursIntervalForDay = (startOfDayMilliseconds, metricIntervalIndex) => {
    const index = metricIntervalIndex + 1;
    const from_targetMillis = Number(startOfDayMilliseconds - Constants_1.DAY_MILLIS) + (index * Constants_1.GRANULARITY_SECONDS * 1000);
    const to_targetMillis = Number(startOfDayMilliseconds) + ((index - 1) * Constants_1.GRANULARITY_SECONDS * 1000);
    return {
        fromMillis: from_targetMillis,
        toMillis: to_targetMillis
    };
};
const getPrecalculatedData = (dataHourly) => {
    return lodash_1.default.mapKeys(lodash_1.default.compact(lodash_1.default.map(dataHourly, (hourlyMetricsData, canisterId) => {
        if (hourlyMetricsData.length > 0) {
            const metricIntervalIndexForCurrentTime = DateUtils_1.DateUtils.getMetricIntervalIndexForCurrentTime();
            const today24HoursInterval = createTrendSection24HoursIntervalForDay(DateUtils_1.DateUtils.getStartOfDayMilliseconds(DateUtils_1.DateUtils.nowTimeUTC()), metricIntervalIndexForCurrentTime);
            const full24HoursIntervalShifts = [0, 1, 2, 3, 4, 5, 6, 7];
            ////////////////////////////////////////////////
            // Shifts trend data
            ////////////////////////////////////////////////
            const create24HoursInterval = (baseInterval, numberOfShiftsBy24Hours) => {
                const shiftMillis = numberOfShiftsBy24Hours * Constants_1.DAY_MILLIS;
                return {
                    fromMillis: baseInterval.fromMillis - shiftMillis,
                    toMillis: baseInterval.toMillis - shiftMillis,
                };
            };
            const full24HoursPairDataForShifts = full24HoursIntervalShifts.map(numberOfShiftsBy24Hours => {
                return {
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    pair: getPairOfDaysDataForFull24HoursIntervalFromNow(hourlyMetricsData, numberOfShiftsBy24Hours)
                };
            });
            const updateCallsTrendSectionShiftData = [];
            const cyclesDifferenceTrendSectionShiftData = [];
            const cyclesDifferenceInDollarsTrendSectionShiftData = [];
            const memoryDifferenceTrendSectionShiftData = [];
            const heapMemoryDifferenceTrendSectionShiftData = [];
            lodash_1.default.each(full24HoursPairDataForShifts, (pairData) => {
                const numberOfShiftsBy24Hours = pairData.numberOfShiftsBy24Hours;
                const trendSection24HoursData = pairData.pair ? calculateTrendSection24HoursData(pairData.pair, metricIntervalIndexForCurrentTime) : undefined;
                const trendSection24HoursIntervalForCurrentShift = create24HoursInterval(today24HoursInterval, numberOfShiftsBy24Hours);
                updateCallsTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData === null || trendSection24HoursData === void 0 ? void 0 : trendSection24HoursData.updateCalls
                });
                cyclesDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData === null || trendSection24HoursData === void 0 ? void 0 : trendSection24HoursData.cyclesDifference
                });
                cyclesDifferenceInDollarsTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData === null || trendSection24HoursData === void 0 ? void 0 : trendSection24HoursData.cyclesDifferenceInDollars
                });
                memoryDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData === null || trendSection24HoursData === void 0 ? void 0 : trendSection24HoursData.memoryDifference
                });
                heapMemoryDifferenceTrendSectionShiftData.push({
                    interval: trendSection24HoursIntervalForCurrentShift,
                    numberOfShiftsBy24Hours: numberOfShiftsBy24Hours,
                    value: trendSection24HoursData === null || trendSection24HoursData === void 0 ? void 0 : trendSection24HoursData.heapMemoryDifference
                });
            });
            const shiftsData = {
                updateCalls: updateCallsTrendSectionShiftData,
                cycles: {
                    difference: cyclesDifferenceTrendSectionShiftData,
                    differenceInDollars: cyclesDifferenceInDollarsTrendSectionShiftData
                },
                memoryDifference: memoryDifferenceTrendSectionShiftData,
                heapMemoryDifference: heapMemoryDifferenceTrendSectionShiftData
            };
            ////////////////////////////////////////////////
            // Result
            ////////////////////////////////////////////////
            const canisterPrecalculatedData = {
                canisterId: canisterId,
                shiftsData: shiftsData,
            };
            return canisterPrecalculatedData;
        }
    })), v => v.canisterId);
};
exports.PrecalculatedTrendDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
};
//# sourceMappingURL=PrecalculatedTrendDataProviderCalculator.js.map