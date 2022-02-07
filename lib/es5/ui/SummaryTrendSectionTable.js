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
const lodash_1 = __importDefault(require("lodash"));
const DataProvider_1 = require("../dataProvider/DataProvider");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const PrecalculatedTrendDataProvider_1 = require("../dataProvider/PrecalculatedTrendDataProvider");
const CommonNoDataLabel_1 = require("./CommonNoDataLabel");
const URLPathProvider_1 = require("./URLPathProvider");
const ChartJSWithOptionsComponent_1 = require("./ChartJSWithOptionsComponent");
const ChartJSUtils_1 = require("./ChartJSUtils");
const ChartJSComponentSupplierProvider_1 = require("./ChartJSComponentSupplierProvider");
const ChartJS = React.memo((props) => {
    return React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierProvider, { data: props.shiftsData, parameters: {
            tooltipValuePrefix: props.tooltipValuePrefix,
            tooltipValuePostfix: props.tooltipValuePostfix,
            yAxisMin: props.yAxisMin,
        }, chartContextProviderFn: ChartJSUtils_1.ChartJSUtils.provideCommonOptionsForTrendShiftDataChart },
        React.createElement(ChartJSComponentSupplierProvider_1.ChartJSComponentSupplierContext.Consumer, null, context => {
            if (context.state.chartContext) {
                return React.createElement(ChartJSWithOptionsComponent_1.ChartJSWithOptionsComponent, { chartContext: context.state.chartContext, cssProps: { height: "130px" } });
            }
            return React.createElement(CommonNoDataLabel_1.CommonNoDataLabel, null);
        }));
}, (prevProps, nextProps) => {
    return lodash_1.default.isEqual(prevProps, nextProps);
});
const SummaryTrendSectionTable = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const precalculatedTrendDataContext = (0, PrecalculatedTrendDataProvider_1.usePrecalculatedTrendDataContext)();
    const inProgress = lodash_1.default.some(dataContext.status, value => value.inProgress);
    let precalculatedDataArray = lodash_1.default.compact(lodash_1.default.map(configurationContext.configuration.canisters, canister => {
        const data = precalculatedTrendDataContext.precalculatedData[canister.canisterId];
        if (data) {
            return { canister: canister, data: data };
        }
    }));
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.Table, { dataSource: precalculatedDataArray, pagination: { hideOnSinglePage: true, defaultPageSize: 20 }, size: "small", rowKey: record => record.canister.canisterId, loading: inProgress },
            React.createElement(antd_1.Table.Column, { title: "Canister", width: "16%", key: "Canister", render: (text, record) => {
                    const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId;
                    return React.createElement(react_router_dom_1.Link, { to: urlPathContext.pathToSection(record.canister.canisterId) },
                        React.createElement("span", { style: { fontSize: "1em", fontWeight: "bold" } }, canisterName));
                } }),
            React.createElement(antd_1.Table.Column, { title: "Update Calls", key: "Update Calls", width: "28%", render: (text, record) => {
                    return React.createElement(ChartJS, { shiftsData: record.data.shiftsData.updateCalls, tooltipValuePrefix: "Update Calls", yAxisMin: 0 });
                } }),
            React.createElement(antd_1.Table.Column, { title: "Cycles Difference", key: "Cycles", width: "28%", render: (text, record) => {
                    return React.createElement(ChartJS, { shiftsData: record.data.shiftsData.cycles.difference, tooltipValuePrefix: "Cycles Difference" });
                } }),
            React.createElement(antd_1.Table.Column, { title: "Memory Difference", key: "Memory", width: "28%", render: (text, record) => {
                    return React.createElement(ChartJS, { shiftsData: record.data.shiftsData.memoryDifference, tooltipValuePrefix: "Memory Difference", tooltipValuePostfix: " bytes" });
                } })));
};
exports.SummaryTrendSectionTable = SummaryTrendSectionTable;
//# sourceMappingURL=SummaryTrendSectionTable.js.map