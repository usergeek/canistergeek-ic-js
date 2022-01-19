import Highcharts, {PointOptionsObject, SeriesLineOptions} from "highcharts";
import {DailyMetricsData, NumericEntity} from "../api/canistergeek.did";
import _ from "lodash";
import {DateUtils} from "../dataProvider/DateUtils";
import {HighchartsDateTimeFacade} from "./HighchartsDateTimeFacade";
import {DAY_MILLIS, DAY_SECONDS} from "../dataProvider/Constants";
import {CalculationUtils} from "../dataProvider/CalculationUtils";

export const INCOMPLETE_MARKER: Highcharts.PointMarkerOptionsObject = {enabled: true, fillColor: '#FFFFFF', radius: 3, lineWidth: 2, lineColor: "#cccccc"}

export type SeriesDataAvailabilityState = "noData" | "complete" | "incomplete"

export type ChartHourlyDataSource = {
    timeMillis: bigint
    values: Array<bigint>
}

/**
 * Method adds single points to series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * Method mutates *seriesData* parameter
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
export const analyzeSeriesDataAvailabilityStateMarkers = (seriesData: Array<PointOptionsObject>, seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState>) => {
    if (seriesData.length == 1 && seriesDataAvailabilityStates.length == 1) {
        const markerState = seriesDataAvailabilityStates[0];
        if (markerState == "complete") {
            seriesData[0].marker = {
                enabled: true,
                symbol: "circle",
                radius: 2
            }
        }
    } else {
        _.each(seriesDataAvailabilityStates, (markerState: SeriesDataAvailabilityState, idx) => {
            if (idx > 1) {
                const aState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 2]
                const bState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 1]
                const cState: SeriesDataAvailabilityState = markerState
                if (aState == "noData" && bState == "complete" && cState == "noData") {
                    const bSeriesData: PointOptionsObject = seriesData[idx - 1]
                    bSeriesData.marker = {
                        enabled: true,
                        symbol: "circle",
                        radius: 2
                    }
                }
            }
            if (idx === 1) {
                const aState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 1]
                const bState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx]
                if (aState == "complete" && bState == "noData") {
                    const aSeriesData: PointOptionsObject = seriesData[idx - 1]
                    aSeriesData.marker = {
                        enabled: true,
                        symbol: "circle",
                        radius: 2
                    }
                }
            }
        })
    }
}

const prepareChartHourlyData = (source: Array<ChartHourlyDataSource>, granularitySeconds: number): ChartHourlyData | undefined => {
    if (source) {
        const itemsByDays: Array<ChartHourlyData> = source.map<ChartHourlyData>((sourceValue) => {
            let currentMillis = Number(sourceValue.timeMillis);
            const millisToAddForEachInterval = (86400 / sourceValue.values.length) * 1000
            return sourceValue.values.map<PointOptionsObject>((value, idx) => {
                return {
                    x: currentMillis + millisToAddForEachInterval * idx,
                    y: value > 0 ? Number(value) : null
                }
            })
        });
        const pointOptionsObjects: Array<PointOptionsObject> = _.flatten<PointOptionsObject>(itemsByDays);
        const seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        _.each(pointOptionsObjects, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData")
            } else {
                seriesDataAvailabilityStates.push("complete")
            }
        })
        analyzeSeriesDataAvailabilityStateMarkers(pointOptionsObjects, seriesDataAvailabilityStates)


        let lastPoint: PointOptionsObject | undefined = undefined
        for (let i = pointOptionsObjects.length - 1; i >= 0; i--) {
            const pointOptionsObject = pointOptionsObjects[i];
            if (pointOptionsObject.y != null) {
                lastPoint = pointOptionsObject
                break;
            }
        }
        if (lastPoint && lastPoint.x) {
            const diffMillis = new Date().getTime() - lastPoint.x;
            if (diffMillis < (granularitySeconds * 1000)) {
                lastPoint.marker = INCOMPLETE_MARKER
            }
        }
        return pointOptionsObjects
    }
}

export type DailyDataValueProviderFn = (source: DailyMetricsData) => bigint

const prepareChartDailyData = (source: Array<DailyMetricsData> | undefined, valueProvider: DailyDataValueProviderFn): ChartDailyData | undefined => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils.getStartOfTodayMilliseconds();
        const pointOptionsObjects: Array<PointOptionsObject> = source.map((sourceValue) => {
            const x: number = Number(sourceValue.timeMillis);
            const value = Number(valueProvider(sourceValue));
            const y: number | null = value > 0 ? value : null
            const point: PointOptionsObject = {
                x: x,
                y: y
            };
            const isToday = x == startOfTodayMilliseconds
            if (isToday) {
                point.marker = INCOMPLETE_MARKER
            }
            return point
        });
        const seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        _.each(pointOptionsObjects, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData")
            } else {
                seriesDataAvailabilityStates.push("complete")
            }
        })
        analyzeSeriesDataAvailabilityStateMarkers(pointOptionsObjects, seriesDataAvailabilityStates)
        return pointOptionsObjects
    }
}

export type DailyDataWithNumericEntityForValueProviderFn = (dailyMetricsData: DailyMetricsData) => NumericEntity

const prepareChartDailyDataWithNumericEntityFor = (source: Array<DailyMetricsData> | undefined, numericEntityProvider: DailyDataWithNumericEntityForValueProviderFn): DailyChartWithNumericEntityData | undefined => {
    if (source) {
        const valuesAvg: ChartDailyData = []
        const valuesAvgAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        const startOfTodayMilliseconds = DateUtils.getStartOfTodayMilliseconds();
        source.forEach((sourceValue) => {
            const numericEntity = numericEntityProvider(sourceValue)
            const avgValue = Number(numericEntity.avg) == 0 ? null : Number(numericEntity.avg)
            valuesAvgAvailabilityStates.push(avgValue == null ? "noData" : "complete")

            const x = Number(sourceValue.timeMillis);
            const point: PointOptionsObject = {x: x, y: avgValue};
            const isToday = x == startOfTodayMilliseconds
            if (isToday) {
                point.marker = INCOMPLETE_MARKER
            }
            valuesAvg.push(point)
        });
        analyzeSeriesDataAvailabilityStateMarkers(valuesAvg, valuesAvgAvailabilityStates)

        return [
            {data: valuesAvg},
        ]
    }
}

export type ChartDailyData = Array<PointOptionsObject>
export type ChartHourlyData = Array<PointOptionsObject>

export interface ChartOptionsParams {
    chartTitle: string,
    seriesName?: string,
    yAxisTitle?: string
    tooltipValuePostfix?: string
}

const optionsForHourlyChart = (chartHourlyData: ChartHourlyData, params: ChartOptionsParams, granularitySeconds: number): Highcharts.Options => {
    if (!chartHourlyData) {
        return {}
    }

    const title = params.chartTitle

    const currentSeries: SeriesLineOptions = {
        type: "line",
        data: chartHourlyData,
        name: params?.seriesName,
        showInLegend: (params?.seriesName || "").length > 0,
        turboThreshold: (DAY_MILLIS / (granularitySeconds * 1000)) * 9
    }

    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils.formatNumericValue(point.y!)
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>"
            const timestamp = new Date(this.x).getTime()
            const date = Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, timestamp)
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`
        }
    }

    const yAxis: Highcharts.YAxisOptions = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: {zoomType: "xy",},
        title: {text: title},
        series: [currentSeries],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    }
}

const optionsForDailyChart = (chartDailyData: ChartDailyData, params: ChartOptionsParams): Highcharts.Options => {
    if (!chartDailyData) {
        return {}
    }

    const title = params.chartTitle

    const currentSeries: SeriesLineOptions = {
        type: "line",
        data: chartDailyData,
        name: params?.seriesName,
        showInLegend: (params?.seriesName || "").length > 0,
    }

    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils.formatNumericValue(point.y!)
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>"
            const timestamp = new Date(this.x).getTime()
            const date = Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.daily, timestamp)
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`
        }
    }

    const yAxis: Highcharts.YAxisOptions = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: {zoomType: "xy",},
        title: {text: title},
        series: [currentSeries],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 24 * 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    }
}

const optionsForDailyChartWithNumericEntity = (source: DailyChartWithNumericEntityData, params: ChartOptionsParams): Highcharts.Options => {
    if (!source) {
        return {}
    }

    const title = params.chartTitle

    const series = source.map<SeriesLineOptions>(value => {
        return {
            type: "line",
            data: value.data,
            name: value.seriesName,
            showInLegend: (value.seriesName || "").length > 0,
        }
    })

    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils.formatNumericValue(point.y!)
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>"
            const timestamp = new Date(this.x).getTime()
            const date = Highcharts.dateFormat(HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.daily, timestamp)
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`
        }
    }

    const yAxis: Highcharts.YAxisOptions = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: {zoomType: "xy",},
        title: {text: title},
        series: series,
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 24 * 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    }
}

const provideCommonOptionsForHourlyChart = (data: Array<ChartHourlyDataSource> | undefined, parameters: ChartOptionsParams): Highcharts.Options => {
    if (data && parameters) {
        if (data.length > 0) {
            const granularitySeconds = DAY_SECONDS / data[0].values.length
            const chartDataXYPoints = prepareChartHourlyData(data, granularitySeconds)
            if (chartDataXYPoints) {
                return optionsForHourlyChart(chartDataXYPoints, parameters, granularitySeconds)
            }
        }
    }
    return {}
}

export type DailyChartWithNumericEntityDataItem = {
    data: ChartDailyData,
    seriesName?: string
}

export type DailyChartWithNumericEntityData = Array<DailyChartWithNumericEntityDataItem>

const provideCommonOptionsForDailyChart = (data: ChartDailyData | undefined, parameters: ChartOptionsParams): Highcharts.Options => {
    if (data && parameters) {
        return optionsForDailyChart(data, parameters)
    }
    return {}
}

const provideCommonOptionsForDailyChartWithNumericEntity = (source: DailyChartWithNumericEntityData | undefined, parameters: ChartOptionsParams): Highcharts.Options => {
    if (source && parameters) {
        return optionsForDailyChartWithNumericEntity(source, parameters)
    }
    return {}
}

export const HighchartsUtils = {
    prepareChartDailyData: prepareChartDailyData,
    prepareChartDailyDataWithNumericEntityFor: prepareChartDailyDataWithNumericEntityFor,
    provideCommonOptionsForHourlyChart: provideCommonOptionsForHourlyChart,
    provideCommonOptionsForDailyChart: provideCommonOptionsForDailyChart,
    provideCommonOptionsForDailyChartWithNumericEntity: provideCommonOptionsForDailyChartWithNumericEntity,
}