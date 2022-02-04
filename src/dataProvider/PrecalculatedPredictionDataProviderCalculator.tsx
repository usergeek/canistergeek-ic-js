import {HourlyMetricsData} from "../api/canistergeek.did";
import {CanisterPredictionData, DateData, MetricsData, PrecalculatedData, PredictionInterval, PredictionMetricsData, ValueData} from "./PrecalculatedPredictionDataProvider";
import {DataProviderUtils, LatestSignificantHourlyValue} from "../dataProvider/DataProviderUtils";
import {DateDifference, DateUtils} from "./DateUtils";
import {COLOR_GRAY_HEX, DAY_MILLIS, GRANULARITY_SECONDS, HOUR_MILLIS, MEMORY_MAX_PER_CANISTER, NO_OBJECT_VALUE_LABEL} from "./Constants";
import {ContextDataHourly} from "./DataProvider";
import {Configuration, ConfigurationMetrics, MetricsThresholds} from "./ConfigurationProvider";
import _ from "lodash";
import {MetricWrapper} from "./PrecalculatedDataProvider";
import * as React from "react";
import {CalculationUtils} from "../dataProvider/CalculationUtils";

const getPercentFromMax = (value: number, base: number, minPercentValue: number = 5): number => {
    const percent = Math.floor(100 * value / base);
    return Math.max(minPercentValue, Math.min(99, percent))
}

type GetMetricWrapperParams = {
    base: number
    valueDifference: number
    dateData: DateData
    valueDifferenceMultiplier: 1 | -1
    predictionThresholds?: MetricsThresholds
    ctx?: string
    minPercentValue?: number
}

const getMetricWrapper = (params: GetMetricWrapperParams): MetricWrapper<number> | undefined => {
    const valueDifference = params.valueDifference * params.valueDifferenceMultiplier;
    if (valueDifference > 0) {
        const analyzedIntervalDateDiff: DateDifference = params.dateData.difference
        const differenceInHours = analyzedIntervalDateDiff.days * 24 + analyzedIntervalDateDiff.hours
        const perHour = valueDifference / differenceInHours
        const hoursLeft = params.base / perHour
        const predictedIntervalDateDiff: DateDifference = DateUtils.Diff.getDifferenceBetweenToMillis(DateUtils.nowTimeUTC(), DateUtils.nowTimeUTC() + (hoursLeft * HOUR_MILLIS))
        const label = predictedIntervalDateDiff.days > 0 ?
            `${CalculationUtils.formatNumericValue(predictedIntervalDateDiff.days)} days`
            :
            `${CalculationUtils.formatNumericValue(predictedIntervalDateDiff.hours)} hours`
        let colorHex: string | undefined = undefined
        let percentFromMax: number | undefined = undefined
        const predictionThresholds = params.predictionThresholds;
        if (predictionThresholds) {
            if (predictionThresholds.steps && predictionThresholds.steps.length > 0) {
                const maxStepValue = predictionThresholds.steps[predictionThresholds.steps.length - 1].value
                for (let i = predictionThresholds.steps.length - 1; i >= 0; i--) {
                    const step = predictionThresholds.steps[i];
                    if (predictedIntervalDateDiff.days >= step.value) {
                        colorHex = step.colorHex
                        percentFromMax = getPercentFromMax(predictedIntervalDateDiff.days, maxStepValue, params.minPercentValue)
                        break
                    }
                }
                if (percentFromMax == undefined) {
                    percentFromMax = getPercentFromMax(predictedIntervalDateDiff.days, maxStepValue)
                }
            }
            if (!colorHex) {
                colorHex = predictionThresholds.base.colorHex
            }
        }
        return {
            value: hoursLeft,
            hasValue: true,
            label: <>{label}</>,
            outdatedContext: undefined,
            percentFromMax: percentFromMax,
            colorHex: colorHex,
            metricsThresholds: predictionThresholds
        }
    }
    return {
        value: 0,
        hasValue: false,
        label: NO_OBJECT_VALUE_LABEL,
        outdatedContext: undefined,
        percentFromMax: undefined,
        colorHex: COLOR_GRAY_HEX,
        metricsThresholds: params.predictionThresholds
    }
}

type DataPoint = {
    value: LatestSignificantHourlyValue
    dataHourlyMetricMillis: number
    startMetricIntervalIndex: number
    pointMillis: number
    cycles: number
    memory: number
}

