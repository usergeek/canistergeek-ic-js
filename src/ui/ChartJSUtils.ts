import {DailyMetricsData, NumericEntity} from "../api/canistergeek.did";
import _ from "lodash";
import {DAY_SECONDS} from "../dataProvider/Constants";
import {ChartJSChartContext} from "./ChartJSChartContext";
import {ChartDataset, ChartOptions, ScatterDataPoint, ScriptableContext} from "chart.js";
import {getColorByIndex} from "./ChartJSWithOptionsComponent";
import {DateUtils} from "../dataProvider/DateUtils";
import {TrendSection24HoursInterval, TrendSectionShiftData} from "../dataProvider/PrecalculatedTrendDataProvider";
import {DateTimeUtils} from "./DateTimeUtils";
import {CalculationUtils} from "../dataProvider/CalculationUtils";

export type SeriesDataAvailabilityState = "noData" | "complete" | "incomplete"

export type ChartHourlyDataSource = {
    timeMillis: bigint
    values: Array<bigint>
}

export type ChartHourlyData = {
    data: Array<ScatterDataPoint>
    borderColor?: (ctx: ScriptableContext<"line">) => string
    backgroundColor?: (ctx: ScriptableContext<"line">) => string
    pointRadius?: (ctx: ScriptableContext<"line">) => number
}

export type ChartDailyData = {
    data: Array<ScatterDataPoint>
    borderColor?: (ctx: ScriptableContext<"line">) => string
    backgroundColor?: (ctx: ScriptableContext<"line">) => string
    pointRadius?: (ctx: ScriptableContext<"line">) => number
}

export type ChartTrendData = {
    data: Array<number | null>
    borderColor?: (ctx: ScriptableContext<"line">) => string
    backgroundColor?: (ctx: ScriptableContext<"line">) => string
    pointRadius?: (ctx: ScriptableContext<"line">) => number
}

export type DailyChartWithNumericEntityDataItem = {
    data: Array<ScatterDataPoint>,
    seriesName?: string
    borderColor?: (ctx: ScriptableContext<"line">) => string
    backgroundColor?: (ctx: ScriptableContext<"line">) => string
    pointRadius?: (ctx: ScriptableContext<"line">) => number
}

export type DailyChartWithNumericEntityData = Array<DailyChartWithNumericEntityDataItem>

const tickValueFormatterCallback = (value) => {
    const ranges = [
        {divider: 1e12, suffix: 'T'},
        {divider: 1e9, suffix: 'G'},
        {divider: 1e6, suffix: 'M'},
        {divider: 1e3, suffix: 'k'}
    ];

    function formatNumber(n) {
        const multiplier = n < 0 ? -1 : 1
        for (let i = 0; i < ranges.length; i++) {
            if (n * multiplier >= ranges[i].divider) {
                return (n / ranges[i].divider).toString() + ranges[i].suffix;
            }
        }
        return n;
    }

    return formatNumber(value);
}

