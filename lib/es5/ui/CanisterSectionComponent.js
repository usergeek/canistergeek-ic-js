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
exports.CanisterSectionComponent = exports.CanisterSectionComponentBlackholeSource = exports.CanisterSectionComponentCanisterSource = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const DataProvider_1 = require("../dataProvider/DataProvider");
const DashboardUtils_1 = require("./DashboardUtils");
const CanisterMetricsErrorPageAlert_1 = require("./CanisterMetricsErrorPageAlert");
const lodash_1 = __importDefault(require("lodash"));
const DataProviderUtils_1 = require("../dataProvider/DataProviderUtils");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const SummaryRealtimeSimpleMetricWrapperLabelComponent_1 = require("./SummaryRealtimeSimpleMetricWrapperLabelComponent");
const PrecalculatedRealtimeDataProviderCalculator_1 = require("../dataProvider/PrecalculatedRealtimeDataProviderCalculator");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const ChartJSComponentSupplierProvider_1 = require("./ChartJSComponentSupplierProvider");
const ChartJSComponentWrapper_1 = require("./ChartJSComponentWrapper");
const ChartJSUtils_1 = require("./ChartJSUtils");
const use_custom_compare_1 = require("use-custom-compare");
const CanisterSectionComponentCanisterSource = (props) => {
    var _a, _b, _c, _d, _e;
    const canisterId = props.canisterId;
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const metricsSource = props.metricsSource;
    const canisterError = dataContext.error[canisterId];
    const canisterInProgress = (_a = dataContext.status[canisterId]) === null || _a === void 0 ? void 0 : _a.inProgress;
    (0, use_custom_compare_1.useCustomCompareEffect)(() => {
        dataContext.getCanisterMetrics(DashboardUtils_1.DashboardUtils.getCanisterPageParams(canisterId, metricsSource));
    }, [dataContext.getCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const dataHourly = dataContext.dataHourly;
    const dataDaily = dataContext.dataDaily;
    const canisterUpdateCallsAggregatedDataHourly = (_b = DataProviderUtils_1.DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)) === null || _b === void 0 ? void 0 : _b.map(value => ({ timeMillis: value.timeMillis, values: value.updateCalls }));
    const canisterCyclesAggregatedDataHourly = (_c = DataProviderUtils_1.DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)) === null || _c === void 0 ? void 0 : _c.map(value => ({ timeMillis: value.timeMillis, values: value.canisterCycles }));
    const canisterMemoryAggregatedDataHourly = (_d = DataProviderUtils_1.DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)) === null || _d === void 0 ? void 0 : _d.map(value => ({ timeMillis: value.timeMillis, values: value.canisterMemorySize }));
    const canisterHeapMemoryAggregatedDataHourly = (_e = DataProviderUtils_1.DataProviderUtils.getDataHourlyMetrics(dataHourly, canisterId)) === null || _e === void 0 ? void 0 : _e.map(value => ({ timeMillis: value.timeMillis, values: value.canisterHeapMemorySize }));
    const dataDailyMetrics = DataProviderUtils_1.DataProviderUtils.getDataDailyMetrics(dataDaily, canisterId);
    const dataHourlyLatestMetrics = DataProviderUtils_1.DataProviderUtils.getDataHourlyLatestMetrics(dataHourly, canisterId);
    const dataDailyLatestMetrics = DataProviderUtils_1.DataProviderUtils.getDataDailyLatestMetrics(dataDaily, canisterId);
    const configuration = configurationContext.configuration;
    const configurationMetrics = configuration.metrics;
    const configurationMetricsCycles = configurationMetrics.cycles;
    const configurationMetricsMemory = configurationMetrics.memory;
    const configurationMetricsHeapMemory = configurationMetrics.heapMemory;
    return React.createElement(React.Fragment, null,
        React.createElement(CanisterMetricsErrorPageAlert_1.CanisterMetricsErrorPageAlert, { error: lodash_1.default.pick(dataContext.error, canisterId) }),
        React.createElement(antd_1.PageHeader, { title: React.createElement(React.Fragment, null,
                "Today ",
                canisterInProgress ? React.createElement(antd_1.Spin, { size: "small", style: { marginLeft: "15px" } }) : null) },
            React.createElement(antd_1.Row, null,
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Update calls")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getUpdateCallsMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Cumulative" }, CalculationUtils_1.CalculationUtils.formatSignificantSumArray(dataHourlyLatestMetrics === null || dataHourlyLatestMetrics === void 0 ? void 0 : dataHourlyLatestMetrics.updateCalls)))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Cycles")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getCyclesMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Average" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterCycles.avg, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Min" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterCycles.min, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Max" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterCycles.max, configurationMetricsCycles.metricsFormat, configurationMetricsCycles.thresholds) })))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Memory")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMemoryMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Average" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterMemorySize.avg, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Min" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterMemorySize.min, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Max" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterMemorySize.max, configurationMetricsMemory.metricsFormat, configurationMetricsMemory.thresholds) })))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Heap Memory")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getHeapMemoryMetricWrapperFromHourlyMetricsData(dataHourlyLatestMetrics, configuration) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Average" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterHeapMemorySize.avg, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Min" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterHeapMemorySize.min, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds) })),
                        React.createElement(antd_1.Descriptions.Item, { label: "Max" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMetricWrapperFromValue(dataDailyLatestMetrics === null || dataDailyLatestMetrics === void 0 ? void 0 : dataDailyLatestMetrics.canisterHeapMemorySize.max, configurationMetricsHeapMemory.metricsFormat, configurationMetricsHeapMemory.thresholds) })))))),
        React.createElement(antd_1.PageHeader, { title: "Hourly Charts" },
            React.createElement(antd_1.Row, { gutter: [16, 16] },
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: canisterCyclesAggregatedDataHourly, parameters: {
                                    chartTitle: "Cycles",
                                    yAxisTitle: "Count"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForHourlyChart },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Cycles" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: canisterUpdateCallsAggregatedDataHourly, parameters: {
                                    chartTitle: "Update Calls",
                                    yAxisTitle: "Count"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForHourlyChart },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Update Calls" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: canisterMemoryAggregatedDataHourly, parameters: {
                                    chartTitle: "Memory Size",
                                    yAxisTitle: "Bytes",
                                    tooltipValuePostfix: " bytes"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForHourlyChart },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Memory Size" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: canisterHeapMemoryAggregatedDataHourly, parameters: {
                                    chartTitle: "Heap Memory Size",
                                    yAxisTitle: "Bytes",
                                    tooltipValuePostfix: " bytes"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForHourlyChart },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Heap Memory Size" });
                                }))))))),
        React.createElement(antd_1.PageHeader, { title: "Daily Charts" },
            React.createElement(antd_1.Row, { gutter: [16, 16] },
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: ChartJSUtils_1.ChartJSUtils.prepareChartDailyData(dataDailyMetrics, source => source.updateCalls), parameters: {
                                    chartTitle: "Update Calls Daily",
                                    yAxisTitle: "Count"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForDailyChart },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Update Calls Daily" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: ChartJSUtils_1.ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterCycles), parameters: {
                                    chartTitle: "Cycles Daily",
                                    yAxisTitle: "Count"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Cycles Daily" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: ChartJSUtils_1.ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterMemorySize), parameters: {
                                    chartTitle: "Memory Daily",
                                    yAxisTitle: "Bytes",
                                    tooltipValuePostfix: " bytes"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Memory Daily" });
                                }))))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, { span: 24 },
                            React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { error: canisterError, data: ChartJSUtils_1.ChartJSUtils.prepareChartDailyDataWithNumericEntityFor(dataDailyMetrics, dailyMetricsData => dailyMetricsData.canisterHeapMemorySize), parameters: {
                                    chartTitle: "Heap Memory Daily",
                                    yAxisTitle: "Bytes",
                                    tooltipValuePostfix: " bytes"
                                }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForDailyChartWithNumericEntity },
                                React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
                                    return React.createElement(ChartJSComponentWrapper_1.ChartJSComponentWrapper, { supplier: context.state, inProgress: canisterInProgress, chartIdentifier: "Heap Memory Daily" });
                                }))))))));
};
exports.CanisterSectionComponentCanisterSource = CanisterSectionComponentCanisterSource;
const CanisterSectionComponentBlackholeSource = (props) => {
    var _a;
    const canisterId = props.canisterId;
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const configuration = configurationContext.configuration;
    const metricsSource = props.metricsSource;
    const canisterInProgress = (_a = dataContext.status[canisterId]) === null || _a === void 0 ? void 0 : _a.inProgress;
    (0, use_custom_compare_1.useCustomCompareEffect)(() => {
        dataContext.getCanisterMetrics(DashboardUtils_1.DashboardUtils.getCanisterPageParams(canisterId, metricsSource));
    }, [dataContext.getCanisterMetrics, canisterId, metricsSource], (prevDeps, nextDeps) => lodash_1.default.isEqual(prevDeps, nextDeps));
    const dataBlackhole = dataContext.dataBlackhole;
    const currentCyclesMetricWrapper = PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getCyclesMetricWrapperFromBlackholeData(dataBlackhole[canisterId], configuration);
    const currentMemoryMetricWrapper = PrecalculatedRealtimeDataProviderCalculator_1.PrecalculatedRealtimeDataProviderCalculator.getMemoryMetricWrapperFromBlackholeData(dataBlackhole[canisterId], configuration);
    return React.createElement(React.Fragment, null,
        React.createElement(CanisterMetricsErrorPageAlert_1.CanisterMetricsErrorPageAlert, { error: dataContext.error }),
        React.createElement(antd_1.PageHeader, { title: React.createElement(React.Fragment, null,
                "Today ",
                canisterInProgress ? React.createElement(antd_1.Spin, { size: "small", style: { marginLeft: "15px" } }) : null) },
            React.createElement(antd_1.Row, null,
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Cycles")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: currentCyclesMetricWrapper })))),
                React.createElement(antd_1.Col, { span: 24 },
                    React.createElement(antd_1.Descriptions, { column: 6, size: "small" },
                        React.createElement(antd_1.Descriptions.Item, null,
                            React.createElement(antd_1.Typography.Title, { level: 5 }, "Memory")),
                        React.createElement(antd_1.Descriptions.Item, { label: "Current" },
                            React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: currentMemoryMetricWrapper })))))));
};
exports.CanisterSectionComponentBlackholeSource = CanisterSectionComponentBlackholeSource;
const CanisterSectionComponent = (props) => {
    var _a;
    const canisterId = props.canisterId;
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const metricsSource = (_a = configurationContext.configuration.canisters.find(v => v.canisterId == canisterId)) === null || _a === void 0 ? void 0 : _a.metricsSource;
    if (DashboardUtils_1.DashboardUtils.isMetricsSourceCanister(metricsSource)) {
        return React.createElement(exports.CanisterSectionComponentCanisterSource, { canisterId: props.canisterId, metricsSource: metricsSource });
    }
    else if (DashboardUtils_1.DashboardUtils.isMetricsSourceBlackhole(metricsSource)) {
        return React.createElement(exports.CanisterSectionComponentBlackholeSource, { canisterId: props.canisterId, metricsSource: metricsSource });
    }
    return null;
};
exports.CanisterSectionComponent = CanisterSectionComponent;
//# sourceMappingURL=CanisterSectionComponent.js.map