const getPairOfDataPoints = (hourlyMetricsData: Array<HourlyMetricsData>, predictionInterval: PredictionInterval, metricIntervalIndexForCurrentTime: number): [DataPoint, DataPoint] | undefined => {
    let fromPoint: DataPoint | undefined = undefined
    let toPoint: DataPoint | undefined = undefined

    const nowTimeUTC = DateUtils.nowTimeUTC();
    const today_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(nowTimeUTC);

    for (let dayDataIndex = hourlyMetricsData.length - 1; dayDataIndex >= 0; dayDataIndex--) {
        const dataHourlyMetricElement = hourlyMetricsData[dayDataIndex];
        const dataHourlyMetricElementTimeMillis = Number(dataHourlyMetricElement.timeMillis);
        const isToday = dataHourlyMetricElementTimeMillis == today_startOfDayMilliseconds

        if (!toPoint) {
            const startMetricIntervalIndex = isToday ? metricIntervalIndexForCurrentTime : undefined;
            const toSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
            if (toSignificantHourlyValue) {
                const pointMillis = dataHourlyMetricElementTimeMillis + (toSignificantHourlyValue.metricIntervalIndex * GRANULARITY_SECONDS * 1000)
                const cycles = toSignificantHourlyValue.value
                const memory = Number(dataHourlyMetricElement.canisterMemorySize[toSignificantHourlyValue.metricIntervalIndex])
                toPoint = {
                    value: toSignificantHourlyValue,
                    dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                    startMetricIntervalIndex: toSignificantHourlyValue.metricIntervalIndex,
                    pointMillis: pointMillis,
                    cycles: cycles,
                    memory: memory,
                }
            }
        }

        switch (predictionInterval) {
            case "hour": {
                if (toPoint && !fromPoint) {
                    const numberOfGranularityIntervalsInOneHour = 60 * 60 / GRANULARITY_SECONDS;
                    let startMetricIntervalIndex: number = -1
                    if (toPoint.dataHourlyMetricMillis == dataHourlyMetricElementTimeMillis) {
                        startMetricIntervalIndex = toPoint.startMetricIntervalIndex - numberOfGranularityIntervalsInOneHour + 1
                    } else {
                        startMetricIntervalIndex = dataHourlyMetricElement.canisterCycles.length - 1
                        const differenceInDays = Math.floor((toPoint.pointMillis - dataHourlyMetricElementTimeMillis) / DAY_MILLIS)
                        if (differenceInDays == 1) {
                            if (toPoint.startMetricIntervalIndex < numberOfGranularityIntervalsInOneHour - 1) {
                                startMetricIntervalIndex += toPoint.startMetricIntervalIndex + 2 - numberOfGranularityIntervalsInOneHour
                            }
                        }
                    }
                    const fromSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
                    if (fromSignificantHourlyValue) {
                        const pointMillis = dataHourlyMetricElementTimeMillis + (fromSignificantHourlyValue.metricIntervalIndex * GRANULARITY_SECONDS * 1000)
                        const cycles = fromSignificantHourlyValue.value
                        const memory = Number(dataHourlyMetricElement.canisterMemorySize[fromSignificantHourlyValue.metricIntervalIndex])
                        fromPoint = {
                            value: fromSignificantHourlyValue,
                            dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                            startMetricIntervalIndex: fromSignificantHourlyValue.metricIntervalIndex,
                            pointMillis: pointMillis,
                            cycles: cycles,
                            memory: memory,
                        }
                    }
                }
                break;
            }
            case "day": {
                if (!isToday && toPoint != undefined && fromPoint == undefined) {
                    const differenceInDays = Math.floor((toPoint.pointMillis - dataHourlyMetricElementTimeMillis) / DAY_MILLIS)
                    if (differenceInDays > 0) {
                        const startMetricIntervalIndex = differenceInDays == 1 ? toPoint.startMetricIntervalIndex + 1 : undefined;
                        const fromSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(dataHourlyMetricElement.canisterCycles, startMetricIntervalIndex);
                        if (fromSignificantHourlyValue) {
                            const pointMillis = dataHourlyMetricElementTimeMillis + (fromSignificantHourlyValue.metricIntervalIndex * GRANULARITY_SECONDS * 1000)
                            const cycles = fromSignificantHourlyValue.value
                            const memory = Number(dataHourlyMetricElement.canisterMemorySize[fromSignificantHourlyValue.metricIntervalIndex])
                            fromPoint = {
                                value: fromSignificantHourlyValue,
                                dataHourlyMetricMillis: dataHourlyMetricElementTimeMillis,
                                startMetricIntervalIndex: fromSignificantHourlyValue.metricIntervalIndex,
                                pointMillis: pointMillis,
                                cycles: cycles,
                                memory: memory,
                            }
                        }
                    }
                }
                break;
            }
        }
        if (fromPoint != undefined && toPoint != undefined) {
            if (fromPoint.pointMillis < toPoint.pointMillis) {
                return [fromPoint, toPoint]
            }
        }
    }
}

