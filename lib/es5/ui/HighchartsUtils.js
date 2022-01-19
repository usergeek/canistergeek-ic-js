"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighchartsUtils = exports.analyzeSeriesDataAvailabilityStateMarkers = exports.INCOMPLETE_MARKER = void 0;
const highcharts_1 = __importDefault(require("highcharts"));
const lodash_1 = __importDefault(require("lodash"));
const DateUtils_1 = require("../dataProvider/DateUtils");
const HighchartsDateTimeFacade_1 = require("./HighchartsDateTimeFacade");
const Constants_1 = require("../dataProvider/Constants");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
exports.INCOMPLETE_MARKER = { enabled: true, fillColor: '#FFFFFF', radius: 3, lineWidth: 2, lineColor: "#cccccc" };
/**
 * Method adds single points to series data when there is no data right before certain point and right after
 * Need to find a sequence: "noData" - "complete" - "noData"
 * Method mutates *seriesData* parameter
 * @param seriesData point objects
 * @param seriesDataAvailabilityStates data states
 */
const analyzeSeriesDataAvailabilityStateMarkers = (seriesData, seriesDataAvailabilityStates) => {
    if (seriesData.length == 1 && seriesDataAvailabilityStates.length == 1) {
        const markerState = seriesDataAvailabilityStates[0];
        if (markerState == "complete") {
            seriesData[0].marker = {
                enabled: true,
                symbol: "circle",
                radius: 2
            };
        }
    }
    else {
        lodash_1.default.each(seriesDataAvailabilityStates, (markerState, idx) => {
            if (idx > 1) {
                const aState = seriesDataAvailabilityStates[idx - 2];
                const bState = seriesDataAvailabilityStates[idx - 1];
                const cState = markerState;
                if (aState == "noData" && bState == "complete" && cState == "noData") {
                    const bSeriesData = seriesData[idx - 1];
                    bSeriesData.marker = {
                        enabled: true,
                        symbol: "circle",
                        radius: 2
                    };
                }
            }
            if (idx === 1) {
                const aState = seriesDataAvailabilityStates[idx - 1];
                const bState = seriesDataAvailabilityStates[idx];
                if (aState == "complete" && bState == "noData") {
                    const aSeriesData = seriesData[idx - 1];
                    aSeriesData.marker = {
                        enabled: true,
                        symbol: "circle",
                        radius: 2
                    };
                }
            }
        });
    }
};
exports.analyzeSeriesDataAvailabilityStateMarkers = analyzeSeriesDataAvailabilityStateMarkers;
const prepareChartHourlyData = (source, granularitySeconds) => {
    if (source) {
        const itemsByDays = source.map((sourceValue) => {
            let currentMillis = Number(sourceValue.timeMillis);
            const millisToAddForEachInterval = (86400 / sourceValue.values.length) * 1000;
            return sourceValue.values.map((value, idx) => {
                return {
                    x: currentMillis + millisToAddForEachInterval * idx,
                    y: value > 0 ? Number(value) : null
                };
            });
        });
        const pointOptionsObjects = lodash_1.default.flatten(itemsByDays);
        const seriesDataAvailabilityStates = [];
        lodash_1.default.each(pointOptionsObjects, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData");
            }
            else {
                seriesDataAvailabilityStates.push("complete");
            }
        });
        (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(pointOptionsObjects, seriesDataAvailabilityStates);
        let lastPoint = undefined;
        for (let i = pointOptionsObjects.length - 1; i >= 0; i--) {
            const pointOptionsObject = pointOptionsObjects[i];
            if (pointOptionsObject.y != null) {
                lastPoint = pointOptionsObject;
                break;
            }
        }
        if (lastPoint && lastPoint.x) {
            const diffMillis = new Date().getTime() - lastPoint.x;
            if (diffMillis < (granularitySeconds * 1000)) {
                lastPoint.marker = exports.INCOMPLETE_MARKER;
            }
        }
        return pointOptionsObjects;
    }
};
const prepareChartDailyData = (source, valueProvider) => {
    if (source) {
        const startOfTodayMilliseconds = DateUtils_1.DateUtils.getStartOfTodayMilliseconds();
        const pointOptionsObjects = source.map((sourceValue) => {
            const x = Number(sourceValue.timeMillis);
            const value = Number(valueProvider(sourceValue));
            const y = value > 0 ? value : null;
            const point = {
                x: x,
                y: y
            };
            const isToday = x == startOfTodayMilliseconds;
            if (isToday) {
                point.marker = exports.INCOMPLETE_MARKER;
            }
            return point;
        });
        const seriesDataAvailabilityStates = [];
        lodash_1.default.each(pointOptionsObjects, value => {
            if (value.y == null) {
                seriesDataAvailabilityStates.push("noData");
            }
            else {
                seriesDataAvailabilityStates.push("complete");
            }
        });
        (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(pointOptionsObjects, seriesDataAvailabilityStates);
        return pointOptionsObjects;
    }
};
const prepareChartDailyDataWithNumericEntityFor = (source, numericEntityProvider) => {
    if (source) {
        const valuesAvg = [];
        const valuesAvgAvailabilityStates = [];
        const startOfTodayMilliseconds = DateUtils_1.DateUtils.getStartOfTodayMilliseconds();
        source.forEach((sourceValue) => {
            const numericEntity = numericEntityProvider(sourceValue);
            const avgValue = Number(numericEntity.avg) == 0 ? null : Number(numericEntity.avg);
            valuesAvgAvailabilityStates.push(avgValue == null ? "noData" : "complete");
            const x = Number(sourceValue.timeMillis);
            const point = { x: x, y: avgValue };
            const isToday = x == startOfTodayMilliseconds;
            if (isToday) {
                point.marker = exports.INCOMPLETE_MARKER;
            }
            valuesAvg.push(point);
        });
        (0, exports.analyzeSeriesDataAvailabilityStateMarkers)(valuesAvg, valuesAvgAvailabilityStates);
        return [
            { data: valuesAvg },
        ];
    }
};
const optionsForHourlyChart = (chartHourlyData, params, granularitySeconds) => {
    if (!chartHourlyData) {
        return {};
    }
    const title = params.chartTitle;
    const currentSeries = {
        type: "line",
        data: chartHourlyData,
        name: params === null || params === void 0 ? void 0 : params.seriesName,
        showInLegend: ((params === null || params === void 0 ? void 0 : params.seriesName) || "").length > 0,
        turboThreshold: (Constants_1.DAY_MILLIS / (granularitySeconds * 1000)) * 9
    };
    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils_1.CalculationUtils.formatNumericValue(point.y);
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>";
            const timestamp = new Date(this.x).getTime();
            const date = highcharts_1.default.dateFormat(HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, timestamp);
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`;
        }
    };
    const yAxis = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: { zoomType: "xy", },
        title: { text: title },
        series: [currentSeries],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    };
};
const optionsForDailyChart = (chartDailyData, params) => {
    if (!chartDailyData) {
        return {};
    }
    const title = params.chartTitle;
    const currentSeries = {
        type: "line",
        data: chartDailyData,
        name: params === null || params === void 0 ? void 0 : params.seriesName,
        showInLegend: ((params === null || params === void 0 ? void 0 : params.seriesName) || "").length > 0,
    };
    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils_1.CalculationUtils.formatNumericValue(point.y);
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>";
            const timestamp = new Date(this.x).getTime();
            const date = highcharts_1.default.dateFormat(HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.daily, timestamp);
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`;
        }
    };
    const yAxis = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: { zoomType: "xy", },
        title: { text: title },
        series: [currentSeries],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 24 * 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    };
};
const optionsForDailyChartWithNumericEntity = (source, params) => {
    if (!source) {
        return {};
    }
    const title = params.chartTitle;
    const series = source.map(value => {
        return {
            type: "line",
            data: value.data,
            name: value.seriesName,
            showInLegend: (value.seriesName || "").length > 0,
        };
    });
    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            const value = CalculationUtils_1.CalculationUtils.formatNumericValue(point.y);
            const symbol = "<span style='color:" + point.series.color + "'>\u25CF</span>";
            const timestamp = new Date(this.x).getTime();
            const date = highcharts_1.default.dateFormat(HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.daily, timestamp);
            return `<small>${date}</small><br/>${symbol}<b> ${value}</b>${params.tooltipValuePostfix || ""}`;
        }
    };
    const yAxis = {
        title: {
            text: params.yAxisTitle
        },
        min: 0,
        allowDecimals: false
    };
    return {
        chart: { zoomType: "xy", },
        title: { text: title },
        series: series,
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.xAxis.dateTimeLabelFormats,
            minTickInterval: 24 * 60 * 60 * 1000,
            startOnTick: false,
        },
        yAxis: yAxis,
        tooltip: tooltip,
    };
};
const provideCommonOptionsForHourlyChart = (data, parameters) => {
    if (data && parameters) {
        if (data.length > 0) {
            const granularitySeconds = Constants_1.DAY_SECONDS / data[0].values.length;
            const chartDataXYPoints = prepareChartHourlyData(data, granularitySeconds);
            if (chartDataXYPoints) {
                return optionsForHourlyChart(chartDataXYPoints, parameters, granularitySeconds);
            }
        }
    }
    return {};
};
const provideCommonOptionsForDailyChart = (data, parameters) => {
    if (data && parameters) {
        return optionsForDailyChart(data, parameters);
    }
    return {};
};
const provideCommonOptionsForDailyChartWithNumericEntity = (source, parameters) => {
    if (source && parameters) {
        return optionsForDailyChartWithNumericEntity(source, parameters);
    }
    return {};
};
exports.HighchartsUtils = {
    prepareChartDailyData: prepareChartDailyData,
    prepareChartDailyDataWithNumericEntityFor: prepareChartDailyDataWithNumericEntityFor,
    provideCommonOptionsForHourlyChart: provideCommonOptionsForHourlyChart,
    provideCommonOptionsForDailyChart: provideCommonOptionsForDailyChart,
    provideCommonOptionsForDailyChartWithNumericEntity: provideCommonOptionsForDailyChartWithNumericEntity,
};
//# sourceMappingURL=HighchartsUtils.js.map