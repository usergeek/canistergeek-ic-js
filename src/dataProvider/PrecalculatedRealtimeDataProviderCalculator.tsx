import {ContextDataHourly} from "./DataProvider";
import {Configuration, MetricsFormat, MetricsThresholds} from "./ConfigurationProvider";
import _ from "lodash";
import {DateUtils} from "./DateUtils";
import {DataProviderUtils} from "../dataProvider/DataProviderUtils";
import {MetricOutdatedContext, MetricWrapper} from "./PrecalculatedDataProvider";
import {COLOR_GRAY_HEX, GRANULARITY_SECONDS} from "./Constants";
import {PrecalculatedDataProviderUtils} from "./PrecalculatedDataProviderUtils";
import {PrecalculatedData, SummaryPageRealtimeSectionData} from "./PrecalculatedRealtimeDataProvider";
import {HourlyMetricsData} from "../api/canistergeek.did";

const getUpdateCallsMetricWrapperFromHourlyMetricsData = (data: HourlyMetricsData | undefined): MetricWrapper<number> | undefined => {
    if (data) {
        const today_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds

        let value = DataProviderUtils.getHourlyValueForCurrentTime(data.updateCalls);
        let outdatedContext: MetricOutdatedContext | undefined = undefined
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(data.updateCalls, isToday ? DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                }
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value);
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: undefined,
            metricsThresholds: undefined,
            outdatedContext: outdatedContext
        }
    }
}

const getCyclesMetricWrapperFromHourlyMetricsData = (data: HourlyMetricsData | undefined, configuration: Configuration): MetricWrapper<number> | undefined => {
    if (data) {
        const today_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds

        const thresholds = configuration.metrics?.cycles?.thresholds;

        let value = DataProviderUtils.getHourlyValueForCurrentTime(data.canisterCycles);
        let outdatedContext: MetricOutdatedContext | undefined = undefined
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(data.canisterCycles, isToday ? DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                }
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, configuration.metrics?.cycles?.metricsFormat);
        let colorHex: string | undefined = undefined
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = (thresholds.steps)[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex
                        break
                    }
                }
            }
            if (!colorHex) {
                colorHex = thresholds.base.colorHex
            }
        }
        return {
            value: value,
            hasValue: value > 0,
            label: valueFormatted,
            colorHex: colorHex,
            metricsThresholds: thresholds,
            outdatedContext: outdatedContext
        }
    }
}

const getMemoryMetricWrapperFromHourlyMetricsData = (data: HourlyMetricsData | undefined, configuration: Configuration): MetricWrapper<number> | undefined => {
    if (data) {
        const today_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds

        const thresholds = configuration.metrics?.memory?.thresholds;
        let value = DataProviderUtils.getHourlyValueForCurrentTime(data.canisterMemorySize);
        let outdatedContext: MetricOutdatedContext | undefined = undefined
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(data.canisterMemorySize, isToday ? DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                }
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, configuration.metrics?.memory?.metricsFormat);
        let colorHex: string | undefined = undefined
        let percentFromMax: number | undefined = undefined
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = thresholds.steps[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex
                        break
                    }
                }
            }
            if (!colorHex) {
                if (value > 0) {
                    colorHex = thresholds.base.colorHex
                } else {
                    colorHex = COLOR_GRAY_HEX
                }
            }
        }
        const limitations = configuration.metrics?.memory?.limitations?.hourly;
        if (limitations?.maxValue) {
            percentFromMax = (value / limitations.maxValue) * 100
            if (value > 0 && limitations.percentFromMaxMinValue) {
                if (percentFromMax < limitations.percentFromMaxMinValue) {
                    percentFromMax = limitations.percentFromMaxMinValue
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
        }
    }
}

