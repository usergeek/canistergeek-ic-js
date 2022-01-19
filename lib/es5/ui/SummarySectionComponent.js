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
exports.SummarySectionComponent = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const DataProvider_1 = require("../dataProvider/DataProvider");
const DashboardUtils_1 = require("./DashboardUtils");
const SummaryTrendSectionTable_1 = require("./SummaryTrendSectionTable");
const SummaryPredictionSectionTable_1 = require("./SummaryPredictionSectionTable");
const ConfigurationProvider_1 = require("../dataProvider/ConfigurationProvider");
const CanisterMetricsErrorPageAlert_1 = require("./CanisterMetricsErrorPageAlert");
const SummaryRealtimeSectionTable_1 = require("./SummaryRealtimeSectionTable");
const PageLoaderComponent_1 = require("./PageLoaderComponent");
const lodash_1 = __importDefault(require("lodash"));
const SummarySectionComponent = () => {
    const configurationContext = (0, ConfigurationProvider_1.useConfigurationContext)();
    const dataContext = (0, DataProvider_1.useDataContext)();
    const atLeastOneCanisterLoaded = lodash_1.default.some(dataContext.status, value => value.loaded);
    (0, react_1.useEffect)(() => {
        dataContext.getCanisterMetrics(configurationContext.configuration.canisters.map(canister => DashboardUtils_1.DashboardUtils.getCanisterMetricsHourlyDashboardParams(canister.canisterId)));
    }, [dataContext.collectCanisterMetrics, dataContext.getCanisterMetrics]);
    if (!atLeastOneCanisterLoaded) {
        return React.createElement(React.Fragment, null,
            React.createElement(CanisterMetricsErrorPageAlert_1.CanisterMetricsErrorPageAlert, { error: dataContext.error }),
            React.createElement(PageLoaderComponent_1.PageLoaderComponent, { marginTop: "60px" }));
    }
    return React.createElement(React.Fragment, null,
        React.createElement(CanisterMetricsErrorPageAlert_1.CanisterMetricsErrorPageAlert, { error: dataContext.error }),
        React.createElement("div", { className: "summarySection" },
            React.createElement(antd_1.PageHeader, { title: "Realtime" },
                React.createElement(SummaryRealtimeSectionTable_1.SummaryRealtimeSectionTable, null)),
            React.createElement(antd_1.PageHeader, { title: "Trends" },
                React.createElement(SummaryTrendSectionTable_1.SummaryTrendSectionTable, null)),
            React.createElement(antd_1.PageHeader, { title: "Prediction" },
                React.createElement(SummaryPredictionSectionTable_1.SummaryPredictionSectionTable, null))));
};
exports.SummarySectionComponent = SummarySectionComponent;
//# sourceMappingURL=SummarySectionComponent.js.map