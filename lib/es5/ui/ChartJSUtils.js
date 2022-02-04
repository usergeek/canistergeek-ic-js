"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartJSUtils = exports.analyzeSeriesDataAvailabilityStateMarkers = void 0;
const lodash_1 = __importDefault(require("lodash"));
const Constants_1 = require("../dataProvider/Constants");
const ChartJSWithOptionsComponent_1 = require("./ChartJSWithOptionsComponent");
const DateUtils_1 = require("../dataProvider/DateUtils");
const DateTimeUtils_1 = require("./DateTimeUtils");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const tickValueFormatterCallback = (value) => {
    const ranges = [
        { divider: 1e12, suffix: 'T' },
        { divider: 1e9, suffix: 'G' },
        { divider: 1e6, suffix: 'M' },
        { divider: 1e3, suffix: 'k' }
    ];
    function formatNumber(n) {
        const multiplier = n < 0 ? -1 : 1;
        for (let i = 0; i < ranges.length; i++) {
            if (n * multiplier >= ranges[i].divider) {
                return (n / ranges[i].divider).toString() + ranges[i].suffix;
            }
        }
        return n;
    }
    return formatNumber(value);
};
/**
 * Method returns indexes of single points from series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
const analyzeSeriesDataAvailabilityStateMarkers = (seriesData, seriesDataAvailabilityStates) => {
    const singlePointIndexes = [];
    if (seriesData.length == 1 && seriesDataAvailabilityStates.length == 1) {
        const markerState = seriesDataAvailabilityStates[0];
        if (markerState == "complete") {
            singlePointIndexes.push(0);
        }
    }
    else {
        lodash_1.default.each(seriesDataAvailabilityStates, (markerState, idx) => {
            if (idx > 1) {
                const aState = seriesDataAvailabilityStates[idx - 2];
                const bState = seriesDataAvailabilityStates[idx - 1];
                const cState = markerState;
                if (aState == "noData" && bState == "complete" && cState == "noData") {
                    singlePointIndexes.push(idx - 1);
                }
            }
            if (idx === 1) {
                const aState = seriesDataAvailabilityStates[idx - 1];
                const bState = seriesDataAvailabilityStates[idx];
                if (aState == "complete" && bState == "noData") {
                    singlePointIndexes.push(idx - 1);
                }
            }
        });
    }
    return singlePointIndexes;
};
exports.analyzeSeriesDataAvailabilityStateMarkers = analyzeSeriesDataAvailabilityStateMarkers;
const prepareChartHourlyData = (source, granularitySeconds) => {
    if (source) {
        const itemsByDays = source.map((sourceValue) => {
            let currentMillis = Number(sourceValue.timeMillis);
            const millisToAddForEachInterval = (86400 / sourceValue.values.length) * 1000;
            return sourceValue.values.map((value, idx) => {
                const point = {
                    x: currentMillis + millisToAddForEachInterval * idx,
                    y: value > 0 ? Number(value) : null
                };
                return point;
            });
        });
        const dataPoints = lodash_1.default.flatten(itemsByDays);
        const seriesDataAvailabilityStates = [];
        lodash_1.default.each(dataPoints, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData");
            }
            else {
                seriesDataAvailabilityStates.push("complete");
            }
        });
        const singlePointIndexes = (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(dataPoints, seriesDataAvailabilityStates);
        let lastIncompletePointIndex = -1;
        for (let i = dataPoints.length - 1; i >= 0; i--) {
            const pointOptionsObject = dataPoints[i];
            if (pointOptionsObject.y != null && pointOptionsObject.x) {
                const diffMillis = new Date().getTime() - pointOptionsObject.x;
                if (diffMillis < (granularitySeconds * 1000)) {
                    lastIncompletePointIndex = i;
                }
                break;
            }
        }
        return {
            data: dataPoints,
            borderColor: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == lastIncompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS;
                }
                if (singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1;
                }
                return 0;
            }
        };
    }
};
const prepareChartDailyData = (source, valueProvider) => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils_1.DateUtils.getStartOfTodayMilliseconds();
        let incompletePointIndex = -1;
        const dataPoints = source.map((sourceValue, idx) => {
            const x = Number(sourceValue.timeMillis);
            const value = Number(valueProvider(sourceValue));
            const y = value > 0 ? value : null;
            const point = {
                x: x,
                y: y
            };
            const isToday = x == startOfTodayMilliseconds;
            if (isToday) {
                incompletePointIndex = idx;
            }
            return point;
        });
        const seriesDataAvailabilityStates = [];
        lodash_1.default.each(dataPoints, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData");
            }
            else {
                seriesDataAvailabilityStates.push("complete");
            }
        });
        const singlePointIndexes = (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(dataPoints, seriesDataAvailabilityStates);
        return {
            data: dataPoints,
            borderColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS;
                }
                if (singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1;
                }
                return 0;
            }
        };
    }
};
const INCOMPLETE_POINT_BORDER_COLOR = "#ccc";
const INCOMPLETE_POINT_BACKGROUND_COLOR = "#fff";
const INCOMPLETE_POINT_RADIUS = 3;
const POINT_RADIUS = 1;
const prepareChartDailyDataWithNumericEntityFor = (source, numericEntityProvider) => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils_1.DateUtils.getStartOfTodayMilliseconds();
        let incompletePointIndex = -1;
        //avg
        const valuesAvg = [];
        const valuesAvgAvailabilityStates = [];
        source.forEach((sourceValue, idx) => {
            const x = Number(sourceValue.timeMillis);
            const numericEntity = numericEntityProvider(sourceValue);
            const isToday = x == startOfTodayMilliseconds;
            if (isToday) {
                incompletePointIndex = idx;
            }
            //avg
            const avgValue = Number(numericEntity.avg) == 0 ? null : Number(numericEntity.avg);
            valuesAvgAvailabilityStates.push(avgValue == null ? "noData" : "complete");
            valuesAvg.push({ x: x, y: avgValue });
        });
        //avg
        const valuesAvg_singlePointIndexes = (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(valuesAvg, valuesAvgAvailabilityStates);
        const valuesAvg_dailyChartWithNumericEntityDataItem = {
            data: valuesAvg,
            seriesName: "Avg",
            borderColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BORDER_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            backgroundColor: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_BACKGROUND_COLOR;
                }
                return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
            },
            pointRadius: ctx => {
                if (ctx.dataIndex == incompletePointIndex) {
                    return INCOMPLETE_POINT_RADIUS;
                }
                if (valuesAvg_singlePointIndexes.includes(ctx.dataIndex)) {
                    return 1;
                }
                return 0;
            }
        };
        return [
            valuesAvg_dailyChartWithNumericEntityDataItem,
        ];
    }
};
const optionsForHourlyChart = (chartHourlyData, params, granularitySeconds) => {
    if (!chartHourlyData) {
        return undefined;
    }
    const title = params.chartTitle;
    const labels = [];
    const options = {
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
                        return DateTimeUtils_1.DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "dayTime");
                    },
                    label: (tooltipItem) => {
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils_1.CalculationUtils.formatNumericValue(value);
                        return ` ${valueFormatted}${params.tooltipValuePostfix || ""}`;
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
                    display: !lodash_1.default.isEmpty(params.yAxisTitle),
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
                    borderColor: chartHourlyData.borderColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
                    backgroundColor: chartHourlyData.backgroundColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: chartHourlyData.pointRadius || 0,
                }
            ],
        }
    };
};
const optionsForDailyChart = (chartDailyData, params) => {
    if (!chartDailyData) {
        return undefined;
    }
    const title = params.chartTitle;
    const labels = [];
    const options = {
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
                        return DateTimeUtils_1.DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day");
                    },
                    label: (tooltipItem) => {
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils_1.CalculationUtils.formatNumericValue(value);
                        return ` ${valueFormatted}${params.tooltipValuePostfix || ""}`;
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
                    display: !lodash_1.default.isEmpty(params.yAxisTitle),
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
                    borderColor: chartDailyData.borderColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
                    backgroundColor: chartDailyData.backgroundColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: chartDailyData.pointRadius || 0,
                }
            ],
        }
    };
};
const optionsForDailyChartWithNumericEntity = (source, params) => {
    if (!source) {
        return undefined;
    }
    const title = params.chartTitle;
    const labels = [];
    const legendVisible = source.length > 1;
    const options = {
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
                        return DateTimeUtils_1.DateTimeUtils.formatDate(tooltipItems[0].parsed.x, "day");
                    },
                    label: (tooltipItem) => {
                        const label = legendVisible ? ` ${tooltipItem.dataset.label}:` : "";
                        const value = tooltipItem.parsed.y;
                        const valueFormatted = CalculationUtils_1.CalculationUtils.formatNumericValue(value);
                        return `${label} ${valueFormatted}${params.tooltipValuePostfix || ""}`;
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
                    display: !lodash_1.default.isEmpty(params.yAxisTitle),
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
            borderColor: value.borderColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
            backgroundColor: value.backgroundColor || (ctx => (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex)),
            borderWidth: 2,
            tension: 0,
            pointRadius: value.pointRadius || 0,
        };
    });
    return {
        options: options,
        data: {
            labels,
            datasets: datasets,
        }
    };
};
const optionsForForTrendShiftDataChart = (source, params) => {
    const data = source.map((value) => {
        if (value.value != undefined) {
            return {
                y: Number(value.value),
                interval: value.interval,
                hasValue: true
            };
        }
        return {
            y: null,
            interval: value.interval,
            hasValue: false
        };
    }).reverse();
    let hasNegativeValues = false;
    let hasPositiveValues = false;
    lodash_1.default.each(data, (value, idx) => {
        if (value.y == null) {
            value.y = 0;
        }
        if (!hasNegativeValues && value.y < 0) {
            hasNegativeValues = true;
        }
        if (!hasPositiveValues && value.y > 0) {
            hasPositiveValues = true;
        }
    });
    const labels = data.map((value, idx) => {
        const reverseIndex = data.length - 1 - idx;
        const shiftBy24HoursAsString = -source[reverseIndex].numberOfShiftsBy24Hours;
        return `${shiftBy24HoursAsString}`;
    });
    let yScaleMin = undefined;
    let yScaleMax = undefined;
    if (hasPositiveValues && !hasNegativeValues) {
        yScaleMin = 0;
    }
    else if (!hasPositiveValues && hasNegativeValues) {
        yScaleMax = 0;
    }
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: tooltipItems => {
                        const dataPoint = data[tooltipItems[0].dataIndex];
                        const interval = dataPoint.interval;
                        const dateFrom = DateTimeUtils_1.DateTimeUtils.formatDate(interval.fromMillis, "dayTime");
                        const dateTo = DateTimeUtils_1.DateTimeUtils.formatDate(interval.toMillis, "dayTime");
                        return `${dateFrom} - ${dateTo}`;
                    },
                    label: (tooltipItem) => {
                        const dataPoint = data[tooltipItem.dataIndex];
                        const hasValue = dataPoint.hasValue;
                        const prefix = lodash_1.default.isEmpty(params.tooltipValuePrefix) ? "" : `${params.tooltipValuePrefix}: `;
                        const postfix = params.tooltipValuePostfix || "";
                        const value = tooltipItem.parsed.y;
                        if (hasValue) {
                            const valueFormatted = CalculationUtils_1.CalculationUtils.formatNumericValue(value);
                            return ` ${prefix}${valueFormatted}${postfix}`;
                        }
                        return ` ${prefix}n/a`;
                    }
                }
            }
        },
        scales: {
            x: {
                // type: "time",
                // time: {
                //     displayFormats: {
                //         "day": "MM/DD",
                //         "hour": "h:mma"
                //     }
                // },
                grid: {
                    drawOnChartArea: false,
                    drawBorder: false,
                    drawTicks: false
                },
                ticks: {
                    // autoSkip: true,
                    maxRotation: 0,
                    // major: {
                    //     enabled: true
                    // },
                    padding: 10
                }
            },
            y: {
                // title: {
                //     display: !_.isEmpty(params.yAxisTitle),
                //     text: params.yAxisTitle
                // },
                grid: {
                    drawOnChartArea: false,
                    drawBorder: false,
                    drawTicks: false
                },
                // grace: "1%",
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
                            return INCOMPLETE_POINT_BORDER_COLOR;
                        }
                        return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
                    },
                    backgroundColor: ctx => {
                        if (data[ctx.dataIndex] && !data[ctx.dataIndex].hasValue) {
                            return INCOMPLETE_POINT_BACKGROUND_COLOR;
                        }
                        return (0, ChartJSWithOptionsComponent_1.getColorByIndex)(ctx.datasetIndex);
                    },
                    pointRadius: ctx => {
                        if (data[ctx.dataIndex] && !data[ctx.dataIndex].hasValue) {
                            return INCOMPLETE_POINT_RADIUS;
                        }
                        return 0;
                    },
                    borderWidth: 2,
                    tension: 0.3,
                }
            ],
        }
    };
};
const provideCommonOptionsForHourlyChart = (data, parameters) => {
    if (data && parameters) {
        if (data.length > 0) {
            const granularitySeconds = Constants_1.DAY_SECONDS / data[0].values.length;
            const chartHourlyData = prepareChartHourlyData(data, granularitySeconds);
            if (chartHourlyData) {
                return optionsForHourlyChart(chartHourlyData, parameters, granularitySeconds);
            }
        }
    }
    return undefined;
};
const provideCommonOptionsForDailyChart = (data, parameters) => {
    if (data && parameters) {
        return optionsForDailyChart(data, parameters);
    }
    return undefined;
};
const provideCommonOptionsForDailyChartWithNumericEntity = (source, parameters) => {
    if (source && parameters) {
        return optionsForDailyChartWithNumericEntity(source, parameters);
    }
    return undefined;
};
const provideCommonOptionsForTrendShiftDataChart = (source, parameters) => {
    if (source && parameters) {
        return optionsForForTrendShiftDataChart(source, parameters);
    }
    return undefined;
};
exports.ChartJSUtils = {
    prepareChartDailyData: prepareChartDailyData,
    prepareChartDailyDataWithNumericEntityFor: prepareChartDailyDataWithNumericEntityFor,
    provideCommonOptionsForHourlyChart: provideCommonOptionsForHourlyChart,
    provideCommonOptionsForDailyChart: provideCommonOptionsForDailyChart,
    provideCommonOptionsForDailyChartWithNumericEntity: provideCommonOptionsForDailyChartWithNumericEntity,
    provideCommonOptionsForTrendShiftDataChart: provideCommonOptionsForTrendShiftDataChart,
};
//# sourceMappingURL=ChartJSUtils.js.map