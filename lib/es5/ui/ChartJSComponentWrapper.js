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
exports.ChartJSComponentWrapper = void 0;
const React = __importStar(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const ChartJSWithOptionsComponent_1 = require("./ChartJSWithOptionsComponent");
const antd_1 = require("antd");
require("./chartJSComponentWrapper.css");
const ChartJSComponentWrapper = ({ supplier, inProgress, chartIdentifier }) => {
    let overlay = null;
    if (inProgress) {
        overlay = React.createElement(antd_1.Spin, null);
    }
    else if (supplier.isError) {
        overlay = React.createElement(antd_1.Alert, { type: "error", message: React.createElement(React.Fragment, null, `${supplier.error}`), showIcon: true });
    }
    else if (lodash_1.default.isEmpty(supplier.chartContext)) {
        overlay = React.createElement(antd_1.Alert, { type: "warning", message: "No Data", showIcon: true });
    }
    const hasOverlay = !lodash_1.default.isEmpty(overlay);
    const content = lodash_1.default.isEmpty(supplier.chartContext) ? null : React.createElement(ChartJSWithOptionsComponent_1.ChartJSWithOptionsComponent, { chartContext: supplier.chartContext, chartIdentifier: chartIdentifier });
    return React.createElement("div", { className: "chartJSContainer" + (hasOverlay ? " chartJSContainerMasked" : "") },
        React.createElement("div", { className: "chartJSChart" }, content),
        hasOverlay && React.createElement("div", { className: "chartJSChartOverlay" }, overlay));
};
exports.ChartJSComponentWrapper = ChartJSComponentWrapper;
//# sourceMappingURL=ChartJSComponentWrapper.js.map