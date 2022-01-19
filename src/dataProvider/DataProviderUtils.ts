import {ContextDataDaily, ContextDataHourly} from "./DataProvider";
import {DailyMetricsData, HourlyMetricsData} from "../api/canistergeek.did";
import {DateUtils} from "./DateUtils";

const getHourlyValueForCurrentTime = (values?: Array<bigint>): number => {
    if (values) {
        const metricIntervalIndex = DateUtils.getMetricIntervalIndexForCurrentTime();
        return Number(values[metricIntervalIndex])
    }
    return 0
}

export type LatestSignificantHourlyValue = {
    value: number,
    metricIntervalIndex: number
}

const getLatestSignificantHourlyValue = (values?: Array<bigint>, startMetricIntervalIndex?: number): LatestSignificantHourlyValue | undefined => {
    if (values) {
        if (startMetricIntervalIndex == undefined) {
            startMetricIntervalIndex = values.length - 1
        }
        for (let i = startMetricIntervalIndex; i >= 0; i--) {
            const value = values[i];
            if (value > 0) {
                return {
                    value: Number(value),
                    metricIntervalIndex: i
                }
            }
        }
    }
}

const getDataHourlyMetrics = (dataHourly: ContextDataHourly, canisterId: string): Array<HourlyMetricsData> | undefined => {
    const data = dataHourly[canisterId];
    if (data && data.length > 0) {
        return data
    }
}

const getDataDailyMetrics = (dataDaily: ContextDataDaily, canisterId: string): Array<DailyMetricsData> | undefined => {
    const data = dataDaily[canisterId];
    if (data && data.length > 0) {
        return data
    }
}

const getDataHourlyLatestMetrics = (dataHourly: ContextDataHourly, canisterId: string): HourlyMetricsData | undefined => {
    const dataHourlyMetrics = getDataHourlyMetrics(dataHourly, canisterId);
    if (dataHourlyMetrics && dataHourlyMetrics.length > 0) {
        return dataHourlyMetrics[dataHourlyMetrics.length - 1]
    }
}

const getDataDailyLatestMetrics = (dataDaily: ContextDataDaily, canisterId: string): DailyMetricsData | undefined => {
    const dataDailyMetrics = getDataDailyMetrics(dataDaily, canisterId);
    if (dataDailyMetrics && dataDailyMetrics.length > 0) {
        return dataDailyMetrics[dataDailyMetrics.length - 1]
    }
}

export const DataProviderUtils = {
    getHourlyValueForCurrentTime: getHourlyValueForCurrentTime,
    getLatestSignificantHourlyValue: getLatestSignificantHourlyValue,
    getDataHourlyMetrics: getDataHourlyMetrics,
    getDataDailyMetrics: getDataDailyMetrics,
    getDataHourlyLatestMetrics: getDataHourlyLatestMetrics,
    getDataDailyLatestMetrics: getDataDailyLatestMetrics,
}