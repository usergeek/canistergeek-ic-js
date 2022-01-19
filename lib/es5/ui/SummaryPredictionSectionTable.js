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
exports.SummaryPredictionSectionTable = void 0;
const React = __importStar(require("react"));
const DataProvider_1 = require("../dataProvider/DataProvider");
const lodash_1 = __importDefault(require("lodash"));
const antd_1 = require("antd");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const react_router_dom_1 = require("react-router-dom");
const PrecalculatedPredictionDataProvider_1 = require("../dataProvider/PrecalculatedPredictionDataProvider");
const SummaryPredictionSectionTableCellComponent_1 = require("./SummaryPredictionSectionTableCellComponent");
const URLPathProvider_1 = require("./URLPathProvider");
const SummaryPredictionSectionTable = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const precalculatedPredictionDataContext = (0, PrecalculatedPredictionDataProvider_1.usePrecalculatedPredictionDataContext)();
    const inProgress = lodash_1.default.some(dataContext.status, value => value.inProgress);
    const precalculatedDataArray = configurationContext.configuration.canisters.map(canister => {
        return {
            canister: canister,
            data: precalculatedPredictionDataContext.precalculatedData[canister.canisterId]
        };
    });
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.Table, { dataSource: precalculatedDataArray, pagination: { hideOnSinglePage: true, defaultPageSize: 20 }, size: "small", rowKey: record => record.canister.canisterId, loading: inProgress },
            React.createElement(antd_1.Table.Column, { title: "Canister", width: "16%", key: "Canister", render: (text, record) => {
                    const canisterName = record.canister.name ? record.canister.name : record.canister.canisterId;
                    return React.createElement(react_router_dom_1.Link, { to: urlPathContext.pathToSection(record.canister.canisterId) },
                        React.createElement("span", { style: { fontSize: "1em", fontWeight: "bold" } }, canisterName));
                } }),
            React.createElement(antd_1.Table.Column, { title: "Cycles will run out in", width: "28%", key: "Cycles", render: (text, record) => { var _a; return React.createElement(SummaryPredictionSectionTableCellComponent_1.SummaryPredictionSectionTableCellComponent, { data: (_a = record.data) === null || _a === void 0 ? void 0 : _a.predictionData.cycles, metric: "cycles", differenceTitlePostfix: " cycles" }); } }),
            React.createElement(antd_1.Table.Column, { title: "Canister will run out of memory in", width: "28%", key: "Memory", render: (text, record) => { var _a; return React.createElement(SummaryPredictionSectionTableCellComponent_1.SummaryPredictionSectionTableCellComponent, { data: (_a = record.data) === null || _a === void 0 ? void 0 : _a.predictionData.memory, metric: "memory", differenceTitlePostfix: " bytes" }); } }),
            React.createElement(antd_1.Table.Column, { title: React.createElement(React.Fragment, null, "\u00A0"), width: "28%", key: "Heap Memory", render: () => React.createElement(React.Fragment, null, "\u00A0") })));
};
exports.SummaryPredictionSectionTable = SummaryPredictionSectionTable;
//# sourceMappingURL=SummaryPredictionSectionTable.js.map