const getHeapMemoryMetricWrapperFromHourlyMetricsData = (data: HourlyMetricsData | undefined, configuration: Configuration): MetricWrapper<number> | undefined => {
    if (data) {
        const today_startOfDayMilliseconds = DateUtils.getStartOfDayMilliseconds(DateUtils.nowTimeUTC());
        const isToday = Number(data.timeMillis) == today_startOfDayMilliseconds

        const thresholds = configuration.metrics?.heapMemory?.thresholds;
        let value = DataProviderUtils.getHourlyValueForCurrentTime(data.canisterHeapMemorySize);
        let outdatedContext: MetricOutdatedContext | undefined = undefined
        if (value == 0) {
            //no value found -> find last significant value
            const latestSignificantHourlyValue = DataProviderUtils.getLatestSignificantHourlyValue(data.canisterHeapMemorySize, isToday ? DateUtils.getMetricIntervalIndexForCurrentTime() : undefined);
            if (latestSignificantHourlyValue) {
                //last significant value found
                value = latestSignificantHourlyValue.value
                outdatedContext = {
                    actualTimeMillis: Number(data.timeMillis) + (GRANULARITY_SECONDS * 1000 * latestSignificantHourlyValue.metricIntervalIndex)
                }
            }
        }
        const valueFormatted = PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(value, configuration.metrics?.heapMemory?.metricsFormat);
        let colorHex: string | undefined = undefined
        let percentFromMax: number | undefined = undefined
        if (thresholds) {
            if (thresholds.steps) {
                for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                    const step = thresholds.steps[i];
                    if (value >= step.value) {
                        colorHex = step.colorHex
                        break
                    }
                }
            }
            if (!colorHex) {
                if (value > 0) {
                    colorHex = thresholds.base.colorHex
                } else {
                    colorHex = COLOR_GRAY_HEX
                }
            }
        }
        const limitations = configuration.metrics?.heapMemory?.limitations?.hourly;
        if (limitations?.maxValue) {
            percentFromMax = (value / limitations.maxValue) * 100
            if (value > 0 && limitations.percentFromMaxMinValue) {
                if (percentFromMax < limitations.percentFromMaxMinValue) {
                    percentFromMax = limitations.percentFromMaxMinValue
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
        }
    }
}

const getMetricWrapperFromValue = (value: number | bigint | undefined = 0, metricsFormat: MetricsFormat | undefined, thresholds: MetricsThresholds | undefined): MetricWrapper<number> | undefined => {
    const valueNumber: number = value == undefined ? 0 : Number(value)
    const valueFormatted = PrecalculatedDataProviderUtils.Formatter.formatSignificantNumericValue(valueNumber, metricsFormat);
    let colorHex: string | undefined = undefined
    if (thresholds) {
        if (thresholds.steps) {
            for (let i = thresholds.steps.length - 1; i >= 0; i--) {
                const step = (thresholds.steps)[i];
                if (valueNumber >= step.value) {
                    colorHex = step.colorHex
                    break
                }
            }
        }
        if (!colorHex) {
            colorHex = thresholds.base.colorHex
        }
    }
    return {
        value: valueNumber,
        hasValue: valueNumber > 0,
        label: valueFormatted,
        colorHex: colorHex,
        metricsThresholds: thresholds,
        outdatedContext: undefined
    }
}

const getPrecalculatedData = (dataHourly: ContextDataHourly, configuration: Configuration): PrecalculatedData => {
    return _.mapKeys<SummaryPageRealtimeSectionData>(_.compact<SummaryPageRealtimeSectionData>(_.map<ContextDataHourly, SummaryPageRealtimeSectionData | undefined>(dataHourly, (hourlyMetricsData, canisterId) => {
        const data = _.last(hourlyMetricsData)
        if (data) {
            //Cycles
            const cyclesMetricWrapper = getCyclesMetricWrapperFromHourlyMetricsData(data, configuration)

            //Memory
            const memoryMetricWrapper = getMemoryMetricWrapperFromHourlyMetricsData(data, configuration)

            //Heap Memory
            const heapMemoryMetricWrapper = getHeapMemoryMetricWrapperFromHourlyMetricsData(data, configuration)

            const canisterPrecalculatedData: SummaryPageRealtimeSectionData = {
                canisterId: canisterId,
                cycles: cyclesMetricWrapper!,
                memory: memoryMetricWrapper!,
                heapMemory: heapMemoryMetricWrapper!,
            }
            return canisterPrecalculatedData
        }
    })), v => v.canisterId)
}

export const PrecalculatedRealtimeDataProviderCalculator = {
    getPrecalculatedData: getPrecalculatedData,
    getUpdateCallsMetricWrapperFromHourlyMetricsData: getUpdateCallsMetricWrapperFromHourlyMetricsData,
    getCyclesMetricWrapperFromHourlyMetricsData: getCyclesMetricWrapperFromHourlyMetricsData,
    getMemoryMetricWrapperFromHourlyMetricsData: getMemoryMetricWrapperFromHourlyMetricsData,
    getHeapMemoryMetricWrapperFromHourlyMetricsData: getHeapMemoryMetricWrapperFromHourlyMetricsData,
    getMetricWrapperFromValue: getMetricWrapperFromValue,
}