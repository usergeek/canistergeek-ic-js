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
exports.SummaryRealtimeSectionTable = void 0;
const React = __importStar(require("react"));
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const DataProvider_1 = require("../dataProvider/DataProvider");
const SummaryRealtimeSimpleMetricWrapperLabelComponent_1 = require("./SummaryRealtimeSimpleMetricWrapperLabelComponent");
const lodash_1 = __importDefault(require("lodash"));
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const PrecalculatedRealtimeDataProvider_1 = require("../dataProvider/PrecalculatedRealtimeDataProvider");
const SummaryRealtimeLineProgressWithOutdatedInfo_1 = require("./SummaryRealtimeLineProgressWithOutdatedInfo");
const URLPathProvider_1 = require("./URLPathProvider");
const SummaryRealtimeSectionTable = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const precalculatedRealtimeDataContext = (0, PrecalculatedRealtimeDataProvider_1.usePrecalculatedRealtimeDataContext)();
    const inProgress = lodash_1.default.some(dataContext.status, value => {
        return value.inProgress;
    });
    const precalculatedDataArray = lodash_1.default.compact(lodash_1.default.map(configurationContext.configuration.canisters, (canister) => {
        const data = precalculatedRealtimeDataContext.precalculatedData[canister.canisterId];
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
            React.createElement(antd_1.Table.Column, { title: "Cycles", key: "Cycles", width: "28%", render: (text, record) => {
                    return React.createElement(SummaryRealtimeSimpleMetricWrapperLabelComponent_1.SummaryRealtimeSimpleMetricWrapperLabelComponent, { metricWrapper: record.data.cycles });
                } }),
            React.createElement(antd_1.Table.Column, { title: "Memory", key: "Memory2", width: "28%", render: (text, record) => {
                    const value = record.data.memory;
                    return React.createElement(SummaryRealtimeLineProgressWithOutdatedInfo_1.SummaryRealtimeLineProgressWithOutdatedInfo, { metricWrapper: value });
                } }),
            React.createElement(antd_1.Table.Column, { title: "Heap Memory", key: "Heap Memory2", width: "28%", render: (text, record) => {
                    if (record.data.metricsSource == "canister") {
                        const value = record.data.heapMemory;
                        return React.createElement(SummaryRealtimeLineProgressWithOutdatedInfo_1.SummaryRealtimeLineProgressWithOutdatedInfo, { metricWrapper: value });
                    }
                    return null;
                } })));
};
exports.SummaryRealtimeSectionTable = SummaryRealtimeSectionTable;
//# sourceMappingURL=SummaryRealtimeSectionTable.js.map