/**
 * Method returns indexes of single points from series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
export const analyzeSeriesDataAvailabilityStateMarkers = (seriesData: Array<ScatterDataPoint>, seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState>): Array<number> => {
    const singlePointIndexes: Array<number> = []
    if (seriesData.length == 1 && seriesDataAvailabilityStates.length == 1) {
        const markerState = seriesDataAvailabilityStates[0];
        if (markerState == "complete") {
            singlePointIndexes.push(0)
        }
    } else {
        _.each(seriesDataAvailabilityStates, (markerState: SeriesDataAvailabilityState, idx) => {
            if (idx > 1) {
                const aState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 2]
                const bState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 1]
                const cState: SeriesDataAvailabilityState = markerState
                if (aState == "noData" && bState == "complete" && cState == "noData") {
                    singlePointIndexes.push(idx - 1)
                }
            }
            if (idx === 1) {
                const aState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx - 1]
                const bState: SeriesDataAvailabilityState = seriesDataAvailabilityStates[idx]
                if (aState == "complete" && bState == "noData") {
                    singlePointIndexes.push(idx - 1)
                }
            }
        })
    }
    return singlePointIndexes
}

const prepareChartHourlyData = (source: Array<ChartHourlyDataSource>, granularitySeconds: number): ChartHourlyData | undefined => {
    if (source) {
        const itemsByDays = source.map((sourceValue) => {
            let currentMillis = Number(sourceValue.timeMillis);
            const millisToAddForEachInterval = (86400 / sourceValue.values.length) * 1000
            const result: Array<ScatterDataPoint> = []
            sourceValue.values.forEach((value, idx) => {
                const point: ScatterDataPoint = {
                    x: currentMillis + millisToAddForEachInterval * idx,
                    y: value > 0 ? Number(value) : null
                }
                result.push(point)
            })
            return result
        });
        const dataPoints: Array<ScatterDataPoint> = _.flatten<ScatterDataPoint>(itemsByDays);
        const seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        _.each(dataPoints, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData")
            } else {
                seriesDataAvailabilityStates.push("complete")
            }
        })
        const singlePointIndexes: Array<number> = analyzeSeriesDataAvailabilityStateMarkers(dataPoints, seriesDataAvailabilityStates)
        let lastIncompletePointIndex: number = -1
        for (let i = dataPoints.length - 1; i >= 0; i--) {
            const pointOptionsObject = dataPoints[i];
            if (pointOptionsObject.y != null && pointOptionsObject.x) {
                const diffMillis = new Date().getTime() - pointOptionsObject.x;
                if (diffMillis < (granularitySeconds * 1000)) {
                    lastIncompletePointIndex = i
                }
                break;
            }
        }
        return {
            data: dataPoints,
            borderColor: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS
                }
                if (singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1
                }
                return 0
            }
        }
    }
}

const prepareChartDailyData = (source: Array<DailyMetricsData> | undefined, valueProvider: DailyDataValueProviderFn): ChartDailyData | undefined => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils.getStartOfTodayMilliseconds();
        let incompletePointIndex: number = -1
        const dataPoints: Array<ScatterDataPoint> = source.map((sourceValue, idx) => {
            const x: number = Number(sourceValue.timeMillis);
            const value = Number(valueProvider(sourceValue));
            const y: number | null = value > 0 ? value : null
            const point: ScatterDataPoint = {
                x: x,
                y: y
            };
            const isToday = x == startOfTodayMilliseconds
            if (isToday) {
                incompletePointIndex = idx
            }
            return point
        });
        const seriesDataAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        _.each(dataPoints, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData")
            } else {
                seriesDataAvailabilityStates.push("complete")
            }
        })
        const singlePointIndexes: Array<number> = analyzeSeriesDataAvailabilityStateMarkers(dataPoints, seriesDataAvailabilityStates)

        return {
            data: dataPoints,
            borderColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS
                }
                if (singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1
                }
                return 0
            }
        }
    }
}

const INCOMPLETE_POINT_BORDER_COLOR: string = "#ccc"
const INCOMPLETE_POINT_BACKGROUND_COLOR: string = "#fff"
const INCOMPLETE_POINT_RADIUS: number = 3
const POINT_RADIUS: number = 1

const prepareChartDailyDataWithNumericEntityFor = (source: Array<DailyMetricsData> | undefined, numericEntityProvider: DailyDataWithNumericEntityForValueProviderFn): DailyChartWithNumericEntityData | undefined => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils.getStartOfTodayMilliseconds();
        let incompletePointIndex: number = -1

        //avg
        const valuesAvg: Array<ScatterDataPoint> = []
        const valuesAvgAvailabilityStates: Array<SeriesDataAvailabilityState> = []
        source.forEach((sourceValue, idx) => {
            const x = Number(sourceValue.timeMillis);
            const numericEntity = numericEntityProvider(sourceValue)
            const isToday = x == startOfTodayMilliseconds
            if (isToday) {
                incompletePointIndex = idx
            }

            //avg
            const avgValue = Number(numericEntity.avg) == 0 ? null : Number(numericEntity.avg)
            valuesAvgAvailabilityStates.push(avgValue == null ? "noData" : "complete")
            valuesAvg.push({x: x, y: avgValue} as ScatterDataPoint)
        });

        //avg
        const valuesAvg_singlePointIndexes: Array<number> = analyzeSeriesDataAvailabilityStateMarkers(valuesAvg, valuesAvgAvailabilityStates)
        const valuesAvg_dailyChartWithNumericEntityDataItem: DailyChartWithNumericEntityDataItem = {
            data: valuesAvg,
            seriesName: "Avg",
            borderColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR
                }
                return getColorByIndex(ctx.datasetIndex)
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS
                }
                if (valuesAvg_singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1
                }
                return 0
            }
        }

        return [
            valuesAvg_dailyChartWithNumericEntityDataItem,
        ]
    }
}

export type DailyDataValueProviderFn = (source: DailyMetricsData) => bigint

export type DailyDataWithNumericEntityForValueProviderFn = (dailyMetricsData: DailyMetricsData) => NumericEntity

export interface ChartOptionsParams {
    chartTitle?: string,
    seriesName?: string,
    yAxisTitle?: string
    yAxisMin?: number
    tooltipValuePrefix?: string
    tooltipValuePostfix?: string
}

const optionsForHourlyChart = (chartHourlyData: ChartHourlyData, params: ChartOptionsParams, granularitySeconds: number): ChartJSChartContext | undefined => {
    if (!chartHourlyData) {
        return undefined
    }

    const title = params.chartTitle
    const labels = []

    const options: ChartOptions<"line"> = {
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 20,
                    weight: "normal"
                }
            },
            tooltip: {
                callbacks: {
                    title: tooltipItems => {
                        return DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "dayTime")
                    },
                    label: (tooltipItem) => {
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils.formatNumericValue(value)
                        return ` ${valueFormatted}${params.tooltipValuePostfix || ""}`
                    }
                }
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    displayFormats: {
                        "day": "MM/DD",
                        "hour": "h:mma"
                    }
                },
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    major: {
                        enabled: true
                    },
                }
            },
            y: {
                title: {
                    display: !_.isEmpty(params.yAxisTitle),
                    text: params.yAxisTitle
                },
                grid: {
                    drawBorder: false
                },
                grace: "1%",
                min: 0,
                ticks: {
                    callback: tickValueFormatterCallback,
                    precision: 0,
                    padding: 10
                }
            }
        }
    };
    return {
        options: options,
        data: {
            labels,
            datasets: [
                {
                    data: chartHourlyData.data,
                    clip: 5,
                    borderColor: chartHourlyData.borderColor || (ctx => getColorByIndex(ctx.datasetIndex)),
                    backgroundColor: chartHourlyData.backgroundColor || (ctx => getColorByIndex(ctx.datasetIndex)),
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: chartHourlyData.pointRadius || 0,
                }
            ],
        }
    }
}

const optionsForDailyChart = (chartDailyData: ChartDailyData, params: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (!chartDailyData) {
        return undefined
    }

    const title = params.chartTitle
    const labels = []

    const options: ChartOptions<"line"> = {
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 20,
                    weight: "normal"
                }
            },
            tooltip: {
                callbacks: {
                    title: tooltipItems => {
                        return DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day")
                    },
                    label: (tooltipItem) => {
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils.formatNumericValue(value)
                        return ` ${valueFormatted}${params.tooltipValuePostfix || ""}`
                    }
                }
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    displayFormats: {
                        "day": "MM/DD",
                        "hour": "h:mma"
                    }
                },
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    major: {
                        enabled: true
                    },
                }
            },
            y: {
                title: {
                    display: !_.isEmpty(params.yAxisTitle),
                    text: params.yAxisTitle
                },
                grid: {
                    drawBorder: false
                },
                grace: "1%",
                min: 0,
                ticks: {
                    callback: tickValueFormatterCallback,
                    precision: 0,
                    padding: 10
                }
            }
        }
    };
    return {
        options: options,
        data: {
            labels,
            datasets: [
                {
                    data: chartDailyData.data,
                    clip: 5,
                    borderColor: chartDailyData.borderColor || (ctx => getColorByIndex(ctx.datasetIndex)),
                    backgroundColor: chartDailyData.backgroundColor || (ctx => getColorByIndex(ctx.datasetIndex)),
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: chartDailyData.pointRadius || 0,
                }
            ],
        }
    }
}

const optionsForDailyChartWithNumericEntity = (source: DailyChartWithNumericEntityData, params: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (!source) {
        return undefined
    }

    const title = params.chartTitle
    const labels = []

    const legendVisible = source.length > 1

    const options: ChartOptions<"line"> = {
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 20,
                    weight: "normal"
                }
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        return DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day")
                    },
                    label: (tooltipItem) => {
                        const label = legendVisible ? ` ${tooltipItem.dataset.label}:` : ""
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils.formatNumericValue(value)
                        return `${label} ${valueFormatted}${params.tooltipValuePostfix || ""}`
                    }
                }
            },
            legend: {
                display: legendVisible,
                position: "bottom",
                labels: {
                    boxWidth: 12
                }
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    displayFormats: {
                        "day": "MM/DD",
                        "hour": "h:mma"
                    }
                },
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    major: {
                        enabled: true
                    },
                }
            },
            y: {
                title: {
                    display: !_.isEmpty(params.yAxisTitle),
                    text: params.yAxisTitle
                },
                grid: {
                    drawBorder: false
                },
                grace: "1%",
                min: 0,
                ticks: {
                    callback: tickValueFormatterCallback,
                    precision: 0,
                    padding: 10
                }
            }
        },
    };

    const datasets = source.map(value => {
        return {
            data: value.data,
            clip: 5,
            label: value.seriesName,
            borderColor: value.borderColor || (ctx => getColorByIndex(ctx.datasetIndex)),
            backgroundColor: value.backgroundColor || (ctx => getColorByIndex(ctx.datasetIndex)),
            borderWidth: 2,
            tension: 0,
            pointRadius: value.pointRadius || 0,
        } as ChartDataset<"line", Array<ScatterDataPoint>>
    })
    return {
        options: options,
        data: {
            labels,
            datasets: datasets,
        }
    }
}

const optionsForForTrendShiftDataChart = (source: Array<TrendSectionShiftData>, params: ChartOptionsParams): ChartJSChartContext | undefined => {

    type DataPointType = {
        y: number | null
        interval: TrendSection24HoursInterval
        hasValue: boolean
    }
    const data: Array<DataPointType> = source.map((value) => {
        if (value.value != undefined) {
            return {
                y: Number(value.value),
                interval: value.interval,
                hasValue: true
            }
        }
        return {
            y: null,
            interval: value.interval,
            hasValue: false
        }
    }).reverse()

    let hasNegativeValues = false
    let hasPositiveValues = false
    _.each(data, (value, idx) => {
        if (value.y == null) {
            value.y = 0
        }
        if (!hasNegativeValues && value.y < 0) {
            hasNegativeValues = true
        }
        if (!hasPositiveValues && value.y > 0) {
            hasPositiveValues = true
        }
    })

    const labels: Array<string> = data.map((value, idx) => {
        const reverseIndex = data.length - 1 - idx
        const shiftBy24HoursAsString = -source[reverseIndex].numberOfShiftsBy24Hours;
        return `${shiftBy24HoursAsString}`
    })
    let yScaleMin: number | undefined = undefined
    let yScaleMax: number | undefined = undefined
    if (hasPositiveValues && !hasNegativeValues) {
        yScaleMin = 0
    } else if (!hasPositiveValues && hasNegativeValues) {
        yScaleMax = 0
    }
    const options: ChartOptions<"line"> = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: tooltipItems => {
                        const dataPoint = data[tooltipItems[0].dataIndex];
                        const interval: TrendSection24HoursInterval = dataPoint.interval
                        const dateFrom = DateTimeUtils.formatDate(interval.fromMillis, "dayTime")
                        const dateTo = DateTimeUtils.formatDate(interval.toMillis, "dayTime")
                        return `${dateFrom} - ${dateTo}`
                    },
                    label: (tooltipItem) => {
                        const dataPoint = data[tooltipItem.dataIndex];
                        const hasValue = dataPoint.hasValue
                        const prefix = _.isEmpty(params.tooltipValuePrefix) ? "" : `${params.tooltipValuePrefix}: `
                        const postfix = params.tooltipValuePostfix || ""
                        const value = tooltipItem.parsed.y;
                        if (hasValue) {
                            const valueFormatted = CalculationUtils.formatNumericValue(value)
                            return ` ${prefix}${valueFormatted}${postfix}`
                        }
                        return ` ${prefix}n/a`
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                    drawBorder: false,
                    drawTicks: false
                },
                ticks: {
                    maxRotation: 0,
                    padding: 10
                }
            },
            y: {
                grid: {
                    drawOnChartArea: false,
                    drawBorder: false,
                    drawTicks: false
                },
                min: yScaleMin,
                max: yScaleMax,
                ticks: {
                    callback: tickValueFormatterCallback,
                    precision: 0,
                    padding: 10,
                }
            }
        }
    };
    return {
        options: options,
        data: {
            labels,
            datasets: [
                {
                    data: data.map(v => v.y),
                    clip: 5,
                    borderColor: ctx => {
                        if (data[ctx.dataIndex] && !data[ctx.dataIndex].hasValue) {
                            return INCOMPLETE_POINT_BORDER_COLOR
                        }
                        return getColorByIndex(ctx.datasetIndex)
                    },
                    backgroundColor: ctx => {
                        if (data[ctx.dataIndex] && !data[ctx.dataIndex].hasValue) {
                            return INCOMPLETE_POINT_BACKGROUND_COLOR
                        }
                        return getColorByIndex(ctx.datasetIndex)
                    },
                    pointRadius: ctx => {
                        if (data[ctx.dataIndex] && !data[ctx.dataIndex].hasValue) {
                            return INCOMPLETE_POINT_RADIUS
                        }
                        return 0
                    },
                    borderWidth: 2,
                    tension: 0.3,
                }
            ],
        }
    }
}

const provideCommonOptionsForHourlyChart = (data: Array<ChartHourlyDataSource> | undefined, parameters: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (data && parameters) {
        if (data.length > 0) {
            const granularitySeconds = DAY_SECONDS / data[0].values.length
            const chartHourlyData = prepareChartHourlyData(data, granularitySeconds)
            if (chartHourlyData) {
                return optionsForHourlyChart(chartHourlyData, parameters, granularitySeconds)
            }
        }
    }
    return undefined
}

const provideCommonOptionsForDailyChart = (data: ChartDailyData | undefined, parameters: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (data && parameters) {
        return optionsForDailyChart(data, parameters)
    }
    return undefined
}

const provideCommonOptionsForDailyChartWithNumericEntity = (source: DailyChartWithNumericEntityData | undefined, parameters: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (source && parameters) {
        return optionsForDailyChartWithNumericEntity(source, parameters)
    }
    return undefined
}

const provideCommonOptionsForTrendShiftDataChart = (source: Array<TrendSectionShiftData> | undefined, parameters: ChartOptionsParams): ChartJSChartContext | undefined => {
    if (source && parameters) {
        return optionsForForTrendShiftDataChart(source, parameters)
    }
    return undefined
}

export const ChartJSUtils = {
    prepareChartDailyData: prepareChartDailyData,
    prepareChartDailyDataWithNumericEntityFor: prepareChartDailyDataWithNumericEntityFor,
    provideCommonOptionsForHourlyChart: provideCommonOptionsForHourlyChart,
    provideCommonOptionsForDailyChart: provideCommonOptionsForDailyChart,
    provideCommonOptionsForDailyChartWithNumericEntity: provideCommonOptionsForDailyChartWithNumericEntity,
    provideCommonOptionsForTrendShiftDataChart: provideCommonOptionsForTrendShiftDataChart,
}