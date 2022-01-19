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
exports.SummaryTrendSectionTable = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const highcharts_1 = __importDefault(require("highcharts"));
const lodash_1 = __importDefault(require("lodash"));
const DataProvider_1 = require("../dataProvider/DataProvider");
const HighchartsDateTimeFacade_1 = require("./HighchartsDateTimeFacade");
const HighchartsWithOptionsComponent_1 = require("./HighchartsWithOptionsComponent");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const PrecalculatedTrendDataProvider_1 = require("../dataProvider/PrecalculatedTrendDataProvider");
const CommonNoDataLabel_1 = require("./CommonNoDataLabel");
const URLPathProvider_1 = require("./URLPathProvider");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const HighchartsUtils_1 = require("./HighchartsUtils");
const Chart = React.memo((props) => {
    const data = props.shiftsData.map(value => {
        if (value.value != undefined) {
            return {
                y: Number(value.value),
                custom: {
                    interval: value.interval,
                    hasValue: true
                }
            };
        }
        return {
            y: null,
            custom: {
                interval: value.interval,
                hasValue: false
            },
        };
    });
    lodash_1.default.each(data, value => {
        if (value.y == null) {
            value.y = 0;
            value.marker = HighchartsUtils_1.INCOMPLETE_MARKER;
        }
    });
    const seriesLineOptions = {
        type: "spline",
        data: data.reverse(),
    };
    const tooltip = {
        useHTML: false,
        formatter: function () {
            const point = this.point;
            // @ts-ignore
            const interval = point.options.custom.interval;
            const dateFrom = highcharts_1.default.dateFormat(HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, interval.fromMillis);
            const dateTo = highcharts_1.default.dateFormat(HighchartsDateTimeFacade_1.HighchartsDateTimeFacade.DateFormatByFunctionality.Common.tooltip.hourly, interval.toMillis);
            const symbol = "<span style='color:" + this.color + "'>\u25CF</span>";
            // @ts-ignore
            const hasValue = point.options.custom.hasValue;
            if (hasValue) {
                const value = CalculationUtils_1.CalculationUtils.formatNumericValue(point.y);
                return `<small>${dateFrom} - ${dateTo}</small><br/>${symbol} ${props.chartTitle}: <b>${value}</b>${props.tooltipValuePostfix || ""}`;
            }
            else {
                return `<small>${dateFrom} - ${dateTo}</small><br/>${symbol} ${props.chartTitle}: <span>n/a</span>`;
            }
        }
    };
    const options = {
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
            // connectNulls: true
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                formatter: function () {
                    const reverseIndex = data.length - 1 - this.pos;
                    const shiftBy24HoursAsString = -props.shiftsData[reverseIndex].numberOfShiftsBy24Hours;
                    return `${shiftBy24HoursAsString}`;
                }
            },
            lineColor: 'transparent'
        },
        yAxis: {
            title: undefined,
            gridLineColor: 'transparent',
        },
        legend: {
            enabled: false
        },
        tooltip: tooltip,
        chart: {
            height: 130,
        },
        series: [seriesLineOptions]
    };
    return React.createElement(HighchartsWithOptionsComponent_1.HighchartsWithOptionsComponent, { options: options });
}, (prevProps, nextProps) => {
    return lodash_1.default.isEqual(prevProps, nextProps);
});
const SummaryTrendSectionTable = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const precalculatedTrendDataContext = (0, PrecalculatedTrendDataProvider_1.usePrecalculatedTrendDataContext)();
    const inProgress = lodash_1.default.some(dataContext.status, value => value.inProgress);
    let precalculatedDataArray = configurationContext.configuration.canisters.map(canister => {
        return {
            canister: canister,
            data: precalculatedTrendDataContext.precalculatedData[canister.canisterId]
        };
    });
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.Table, { dataSource: precalculatedDataArray, pagination: { hideOnSinglePage: true, defaultPageSize: 20 }, size: "small", rowKey: record => record.canister.canisterId, loading: inProgress },
            React.createElement(antd_1.Table.Column, { title: "Canister", width: "16%", key: "Canister", render: (text, record) => {
                    const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId;
                    return React.createElement(react_router_dom_1.Link, { to: urlPathContext.pathToSection(record.canister.canisterId) },
                        React.createElement("span", { style: { fontSize: "1em", fontWeight: "bold" } }, canisterName));
                } }),
            React.createElement(antd_1.Table.Column, { title: "Update Calls", key: "Update Calls", width: "28%", render: (text, record) => {
                    if (record.data) {
                        return React.createElement(Chart, { shiftsData: record.data.shiftsData.updateCalls, chartTitle: "Update Calls" });
                    }
                    return React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null);
                } }),
            React.createElement(antd_1.Table.Column, { title: "Cycles Difference", key: "Cycles", width: "28%", render: (text, record) => {
                    if (record.data) {
                        return React.createElement(Chart, { shiftsData: record.data.shiftsData.cycles.difference, chartTitle: "Cycles Difference" });
                    }
                    return React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null);
                } }),
            React.createElement(antd_1.Table.Column, { title: "Memory Difference", key: "Memory", width: "28%", render: (text, record) => {
                    if (record.data) {
                        return React.createElement(Chart, { shiftsData: record.data.shiftsData.memoryDifference, chartTitle: "Memory Difference", tooltipValuePostfix: " bytes" });
                    }
                    return React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null);
                } })));
};
exports.SummaryTrendSectionTable = SummaryTrendSectionTable;
//# sourceMappingURL=SummaryTrendSectionTable.js.map