const getPredictionMetricsData = (hourlyMetricsData: Array<HourlyMetricsData>, predictionInterval: PredictionInterval, metricIntervalIndexForCurrentTime: number, configurationMetrics?: ConfigurationMetrics): PredictionMetricsData | undefined => {
    const points: [DataPoint, DataPoint] | undefined = getPairOfDataPoints(hourlyMetricsData, predictionInterval, metricIntervalIndexForCurrentTime)
    if (points) {
        const [fromPoint, toPoint] = points

        const cyclesDifference = toPoint.cycles - fromPoint.cycles;
        const memoryDifference = toPoint.memory - fromPoint.memory;

        let fromMillis = fromPoint.pointMillis;
        let toMillis = toPoint.pointMillis + (GRANULARITY_SECONDS * 1000);

        let dateDifference = DateUtils.Diff.getDifferenceBetweenToMillis(fromMillis, toMillis);

        const dateData: DateData = {
            fromMillis: fromMillis,
            toMillis: toMillis,
            difference: dateDifference
        };
        const cyclesValueData: ValueData = {
            lastValue: toPoint.cycles,
            difference: cyclesDifference
        };
        const memoryValueData: ValueData = {
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
                    predictionThresholds: configurationMetrics?.cycles?.predictionThresholds
                })
            },
            memory: {
                predictionInterval: predictionInterval,
                date: dateData,
                data: memoryValueData,
                metricWrapper: getMetricWrapper({
                    ctx: "memory",
                    base: configurationMetrics?.memory?.limitations?.hourly?.maxValue || MEMORY_MAX_PER_CANISTER,
                    valueDifference: memoryValueData.difference,
                    dateData: dateData,
                    valueDifferenceMultiplier: 1,
                    predictionThresholds: configurationMetrics?.memory?.predictionThresholds,
                    minPercentValue: configurationMetrics?.memory?.limitations?.hourly?.percentFromMaxMinValue
                })
            }
        }
    }

    return undefined
}

const getPrecalculatedData = (dataHourly: ContextDataHourly, configuration: Configuration): PrecalculatedData => {
    return _.mapKeys<CanisterPredictionData>(_.compact<CanisterPredictionData>(_.map<ContextDataHourly, CanisterPredictionData | undefined>(dataHourly, (hourlyMetricsData, canisterId) => {
        if (hourlyMetricsData.length > 0) {
            const metricIntervalIndexForCurrentTime = DateUtils.getMetricIntervalIndexForCurrentTime();

            //let's get cycle and memory differences with "day" interval (more precise prediction)
            const predictionMetricsData_day: PredictionMetricsData | undefined = getPredictionMetricsData(hourlyMetricsData, "day", metricIntervalIndexForCurrentTime, configuration.metrics)
            let cyclesDayGood = false
            let cyclesMetricData: MetricsData<number> | undefined = undefined
            let memoryDayGood = false
            let memoryMetricData: MetricsData<number> | undefined = undefined
            if (predictionMetricsData_day) {
                //first let's analyze if data is valuable for prediction:
                //1. cycles difference should be <= 0
                //1. memory difference should be >= 0
                cyclesMetricData = predictionMetricsData_day.cycles
                if (predictionMetricsData_day.cycles.data.difference <= 0) {
                    //it is ok that cycles are the same or reduced
                    cyclesDayGood = true
                }
                memoryMetricData = predictionMetricsData_day.memory
                if (predictionMetricsData_day.memory.data.difference > 0) {
                    //it is ok that memory is the same or increased
                    memoryDayGood = true
                }
            }
            if (!cyclesDayGood || !memoryDayGood) {
                //if cycles or memory is not good - lets check with "hour" interval (less precise prediction)
                const predictionMetricsData_hour: PredictionMetricsData | undefined = getPredictionMetricsData(hourlyMetricsData, "hour", metricIntervalIndexForCurrentTime, configuration.metrics)
                if (predictionMetricsData_hour) {
                    if (!cyclesDayGood) {
                        if (predictionMetricsData_hour.cycles.data.difference <= 0) {
                            //it is ok that cycles are the same or reduced
                            cyclesMetricData = predictionMetricsData_hour.cycles
                        }
                    }
                    if (!memoryDayGood) {
                        if (predictionMetricsData_hour.memory.data.difference > 0) {
                            //it is ok that memory is the same or increased
                            memoryMetricData = predictionMetricsData_hour.memory
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
                }
            }
        }
    })), v => v.canisterId)
}

export const PrecalculatedPredictionDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
}